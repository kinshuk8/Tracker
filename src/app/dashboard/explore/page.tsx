"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { DashboardSkeleton, CourseCardSkeleton } from "@/components/ui/skeletons";
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import Image from "next/image";

interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  imageUrl: string | null;
  enrollment: {
    plan: "1_month" | "3_months" | "6_months";
    endDate: string;
    isActive: boolean;
  } | null;
}

export default function ExplorePage() {
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        if (response.ok) {
            const data: Course[] = await response.json();
            setCourses(data);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user && !isAuthPending) {
        fetchCourses();
    } else if (!isAuthPending) {
        setIsLoading(false);
    }
  }, [session, isAuthPending]);

  if (isAuthPending || isLoading) {
    return (
      <div className="container mx-auto py-10 px-8">
        <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Courses</h1>
            <p className="text-muted-foreground mb-6">Continue where you left off.</p>
            <DashboardSkeleton />
        </div>
      </div>
    );
  }

  const enrolledCourses = courses.filter(c => c.enrollment && c.enrollment.isActive);
  const availableCourses = courses.filter(c => !c.enrollment || !c.enrollment.isActive);

  return (
    <div className="container mx-auto py-10 px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Courses</h1>
        <p className="text-muted-foreground mb-6">Continue where you left off.</p>
        
        {enrolledCourses.length === 0 ? (
           <Empty>
             <EmptyMedia>
               <BookOpen className="text-muted-foreground" />
             </EmptyMedia>
             <EmptyHeader>
               <EmptyTitle>No Enrolled Courses</EmptyTitle>
               <EmptyDescription>You are not enrolled in any active courses yet.</EmptyDescription>
             </EmptyHeader>
           </Empty>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all border-none ring-1 ring-border/50 bg-card/50">
                  <div className="relative aspect-video w-full overflow-hidden">
                    {course.imageUrl ? (
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2" variant="default">
                        Enrolled
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/internship/courses/${course.slug}`}>Go to Course</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Courses</h1>
        <p className="text-muted-foreground mb-6">Expand your skills with these courses.</p>
        
        {availableCourses.length === 0 ? (
            <Empty>
             <EmptyMedia>
               <BookOpen className="text-muted-foreground" />
             </EmptyMedia>
             <EmptyHeader>
               <EmptyTitle>No Available Courses</EmptyTitle>
               <EmptyDescription>No new courses available at the moment.</EmptyDescription>
             </EmptyHeader>
           </Empty>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all border-none ring-1 ring-border/50 bg-card/50">
                  <div className="relative aspect-video w-full overflow-hidden">
                    {course.imageUrl ? (
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href={`/dashboard/explore/${course.slug}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
        )}
      </div>
    </div>
  );
}
