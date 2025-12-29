"use server";

import { db } from "@/db";
import { payments, enrollments, courses } from "@/db/schema";
import { sql, eq, and, gte, lte } from "drizzle-orm";

export type Period = "daily" | "weekly" | "monthly" | "all";

export async function getAdminChartData(period: Period) {
  const now = new Date();
  let startDate: Date;

  // Determine date range
  switch (period) {
    case "daily":
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
      break;
    case "weekly":
      startDate = new Date();
      startDate.setDate(now.getDate() - 90); // ~12 weeks
      break;
    case "monthly":
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case "all":
      startDate = new Date(0); // Beginning of time
      break;
  }

  // --- REVENUE CHART DATA ---
  // We need to group payments by date trunc
  let timeFormat = "YYYY-MM-DD";
  let truncType = "day";

  if (period === "daily") {
    truncType = "day";
  } else if (period === "weekly") {
    truncType = "week";
  } else if (period === "monthly" || period === "all") {
    truncType = "month";
  }

  // Aggregating Revenue
  const revenueData = await db
    .select({
      date: sql<Date>`date_trunc(${truncType}, ${payments.createdAt})`,
      amount: sql<number>`sum(${payments.amount}) / 100`, // Convert paise to rupees
    })
    .from(payments)
    .where(and(eq(payments.status, "captured"), gte(payments.createdAt, startDate)))
    .groupBy(sql`1`)
    .orderBy(sql`1`);
  
  // Format data for chart (fill gaps? optional for now)
  
  // --- ENROLLMENT OVER TIME ---
  const enrollmentData = await db
    .select({
      date: sql<Date>`date_trunc(${truncType}, ${enrollments.createdAt})`,
      count: sql<number>`count(*)`,
    })
    .from(enrollments)
    .where(gte(enrollments.createdAt, startDate))
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  // --- COURSE DISTRIBUTION ---
  const courseDistribution = await db
    .select({
      name: courses.title,
      count: sql<number>`count(${enrollments.id})`,
    })
    .from(enrollments)
    .leftJoin(courses, eq(enrollments.courseId, courses.id))
    .where(gte(enrollments.createdAt, startDate))
    .groupBy(courses.id, courses.title)
    .orderBy(sql`count(${enrollments.id}) DESC`);

  // Fill in zero data? 
  // For simplicity, we return the raw aggregated data. The chart can handle sparse data or we map it on client.
  
  return {
    revenue: revenueData.map(d => ({ ...d, date: new Date(d.date).toISOString(), amount: Number(d.amount) })),
    enrollments: enrollmentData.map(d => ({ ...d, date: new Date(d.date).toISOString(), count: Number(d.count) })),
    distribution: courseDistribution.map(d => ({ ...d, count: Number(d.count), fill: "var(--color-" + (d.name || "Unknown").replace(/[^a-zA-Z0-9]/g, "") + ")"  }))
  };
}
