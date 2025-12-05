import { db } from "@/db";
import { users, enrollments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "./actions";
import Link from "next/link";
import { BookOpen, Calendar, User } from "lucide-react";

export default async function ProfilePage() {
  const { auth } = await import("@/lib/auth");
  const { headers } = await import("next/headers");
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const user = session?.user;

  if (!user || !user.email) {
    redirect("/auth/sign-in");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, user.email),
  });

  if (!dbUser) {
    return <div>User not found in database. Please contact support.</div>;
  }

  const userEnrollments = await db.query.enrollments.findMany({
    where: eq(enrollments.userId, dbUser.id),
    with: {
      course: true,
    },
    orderBy: desc(enrollments.createdAt),
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-32">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Edit */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Edit Profile
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={dbUser.email} disabled className="bg-slate-100" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={dbUser.name} 
                      placeholder="Enter your full name" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      defaultValue={dbUser.phoneNumber || ""} 
                      placeholder="+1 (555) 000-0000" 
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Enrolled Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  My Courses
                </CardTitle>
                <CardDescription>Courses you are currently enrolled in</CardDescription>
              </CardHeader>
              <CardContent>
                {userEnrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500 mb-4">You haven&apos;t enrolled in any courses yet.</p>
                    <Button asChild variant="outline">
                      <Link href="/internship/courses">Browse Courses</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {userEnrollments.map((enrollment) => (
                      <div 
                        key={enrollment.id} 
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-200 transition-colors bg-white"
                      >
                        <div>
                          <h3 className="font-semibold text-slate-900">{enrollment.course.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Enrolled: {new Date(enrollment.startDate).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${enrollment.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {enrollment.isActive ? 'Active' : 'Expired'}
                            </span>
                          </div>
                        </div>
                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Link href={`/internship/courses/${enrollment.course.slug}`}>
                            Continue Learning
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
