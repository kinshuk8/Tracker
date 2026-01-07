import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users, enrollments, payments, courses, coursePlans } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
        console.error("RAZORPAY_WEBHOOK_SECRET not configured");
        return NextResponse.json({ message: "Configuration error" }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ message: "Missing signature" }, { status: 400 });
    }

    // Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Invalid webhook signature");
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(rawBody);
    const event = body.event;

    // Handle "order.paid" or "payment.captured"
    if (event === "order.paid" || event === "payment.captured") {
        const payload = body.payload;
        const paymentEntity = payload.payment.entity;
        
        const razorpay_order_id = paymentEntity.order_id;
        const razorpay_payment_id = paymentEntity.id;
        const amount = paymentEntity.amount;
        const currency = paymentEntity.currency;
        const notes = paymentEntity.notes;

        console.log(`[Razorpay Webhook] Processing event: ${event} for Payment: ${razorpay_payment_id}`);

        // Extract Context from Notes
        const userId = notes?.userId;
        const courseIdStr = notes?.courseId;
        const planIdStr = notes?.planId;

        // Validation
        if (!userId || !courseIdStr) {
            console.error(`[Razorpay Webhook] Missing context in notes for payment: ${razorpay_payment_id}`);
            // We acknowledge success to Razorpay to stop retries, but log error
            return NextResponse.json({ success: true, message: "Missing context, skipped" }); 
        }

        const resolvedCourseId = parseInt(courseIdStr);
        // Only use Plan ID if valid
        const resolvedPlanId = planIdStr ? parseInt(planIdStr) : null;

        // 1. Idempotency Check (Payment)
        const existingPayment = await db.query.payments.findFirst({
            where: eq(payments.paymentId, razorpay_payment_id)
        });

        if (!existingPayment) {
            await db.insert(payments).values({
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: "webhook_verified", // Since this is webhook, we don't have the frontend signature
                amount: Number(amount),
                currency: currency || "INR",
                status: "captured",
                userId: userId,
                courseId: resolvedCourseId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // 2. Enrollment
        const existingEnrollment = await db.query.enrollments.findFirst({
            where: and(
                eq(enrollments.userId, userId),
                eq(enrollments.courseId, resolvedCourseId)
            )
        });

        if (!existingEnrollment) {
             // Fetch plan details directly using ID if possible, else defaults
             let durationMonths = 6;
             let planTitle = "6_months";

             if (resolvedPlanId && !isNaN(resolvedPlanId)) {
                const plan = await db.query.coursePlans.findFirst({
                    where: eq(coursePlans.id, resolvedPlanId)
                });
                if (plan) {
                    durationMonths = plan.durationMonths;
                    planTitle = plan.title || plan.planType || "Monthly Plan";
                }
             }

             await db.insert(enrollments).values({
                userId: userId,
                courseId: resolvedCourseId,
                planId: resolvedPlanId,
                plan: planTitle,
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + durationMonths)),
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`[Razorpay Webhook] Enrolled user ${userId} in course ${resolvedCourseId}`);
        } else {
            console.log(`[Razorpay Webhook] User ${userId} already enrolled in course ${resolvedCourseId}`);
        }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error processing Razorpay webhook:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
