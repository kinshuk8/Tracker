"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { courses } from "../data";

interface CourseSelectorProps {
  selectedCourse: string;
  onSelect: (courseId: string) => void;
}

export function CourseSelector({ selectedCourse, onSelect }: CourseSelectorProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">1. Select a Course</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer transition-colors h-full ${
                selectedCourse === course.id
                  ? "ring-2 ring-blue-600 border-blue-600 bg-blue-50/50"
                  : "hover:border-blue-400"
              }`}
              onClick={() => onSelect(course.id)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-slate-500">{course.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
