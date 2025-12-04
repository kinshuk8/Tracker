"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const courses = [
  { id: "power-bi", title: "Power BI", description: "Master data visualization and business intelligence." },
  { id: "python", title: "Python", description: "Learn Python programming from scratch to advanced." },
  { id: "java", title: "Java", description: "Comprehensive Java course for building robust applications." },
];

const plans = [
  { id: "1_month", title: "1 Month", price: 199, features: ["Course Access"] },
  { id: "3_months", title: "3 Months", price: 429, features: ["Course Access", "Assignments", "Projects"] },
  { id: "6_months", title: "6 Months", price: 1499, features: ["Course Access", "Assignments", "Projects", "Resume Building", "Priority Support"] },
];

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-36 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Start Your Learning Journey</h1>
          <p className="text-lg text-slate-600">Choose a course and a plan that suits you best.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Course & Plan Selection */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Select a Course</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Card 
                    key={course.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedCourse === course.id ? "ring-2 ring-blue-600 border-blue-600" : ""}`}
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-slate-500">{course.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Select a Plan</h2>
              <div className="grid gap-4">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedPlan === plan.id ? "ring-2 ring-blue-600 border-blue-600" : ""}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
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
                ))}
              </div>
            </section>
          </div>

          {/* Registration Form */}
          <div className="lg:sticky lg:top-24">
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

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={form.state.isSubmitting}>
                    {form.state.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Registration
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="text-xs text-center text-slate-500 justify-center">
                By registering, you agree to our Terms of Service and Privacy Policy.
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
