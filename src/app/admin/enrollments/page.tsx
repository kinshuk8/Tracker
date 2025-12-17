
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { Plus } from "lucide-react";

// We'll fetch this from an API, or use server action if configured.
// For now, let's create a client component that fetches.
// We need an API route for GET enrollments. I'll create that momentarily or inline it here if server component.
// Staying consistent with the "admin/courses" page which uses client-side fetch.

// But wait, there is no API generic for getting enrollments yet except querying DB.
// I should create an API route for fetching enrollments or make this a server component.
// Server component is cleaner for Admin.

// Let's try making it a Server Component if possible, but the courses page was client.
// I will stick to server component for better practice if I can, but I need to import db directly.
// Given the user context "in admin portal, create a route", standard Next.js 13+ is Server Components.

import { db } from "@/db";
import { enrollments, courses, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Make this a Server Component
export default async function AdminEnrollmentsPage() {
  const data = await db
    .select({
      id: enrollments.id,
      user_name: users.name,
      user_email: users.email,
      course_title: courses.title,
      plan: enrollments.plan,
      startDate: enrollments.startDate,
      isActive: enrollments.isActive,
    })
    .from(enrollments)
    .leftJoin(users, eq(enrollments.userId, users.id))
    .leftJoin(courses, eq(enrollments.courseId, courses.id))
    .orderBy(desc(enrollments.createdAt));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Enrollments
          </h1>
          <p className="text-slate-500 mt-1">View and manage student enrollments.</p>
        </div>
        <Link href="/admin/enroll/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Enroll New Student
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">All Enrollments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="pl-6">User</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="pr-6 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{item.user_name}</span>
                      <span className="text-xs text-slate-500">{item.user_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/10 hover:bg-slate-100">
                      {item.course_title}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize text-slate-600 dark:text-slate-400">{item.plan?.replace('_', ' ')}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 font-mono text-xs">{format(item.startDate, "PP")}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Badge className={`${item.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-slate-100 text-slate-600"}`}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                    <p className="text-lg font-medium">No enrollments yet</p>
                    <p className="text-sm">New enrollments will appear here.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
