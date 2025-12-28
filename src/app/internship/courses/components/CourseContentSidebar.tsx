"use client";

import React, { useState } from "react";
import { SidebarLink } from "@/components/ui/sidebar-aceternity";
import { CheckCircle, Video, FileText, BookOpen, ChevronRight, ChevronDown, Folder, Calendar } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: number;
  title: string;
  type: "video" | "text" | "test";
  moduleId: number | null;
  dayId: number | null;
}

interface Day {
  id: number;
  title: string;
  moduleId: number;
  content: ContentItem[];
}

interface Module {
  id: number;
  title: string;
  days: Day[];
  content: ContentItem[]; // Direct content in module (legacy or specific use case)
}

interface CourseContentSidebarProps {
  modules: Module[];
  courseId: string;
  completedContentIds: Set<number>;
}

export function CourseContentSidebar({
  modules,
  courseId,
  completedContentIds,
}: CourseContentSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      {modules.map((module) => (
        <ModuleItem 
          key={module.id} 
          module={module} 
          courseId={courseId} 
          completedContentIds={completedContentIds} 
        />
      ))}
    </div>
  );
}

function ModuleItem({ 
  module, 
  courseId, 
  completedContentIds 
}: { 
  module: Module; 
  courseId: string; 
  completedContentIds: Set<number>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Check if module is completed
  // 1. All Days must be completed
  // 2. All Direct Content must be completed
  const isModuleCompleted = module.days.every(day => 
      day.content.every(c => completedContentIds.has(c.id))
  ) && module.content.every(c => completedContentIds.has(c.id));

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-1">
      <CollapsibleTrigger 
        className={cn(
          "flex items-center gap-3 w-full text-left p-3 rounded-lg border transition-all duration-200 group",
          isOpen 
            ? "bg-white border-neutral-200 shadow-sm dark:bg-neutral-800 dark:border-neutral-700" 
            : "bg-neutral-50/50 border-transparent hover:bg-white hover:border-neutral-200 hover:shadow-sm dark:bg-neutral-900/50 dark:hover:bg-neutral-800 dark:hover:border-neutral-700"
        )}
      >
        <div className={cn(
          "h-6 w-6 rounded-md flex items-center justify-center border transition-colors shrink-0",
          isOpen 
            ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" 
            : "bg-white border-neutral-200 text-neutral-400 group-hover:border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700"
        )}>
          {isModuleCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
           ) : isOpen ? (
              <ChevronDown className="h-4 w-4" />
           ) : (
              <ChevronRight className="h-4 w-4" />
           )}
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest leading-none mb-0.5">
            Module
          </span>
          <h3 className={cn(
            "text-sm font-semibold transition-colors leading-tight",
            isOpen ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-600 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-200"
          )}>
             {module.title}
          </h3>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pl-4 flex flex-col gap-1 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
        <div className="pl-4 border-l-2 border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col gap-2 py-2">
            {/* Render Days */}
            {module.days.map((day) => (
              <DayItem 
                key={day.id} 
                day={day} 
                courseId={courseId} 
                completedContentIds={completedContentIds} 
              />
            ))}

            {/* Render Direct Content (if any) */}
            {module.content.map((item) => (
               <ContentLink 
                 key={item.id} 
                 item={item} 
                 courseId={courseId} 
                 completedContentIds={completedContentIds} 
               />
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DayItem({ 
  day, 
  courseId, 
  completedContentIds 
}: { 
  day: Day; 
  courseId: string; 
  completedContentIds: Set<number>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Check if Day is completed (all content in day is completed)
  const isDayCompleted = day.content.every(item => completedContentIds.has(item.id));

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-1">
      <CollapsibleTrigger 
        className={cn(
            "flex items-center gap-2 py-2 px-2 rounded-md transition-colors w-full text-left group",
            isOpen ? "bg-neutral-100/80 dark:bg-neutral-800/80" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
        )}
      >
        {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
        ) : (
            <ChevronRight className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
        )}
        
        <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 line-clamp-1">
           {isDayCompleted ? (
               <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
           ) : (
               <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
           )}
           {day.title}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pl-6 flex flex-col gap-0.5 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
        {day.content.map((item) => (
          <ContentLink 
            key={item.id} 
            item={item} 
            courseId={courseId} 
            completedContentIds={completedContentIds} 
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ContentLink({ 
  item, 
  courseId, 
  completedContentIds 
}: { 
  item: ContentItem; 
  courseId: string; 
  completedContentIds: Set<number>;
}) {
  const isCompleted = completedContentIds.has(item.id);
  
  return (
    <SidebarLink
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
}
