"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { CourseDetailSkeleton } from "@/components/ui/skeletons";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, Lock, BookOpen, Clock, Calendar } from "lucide-react";
import { S3Image } from "@/components/ui/s3-image";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface Module {
  id: number;
  title: string;
  order: number;
}

interface CourseDetail {
  id: number;
  title: string;
  description: string;
  slug: string;
  imageUrl: string | null;
  modules: Module[];
  enrollment: {
    plan: "1_month" | "3_months" | "6_months";
    endDate: string;
    isActive: boolean;
  } | null;
}

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // We'll need a new endpoint for a single course with modules
        // For now, let's fetch all and find (not efficient but works given current endpoints)
        // OR better: create /api/courses/[slug]
        // Let's assume we create the endpoint or simulate it. 
        // For this step I'll fetch lists and filter, but I should create the endpoint.
        // Let's create the endpoint in a parallel tool call.
        const response = await fetch(`/api/courses/${slug}`);
        if (response.ok) {
            const data = await response.json();
            setCourse(data);
        } else {
            toast.error("Failed to load course details");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user && !isAuthPending) {
        fetchCourse();
    } else if (!isAuthPending) {
        setIsLoading(false);
    }
  }, [slug, session, isAuthPending]);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      // Simulate API call for enrollment
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      toast.success("Enrollment successful!");
      // In a real app, you'd refresh course data or update enrollment status
      // For now, just log
      console.log("Enrolled in course:", course?.title);
    } catch (error) {
      toast.error("Failed to enroll in course.");
      console.error("Enrollment error:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isAuthPending) {
    return <CourseDetailSkeleton />;
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Course Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Modules</CardTitle>
              <CardDescription>What you will learn in this course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.modules.length === 0 ? (
                 <p className="text-muted-foreground">No modules defined yet.</p>
              ) : (
                  course.modules.sort((a,b) => a.order - b.order).map((module) => (
                    <div key={module.id} className="flex items-center p-4 border rounded-lg bg-card/50">
                        <div className="mr-4 bg-primary/10 p-2 rounded-full">
                            <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">Includes quizzes and materials</p>
                        </div>
                        {course.enrollment?.isActive ? (
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                Available
                            </Badge>
                        ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Enrollment / Status */}
        <div className="lg:col-span-1">
            <Card className="sticky top-8">
                <div className="aspect-video relative w-full overflow-hidden rounded-t-lg">
                    {course.imageUrl ? (
                        <S3Image
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <CardHeader>
                    <CardTitle>Registration</CardTitle>
                    {course.enrollment?.isActive ? (
                        <Badge className="w-fit bg-green-600 hover:bg-green-700">Enrolled</Badge>
                    ) : (
                        <Badge variant="secondary" className="w-fit">Not Enrolled</Badge>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    {course.enrollment?.isActive ? (
                        <div className="space-y-2">
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Ends: {new Date(course.enrollment.endDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Plan: {course.enrollment.plan.replace('_', ' ')}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex items-center gap-2 text-green-600 font-medium my-4">
                                <CheckCircle className="h-5 w-5" />
                                <span>You have full access!</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Select a Plan</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: "1_month", title: "1 Month", price: 199, features: ["Course Access", "Certification"] },
                                        { id: "3_months", title: "3 Months", price: 429, features: ["Projects", "Assignments"] },
                                        { id: "6_months", title: "6 Months", price: 1499, features: ["Resume Building", "Priority Support"] },
                                    ].map((plan) => (
                                        <div key={plan.id} className="border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium">{plan.title}</span>
                                                <span className="font-bold text-lg">₹{plan.price}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {plan.features.join(" • ")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2 pt-2">
                                <p className="text-sm font-medium">All plans include:</p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-primary" /> Full course access</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-primary" /> Community support</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    {course.enrollment?.isActive ? (
                        <Button className="w-full" asChild>
                            <Link href={`/internship/courses/${course.slug}`}>Continue Learning</Link>
                        </Button>
                    ) : (
                         <Button className="w-full" size="lg" asChild>
                            <Link href={`/internship/courses?course=${course.slug}`}>
                                Enroll Now
                            </Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
