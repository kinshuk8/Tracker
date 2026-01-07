import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons, coursePlans } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const allCoupons = await db
      .select({
        id: coupons.id,
        code: coupons.code,
        discountAmount: coupons.discountAmount,
        isActive: coupons.isActive,
        createdAt: coupons.createdAt,
        planId: coupons.planId,
        planTitle: coursePlans.title,
      })
      .from(coupons)
      .leftJoin(coursePlans, eq(coupons.planId, coursePlans.id))
      .orderBy(desc(coupons.createdAt));

    return NextResponse.json(allCoupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, discountAmount, planId } = await req.json();

    if (!code || !discountAmount) {
      return NextResponse.json({ error: "Code and discount amount are required" }, { status: 400 });
    }

    const newCoupon = await db.insert(coupons).values({
      code: code.toUpperCase(),
      discountAmount: Number(discountAmount),
      planId: planId ? Number(planId) : null,
    }).returning();

    return NextResponse.json(newCoupon[0]);
  } catch (error) {
    console.error("Error creating coupon:", error);
    if ((error as any).code === '23505') {
       return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
