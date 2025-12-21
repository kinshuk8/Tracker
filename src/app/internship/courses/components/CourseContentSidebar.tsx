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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-2">
      <CollapsibleTrigger className="flex items-center gap-2 group cursor-pointer w-full text-left">
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-neutral-500 transition-transform duration-200" />
        ) : (
          <ChevronRight className="h-4 w-4 text-neutral-500 transition-transform duration-200" />
        )}
        <h3 className="text-xs font-bold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 uppercase tracking-wider transition-colors flex items-center gap-2">
           <Folder className="h-3 w-3" />
           {module.title}
        </h3>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pl-2 flex flex-col gap-1 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
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

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-1 ml-2 mt-2">
      <CollapsibleTrigger className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors w-full text-left group">
        {isOpen ? (
           <ChevronDown className="h-3 w-3 text-neutral-400" />
        ) : (
           <ChevronRight className="h-3 w-3 text-neutral-400" />
        )}
        <div className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">
           <Calendar className="h-3 w-3" />
           {day.title}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pl-6 flex flex-col gap-1 mt-1 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
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
