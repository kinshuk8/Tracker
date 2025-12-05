"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  Edit,
  Library,
  Users,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mockCourses = [
  { id: 1, title: "Power BI", students: 120, modules: 8 },
  { id: 2, title: "Python", students: 250, modules: 12 },
  { id: 3, title: "Java", students: 180, modules: 10 },
];

export default function AdminCoursesPage() {
  const courses = mockCourses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-12 mt-16">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Course Administration
            </h1>
            <p className="text-slate-500 mt-1">
              Manage courses, modules, and student performance.
            </p>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Add New Course
          </Button>
        </div>

        {/* TABS */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="bg-white border shadow-sm rounded-xl p-1">
            <TabsTrigger
              value="courses"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6 py-2 transition"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-6 py-2 transition"
            >
              Student Performance
            </TabsTrigger>
          </TabsList>

          {/* COURSES TAB */}
          <TabsContent value="courses" className="mt-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all bg-white/70 backdrop-blur"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-xl font-semibold">
                      {course.title}
                    </CardTitle>
                    <Library className="w-5 h-5 text-blue-600" />
                  </CardHeader>

                  <CardContent>
                    <div className="text-3xl font-bold">
                      {course.students}
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                      Students • {course.modules} Modules
                    </p>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-slate-300 hover:bg-slate-100"
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* STUDENTS TAB */}
          <TabsContent value="students" className="mt-8">
            <Card className="rounded-2xl bg-white border shadow-md p-10">
              <div className="text-center text-slate-500 flex flex-col items-center">
                <Users className="w-14 h-14 mb-3 opacity-40" />
                <p className="text-lg font-medium">
                  Select a course to view detailed student analytics.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
