import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { courses, modules, content } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export default async function CourseIndexPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  // Find course
  let course = await db.query.courses.findFirst({
    where: eq(courses.slug, courseId),
  });

  if (!course) {
     if (!isNaN(Number(courseId))) {
       course = await db.query.courses.findFirst({
        where: eq(courses.id, Number(courseId)),
      });
    }
  }

  if (!course) {
    notFound();
  }

  // Find first module
  const firstModule = await db.query.modules.findFirst({
    where: eq(modules.courseId, course.id),
    orderBy: asc(modules.order),
  });

  if (!firstModule) {
    return <div>No modules found in this course.</div>;
  }

  // Find first content
  const firstContent = await db.query.content.findFirst({
    where: eq(content.moduleId, firstModule.id),
    orderBy: asc(content.order),
  });

  if (!firstContent) {
    return <div>No content found in this module.</div>;
  }

  redirect(`/internship/courses/${courseId}/${firstContent.id}`);
}
