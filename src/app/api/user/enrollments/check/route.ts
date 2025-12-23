import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { enrollments, courses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Need to verify auth import but assuming standard pattern from elsewhere
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
             return NextResponse.json({ enrolled: false, message: "Not logged in" });
        }

        const { courseId } = await req.json();

        if (!courseId) {
            return NextResponse.json({ error: "Course ID required" }, { status: 400 });
        }

        // Check if active enrollment exists
        const existingEnrollment = await db.query.enrollments.findFirst({
            where: and(
                eq(enrollments.userId, session.user.id),
                eq(enrollments.courseId, Number(courseId)),
                eq(enrollments.isActive, true)
            )
        });

        if (existingEnrollment) {
            return NextResponse.json({ enrolled: true });
        }

        return NextResponse.json({ enrolled: false });

    } catch (error) {
        console.error("Error checking enrollment:", error);
        return NextResponse.json({ error: "Failed to check enrollment" }, { status: 500 });
    }
}
