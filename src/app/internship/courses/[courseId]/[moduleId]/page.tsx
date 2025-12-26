import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/db";
import { content, userProgress, users, modules, days } from "@/db/schema";
import { eq, and, asc, desc, lt, gt, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

import MarkAsReadButton from "../../components/MarkAsReadButton";
import Quiz from "../../components/Quiz";
import { AlertCircle } from "lucide-react";
import { S3Resource } from "@/components/content/s3-resource";



export default async function ModulePage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const { courseId, moduleId } = await params;

  // Note: 'moduleId' param is actually the content ID based on layout.tsx links
  const contentId = parseInt(moduleId);
  if (isNaN(contentId)) {
    notFound();
  }

  // Parallelize Auth and Content Fetching
  const sessionPromise = (async () => {
    const { auth } = await import("@/lib/auth");
    const { headers } = await import("next/headers");
    return auth.api.getSession({
      headers: await headers()
    });
  })();

  const contentPromise = (async () => {
     // Fetch content with its relations
     const cResult = await db.query.content.findFirst({
        where: eq(content.id, contentId),
        with: {
            module: {
                with: { course: true }
            },
            day: true
        }
      });
      return cResult;
  })();

  const [session, contentItem] = await Promise.all([sessionPromise, contentPromise]);

  if (!contentItem || !contentItem.module) {
    notFound();
  }

  // --- Robust Navigation Logic ---
  // Hierarchy: Course -> Module -> (Day -> Content) || (Content)

  const currentModuleId = contentItem.moduleId!;
  const currentDayId = contentItem.dayId;
  const currentOrder = contentItem.order;

  // Helpers to fetch single items
  const getPrevContentInDay = async (dId: number, order: number) => {
      return db.query.content.findFirst({
          where: and(eq(content.dayId, dId), lt(content.order, order)),
          orderBy: desc(content.order)
      });
  };
  const getNextContentInDay = async (dId: number, order: number) => {
      return db.query.content.findFirst({
          where: and(eq(content.dayId, dId), gt(content.order, order)),
          orderBy: asc(content.order)
      });
  };
  
  // For modules that have direct content (no days)
  const getPrevContentInModuleDirect = async (mId: number, order: number) => {
      return db.query.content.findFirst({
          where: and(eq(content.moduleId, mId), isNull(content.dayId), lt(content.order, order)), // Assuming direct content implies dayId is null
          orderBy: desc(content.order)
      });
  };
  const getNextContentInModuleDirect = async (mId: number, order: number) => {
      return db.query.content.findFirst({
          where: and(eq(content.moduleId, mId), isNull(content.dayId), gt(content.order, order)),
          orderBy: asc(content.order)
      });
  };

  let prevContent = null;
  let nextContent = null;

  // 1. Find PREVIOUS Content
  if (currentDayId) {
      // 1a. Previous in same Day
      prevContent = await getPrevContentInDay(currentDayId, currentOrder);
      
      if (!prevContent) {
          // 1b. Last content of Previous Day in Same Module
          const currentDay = await db.query.days.findFirst({ where: eq(days.id, currentDayId)});
          if (currentDay) {
              const prevDay = await db.query.days.findFirst({
                  where: and(eq(days.moduleId, currentModuleId), lt(days.order, currentDay.order)),
                  orderBy: desc(days.order),
                  with: {
                      content: { orderBy: desc(content.order), limit: 1 }
                  }
              });
              if (prevDay && prevDay.content.length > 0) {
                  prevContent = prevDay.content[0];
              }
          }
      }
  } else {
      // No Day ID (Direct Module Content)
      // 1c. Previous in same Module (Direct)
      prevContent = await db.query.content.findFirst({
        where: and(eq(content.moduleId, currentModuleId), isNull(content.dayId), lt(content.order, currentOrder)),
        orderBy: desc(content.order)
      });
      
      if (!prevContent) {
          // 1d. Last content of Last Day in Same Module (if we treat direct content as "after" days? usually mixed is bad practice but lets assume direct is at bottom or top. 
          // Let's assume standard flow: Days first, then Extra content or vice versa. 
          // Actually layout.tsx separates them: Days processed then Content filtered (null dayId).
          // So Direct Content usually comes AFTER days or is standalone.
          // Let's check for Days in this module to find the Last Content of Last Day
          const lastDay = await db.query.days.findFirst({
              where: eq(days.moduleId, currentModuleId),
              orderBy: desc(days.order),
               with: {
                  content: { orderBy: desc(content.order), limit: 1 }
              }
          });
          if (lastDay && lastDay.content.length > 0) {
              prevContent = lastDay.content[0];
          }
      }
  }

  // 1e. If still no prev content, go to Previous Module (Last Content)
  if (!prevContent) {
      const prevModule = await db.query.modules.findFirst({
          where: and(eq(modules.courseId, contentItem.module.courseId), lt(modules.order, contentItem.module.order)),
          orderBy: desc(modules.order),
          with: {
              days: { orderBy: desc(days.order), with: { content: { orderBy: desc(content.order), limit: 1 } } },
              content: { orderBy: desc(content.order), limit: 1 } // direct content
          }
      });

      if (prevModule) {
           // Check for direct content first (if it comes after days) OR days.
           // This depends on "Module Structure". Let's assume Days are main, Direct is fallback or Intro.
           // A safe bet is checking both and taking max order? But they are different tables/lists.
           // Based on Sidebar: Days are rendered first, then Direct Content.
           // So "Previous" from start of next module should be -> Direct Content of Prev Module -> Last Day of Prev Module.
           
           // Direct Content of Prev Module
           const lastDirect = prevModule.content.find(c => c.dayId === null); // limit 1 desc gives last
           
           if (lastDirect) {
               prevContent = lastDirect;
           } else if (prevModule.days.length > 0) {
               // Last Day Content
               const lastDay = prevModule.days[0];
               if (lastDay.content.length > 0) prevContent = lastDay.content[0];
           }
      }
  }


  // 2. Find NEXT Content
  if (currentDayId) {
       // 2a. Next in same Day
      nextContent = await getNextContentInDay(currentDayId, currentOrder);
      
      if (!nextContent) {
          // 2b. First content of Next Day in Same Module
          const currentDay = await db.query.days.findFirst({ where: eq(days.id, currentDayId)});
          if (currentDay) {
              const nextDay = await db.query.days.findFirst({
                  where: and(eq(days.moduleId, currentModuleId), gt(days.order, currentDay.order)),
                  orderBy: asc(days.order),
                  with: {
                      content: { orderBy: asc(content.order), limit: 1 }
                  }
              });
              if (nextDay && nextDay.content.length > 0) {
                  nextContent = nextDay.content[0];
              }
          }
      }
      
      if (!nextContent) {
          // 2c. Check for Direct Content in Same Module (after days)
           const firstDirect = await db.query.content.findFirst({
              where: and(eq(content.moduleId, currentModuleId), isNull(content.dayId)),
              orderBy: asc(content.order)
          });
          if (firstDirect) nextContent = firstDirect;
      }
  } else {
      // 2d. Next in same Module (Direct)
      nextContent = await db.query.content.findFirst({
        where: and(eq(content.moduleId, currentModuleId), isNull(content.dayId), gt(content.order, currentOrder)),
        orderBy: asc(content.order)
      });
  }

  // 2e. If still no next content, go to Next Module (First Content)
  if (!nextContent) {
      const nextModule = await db.query.modules.findFirst({
          where: and(eq(modules.courseId, contentItem.module.courseId), gt(modules.order, contentItem.module.order)),
          orderBy: asc(modules.order),
          with: {
              days: { orderBy: asc(days.order), with: { content: { orderBy: asc(content.order), limit: 1 } } },
              content: { orderBy: asc(content.order), limit: 1 }
          }
      });
      
      if (nextModule) {
          // Prefer Days first
          if (nextModule.days.length > 0) {
              const firstDay = nextModule.days[0];
              if (firstDay.content.length > 0) nextContent = firstDay.content[0];
          }
          // If no days, or empty days (unlikely), check direct
          if (!nextContent) {
               const firstDirect = nextModule.content.find(c => c.dayId === null);
               if (firstDirect) nextContent = firstDirect;
          }
      }
  }
 
  let isCompleted = false;
  let attempts = 0;
  let score: number | undefined = undefined;
  let isLocked = false;

  const user = session?.user;

  if (user && user.email) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (dbUser) {
      // 1. Fetch current progress
      const progress = await db.query.userProgress.findFirst({
        where: and(
          eq(userProgress.userId, dbUser.id),
          eq(userProgress.contentId, contentId)
        ),
      });
      isCompleted = !!progress?.isCompleted;
      attempts = progress?.attempts || 0;
      score = progress?.score || undefined;

      // 2. Check Module Locking
      const previousModule = await db.query.modules.findFirst({
        where: and(
          eq(modules.courseId, contentItem.module.courseId),
          lt(modules.order, contentItem.module.order)
        ),
        orderBy: desc(modules.order),
        with: {
           content: true 
        }
      });

      if (previousModule) {
         // Fetch all completed IDs for previous module
         // This check is slightly loose as it doesn't account for Days in previous module perfectly 
         // without a deep fetch, but assuming 'modules.content' relational query might ONLY return direct content?
         // WAIT: Drizzle 'many(content)' on modules returns ALL content linked to module usually, 
         // BUT in standard relational setup, content has moduleId.
         // If `content` table has `moduleId` for ALL items (even those in days), then this works.
         // Looking at schema: `moduleId` is on content. `dayId` is also there.
         // Ideally all content has moduleId. Let's assume that for safety.
         
         const previousModuleContentIds = await db.query.content.findMany({
             where: eq(content.moduleId, previousModule.id),
             columns: { id: true }
         });
         
         if (previousModuleContentIds.length > 0) {
             const completedProgress = await db.query.userProgress.findMany({
                 where: and(
                     eq(userProgress.userId, dbUser.id),
                     eq(userProgress.isCompleted, true)
                 ),
                 columns: { contentId: true }
             });
             
             const completedSet = new Set(completedProgress.map(p => p.contentId));
             const isPreviousModuleComplete = previousModuleContentIds.every(c => completedSet.has(c.id));
    
             if (!isPreviousModuleComplete) {
                 isLocked = true;
             }
         }
      }
    }
  }

  if (isLocked) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
              <div className="bg-red-100 p-4 rounded-full">
                  <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Module Locked</h1>
              <p className="text-slate-600 max-w-md">
                  You must complete the previous module to unlock this content. Please go back and finish all lessons and quizzes.
              </p>
              <Link href={`/internship/courses/${courseId}`}>
                  <Button variant="outline">Back to Course</Button>
              </Link>
          </div>
      );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-sm font-medium text-blue-600 mb-1">
              {contentItem.module.title}
              {contentItem.day && <span className="text-slate-400 mx-2">•</span>}
              {contentItem.day && <span className="text-slate-500">{contentItem.day.title}</span>}
          </h2>
          <h1 className="text-3xl font-bold text-slate-900">{contentItem.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {contentItem.type !== "test" && (
            <MarkAsReadButton 
              courseId={contentItem.module.course.id} 
              contentId={contentItem.id} 
              initialIsCompleted={isCompleted} 
            />
          )}
        </div>
      </div>

      <div className="min-h-[500px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-a:text-blue-600">
          {/* Render content based on type */}
          {(() => {
            // Priority 2: S3 Resource or File (Video or Download)
            const isS3 = contentItem.data.startsWith("s3://");
            const isFileLike = !contentItem.data.includes("\n") && /\.(pdf|docx|doc|ppt|pptx|xls|xlsx|zip|png|jpg|jpeg|mp4|mov|avi|wmv|json|xml|sql|txt|csv)$/i.test(contentItem.data);

            if (isS3 || isFileLike || contentItem.type === "video") {
               return (
                  <div className="w-full flex flex-col">
                     <S3Resource 
                        src={contentItem.data} 
                        title={contentItem.title} 
                        courseId={contentItem.module!.courseId!} 
                        contentId={contentItem.id}
                     />
                     {contentItem.type !== "video" && !/\.(mp4|mov|webm|mkv|avi)$/i.test(contentItem.data) && (
                        <p className="mt-4 text-sm text-slate-500 text-center italic">
                            Please read the document above and click "Mark as Read" to save your progress.
                        </p>
                     )}
                  </div>
               );
            }

            // Priority 3: Standard Text
            if (contentItem.type === "text") {
                return (
                    <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-700">{contentItem.data}</div>
                );
            }

            // Priority 4: Quiz
            if (contentItem.type === "test") {
                return (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Quiz</h3>
                      <Quiz 
                        data={contentItem.data} 
                        contentId={contentItem.id} 
                        initialAttempts={attempts} 
                        currentBestScore={score}
                      />
                    </div>
                );
            }
          })()}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        {prevContent ? (
          <Link href={`/internship/courses/${courseId}/${prevContent.id}`}>
            <Button variant="outline" className="text-slate-600 hover:text-slate-900">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Lesson
            </Button>
          </Link>
        ) : (
          <Button variant="outline" disabled className="text-slate-400">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous Lesson
          </Button>
        )}

        {nextContent ? (
           <Link href={`/internship/courses/${courseId}/${nextContent.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
              Next Lesson
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        ) : (
           <Button disabled className="bg-slate-200 text-slate-400">
            Next Lesson
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
