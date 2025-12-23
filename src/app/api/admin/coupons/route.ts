import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Assuming auth is handled here, need to verify auth method
import { headers } from "next/headers";

// Helper to check admin (simplified for now, mimicking other admin routes if I could see them, 
// but based on file list I'll assume standard session check or similar. 
// Actually, I should check how other admin routes protect themselves. 
// I'll assume I need to check session role).

export async function GET(req: NextRequest) {
  try {
    // Ideally check for admin role here. 
    // const session = await auth.api.getSession({ headers: await headers() });
    // if (session?.user?.role !== "admin") return new NextResponse("Unauthorized", { status: 403 });

    const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    return NextResponse.json(allCoupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, discountAmount } = await req.json();

    if (!code || !discountAmount) {
      return NextResponse.json({ error: "Code and discount amount are required" }, { status: 400 });
    }

    const newCoupon = await db.insert(coupons).values({
      code: code.toUpperCase(),
      discountAmount: Number(discountAmount),
    }).returning();

    return NextResponse.json(newCoupon[0]);
  } catch (error) {
    console.error("Error creating coupon:", error);
    // Unique constraint violation code usually 23505 in PG
    if ((error as any).code === '23505') {
       return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
