"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit, Library, Users, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CourseSummary {
  id: number;
  title: string;
  modulesCount: number;
  studentsCount: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
      try {
          const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete");
          setCourses(courses.filter(c => c.id !== id));
          toast.success("Course deleted successfully");
      } catch (error) {
          toast.error("Failed to delete course");
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-slate-800 dark:text-slate-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Course Administration
          </h1>
          <p className="text-slate-500 mt-1">
            Manage courses, modules, and student performance.
          </p>
        </div>

        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all hover:scale-105">
          <Link href="/admin/courses/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Course
          </Link>
        </Button>
      </div>

      {/* TABS */}
      <Tabs defaultValue="courses" className="w-full space-y-8">
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger
            value="courses"
            className="rounded-lg px-6 py-2 transition data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 font-medium shadow-sm"
          >
            Courses
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="rounded-lg px-6 py-2 transition data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 font-medium shadow-sm"
          >
            Student Performance
          </TabsTrigger>
        </TabsList>

        {/* COURSES TAB */}
        <TabsContent
          value="courses"
          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))
              : courses.length === 0 ? (
                  <Alert className="col-span-full">
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Courses Found</AlertTitle>
                    <AlertDescription>
                      You haven't created any courses yet. Click "Add New Course" to get started.
                    </AlertDescription>
                  </Alert>
              ) : courses.map((course) => (
                  <Card
                    key={course.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.title}
                        </CardTitle>
                        <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                          Active
                        </span>
                      </div>
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                        <Library className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-0.5">
                            Students
                          </p>
                          <p className="text-2xl font-bold">
                            {course.studentsCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-0.5">
                            Modules
                          </p>
                          <p className="text-2xl font-bold">{course.modulesCount}</p>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="flex-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Link href={`/admin/courses/${course.id}/edit`}>
                             <Edit className="w-4 h-4 mr-2" /> Edit
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the course 
                                <strong> "{course.title}" </strong>
                                and remove all its modules and data from the database.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(course.id)} className="bg-red-600 hover:bg-red-700">
                                Delete Course
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </TabsContent>

        {/* STUDENTS TAB */}
        <TabsContent value="students" className="mt-0">
          <Card className="rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent shadow-none p-12">
            <div className="text-center text-slate-500 flex flex-col items-center">
              <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <Users className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Student Analytics</h3>
              <p className="text-sm">
                Select a specific course above to view detailed performance
                metrics.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
