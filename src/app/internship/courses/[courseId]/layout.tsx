import Link from "next/link";
import { Video, FileText, BookOpen, ArrowLeft, CheckCircle } from "lucide-react";
import { db } from "@/db";
import { courses, modules, content, userProgress, users, enrollments } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar-aceternity";
import { SidebarUserProfile } from "../components/SidebarUserProfile";
import { Progress } from "@/components/ui/progress";
import { CourseContentSidebar } from "../components/CourseContentSidebar";


export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  // Fetch course by slug (assuming courseId param is the slug)
  // Try to find by slug first, then ID if that fails (for backward compatibility if needed)
  let course = await db.query.courses.findFirst({
    where: eq(courses.slug, courseId),
  });

  if (!course) {
    // Fallback: try to find by ID if courseId is numeric
    if (!isNaN(Number(courseId))) {
       course = await db.query.courses.findFirst({
        where: eq(courses.id, Number(courseId)),
      });
    }
  }

  if (!course) {
    notFound();
  }

  const courseModules = await db.query.modules.findMany({
    where: eq(modules.courseId, course.id),
    orderBy: asc(modules.order),
    with: {
      content: {
        orderBy: asc(content.order),
        columns: {
           id: true,
           title: true,
           type: true,
           moduleId: true,
           dayId: true,
           // EXCLUDE data to reduce payload size
        }
      },
      days: {
        orderBy: asc(modules.order),
        with: {
            content: {
                orderBy: asc(content.order),
                columns: {
                   id: true,
                   title: true,
                   type: true,
                   moduleId: true,
                   dayId: true,
                   // EXCLUDE data to reduce payload size
                }
            }
        }
      }
    }
  });

  // Fetch user progress
  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const user = session?.user;

  const completedContentIds = new Set<number>();
  let userPlanId: number | null = null;
  
  if (user && user.email) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (dbUser) {
      const progress = await db.query.userProgress.findMany({
        where: and(
          eq(userProgress.userId, dbUser.id),
          eq(userProgress.isCompleted, true)
        ),
      });
      progress.forEach(p => completedContentIds.add(p.contentId));

      // Fetch Enrollment to check Plan
      const enrollment = await db.query.enrollments.findFirst({
        where: and(
            eq(enrollments.userId, dbUser.id),
            eq(enrollments.courseId, course.id),
            eq(enrollments.isActive, true)
        )
      });
      
      if (enrollment && enrollment.planId) {
          userPlanId = enrollment.planId;
      }
    }
  }

  // Filter modules based on Plan
  const visibleModulesRaw = courseModules.filter(m => {
      // If module has no specified plans, assume it's open to all enrolled users? 
      // Or if it's strictly requiring a plan. 
      // Let's assume: If planIds is null/empty -> Open to all enrolled.
      // If planIds has values -> User must have one of those matching planId.
      if (!m.planIds || m.planIds.length === 0) return true;
      if (!userPlanId) return false; // Enrolled but no planId recorded (legacy?) or not enrolled? 
      // If not enrolled/no planId, and module restricts, hide it.
      return m.planIds.includes(userPlanId);
  });

  // Cast to a Type that matches our prop (Drizzle Relation Types can be tricky to infer perfectly without explicit types)
  const formattedModules = visibleModulesRaw.map(m => ({
     id: m.id,
     title: m.title,
     days: m.days.map(d => ({
        id: d.id,
        title: d.title,
        moduleId: d.moduleId,
        content: d.content
     })),
     // Filter out content that is already assigned to a day
     content: m.content.filter(c => c.dayId === null)
  }));

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-4 mb-8">
               <Link href="/dashboard/explore" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Courses
               </Link>
               <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                    {course.title.charAt(0)}
                  </div>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm truncate">
                    {course.title}
                  </span>
               </div>
               
               {/* Progress Bar */}
               {completedContentIds.size > 0 && (() => {
                  let totalContent = 0;
                  courseModules.forEach(m => {
                      totalContent += m.content.length;
                      m.days.forEach(d => totalContent += d.content.length);
                  });
                  const percentage = totalContent > 0 ? Math.round((completedContentIds.size / totalContent) * 100) : 0;
                  
                  return (
                      <div className="flex flex-col gap-1 mt-1">
                          <div className="flex justify-between text-xs text-neutral-500">
                              <span>Progress</span>
                              <span>{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-1.5" />
                      </div>
                  )
               })()}
            </div>
            
            <div className="flex flex-col gap-6">
                <CourseContentSidebar 
                    modules={formattedModules} 
                    courseId={courseId} 
                    completedContentIds={completedContentIds} 
                />
            </div>
          </div>
          
          <div className="flex justify-center w-full pb-4">
            <SidebarUserProfile user={user} />
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700">
        <div className="max-w-4xl mx-auto p-8 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
