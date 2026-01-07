import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db } from "@/db";
import { users, enrollments, payments, courses, coursePlans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    let razorpay_order_id, razorpay_payment_id, razorpay_signature, courseIdParam, planId, userDetails, userIdFromBody;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      razorpay_order_id = formData.get("razorpay_order_id") as string;
      razorpay_payment_id = formData.get("razorpay_payment_id") as string;
      razorpay_signature = formData.get("razorpay_signature") as string;
    } else {
      const body = await req.json();
      razorpay_order_id = body.razorpay_order_id;
      razorpay_payment_id = body.razorpay_payment_id;
      razorpay_signature = body.razorpay_signature;
      courseIdParam = body.courseId;
      planId = body.planId;
      userDetails = body.userDetails;
      userIdFromBody = body.userId; // If passed from frontend explicitly
    }

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

      // 1. Fetch Payment Details to get actual amount and notes
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      console.log(`[Razorpay Verify] Payment Details:`, JSON.stringify(paymentDetails, null, 2));
      
      const notes = paymentDetails.notes as any;

      // Resolve Context (Handle Callback Flow where body params are missing)
      let resolvedCourseId = parseInt(courseIdParam);
      let resolvedPlanId = planId;
      let resolvedUserId = userIdFromBody;

      if (!resolvedUserId && notes?.userId) {
          resolvedUserId = notes.userId;
      }
      if (isNaN(resolvedCourseId) && notes?.courseId) {
          resolvedCourseId = parseInt(notes.courseId);
      }
      if (!resolvedPlanId && notes?.planId) {
          resolvedPlanId = notes.planId;
      }

      // 1b. If we still don't have user ID, check if we can find user by email from payment details (fallback)
      // typically paymentDetails.email or paymentDetails.contact might exist if prefilled
      if (!resolvedUserId && userDetails?.email) {
           const existingUser = await db.query.users.findFirst({
                where: eq(users.email, userDetails.email.toLowerCase()),
           });
           if (existingUser) resolvedUserId = existingUser.id;
      }

      if (!resolvedCourseId || !resolvedUserId) {
         console.error("[Razorpay Verify] MISSING CONTEXT (Course or User). Cannot verify enrollment.");
         // If callback, redirect to error page
         if (contentType.includes("application/x-www-form-urlencoded")) {
            return NextResponse.redirect(new URL(`/internship/courses?error=payment_failed_context`, req.url));
         }
         return NextResponse.json({ success: false, message: "Missing context" }, { status: 400 });
      }

      // Resolve Course ID logic (if param was slug)
      if (isNaN(resolvedCourseId) && typeof courseIdParam === 'string') {
        const course = await db.query.courses.findFirst({
          where: eq(courses.slug, courseIdParam),
        });
        if (course) {
          resolvedCourseId = course.id;
        } else {
             // Failed to resolve course
             console.error("Failed to resolve course from slug:", courseIdParam);
        }
      }

      // If User doesn't exist (rare in this flow as they must be logged in to order), create them?
      // Actually, standard flow requires login.
      // We will perform updates assuming user exists or creation logic if `userDetails` was present.
      // But in callback flow `userDetails` is missing. We rely on `resolvedUserId` existing in DB.
      
      // 2. Create Payment Record
      // Check if payment already exists to avoid duplicates (idempotency)
      const existingPayment = await db.query.payments.findFirst({
          where: eq(payments.paymentId, razorpay_payment_id)
      });

      if (!existingPayment) {
          await db.insert(payments).values({
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            signature: razorpay_signature,
            amount: Number(paymentDetails.amount),
            currency: paymentDetails.currency || "INR",
            status: "captured",
            userId: resolvedUserId,
            courseId: resolvedCourseId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
      }

      // 3. Create Enrollment
      const existingEnrollment = await db.query.enrollments.findFirst({
        where: (enrollments, { and, eq }) => and(
          eq(enrollments.userId, resolvedUserId),
          eq(enrollments.courseId, resolvedCourseId)
        ),
      });

      if (!existingEnrollment) {
        // Fetch plan details to get duration
        let durationMonths = 6; 
        let planTitle = "6_months";

        const numericPlanId = parseInt(resolvedPlanId);
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
            userId: resolvedUserId,
            courseId: resolvedCourseId,
            planId: !isNaN(numericPlanId) ? numericPlanId : null,
            plan: planTitle,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + durationMonths)),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
      }

      const isCallback = contentType.includes("application/x-www-form-urlencoded");
      
      if (isCallback) {
          // Redirect to course page with success flag
          const slug = notes?.courseSlug || resolvedCourseId;
          const redirectUrl = new URL(`/internship/courses/${slug}?payment_success=true`, req.url);
          return NextResponse.redirect(redirectUrl);
      }

      return NextResponse.json({
        message: "Payment verified and enrollment created",
        success: true,
      });
    } else {
       const isCallback = contentType.includes("application/x-www-form-urlencoded");
       if(isCallback) {
             return NextResponse.redirect(new URL(`/internship/courses?error=invalid_signature`, req.url));
       }
      return NextResponse.json(
        { message: "Invalid signature", success: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    // In callback flow, we should probably redirect to an error page instead of JSON 500
    // But req might not be available if error is early?
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
