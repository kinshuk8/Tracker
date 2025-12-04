"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit, Users, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock data
const mockCourses = [
  { id: 1, title: "Power BI", students: 120, modules: 8 },
  { id: 2, title: "Python", students: 250, modules: 12 },
  { id: 3, title: "Java", students: 180, modules: 10 },
];

export default function AdminCoursesPage() {
  const courses = mockCourses;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Course Administration</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Course
          </Button>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Student Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      {course.title}
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-slate-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{course.students} Students</div>
                    <p className="text-xs text-slate-500">
                      {course.modules} Modules
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Select a course to view detailed student analytics.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
