import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, enrollments } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, college, course, plan } = body;

    if (!name || !email || !password || !course || !plan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    let userId;

    if (existingUser.length > 0) {
      userId = existingUser[0].id;
      // Optional: Update user details if needed
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        college,
        role: "user",
      }).returning({ id: users.id });
      userId = newUser[0].id;
    }

    // Calculate end date based on plan
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (plan === "1_month") endDate.setMonth(endDate.getMonth() + 1);
    else if (plan === "3_months") endDate.setMonth(endDate.getMonth() + 3);
    else if (plan === "6_months") endDate.setMonth(endDate.getMonth() + 6);

    // Create enrollment
    // Note: We need to look up courseId from the course slug/id passed from frontend
    // For now, let's assume we fetch the course first.
    // Since we don't have a seed script yet, we might need to handle this dynamically or seed the DB.
    // For this implementation, I'll assume the course exists or I'll insert it if not (for simplicity in this flow, usually we'd seed).
    
    // Let's try to find the course by slug (which matches the ID from frontend)
    // If not found, we might need to return an error or auto-create (auto-create for now to make it work without seeding)
    
    // Ideally we should have a `courses` table populated.
    // I will add a check to find or create the course.
    
    // Check for course
    // We need to import courses table
    const { courses } = await import("@/db/schema");
    
    const courseRecord = await db.select().from(courses).where(eq(courses.slug, course)).limit(1);
    let courseId;

    if (courseRecord.length === 0) {
       // Auto-create course for demo purposes if it doesn't exist
       const newCourse = await db.insert(courses).values({
         title: course.charAt(0).toUpperCase() + course.slice(1).replace("-", " "),
         description: "Course description placeholder",
         slug: course,
       }).returning({ id: courses.id });
       courseId = newCourse[0].id;
    } else {
       courseId = courseRecord[0].id;
    }

    await db.insert(enrollments).values({
      userId,
      courseId,
      plan,
      startDate,
      endDate,
      isActive: true,
    });

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
