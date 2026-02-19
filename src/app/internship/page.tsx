
import { db } from "@/db";
import { courses } from "@/db/schema";
import InternshipForm from "./InternshipForm";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

async function getCourses() {
  try {
    const allCourses = await db.select().from(courses);
    return allCourses.map(c => ({
      id: c.slug, // Use slug as the ID for the form value
      label: c.title
    }));
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
}

export default async function InternshipPage() {
  const courseOptions = await getCourses();

  return (
    <InternshipForm initialCourses={courseOptions} />
  );
}
