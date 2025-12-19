import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/db";
import { content, userProgress, users, modules } from "@/db/schema";
import { eq, and, asc, desc, lt, gt } from "drizzle-orm";
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
     const cResult = await db.query.content.findFirst({
        where: eq(content.id, contentId),
      });
      if (!cResult || !cResult.moduleId) return null;
      
      const mResult = await db.query.modules.findFirst({
        where: eq(modules.id, cResult.moduleId),
        with: { course: true }
      });
      
      if (!mResult) return null;
      return { ...cResult, module: mResult };
  })();

  const [session, contentItem] = await Promise.all([sessionPromise, contentPromise]);

  if (!contentItem) {
    notFound();
  }

  // --- Navigation Logic ---
  const currentModuleOrder = contentItem.module.order;
  const currentContentOrder = contentItem.order;

  const [prevContentSameModule, nextContentSameModule] = await Promise.all([
    db.query.content.findFirst({
      where: and(
        eq(content.moduleId, contentItem.moduleId!),
        lt(content.order, currentContentOrder)
      ),
      orderBy: desc(content.order),
    }),
    db.query.content.findFirst({
      where: and(
        eq(content.moduleId, contentItem.moduleId!),
        gt(content.order, currentContentOrder)
      ),
      orderBy: asc(content.order),
    })
  ]);

  let prevContent = prevContentSameModule;
  let nextContent = nextContentSameModule;

  // Secondary queries only if needed
  if (!prevContent) {
    const prevModule = await db.query.modules.findFirst({
      where: and(
        eq(modules.courseId, contentItem.module.courseId),
        lt(modules.order, currentModuleOrder)
      ),
      orderBy: desc(modules.order),
      with: {
        content: {
          orderBy: desc(content.order),
          limit: 1,
        }
      }
    });
    if (prevModule && prevModule.content.length > 0) {
      prevContent = prevModule.content[0];
    }
  }

  if (!nextContent) {
    const nextModule = await db.query.modules.findFirst({
      where: and(
        eq(modules.courseId, contentItem.module.courseId),
        gt(modules.order, currentModuleOrder)
      ),
      orderBy: asc(modules.order),
      with: {
        content: {
          orderBy: asc(content.order),
          limit: 1,
        }
      }
    });
    if (nextModule && nextModule.content.length > 0) {
      nextContent = nextModule.content[0];
    }
  }
  // --- End Navigation Logic ---
 
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
      // Logic: If this is the START of a module (or any content in a module), 
      // check if the immediately PREVIOUS module is completed.
      // Optimization: Only check if we are NOT an admin/intern? (assuming regular user flow)
      
      // Calculate previous module ID
      const currentModuleId = contentItem.moduleId!;
      const previousModule = await db.query.modules.findFirst({
        where: and(
          eq(modules.courseId, contentItem.module.courseId),
          lt(modules.order, contentItem.module.order)
        ),
        orderBy: desc(modules.order),
        with: {
           content: true // finish check needs total content
        }
      });

      if (previousModule) {
         // Check if ALL content in previous module is completed
         const previousModuleContentIds = previousModule.content.map(c => c.id);
         const completedCount = await db.$count(
            userProgress, 
            and(
                eq(userProgress.userId, dbUser.id),
                eq(userProgress.isCompleted, true),
                // inArray(userProgress.contentId, previousModuleContentIds) // Drizzle doesn't support massive arrays well sometimes, but fine here
            )
            // safer manual check if array issue, but let's try clean query first or
            // simpler: fetch all progress for user for these IDs
         );
         
         // Actually, just fetching all completed IDs for previous module is safer
         const completedProgress = await db.query.userProgress.findMany({
             where: and(
                 eq(userProgress.userId, dbUser.id),
                 eq(userProgress.isCompleted, true)
             ),
             columns: { contentId: true }
         });
         
         const completedSet = new Set(completedProgress.map(p => p.contentId));
         const isPreviousModuleComplete = previousModule.content.every(c => completedSet.has(c.id));

         if (!isPreviousModuleComplete) {
             isLocked = true;
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
          <h2 className="text-sm font-medium text-blue-600 mb-1">{contentItem.module.title}</h2>
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
            const isFileLike = !contentItem.data.includes("\n") && /\.(pdf|docx|doc|ppt|pptx|xls|xlsx|zip|png|jpg|jpeg|mp4|mov|avi|wmv)$/i.test(contentItem.data);

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
