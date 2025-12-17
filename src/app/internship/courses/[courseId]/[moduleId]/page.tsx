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

function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

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

  const contentItem = await db.query.content.findFirst({
    where: eq(content.id, contentId),
    with: {
      module: {
        with: {
          course: true
        }
      }
    }
  });

  if (!contentItem || !contentItem.module) {
    notFound();
  }

  // --- Navigation Logic ---
  const currentModuleOrder = contentItem.module.order;
  const currentContentOrder = contentItem.order;

  // 1. Try to find previous content in the same module
  let prevContent = await db.query.content.findFirst({
    where: and(
      eq(content.moduleId, contentItem.moduleId!),
      lt(content.order, currentContentOrder)
    ),
    orderBy: desc(content.order),
  });

  // 2. If not found, find last content of the previous module
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

  // 3. Try to find next content in the same module
  let nextContent = await db.query.content.findFirst({
    where: and(
      eq(content.moduleId, contentItem.moduleId!),
      gt(content.order, currentContentOrder)
    ),
    orderBy: asc(content.order),
  });

  // 4. If not found, find first content of the next module
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
  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const user = session?.user;

  if (user && user.email) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (dbUser) {
      const progress = await db.query.userProgress.findFirst({
        where: and(
          eq(userProgress.userId, dbUser.id),
          eq(userProgress.contentId, contentId)
        ),
      });
      isCompleted = !!progress?.isCompleted;
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-sm font-medium text-blue-600 mb-1">{contentItem.module.title}</h2>
          <h1 className="text-3xl font-bold text-slate-900">{contentItem.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!(/\.(mp4|mov|webm|mkv|avi)$/i.test(contentItem.data)) && (
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
            const isYouTube = contentItem.type === "video" && getYouTubeEmbedUrl(contentItem.data);
            const isS3 = contentItem.data.startsWith("s3://");
            const isFileLike = !contentItem.data.includes("\n") && /\.(pdf|docx|doc|ppt|pptx|xls|xlsx|zip|png|jpg|jpeg|mp4|mov|avi|wmv)$/i.test(contentItem.data);
            
            // Priority 1: YouTube Video
            if (isYouTube) {
               const embedUrl = getYouTubeEmbedUrl(contentItem.data);
               return (
                 <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg overflow-hidden">
                    <iframe
                      src={embedUrl!}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={contentItem.title}
                    />
                 </div>
               );
            }

            // Priority 2: S3 Resource or File (Video or Download)
            if (isS3 || isFileLike || (contentItem.type === "video" && !isYouTube)) {
               return (
                  <div className="w-full">
                     <S3Resource 
                        src={contentItem.data} 
                        title={contentItem.title} 
                        courseId={contentItem.module!.courseId!} 
                        contentId={contentItem.id}
                     />
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
                      <Quiz data={contentItem.data} />
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
