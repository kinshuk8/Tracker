
import { db } from "@/db";
import { coursePlans, courses } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Fetching courses...");
  const allCourses = await db.select().from(courses);
  console.log("Courses:", allCourses.map(c => ({ id: c.id, slug: c.slug, title: c.title })));

  console.log("\nFetching plans...");
  const allPlans = await db.select().from(coursePlans);
  console.log("Plans:", allPlans.map(p => ({
    id: p.id,
    courseId: p.courseId,
    planType: p.planType,
    price: p.price,
    isActive: p.isActive
  })));
}

main().catch(console.error).then(() => process.exit(0));
