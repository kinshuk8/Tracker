import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const { courseId, planId } = await req.json();

    if (!courseId || !planId) {
      return NextResponse.json(
        { error: "Course ID and Plan ID are required" },
        { status: 400 }
      );
    }

    // Pricing mapping (should match data.ts)
    const PRICING: Record<string, number> = {
      "1_month": 199,
      "3_months": 429,
      "6_months": 1499,
    };

    const price = PRICING[planId];

    if (!price) {
        return NextResponse.json(
            { error: "Invalid Plan ID" },
            { status: 400 }
        );
    }

    // Razorpay accepts amount in paise
    const amount = price * 100;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        courseId: courseId.toString(),
        planId: planId.toString(),
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
