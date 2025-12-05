"use server";

import { db } from "@/db";
import { users, enrollments, userProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";

import { revalidatePath } from "next/cache";

export async function markAsCompleted(courseId: number, contentId: number) {
  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const user = session?.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const email = user.email;
  if (!email) {
    throw new Error("No email found");
  }

  // Find DB user
  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!dbUser) {
    // Should be synced by webhook, but handle edge case or just error
    throw new Error("User not found in database");
  }

  // Check enrollment
  let enrollment = await db.query.enrollments.findFirst({
    where: and(
      eq(enrollments.userId, dbUser.id),
      eq(enrollments.courseId, courseId),
      eq(enrollments.isActive, true)
    ),
  });

  if (!enrollment) {
    // Auto-enroll for testing as requested
    // Default to 1 month plan
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const [newEnrollment] = await db.insert(enrollments).values({
      userId: dbUser.id,
      courseId: courseId,
      plan: "1_month",
      startDate: startDate,
      endDate: endDate,
      isActive: true,
    }).returning();
    
    enrollment = newEnrollment;
  }

  // Update progress
  const existingProgress = await db.query.userProgress.findFirst({
    where: and(
      eq(userProgress.userId, dbUser.id),
      eq(userProgress.contentId, contentId)
    ),
  });

  if (existingProgress) {
    await db.update(userProgress)
      .set({
        isCompleted: true,
        completedAt: new Date(),
      })
      .where(eq(userProgress.id, existingProgress.id));
  } else {
    await db.insert(userProgress).values({
      userId: dbUser.id,
      contentId: contentId,
      isCompleted: true,
      completedAt: new Date(),
    });
  }

  revalidatePath("/internship/courses");
  return { success: true };
}
