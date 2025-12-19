"use server";

import { db } from "@/db";
import { courses, enrollments, users, userProgress, modules } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getCourseStudents(courseId: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        if (!session || session.user.role !== "admin") {
            return { error: "Unauthorized" };
        }

        // 1. Get ALL enrolled users for this course
        const enrolledUsers = await db.query.enrollments.findMany({
            where: eq(enrollments.courseId, courseId),
            with: {
                user: true
            },
            orderBy: desc(enrollments.createdAt)
        });

        // 2. Get Total Content Count for the Course
        const courseModules = await db.query.modules.findMany({
            where: eq(modules.courseId, courseId),
            with: {
                content: true
            }
        });

        let totalContent = 0;
        courseModules.forEach(m => totalContent += m.content.length);

        // 3. For each user, calculating progress
        const studentsWithProgress = await Promise.all(enrolledUsers.map(async (enrollment) => {
            const completedCount = await db.$count(
                userProgress,
                and(
                    eq(userProgress.userId, enrollment.userId),
                    eq(userProgress.isCompleted, true)
                    // Ideally check if content belongs to this course, but userProgress only links to contentId
                    // For accuracy, we'd need to filter by content IDs belonging to this course.
                    // Let's do a more robust check below.
                )
            );

            // Robust check: Count only completed content that belongs to this course
            const userCompletedProgress = await db.query.userProgress.findMany({
                where: and(
                    eq(userProgress.userId, enrollment.userId),
                    eq(userProgress.isCompleted, true)
                ),
                with: {
                    content: {
                        with: {
                           module: true
                        }
                    }
                }
            });

            // Filter for current course
            const courseCompletedCount = userCompletedProgress.filter((p: any) => p.content?.module?.courseId === courseId).length;
            const progressPercentage = totalContent > 0 ? Math.round((courseCompletedCount / totalContent) * 100) : 0;

            return {
                id: enrollment.user.id,
                name: enrollment.user.name,
                email: enrollment.user.email,
                image: enrollment.user.image,
                enrolledAt: enrollment.createdAt,
                progress: progressPercentage,
                completedItems: courseCompletedCount,
                totalItems: totalContent
            };
        }));

        return { success: true, students: studentsWithProgress };
    } catch (error) {
        console.error("Error fetching course students:", error);
        return { error: "Failed to fetch students" };
    }
}
