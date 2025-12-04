
import { db } from "@/db";
import { courses, modules, content } from "@/db/schema";

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
    .returning();

  console.log(`Created course: ${course.title} (ID: ${course.id})`);

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
        data: JSON.stringify({ questions: [{ q: "What is HTML?", a: ["Markup Language", "Programming Language"] }] }),
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
            { q: "What does CSS stand for?", a: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets"] },
            { q: "Which HTML tag is used to define an internal style sheet?", a: ["<style>", "<script>", "<css>"] },
            { q: "Which property is used to change the background color?", a: ["background-color", "color", "bgcolor"] },
            { q: "How do you select an element with id 'demo'?", a: ["#demo", ".demo", "demo"] },
            { q: "Which is the correct CSS syntax?", a: ["body {color: black;}", "{body;color:black;}", "body:color=black;"] }
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
