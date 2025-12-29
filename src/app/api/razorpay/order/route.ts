import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/db";
import { coupons, coursePlans, enrollments, courses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Verify path
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, planId, couponCode } = await req.json();

    if (!courseId || !planId) {
      return NextResponse.json(
        { error: "Course ID and Plan ID are required" },
        { status: 400 }
      );
    }

    let numericCourseId = Number(courseId);

    // If ID is NaN, assume it's a slug and look it up
    if (isNaN(numericCourseId)) {
        const foundCourse = await db.query.courses.findFirst({
            where: eq(courses.slug, courseId.toString()), // Force string comparison just in case
            columns: { id: true }
        });

        if (!foundCourse) {
             return NextResponse.json(
                { error: "Course not found." },
                { status: 404 }
             );
        }
        numericCourseId = foundCourse.id;
    }

    const userId = session.user.id;

    // 1. DUPLICATE PURCHASE CHECK
    const existingEnrollment = await db.query.enrollments.findFirst({
        where: and(
            eq(enrollments.userId, userId),
            eq(enrollments.courseId, numericCourseId),
            eq(enrollments.isActive, true)
        )
    });

    if (existingEnrollment) {
         return NextResponse.json(
            { error: "You are already enrolled in this course." },
            { status: 400 }
         );
    }
 
    // 2. DYNAMIC PRICING
    let numericPlanId = Number(planId);
    if(isNaN(numericPlanId)) {
        return NextResponse.json(
             { error: "Invalid Plan ID" },
             { status: 400 }
        );
    }

    const plan = await db.query.coursePlans.findFirst({
        where: and(
            eq(coursePlans.courseId, numericCourseId),
            eq(coursePlans.id, numericPlanId),
            eq(coursePlans.isActive, true)
        )
    });

    if (!plan) {
        return NextResponse.json(
            { error: "Invalid or inactive plan." },
            { status: 400 }
        );
    }

    let price = plan.price;

    // Apply Coupon
    let discount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await db.query.coupons.findFirst({
        where: and(
          eq(coupons.code, couponCode.toUpperCase()),
          eq(coupons.isActive, true)
        ),
      });

      if (coupon) {
        discount = coupon.discountAmount;
        appliedCouponCode = coupon.code;
      }
    }

    let finalPrice = price - discount;
    if (finalPrice < 1) finalPrice = 1; // Minimum 1 Rupee

    // Razorpay accepts amount in paise
    const amount = finalPrice * 100;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        courseId: numericCourseId.toString(),
        planId: planId.toString(),
        couponCode: appliedCouponCode || "",
        originalPrice: price.toString(),
        discount: discount.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
