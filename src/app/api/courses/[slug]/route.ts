import { db } from "@/db";
import { courses, modules, enrollments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
    const params = await props.params;
    const slug = params.slug;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const course = await db.query.courses.findFirst({
            where: eq(courses.slug, slug),
            with: {
                modules: true
            }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const userEnrollment = await db.query.enrollments.findFirst({
            where: and(
                eq(enrollments.courseId, course.id),
                eq(enrollments.userId, session.user.id)
            )
        });

        return NextResponse.json({
            ...course,
            enrollment: userEnrollment ? {
                plan: userEnrollment.plan,
                endDate: userEnrollment.endDate,
                isActive: userEnrollment.isActive,
            } : null
        });

    } catch (error) {
        console.error("Error fetching course detail:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
