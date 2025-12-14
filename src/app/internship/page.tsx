"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

export default function InternshipPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      year: "",
      college: "",
      internshipDuration: "" as "1_month" | "3_months" | "6_months" | "",
      courses: [] as string[],
      areaOfInterest: "",
    },
    onSubmit: async ({ value }) => {
      // Manual validation check
      if (!value.internshipDuration) {
        toast.error("Please select an internship duration.");
        return;
      }
      if (value.courses.length === 0) {
        toast.error("Please select at least one course.");
        return;
      }

      try {
        const response = await fetch("/api/internship/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit application");
        }

        setIsSuccess(true);
        toast.success("Application submitted successfully!");
        form.reset();
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);

      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      }
    },
  });

  const courseOptions = [
    { id: "power_bi", label: "Power BI" },
    { id: "python", label: "Python" },
    { id: "ai_agents", label: "AI Agents" },
    { id: "other", label: "Other" },
  ];

  return (
    <div className="font-sans bg-slate-50 dark:bg-black text-slate-800 dark:text-white min-h-screen flex flex-col">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Registration Form Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                Internship Registration
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300">
                Start your journey with us. Fill out the form below to apply.
              </p>
          </div>

          <Card className="border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-black/50 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-8">
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Application Details</CardTitle>
              <CardDescription>
                 Please provide accurate information for your application.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-8"
              >
                
                <div className="grid md:grid-cols-2 gap-6">
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => !value ? "Name is required" : value.length < 2 ? "Name must be at least 2 chars" : undefined,
                    }}
                    children={(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Name of the Candidate</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="John Doe"
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
                        ) : null}
                      </div>
                    )}
                  />
                  
                  <form.Field
                    name="phone"
                    validators={{
                        onChange: ({ value }) => !value || value.length < 10 ? "Recent valid phone required" : undefined,
                    }}
                    children={(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Phone Number</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                        {field.state.meta.errors ? (
                          <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
                        ) : null}
                      </div>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <form.Field
                    name="email"
                    validators={{
                        onChange: ({ value }) => !value || !/\S+@\S+\.\S+/.test(value) ? "Valid email required" : undefined,
                    }}
                    children={(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Email ID</Label>
                        <Input
                          id={field.name}
                          type="email"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="john@example.com"
                        />
                         {field.state.meta.errors ? (
                          <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
                        ) : null}
                      </div>
                    )}
                  />

                  <form.Field
                    name="year"
                    validators={{
                        onChange: ({ value }) => !value ? "Year is required" : undefined,
                    }}
                    children={(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Year</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="e.g. 3rd Year"
                        />
                         {field.state.meta.errors ? (
                          <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
                        ) : null}
                      </div>
                    )}
                  />
                </div>

                <form.Field
                    name="college"
                    validators={{
                        onChange: ({ value }) => !value ? "College is required" : undefined,
                    }}
                    children={(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>College</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="University Name"
                        />
                         {field.state.meta.errors ? (
                          <p className="text-sm text-red-500">{field.state.meta.errors.join(", ")}</p>
                        ) : null}
                      </div>
                    )}
                  />

                <form.Field
                    name="internshipDuration"
                    children={(field) => (
                      <div className="space-y-3">
                        <Label>Internship Duration</Label>
                        <RadioGroup
                            value={field.state.value}
                            onValueChange={(value) => field.handleChange(value as any)}
                            className="flex flex-col space-y-1"
                        >
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="1_month" id="d1" />
                                <Label htmlFor="d1" className="font-normal cursor-pointer">1 month</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="3_months" id="d3" />
                                <Label htmlFor="d3" className="font-normal cursor-pointer">3 months (8 weeks to 12 weeks)</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="6_months" id="d6" />
                                <Label htmlFor="d6" className="font-normal cursor-pointer">6 months (20 weeks to 24 weeks)</Label>
                            </div>
                        </RadioGroup>
                      </div>
                    )}
                />

                <form.Field
                    name="courses"
                    children={(field) => (
                      <div className="space-y-3">
                         <div className="mb-2">
                            <Label className="text-base">Courses</Label>
                            <p className="text-sm text-slate-500">Select the courses you are interested in.</p>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {courseOptions.map((item) => (
                                <div key={item.id} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id={`course-${item.id}`}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                        checked={field.state.value.includes(item.id)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            const currentValues = field.state.value;
                                            if (checked) {
                                                field.handleChange([...currentValues, item.id]);
                                            } else {
                                                field.handleChange(currentValues.filter((v: string) => v !== item.id));
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`course-${item.id}`} className="font-normal cursor-pointer">
                                        {item.label}
                                    </Label>
                                </div>
                            ))}
                          </div>
                      </div>
                    )}
                />

                <form.Field
                    name="areaOfInterest"
                    children={(field) => (
                       <div className="space-y-2">
                        <Label htmlFor={field.name}>Area of Interest</Label>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Tell us about your other interests..."
                          className="resize-none h-32"
                        />
                        <p className="text-sm text-slate-500">Optional: Any specific domain or technology you want to work on.</p>
                      </div>
                    )}
                  />

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <div className="space-y-4">
                            <Button 
                                type="submit" 
                                size="lg" 
                                className={`w-full text-lg transition-all duration-300 ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`} 
                                disabled={!canSubmit || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : isSuccess ? (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Submitted Successfully
                                    </>
                                ) : (
                                    "Submit Registration"
                                )}
                            </Button>
                            
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-center text-sm font-medium border border-green-100 dark:border-green-800"
                                >
                                    Thank you! Your application has been submitted successfully to our team.
                                </motion.div>
                            )}
                        </div>
                    )}
                />
              </form>
            </CardContent>
          </Card>
        </motion.div>

      </main>
      <Footer />
    </div>
  );
}
