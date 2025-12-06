import { db } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { auth } from "@/lib/auth"; // Server-side auth
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const userRole = session.user.role;
    // Strictly block 'user' role, allow 'intern' and 'admin'
    if (userRole === "user") {
        return new NextResponse("Forbidden", { status: 403 });
    }

    try {
        const userEnrollments = await db
            .select({
                course: courses,
                enrollment: enrollments,
            })
            .from(enrollments)
            .innerJoin(courses, eq(enrollments.courseId, courses.id))
            .where(eq(enrollments.userId, session.user.id));

        const formattedCourses = userEnrollments.map(({ course, enrollment }) => ({
            ...course,
            enrollment: {
                plan: enrollment.plan,
                endDate: enrollment.endDate,
                isActive: enrollment.isActive,
            },
        }));

        return NextResponse.json(formattedCourses);
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
