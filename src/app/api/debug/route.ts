import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, coursePlans, coupons, courses } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const recentPayments = await db.select().from(payments).orderBy(desc(payments.createdAt)).limit(10);
  const allPlans = await db.select().from(coursePlans);

  const allCoupons = await db.select().from(coupons);
  const allCourses = await db.select().from(courses);

  return NextResponse.json({
    payments: recentPayments,
    plans: allPlans,
    coupons: allCoupons,
    courses: allCourses
  });
}
