"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Course } from "../CoursesContent";

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseSlug: string;
  onSelect: (slug: string) => void;
}

export function CourseSelector({ courses, selectedCourseSlug, onSelect }: CourseSelectorProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">1. Select a Course</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {courses.map((course) => {
          // Assuming all active courses from DB are available. 
          // If you have an "isActive" flag or similar, check it here.
          const isAvailable = true;

          return (
            <motion.div
              key={course.id}
              whileHover={isAvailable ? { scale: 1.02 } : {}}
              whileTap={isAvailable ? { scale: 0.98 } : {}}
              className="relative"
            >
              <Card
                className={`h-full transition-colors relative overflow-hidden ${isAvailable
                    ? "cursor-pointer hover:border-blue-400"
                    : "cursor-not-allowed opacity-80"
                  } ${selectedCourseSlug === course.slug
                    ? "ring-2 ring-blue-600 border-blue-600 bg-blue-50/50"
                    : ""
                  }`}
                onClick={() => isAvailable && onSelect(course.slug)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-slate-500">{course.description}</p>
                </CardContent>

                {!isAvailable && (
                  <div className="absolute inset-0 bg-slate-100/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Coming Soon
                    </span>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
