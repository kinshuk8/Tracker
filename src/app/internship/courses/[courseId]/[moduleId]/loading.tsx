import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="min-h-[500px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="pt-8">
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" disabled className="text-slate-400">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous Lesson
        </Button>
        <Button disabled className="bg-slate-200 text-slate-400">
          Next Lesson
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
