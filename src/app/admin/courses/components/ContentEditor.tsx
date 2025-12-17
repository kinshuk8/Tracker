"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, GripVertical, FileVideo, FileText, HelpCircle, Save } from "lucide-react";
import { S3FilePicker } from "./S3FilePicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ContentItem {
  id?: number | string; // string for temp items
  title: string;
  type: "video" | "text" | "test";
  data: string;
  order: number;
}

interface ContentEditorProps {
  content: ContentItem;
  onUpdate: (content: ContentItem) => void;
  onDelete: () => void;
}

export function ContentEditor({ content, onUpdate, onDelete }: ContentEditorProps) {
  const handleChange = (field: keyof ContentItem, value: any) => {
    onUpdate({ ...content, [field]: value });
  };

  return (
    <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900/50 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1.5 flex-1">
          <Label>Title</Label>
          <Input 
            value={content.title} 
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Introduction Video..."
          />
        </div>
        <div className="grid gap-1.5 w-[150px]">
          <Label>Type</Label>
          <Select 
            value={content.type} 
            onValueChange={(val) => handleChange("type", val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="video"> Video</SelectItem>
               <SelectItem value="text"> PDF / Text</SelectItem>
               <SelectItem value="test"> Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="icon" className="text-red-500 mt-6" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* DYNAMIC CONTENT EDITOR BASED ON TYPE */}
      <div className="pt-2">
         {content.type === "video" && (
             <div className="space-y-2">
                 <Label>Video Source (S3 Key)</Label>
                 <div className="flex gap-2">
                     <Input 
                        value={content.data} 
                        onChange={(e) => handleChange("data", e.target.value)}
                        placeholder="path/to/video.mp4"
                     />
                     <S3FilePicker onSelect={(_, key) => handleChange("data", key)} />
                 </div>
                 <p className="text-xs text-slate-500">Select a video from your S3 library.</p>
             </div>
         )}

         {content.type === "text" && (
             <div className="space-y-2">
                <Label>Content / PDF URL</Label>
                 <div className="flex gap-2">
                     <Input 
                        value={content.data} 
                        onChange={(e) => handleChange("data", e.target.value)}
                        placeholder="https://... or S3 key"
                     />
                     <S3FilePicker onSelect={(_, key) => handleChange("data", key)} />
                 </div>
                 <p className="text-xs text-slate-500">Provide a URL or select a PDF/PPT from S3.</p>
             </div>
         )}
         
         {content.type === "test" && (
             <div className="space-y-2">
                <Label>Quiz Configuration (JSON)</Label>
                <Textarea 
                    value={content.data}
                    onChange={(e) => handleChange("data", e.target.value)}
                    placeholder='[{"question": "...", "options": ["A", "B"], "answer": "A"}]'
                    rows={4}
                    className="font-mono text-xs"
                />
                <p className="text-xs text-slate-500">Enter quiz questions in JSON format.</p>
             </div>
         )}
      </div>
    </div>
  );
}
