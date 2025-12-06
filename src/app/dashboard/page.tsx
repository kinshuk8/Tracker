"use client";

import { authClient } from "@/lib/auth-client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Loader2, BookOpen, Clock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

// Define interface for course data
interface EnrolledCourse {
  id: number;
  title: string;
  description: string;
  slug: string;
  imageUrl: string | null;
  enrollment: {
    plan: "1_month" | "3_months" | "6_months";
    endDate: string;
    isActive: boolean;
  };
}

export default function DashboardPage() {
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/dashboard/courses");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      if(session.user.role === 'user') {
         // Redirect or show access denied if somehow a user gets here
         // For now just stop loading
         setIsLoading(false);
      } else {
         fetchCourses();
      }
    } else if (!isAuthPending) {
        setIsLoading(false);
    }
  }, [session, isAuthPending]);

  if (isAuthPending || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
        <Button asChild>
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (session.user.role === 'user') {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <h1 className="text-2xl font-bold mb-2 text-destructive">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this dashboard.</p>
          </div>
      )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Learning Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name}. Here are your enrolled courses.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-6">
            You haven't been assigned to any courses yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow border-none ring-1 ring-border/50 bg-card/50 backdrop-blur-sm">
              <div className="relative aspect-video w-full overflow-hidden">
                {course.imageUrl ? (
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <Badge 
                    variant={course.enrollment.isActive ? "default" : "secondary"}
                    className="absolute top-2 right-2"
                >
                    {course.enrollment.isActive ? "Active" : "Expired"}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Plan: {course.enrollment.plan.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Ends: {new Date(course.enrollment.endDate).toLocaleDateString()}</span>
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild disabled={!course.enrollment.isActive}>
                  <Link href={`/internship/courses/${course.slug}`}>
                    Continue Learning
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
