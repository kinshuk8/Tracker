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
  planIds?: (number | string)[]; // IDs or Temp IDs of plans
}

interface ModuleListProps {
  modules: ModuleItem[];
  availablePlans: { id?: number | string; title: string; planType?: string }[];
  onUpdate: (modules: ModuleItem[]) => void;
}

export function ModuleList({ modules, availablePlans = [], onUpdate }: ModuleListProps) {
  const addModule = () => {
    onUpdate([
      ...modules,
      {
        id: `temp-mod-${Date.now()}`,
        title: `Module ${modules.length + 1}`,
        order: modules.length + 1,
        days: [],
        planIds: [], // Default to no specific plans (or all?) - User decision: "Strict assignment"
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

  const togglePlan = (moduleIdx: number, planId: number | string) => {
     const module = modules[moduleIdx];
     const currentPlans = module.planIds || [];
     let newPlans;
     
     if (currentPlans.includes(planId)) {
        newPlans = currentPlans.filter(id => id !== planId);
     } else {
        newPlans = [...currentPlans, planId];
     }
     
     updateModule(moduleIdx, { ...module, planIds: newPlans });
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
                    <div className="flex flex-col gap-4">
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
                        
                        {/* Plan Availability Selector */}
                        <div className="flex gap-4 items-center pl-14">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Available In:</span>
                            <div className="flex flex-wrap gap-3">
                                {availablePlans.map((plan) => {
                                    // Use plan.id if available, fallback to planType (temp ID)
                                    const planId = plan.id || plan.planType;
                                    if (!planId) return null;
                                    
                                    const isSelected = (module.planIds || []).includes(planId);
                                    
                                    return (
                                        <label key={planId} className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border transition-colors ${isSelected ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200' : 'bg-white dark:bg-zinc-900 border-slate-200 text-slate-500'}`}>
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
                                                checked={isSelected}
                                                onChange={() => togglePlan(idx, planId)}
                                            />
                                            {plan.title}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
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
