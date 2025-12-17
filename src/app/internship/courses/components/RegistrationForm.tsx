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
import { Loader2, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

interface RegistrationFormProps {
  selectedCourse: string;
  selectedPlan: string;
}

export function RegistrationForm({ selectedCourse, selectedPlan }: RegistrationFormProps) {
  const { data: session } = authClient.useSession();
  
  const form = useForm({
    defaultValues: {
      name: "",
      college: "",
      email: "",
      phone: "",
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

  if (!session) {
    return (
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader className="text-center">
          <div className="mx-auto bg-slate-100 p-3 rounded-full w-fit mb-2">
            <Lock className="w-6 h-6 text-slate-500" />
          </div>
          <CardTitle>Login Required</CardTitle>
          <CardDescription>
            You must be logged in to register for a course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" size="lg">
             <Link href="/auth/sign-in?callbackUrl=/internship/courses">Sign In to Continue</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

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

          <form.Field name="phone">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="+91 98765 43210"
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
