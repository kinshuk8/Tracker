import Link from "next/link";
import { Video, FileText, BookOpen, ArrowLeft, CheckCircle } from "lucide-react";
import { db } from "@/db";
import { courses, modules, content, userProgress, users } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Image from "next/image";


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
      }
    }
  });

  // Fetch user progress
  // Fetch user progress
  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const user = session?.user;

  const completedContentIds = new Set<number>();
  
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
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar open={true}>
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
            </div>
            
            <div className="flex flex-col gap-6">
              {courseModules.map((module) => (
                <div key={module.id} className="flex flex-col gap-2">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2">
                    {module.title}
                  </h3>
                  <div className="flex flex-col gap-1">
                    {module.content.map((item) => {
                      const isCompleted = completedContentIds.has(item.id);
                      return (
                        <SidebarLink
                          key={item.id}
                          link={{
                            label: item.title,
                            href: `/internship/courses/${courseId}/${item.id}`,
                            icon: isCompleted ? (
                              <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                            ) : item.type === "video" ? (
                              <Video className="h-4 w-4 shrink-0" />
                            ) : item.type === "test" ? (
                              <FileText className="h-4 w-4 shrink-0" />
                            ) : (
                              <BookOpen className="h-4 w-4 shrink-0" />
                            ),
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <SidebarLink
              link={{
                label: user?.name || "Profile",
                href: "/profile",
                icon: (
                  <Image
                    src={user?.image || "https://github.com/shadcn.png"}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
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
