"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CourseSelector } from "./components/CourseSelector";
import { PlanSelector } from "./components/PlanSelector";
import { RegistrationForm } from "./components/RegistrationForm";
import { Plan } from "./page";
// Assuming we keep defaultPlans for fallback structure/features if needed
import { plans as defaultPlans } from "./data"; 

export interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
}

interface CoursesContentProps {
  initialCourses: Course[];
}

export default function CoursesContent({ initialCourses }: CoursesContentProps) {
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  
  const searchParams = useSearchParams();

  // Initialize from URL
  useEffect(() => {
    const course = searchParams.get("course");
    if (course) {
        setSelectedCourseSlug(course);
    }
  }, [searchParams]);

  // Find the selected course object to get its numeric ID
  const selectedCourseObj = initialCourses.find(c => c.slug === selectedCourseSlug);

  // Fetch plans when course changes
  useEffect(() => {
      if (!selectedCourseSlug) {
          setAvailablePlans([]);
          setSelectedPlan("");
          return;
      }

      const fetchPlans = async () => {
          setLoadingPlans(true);
          try {
              const res = await fetch(`/api/courses/${selectedCourseSlug}/plans`);
              if (res.ok) {
                  const data = await res.json();
                  if (data.plans && data.plans.length > 0) {
                      // Map DB plans to UI plans structure
                      const mappedPlans = data.plans.map((p: any) => {
                          // Try to match with default plans to get features if they follow standard naming
                          // Or use DB title as is. Ideally features should come from DB or be standard.
                          const defPlan = defaultPlans.find(dp => dp.id === p.planType || dp.title.toLowerCase().includes(p.title.toLowerCase()));
                          
                          return {
                              id: String(p.id), // Use DB ID as string for selection key
                              title: p.title || "Course Plan",
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
                  setAvailablePlans([]);
              }
          } catch (error) {
              console.error("Error fetching plans", error);
              setAvailablePlans([]);
          } finally {
              setLoadingPlans(false);
          }
      };

      fetchPlans();
      setSelectedPlan(""); // Reset selection on course change
  }, [selectedCourseSlug]);

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
            <CourseSelector 
                courses={initialCourses}
                selectedCourseSlug={selectedCourseSlug} 
                onSelect={setSelectedCourseSlug} 
            />
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
                selectedCourseSlug={selectedCourseSlug}
                selectedCourseId={selectedCourseObj?.id}
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
