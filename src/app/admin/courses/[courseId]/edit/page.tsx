import { CourseEditor } from "../../components/CourseEditor";
import { notFound } from "next/navigation";

// Since we are Server Component, we can fetch directly if we want, 
// but for consistency with the API-based Editor, we'll let it client-fetch 
// OR simpler: Fetch here and pass as initialData.

// Let's fetch strict data here to avoid loading states if possible, 
// but we need to match the Shape.
// For now, let's keep it simple and just render Client Component 
// which could fetch or we fetch here.

import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const id = parseInt(courseId);

  if (isNaN(id)) return notFound();

  // Fetch full tree
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, id),
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

  if (!course) return notFound();

  // Transform data to fit our Editor Interface if needed (it matches Drizzle output mostly)
  // We need to ensure nested arrays exist even if empty
  // Transform data to fit our Editor Interface
  const courseData = course as any; 
  
  const formattedCourse = {
      ...courseData,
      modules: (courseData.modules || []).map((mod: any) => ({
          ...mod,
          days: mod.days || [],
      }))
  };

  return (
    <div className="p-8">
      <CourseEditor initialData={formattedCourse} isEditing />
    </div>
  );
}
