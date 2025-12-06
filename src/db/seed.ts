
import { db } from "@/db";
import { courses, modules, content, users, enrollments } from "@/db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // 1. Create Course
  const [course] = await db
    .insert(courses)
    .values({
      title: "Full Stack Web Development",
      description: "Master the art of web development with this comprehensive course covering frontend, backend, and everything in between.",
      slug: "full-stack-web-development",
      imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80",
    })
    .onConflictDoUpdate({
      target: courses.slug,
      set: {
        title: "Full Stack Web Development",
        description: "Master the art of web development with this comprehensive course covering frontend, backend, and everything in between.",
        imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1000&q=80",
      }
    })
    .returning();

  console.log(`Created/Updated course: ${course.title} (ID: ${course.id})`);

  // Clean up existing modules and content for this course to avoid duplicates
  // Cascading deletes would handle content if set up, but let's be safe and manual or rely on key constraints if were re-creating
  // Easier approach for seeding: Delete all modules for this course, which should cascade delete content if FKs are set to CASCADE
  // If not, we might error. Let's assume standard behavior or delete content first.
  
  // Actually, to be safe and simple without knowing FK constraints details for sure (though likely standard):
  // Let's find existing modules
  const existingModules = await db.select().from(modules).where(eq(modules.courseId, course.id));
  for (const m of existingModules) {
      await db.delete(content).where(eq(content.moduleId, m.id));
      await db.delete(modules).where(eq(modules.id, m.id));
  }
  console.log("Cleaned up existing course content.");

  // 1.5 Assign Course to existing User (if any)
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) {
      const user = existingUsers[0];
      
      // Update role to intern
      await db.update(users).set({ role: "intern" }).where(eq(users.id, user.id));
      console.log(`Updated user ${user.email} role to 'intern'`);

      // Check for existing enrollment
      const existingEnrollment = await db.select().from(enrollments).where(
          eq(enrollments.userId, user.id)
      );

      if (existingEnrollment.length === 0) {
          // Create enrollment
          await db.insert(enrollments).values({
              userId: user.id,
              courseId: course.id,
              plan: "6_months",
              startDate: new Date(),
              endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
              isActive: true
          });
          console.log(`Enrolled user ${user.email} in course ${course.title}`);
      }
  } else {
      console.log("No users found to seed enrollments for.");
  }

  // 2. Create Modules
  const moduleData = [
    { title: "Introduction to Web Development", order: 1 },
    { title: "Frontend Fundamentals (HTML/CSS/JS)", order: 2 },
    { title: "Backend Mastery with Node.js", order: 3 },
    { title: "Final Course Assessment", order: 4 },
  ];

  for (const m of moduleData) {
    const [mod] = await db
      .insert(modules)
      .values({
        courseId: course.id,
        title: m.title,
        order: m.order,
      })
      .returning();

    console.log(`  Created module: ${mod.title} (ID: ${mod.id})`);

    // 3. Create Content for each module
    const contentData = [
      {
        title: "Welcome to the Course",
        type: "video" as const,
        data: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder video
        order: 1,
      },
      {
        title: "Course Overview",
        type: "text" as const,
        data: "# Course Overview\n\nIn this video, we will go over the curriculum...",
        order: 2,
      },
      {
        title: "Module Quiz",
        type: "test" as const,
        data: JSON.stringify({ 
            questions: [
                { q: "What is HTML?", a: ["Markup Language", "Programming Language", "Scripting Language", "Style Sheet"] },
                { q: "What does DOM stand for?", a: ["Document Object Model", "Data Object Model", "Digital Ordinance Model", "Desktop Orientation Module"] },
                { q: "Which tag is used for the largest heading?", a: ["<h1>", "<h6>", "<head>", "<header>"] }
            ] 
        }),
        order: 3,
      },
    ];

    // Add specific content for Final Test module
    if (m.title === "Final Course Assessment") {
      contentData.length = 0; // Clear default content
      contentData.push({
        title: "Final Exam",
        type: "test" as const,
        data: JSON.stringify({
          questions: [
            { q: "What does CSS stand for?", a: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"] },
            { q: "Which HTML tag is used to define an internal style sheet?", a: ["<style>", "<script>", "<css>", "<link>"] },
            { q: "Which property is used to change the background color?", a: ["background-color", "color", "bgcolor", "background-image"] },
            { q: "How do you select an element with id 'demo'?", a: ["#demo", ".demo", "demo", "*demo"] },
            { q: "Which is the correct CSS syntax?", a: ["body {color: black;}", "{body;color:black;}", "body:color=black;", "body = {color: black;}"] },
            { q: "How do you add a comment in a CSS file?", a: ["/* this is a comment */", "// this is a comment", "' this is a comment", "<!-- this is a comment -->"] },
            { q: "Which property is used to change the font of an element?", a: ["font-family", "font-style", "font-weight", "font-size"] },
            { q: "How do you make each word in a text start with a capital letter?", a: ["text-transform: capitalize", "text-style: capitalize", "transform: capitalize", "text-decoration: capitalize"] },
            { q: "Which property is used to change the left margin of an element?", a: ["margin-left", "padding-left", "indent", "margin"] },
            { q: "When using the padding property; are you identifying the padding inside or outside the element?", a: ["Inside", "Outside", "Both", "None"] }
          ]
        }),
        order: 1,
      });
    }

    for (const c of contentData) {
      await db.insert(content).values({
        moduleId: mod.id,
        title: c.title,
        type: c.type,
        data: c.data,
        order: c.order,
      });
      console.log(`    Created content: ${c.title}`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
