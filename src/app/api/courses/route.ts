import { db } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const allCourses = await db.select().from(courses);
        
        // Fetch enrollments for the current user
        const userEnrollments = await db
            .select()
            .from(enrollments)
            .where(eq(enrollments.userId, session.user.id));

        const coursesWithStatus = allCourses.map(course => {
            const enrollment = userEnrollments.find(e => e.courseId === course.id);
            return {
                ...course,
                enrollment: enrollment ? {
                    plan: enrollment.plan,
                    endDate: enrollment.endDate,
                    isActive: enrollment.isActive,
                } : null
            };
        });

        return NextResponse.json(coursesWithStatus);
    } catch (error) {
        console.error("Error fetching courses:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
