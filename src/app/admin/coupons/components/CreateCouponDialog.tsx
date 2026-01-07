"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  code: string;
  discountAmount: number;
  planId?: string;
}

interface Plan {
  id: number;
  title: string;
}

export function CreateCouponDialog({ open, onOpenChange, onSuccess }: CreateCouponDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    if (open) {
      // Fetch plans to populate dropdown. 
      // Assuming we have an endpoint for this, e.g., the same endpoint used elsewhere or a specialized one.
      // Since I don't see a direct "list all plans for admin" endpoint in my previous `ls`, 
      // I might need to use a known one or assume one exists. 
      // The `src/app/api/courses/[slug]/plans` gets plans for a course. 
      // Maybe I can fetch all plans via `src/app/api/admin/courses` if it includes plans? 
      // Or just create a quick client-side fetch if no "all plans" endpoint exists, 
      // but actually I should reuse existing endpoints. 
      // Let's assume for now I can fetch from a new endpoint or existing one.
      // I'll create a simple server action or route if needed, but for now I'll try to fetch from 
      // /api/courses/power-bi/plans (just one course) as a fallback or if I know the course.
      // Wait, the user wants "specific couple for plan". This implies ANY plan from ANY course? 
      // Or typical use case is one main course.
      // Let's Try to fetch all plans. I'll use a hacky way if needed, but correct way is likely an admin route.
      // I'll skip fetching for now and hardcode simple fetch, 
      // but I should really check if there is an endpoint.
      // Actually, I can use a server action component or just fetch.
      
      // Let's assume I need to fetch all plans. I'll simply fetch from the existing plans table via a simple API call 
      // or if I haven't created one, I might need to.
      // But `admin/enroll/new/page.tsx` fetched courses. 
      // Let's stick effectively to "Global" or "Specific Plan".
      
      // For now, I will modify this to fetch plans. I'll add a new route /api/admin/plans if it doesn't exist, 
      // or I'll just clear this up later.
      // Actually I'll use `fetch("/api/admin/courses")` and map? No, that's heavy.
      // I'll add a quick route /api/admin/plans to list all plans.
       
      fetch("/api/admin/plans") 
          .then(res => res.ok ? res.json() : [])
          .then(setPlans)
          .catch(err => console.error("Failed to fetch plans", err));
    }
  }, [open]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create coupon");
      }

      toast.success("Coupon created successfully");
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Coupon</DialogTitle>
          <DialogDescription>
            Add a new discount coupon. Leave plan empty for global coupon.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code</Label>
            <Input
              id="code"
              {...register("code", { required: "Code is required" })}
              placeholder="SUMMER2025"
              className="uppercase"
            />
            {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountAmount">Discount Amount (₹)</Label>
            <Input
              id="discountAmount"
              type="number"
              {...register("discountAmount", { 
                required: "Discount amount is required",
                min: { value: 1, message: "Minimum discount is ₹1" }
              })}
              placeholder="100"
            />
            {errors.discountAmount && <p className="text-red-500 text-sm">{errors.discountAmount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="planId">Applicable Plan (Optional)</Label>
            <Select onValueChange={(val) => setValue("planId", val === "global" ? undefined : val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">All Plans (Global)</SelectItem>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id.toString()}>
                    {plan.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">If selected, coupon only works for this plan.</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
