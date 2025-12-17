"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ContentEditor, ContentItem } from "./ContentEditor";
import { Input } from "@/components/ui/input";

export interface DayItem {
  id?: number | string;
  title: string;
  order: number;
  content: ContentItem[];
}

interface DayListProps {
  days: DayItem[];
  onUpdate: (days: DayItem[]) => void;
}

export function DayList({ days, onUpdate }: DayListProps) {
  const addDay = () => {
    onUpdate([
      ...days,
      {
        id: `temp-day-${Date.now()}`,
        title: `Day ${days.length + 1}`,
        order: days.length + 1,
        content: [],
      },
    ]);
  };

  const updateDay = (index: number, updatedDay: DayItem) => {
    const newDays = [...days];
    newDays[index] = updatedDay;
    onUpdate(newDays);
  };

  const removeDay = (index: number) => {
      onUpdate(days.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
      {days.map((day, dayIndex) => (
        <DayEditor 
            key={day.id} 
            day={day} 
            onUpdate={(d) => updateDay(dayIndex, d)}
            onRemove={() => removeDay(dayIndex)}
        />
      ))}

      <Button onClick={addDay} variant="secondary" size="sm" className="w-full border-dashed border-2">
        <Plus className="w-4 h-4 mr-2" /> Add Day
      </Button>
    </div>
  );
}

function DayEditor({ day, onUpdate, onRemove }: { day: DayItem, onUpdate: (d: DayItem) => void, onRemove: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const addContent = () => {
        onUpdate({
            ...day,
            content: [
                ...day.content,
                {
                    id: `temp-content-${Date.now()}`,
                    title: "New Content",
                    type: "video",
                    data: "",
                    order: day.content.length + 1
                }
            ]
        });
    };

    const updateContent = (index: number, item: ContentItem) => {
        const newContent = [...day.content];
        newContent[index] = item;
        onUpdate({ ...day, content: newContent });
    };

    const removeContent = (index: number) => {
        const newContent = day.content.filter((_, i) => i !== index);
        onUpdate({ ...day, content: newContent });
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-2 p-3">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                </CollapsibleTrigger>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md">
                     <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <Input 
                   value={day.title}
                   onChange={(e) => onUpdate({...day, title: e.target.value})}
                   className="h-8 py-0 font-medium flex-1 bg-transparent border-transparent hover:border-input focus:bg-background transition-all"
                />
                <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-500 hover:text-red-700">Delete</Button>
            </div>
            
            <CollapsibleContent className="p-4 pt-0 space-y-4">
                <div className="space-y-3">
                     {day.content.length === 0 && <p className="text-sm text-slate-400 text-center py-2">No content added yet.</p>}
                     {day.content.map((item, idx) => (
                         <ContentEditor 
                            key={item.id}
                            content={item}
                            onUpdate={(c) => updateContent(idx, c)}
                            onDelete={() => removeContent(idx)}
                         />
                     ))}
                </div>
                <Button onClick={addContent} variant="outline" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Content
                </Button>
            </CollapsibleContent>
        </Collapsible>
    )
}
