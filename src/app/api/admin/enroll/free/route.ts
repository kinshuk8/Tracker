import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, enrollments, coursePlans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    // Ideally verify admin session here
    
    const { name, email, phone, college, courseId, isFree } = await req.json();

    if (!isFree) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!email || !courseId) {
        return NextResponse.json({ error: "Email and Course ID are required" }, { status: 400 });
    }

    const resolvedCourseId = parseInt(courseId);
    if (isNaN(resolvedCourseId)) {
         return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
    }

    // 1. Find or Create User
    let userId: string;
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
    });

    if (existingUser) {
        userId = existingUser.id;
    } else {
        // Create new user
        userId = nanoid(); // Or use crypto.randomUUID
        await db.insert(users).values({
            id: userId,
            name: name,
            email: email.toLowerCase(),
            emailVerified: false, // They can verify later
            role: "user",
            phoneNumber: phone,
            college: college,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    // 2. Create Enrollment
    const existingEnrollment = await db.query.enrollments.findFirst({
        where: (enrollments, { and, eq }) => and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, resolvedCourseId)
        ),
    });

    if (existingEnrollment) {
        return NextResponse.json({ error: "User is already enrolled in this course" }, { status: 400 });
    }

    // Fetch default plan (e.g., 6 months or 1 month)
    // Since manually granting, maybe default to 6 months or ask?
    // Assuming 6 months default for now matching verify logic
    const durationMonths = 6; 
    
    await db.insert(enrollments).values({
        userId: userId,
        courseId: resolvedCourseId,
        // planId: null, // No specific plan linked for free access, or link to a "Free" plan if exists?
        // Let's leave planId null but set a plan name
        plan: "Grant Access (Free)", 
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + durationMonths)),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "Free access granted successfully" });

  } catch (error) {
    console.error("Error granting free access:", error);
    return NextResponse.json({ error: "Failed to grant access" }, { status: 500 });
  }
}
