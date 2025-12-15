"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CourseSelector } from "./components/CourseSelector";
import { PlanSelector } from "./components/PlanSelector";
import { RegistrationForm } from "./components/RegistrationForm";

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");

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
            <PlanSelector selectedPlan={selectedPlan} onSelect={setSelectedPlan} />
          </div>

          {/* Registration Form */}
          <div className="lg:sticky lg:top-24">
            <RegistrationForm selectedCourse={selectedCourse} selectedPlan={selectedPlan} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
