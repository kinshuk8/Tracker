import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coursePlans } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const plans = await db.select().from(coursePlans).orderBy(desc(coursePlans.createdAt));
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
