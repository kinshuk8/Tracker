"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plan } from "../page";

interface PlanSelectorProps {
  selectedPlan: string;
  onSelect: (planId: string) => void;
  plans: Plan[];
  loading: boolean;
}

export function PlanSelector({ selectedPlan, onSelect, plans, loading }: PlanSelectorProps) {
  
  if (loading) {
      return (
          <section>
              <h2 className="text-2xl font-semibold mb-4">2. Select a Plan</h2>
              <div className="flex justify-center p-8 bg-white rounded-lg border border-slate-200">
                  <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
              </div>
          </section>
      );
  }

  if (plans.length === 0) {
      return (
          <section>
              <h2 className="text-2xl font-semibold mb-4">2. Select a Plan</h2>
              <div className="p-8 bg-white rounded-lg border border-slate-200 text-slate-500 text-center">
                  No plans available for this course yet or course not selected.
              </div>
          </section>
      );
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">2. Select a Plan</h2>
      <div className="grid gap-4">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Card
              className={`cursor-pointer transition-colors ${
                selectedPlan === plan.id
                  ? "ring-2 ring-blue-600 border-blue-600 bg-blue-50/50"
                  : "hover:border-blue-400"
              }`}
              onClick={() => onSelect(plan.id)}
            >
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex flex-col">
                    <CardTitle className="text-lg">
                        {plan.id === "1_month" ? "1 Month Access" : 
                         plan.id === "3_months" ? "3 Months Access" : 
                         plan.id === "6_months" ? "6 Months Access" : plan.title}
                    </CardTitle>
                    <span className="text-xs text-slate-500 font-normal capitalize">{plan.title !== plan.id ? plan.title : "Internship Plan"}</span>
                </div>
                <span className="text-xl font-bold">₹{plan.price}</span>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <ul className="grid sm:grid-cols-2 gap-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" /> {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
