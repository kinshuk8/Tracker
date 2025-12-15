"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RegistrationFormProps {
  selectedCourse: string;
  selectedPlan: string;
}

export function RegistrationForm({ selectedCourse, selectedPlan }: RegistrationFormProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      college: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      if (!selectedCourse || !selectedPlan) {
        toast.error("Please select a course and a plan.");
        return;
      }

      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Registration:", { ...value, course: selectedCourse, plan: selectedPlan });
      toast.success("Registration successful! Redirecting...");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration Details</CardTitle>
        <CardDescription>Fill in your details to complete enrollment.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="college">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="college">College / University</Label>
                <Input
                  id="college"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="XYZ Institute of Technology"
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
          </form.Field>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Registration
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-center text-slate-500 justify-center">
        By registering, you agree to our Terms of Service and Privacy Policy.
      </CardFooter>
    </Card>
  );
}
