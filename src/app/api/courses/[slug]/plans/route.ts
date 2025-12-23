import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses, coursePlans } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const course = await db.query.courses.findFirst({
        where: eq(courses.slug, slug),
        with: {
            plans: {
                where: eq(coursePlans.isActive, true)
            }
        }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ plans: course.plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
