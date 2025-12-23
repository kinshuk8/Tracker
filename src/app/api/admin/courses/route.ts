import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses, enrollments } from "@/db/schema";
import { desc, count, eq } from "drizzle-orm";

export async function GET() {
  try {
    const allCourses = await db.query.courses.findMany({
      orderBy: [desc(courses.createdAt)],
      with: {
        modules: true,
        plans: true,
      }
    });
    
    // 2. Fetch active enrollment counts
    const enrollmentCounts = await db
        .select({
            courseId: enrollments.courseId,
            count: count(enrollments.id)
        })
        .from(enrollments)
        .where(eq(enrollments.isActive, true))
        .groupBy(enrollments.courseId);

    const countMap = new Map(enrollmentCounts.map(e => [e.courseId, e.count]));

    // Transform to include counts
    const coursesWithCounts = allCourses.map(course => ({
      ...course,
      modulesCount: course.modules.length,
      studentsCount: countMap.get(course.id) || 0
    }));

    return NextResponse.json(coursesWithCounts);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

import { modules, days, content, coursePlans } from "@/db/schema";
// ...

export async function POST(request: Request) {
  try {
    const { title, description, slug, imageUrl, modules: modulesData, plans: plansData } = await request.json();

    if (!title || !description || !slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use transaction to ensure full integrity
    const result = await db.transaction(async (tx) => {
        // 1. Create Course
        const [newCourse] = await tx.insert(courses).values({
          title,
          description,
          slug,
          imageUrl,
        }).returning();

        // 2. Create Plans if provided
        if (plansData && Array.isArray(plansData)) {
            for (const plan of plansData) {
                if (plan.isActive) {
                    await tx.insert(coursePlans).values({
                        courseId: newCourse.id,
                        planType: plan.planType,
                        price: plan.price,
                        isActive: true
                    });
                }
            }
        }

        // 3. Create nested structure if provided
        if (modulesData && Array.isArray(modulesData)) {
            for (const mod of modulesData) {
                const [newMod] = await tx.insert(modules).values({
                    courseId: newCourse.id,
                    title: mod.title,
                    order: mod.order
                }).returning();

                if (mod.days && Array.isArray(mod.days)) {
                    for (const day of mod.days) {
                        const [newDay] = await tx.insert(days).values({
                            moduleId: newMod.id,
                            title: day.title,
                            order: day.order
                        }).returning();

                        if (day.content && Array.isArray(day.content)) {
                            for (const item of day.content) {
                                await tx.insert(content).values({
                                    moduleId: newMod.id,
                                    dayId: newDay.id,
                                    title: item.title,
                                    type: item.type, // Ensure enum values match
                                    data: item.data,
                                    order: item.order
                                });
                            }
                        }
                    }
                }
            }
        }
        return newCourse;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
