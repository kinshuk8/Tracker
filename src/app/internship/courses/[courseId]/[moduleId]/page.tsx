import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/db";
import { content, userProgress, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";

import MarkAsReadButton from "../../components/MarkAsReadButton";
import Quiz from "../../components/Quiz";
import { AlertCircle } from "lucide-react";

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
  const { moduleId } = await params;

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

  if (!contentItem) {
    notFound();
  }

  // Check completion status
  // Check completion status
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
          <MarkAsReadButton 
            courseId={contentItem.module.course.id} 
            contentId={contentItem.id} 
            initialIsCompleted={isCompleted} 
          />
        </div>
      </div>

      <div className="min-h-[500px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-a:text-blue-600">
          {/* Render content based on type */}
          {contentItem.type === "text" && (
            <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-700">{contentItem.data}</div>
          )}
          {contentItem.type === "video" && (
            <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg overflow-hidden">
              {(() => {
                const embedUrl = getYouTubeEmbedUrl(contentItem.data);
                if (embedUrl) {
                  return (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={contentItem.title}
                    />
                  );
                } else {
                  return (
                    <div className="flex flex-col items-center gap-2 text-red-400 p-4 text-center">
                      <AlertCircle className="w-12 h-12" />
                      <p className="font-medium">Invalid Video Source</p>
                      <p className="text-sm text-slate-400">Only YouTube videos are supported.</p>
                    </div>
                  );
                }
              })()}
            </div>
          )}
          {contentItem.type === "test" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Quiz</h3>
              <Quiz data={contentItem.data} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" className="text-slate-600 hover:text-slate-900">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous Lesson
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all">
          Next Lesson
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
