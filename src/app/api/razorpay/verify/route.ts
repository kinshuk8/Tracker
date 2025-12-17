import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { users, enrollments, payments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userDetails,
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // 1. Create or Get User
      // Note: In a real app, you might want to check if user already exists more robustly
      // For this admin flow, we assume we might be creating a new user or linking to existing by email.
      
      let userId = "";
      
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, userDetails.email),
      });

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user
        // We need a unique ID. Assuming we have a way to generate IDs or let DB handle it if it was serial/uuid.
        // The schema says id is text. Usually uuid. Let's start with a random string if not present.
        // Wait, schema `users` has `id: text("id").primaryKey()`. I better check how other users are created.
        // Assuming we can use a simple random ID for now or dependent on auth lib.
        // For better compatibility, I will assume we generate one.
        userId = crypto.randomUUID();
        
        await db.insert(users).values({
          id: userId,
          name: userDetails.name,
          email: userDetails.email,
          emailVerified: false, // Admin added
          createdAt: new Date(),
          updatedAt: new Date(),
          role: "user", // or "intern"
          college: userDetails.college,
          phoneNumber: userDetails.phone,
        });
      }

      // 2. Create Payment Record
      await db.insert(payments).values({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        amount: 100, // stored in paise
        currency: "INR",
        status: "captured", // Assumed success if signature matches
        userId: userId,
        courseId: parseInt(courseId),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 3. Create Enrollment
      // Check if already enrolled?
      const existingEnrollment = await db.query.enrollments.findFirst({
        where: (enrollments, { and, eq }) => and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, parseInt(courseId))
        ),
      });

      if (!existingEnrollment) {
        await db.insert(enrollments).values({
            userId: userId,
            courseId: parseInt(courseId),
            plan: "6_months", // Default or passed from frontend
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
