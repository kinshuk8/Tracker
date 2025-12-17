"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Folder } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DayList, DayItem } from "./DayList";
import { Input } from "@/components/ui/input";

export interface ModuleItem {
  id?: number | string;
  title: string;
  order: number;
  days: DayItem[];
}

interface ModuleListProps {
  modules: ModuleItem[];
  onUpdate: (modules: ModuleItem[]) => void;
}

export function ModuleList({ modules, onUpdate }: ModuleListProps) {
  const addModule = () => {
    onUpdate([
      ...modules,
      {
        id: `temp-mod-${Date.now()}`,
        title: `Module ${modules.length + 1}`,
        order: modules.length + 1,
        days: [],
      },
    ]);
  };

  const updateModule = (index: number, updatedModule: ModuleItem) => {
    const newModules = [...modules];
    newModules[index] = updatedModule;
    onUpdate(newModules);
  };

  const removeModule = (index: number) => {
      onUpdate(modules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Course Curriculum</h3>
          <Button onClick={addModule}>
            <Plus className="w-4 h-4 mr-2" /> Add Module
          </Button>
      </div>

      <div className="space-y-6">
        {modules.map((module, idx) => (
            <Card key={module.id} className="border-l-4 border-l-brand-purple">
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-purple/10 p-2 rounded-lg">
                            <Folder className="w-5 h-5 text-brand-purple" />
                        </div>
                        <Input 
                            value={module.title}
                            onChange={(e) => updateModule(idx, { ...module, title: e.target.value })}
                            className="text-lg font-bold bg-transparent border-transparent hover:border-input focus:bg-background h-10 w-full"
                        />
                         <Button variant="ghost" size="sm" onClick={() => removeModule(idx)} className="text-red-500 hover:bg-red-50">
                             Delete Module
                         </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <DayList 
                        days={module.days}
                        onUpdate={(updatedDays) => updateModule(idx, { ...module, days: updatedDays })}
                    />
                </CardContent>
            </Card>
        ))}
        
        {modules.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-xl bg-slate-50/50">
                <p className="text-slate-500">No modules added yet. Click "Add Module" to start.</p>
            </div>
        )}
      </div>
    </div>
  );
}
