"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CourseSelector } from "./components/CourseSelector";
import { PlanSelector } from "./components/PlanSelector";
import { RegistrationForm } from "./components/RegistrationForm";
import { toast } from "sonner";
// Import default plans for fallback or structure
import { plans as defaultPlans } from "./data";
import { courses } from "./data"; 

export interface Plan {
    id: string; 
    title: string;
    price: number;
    features: string[];
    courseId?: number;
}

function CoursesContent() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const course = searchParams.get("course");
    if (course) {
        setSelectedCourse(course);
    }
  }, [searchParams]);

  // Fetch plans when course changes
  useEffect(() => {
      if (!selectedCourse) {
          setAvailablePlans([]);
          setSelectedPlan("");
          return;
      }

      const fetchPlans = async () => {
          setLoadingPlans(true);
          try {
              // We need to find the slug for the backend call. 
              // In this app structure, selectedCourse matches the ID in data.ts
              // but we need to verify if that maps to DB slug.
              // For now, assuming current simple mapping: courseId IS the slug roughly.
              // Ideally data.ts should be replaced by DB fetch on page load too,
              // but limiting scope to Plans as requested.
              
              // find the slug from the data.ts (assuming data.ts id == slug? usually not but let's try)
              // Actually data.ts has IDs like "power-bi", "python".
              
              const res = await fetch(`/api/courses/${selectedCourse}/plans`);
              if (res.ok) {
                  const data = await res.json();
                  if (data.plans && data.plans.length > 0) {
                      // Map DB plans to UI plans structure
                      const mappedPlans = data.plans.map((p: any) => {
                          const defPlan = defaultPlans.find(dp => dp.id === p.planType);
                          return {
                              id: String(p.id), // Use DB ID as string
                              title: p.title || defPlan?.title || "Course Plan",
                              price: p.price,
                              features: defPlan?.features || ["Full Course Access", "Certificate of Completion", "Project Support", "24/7 Doubt Support"],
                              courseId: p.courseId
                          };
                      });
                      // Sort by price
                       mappedPlans.sort((a: Plan, b: Plan) => a.price - b.price);
                      setAvailablePlans(mappedPlans);
                  } else {
                      setAvailablePlans([]);
                  }
              } else {
                  // Fallback or empty if error (maybe course doesn't exist in DB yet?)
                  setAvailablePlans([]);
              }
          } catch (error) {
              console.error("Error fetching plans", error);
          } finally {
              setLoadingPlans(false);
          }
      };

      fetchPlans();
      setSelectedPlan(""); // Reset selection on course change
  }, [selectedCourse]);

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
            <CourseSelector selectedCourse={selectedCourse} onSelect={setSelectedCourse} />
            <PlanSelector 
                selectedPlan={selectedPlan} 
                onSelect={setSelectedPlan} 
                plans={availablePlans}
                loading={loadingPlans}
            />
          </div>

          {/* Registration Form */}
          <div className="lg:sticky lg:top-24">
            <RegistrationForm 
                selectedCourse={selectedCourse} 
                selectedPlan={selectedPlan} 
                plans={availablePlans} 
                loadingPlans={loadingPlans}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CoursesContent />
        </Suspense>
    );
}
