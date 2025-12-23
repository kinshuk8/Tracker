import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ couponId: string }> } // Params as Promise in Next.js 15
) {
  try {
    const { couponId } = await params;
    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "isActive boolean is required" },
        { status: 400 }
      );
    }

    const updatedCoupon = await db
      .update(coupons)
      .set({ isActive })
      .where(eq(coupons.id, Number(couponId)))
      .returning();

    if (updatedCoupon.length === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCoupon[0]);
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ couponId: string }> }
) {
  try {
    const { couponId } = await params;

    const deletedCoupon = await db
      .delete(coupons)
      .where(eq(coupons.id, Number(couponId)))
      .returning();

    if (deletedCoupon.length === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(deletedCoupon[0]);
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
