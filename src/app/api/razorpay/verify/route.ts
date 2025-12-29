import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db } from "@/db";
import { users, enrollments, payments, courses, coursePlans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId: courseIdParam, // Rename to avoid confusion
      planId,
      userDetails,
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Initialize Razorpay
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      // 1. Fetch Payment Details to get actual amount
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      console.log(`[Razorpay Verify] Payment Details:`, JSON.stringify(paymentDetails, null, 2));
      console.log(`[Razorpay Verify] Fetched Amount: ${paymentDetails.amount}`);
      
      // Resolve Course ID (Handle Slug vs ID)
      let resolvedCourseId = parseInt(courseIdParam);
      
      if (isNaN(resolvedCourseId)) {
        const course = await db.query.courses.findFirst({
          where: eq(courses.slug, courseIdParam),
        });
        if (course) {
          resolvedCourseId = course.id;
        } else {
           return NextResponse.json(
            { message: "Invalid Course ID", success: false },
            { status: 400 }
          );
        }
      }

      // 1. Create or Get User
      let userId = "";
      
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, userDetails.email.toLowerCase()),
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        userId = crypto.randomUUID();
        await db.insert(users).values({
          id: userId,
          name: userDetails.name,
          email: userDetails.email.toLowerCase(),
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: "user",
          college: userDetails.college,
          phoneNumber: userDetails.phone,
        });
      }

      // 2. Create Payment Record
      await db.insert(payments).values({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        amount: Number(paymentDetails.amount), // Use actual amount from Razorpay
        currency: paymentDetails.currency || "INR",
        status: "captured", // Since we are in verify, it's captured or authorized. Razorpay usually auto-captures.
        userId: userId,
        courseId: resolvedCourseId, // Use resolved ID
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 3. Create Enrollment
      const existingEnrollment = await db.query.enrollments.findFirst({
        where: (enrollments, { and, eq }) => and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, resolvedCourseId)
        ),
      });

      if (!existingEnrollment) {
        // Fetch plan details to get duration
        let durationMonths = 6; // Default fallback
        let planTitle = "6_months";

        const numericPlanId = parseInt(planId);
        if (!isNaN(numericPlanId)) {
            const plan = await db.query.coursePlans.findFirst({
                where: eq(coursePlans.id, numericPlanId)
            });
            if (plan) {
                durationMonths = plan.durationMonths;
                planTitle = plan.title || plan.planType || "Monthly Plan";
            }
        }

        await db.insert(enrollments).values({
            userId: userId,
            courseId: resolvedCourseId,
            planId: !isNaN(numericPlanId) ? numericPlanId : null, // Store the specific plan ID
            plan: planTitle,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + durationMonths)),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
      }


      return NextResponse.json({
        message: "Payment verified and enrollment created",
        success: true,
      });
    } else {
      return NextResponse.json(
        { message: "Invalid signature", success: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
