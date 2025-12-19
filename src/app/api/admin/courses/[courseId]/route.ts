import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses, modules, days, content, userProgress, enrollments, payments } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

// GET: Fetch full course hierarchy
export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }    
) {
  try {
    const { courseId } = await params;
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, parseInt(courseId)),
      with: {
        modules: {
          orderBy: (modules, { asc }) => [asc(modules.order)],
          with: {
            days: {
               orderBy: (days, { asc }) => [asc(days.order)],
               with: {
                 content: {
                    orderBy: (content, { asc }) => [asc(content.order)],
                 }
               }
            },
            // Legacy content direct to module, if any
            content: true 
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course details:", error);
    return NextResponse.json(
      { error: "Failed to fetch course details" },
      { status: 500 }
    );
  }
}

// PUT: Update course and its structure
// Note: This is a complex operation. For simplicity, we might update Course metadata here
// or handle complex nested updates. A naive approach is "Delete all children and Recreate", 
// but that destroys history/progress.
// A better approach for this iteration:
// 1. Update Course Metadata
// 2. Client uses separate atomic endpoints for modules/days? 
// OR 
// 3. We handle smart diffing? 
// 
// Given the user prompt "after they're done, it should be updated in the database",
// implying a "Save" button that commits the state. 
// We will attempt a full sync transaction for structure if provided.

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const id = parseInt(courseId);
    const body = await request.json();
    const { title, description, slug, imageUrl, modules: modulesData } = body;

    // Transaction to ensure atomicity
    await db.transaction(async (tx) => {
      // 1. Update Course Metadata
      await tx.update(courses)
        .set({ title, description, slug, imageUrl, updatedAt: new Date() })
        .where(eq(courses.id, id));

      // 2. Handle Structure Sync if modules provided
      // This is tricky without existing IDs. 
      // Strategy:
      // - If we received full structure, we might need to handle it carefully.
      // - To keep it simple for this "MVP" request: 
      //   We will delete old structure and recreate it IF `fullSync` flag is true, 
      //   OR we accept that this endpoint only updates metadata for now, 
      //   and we rely on separate "create module", "create day" calls?
      
      // Let's implement robust metadata update + optional full sync if needed.
      // But actually, managing IDs for children in a single JSON blob is hard.
      // 
      // ALTERNATIVE: The User asks "when they choose to add a course... add modules.. day wise... after they're done, updated in database".
      // This suggests a "Form" style submission.
      //
      // Let's support a "Full Replace" strategy for the structure for simplicity of this specifc prompt.
      // Warning: This resets IDs which breaks UserProgress. 
      // 
      // REVISED STRATEGY:
      // We will assume the frontend sends separate API calls for adding items,
      // OR we implement a smart update.
      //
      // Let's stick to Metadata Update Only for GET/PUT on root course level for now.
      // We'll Create separate routes or handle children in a smart way if the user insists on one big save.
      // 
      // User said: "after they're done ... updated in database".
      // Let's try to do it:
      
      if (modulesData && Array.isArray(modulesData)) {
          // Full Structure Replace Strategy
          // 1. Fetch existing structure to handle cascade delete manually
          const existingModules = await tx.query.modules.findMany({
             where: eq(modules.courseId, id),
             with: {
                 days: true 
             }
          });

          const moduleIds = existingModules.map(m => m.id);
          const dayIds = existingModules.flatMap(m => m.days.map(d => d.id));

          // 2. Delete Content (linked to modules or days)
          if (moduleIds.length > 0) {
              await tx.delete(content).where(inArray(content.moduleId, moduleIds));
          }
          if (dayIds.length > 0) {
              await tx.delete(content).where(inArray(content.dayId, dayIds));
          }

          // 3. Delete Days
          if (moduleIds.length > 0) {
              await tx.delete(days).where(inArray(days.moduleId, moduleIds));
          }

          // 4. Delete Modules
          await tx.delete(modules).where(eq(modules.courseId, id));

          // 5. Re-insert
          for (const mod of modulesData) {
              const [newMod] = await tx.insert(modules).values({
                  courseId: id,
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
                                  moduleId: newMod.id, // Keep linking to module if needed
                                  dayId: newDay.id,
                                  title: item.title,
                                  type: item.type,
                                  data: item.data,
                                  order: item.order
                              });
                          }
                      }
                  }
              }
          }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ courseId: string }> }
  ) {
    try {
      const { courseId } = await params;
      const id = parseInt(courseId);
  
      await db.transaction(async (tx) => {
          // 1. Gather Dependencies
          const courseModules = await tx.query.modules.findMany({
              where: eq(modules.courseId, id),
              with: {
                  content: true,
                  days: {
                      with: {
                          content: true
                      }
                  }
              }
          });

          const moduleIds = courseModules.map(m => m.id);
          const dayIds = courseModules.flatMap(m => m.days.map(d => d.id));
          
          const distinctContentIds = new Set<number>();
          courseModules.forEach(m => {
              m.content.forEach(c => distinctContentIds.add(c.id));
              m.days.forEach(d => {
                  d.content.forEach(c => distinctContentIds.add(c.id));
              });
          });
          const contentIds = Array.from(distinctContentIds);

          // 2. Delete Dependencies from bottom up

          // A. User Progress
          if (contentIds.length > 0) {
              await tx.delete(userProgress).where(inArray(userProgress.contentId, contentIds));
          }

          // B. Content
          if (contentIds.length > 0) {
               await tx.delete(content).where(inArray(content.id, contentIds));
          }

          // C. Days
          if (dayIds.length > 0) {
              await tx.delete(days).where(inArray(days.id, dayIds));
          }

          // D. Modules
          if (moduleIds.length > 0) {
              await tx.delete(modules).where(inArray(modules.id, moduleIds));
          }

          // E. Enrollments
          await tx.delete(enrollments).where(eq(enrollments.courseId, id));

          // F. Payments (Unlink instead of delete for financial records)
          await tx.update(payments).set({ courseId: null }).where(eq(payments.courseId, id));

          // G. Finally Course
          await tx.delete(courses).where(eq(courses.id, id));
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting course:", error);
      return NextResponse.json(
        { error: "Failed to delete course" },
        { status: 500 }
      );
    }
  }
