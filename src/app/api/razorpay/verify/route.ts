import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users, enrollments, payments, courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId: courseIdParam, // Rename to avoid confusion
      userDetails,
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
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
      // ... (Rest of existing user logic)
      
      // ... (Inside User Creation Logic - no changes needed there usually, but wait, let's keep the user logic intact)
      // I need to be careful with replace range. I will insert the resolution logic at the top and update usages.
      
      // Let's rewrite the block to be safe.
      
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
        amount: 100,
        currency: "INR",
        status: "captured",
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
        await db.insert(enrollments).values({
            userId: userId,
            courseId: resolvedCourseId,
            plan: "6_months",
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
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
