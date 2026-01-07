import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { code, planId } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: "Code is required" });
    }

    const coupon = await db.query.coupons.findFirst({
      where: and(
        eq(coupons.code, code.toUpperCase()),
        eq(coupons.isActive, true)
      ),
    });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Invalid or expired coupon" });
    }

    // Check if coupon is restricted to a specific plan
    if (coupon.planId) {
      if (!planId) {
         return NextResponse.json({ valid: false, message: "This coupon requires a specific plan selection" });
      }
      if (Number(coupon.planId) !== Number(planId)) {
         return NextResponse.json({ valid: false, message: "This coupon is not applicable to the selected plan" });
      }
    }

    return NextResponse.json({
      valid: true,
      discountAmount: coupon.discountAmount,
      code: coupon.code,
      planId: coupon.planId
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({ valid: false, message: "Server error" }, { status: 500 });
  }
}
