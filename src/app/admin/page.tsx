import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Activity } from "lucide-react";
import { db } from "@/db";
import { users, courses, enrollments } from "@/db/schema";
import { count } from "drizzle-orm";
import { AdminCharts } from "./components/AdminCharts";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [usersCount] = await db.select({ value: count() }).from(users);
  const [coursesCount] = await db.select({ value: count() }).from(courses);
  const [enrollmentsCount] = await db.select({ value: count() }).from(enrollments);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome to the administration portal.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount.value}</div>
            <p className="text-xs text-muted-foreground">Registered platform users</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesCount.value}</div>
            <p className="text-xs text-muted-foreground">Available on platform</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Enrollments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollmentsCount.value}</div>
            <p className="text-xs text-muted-foreground">Total students enrolled</p>
          </CardContent>
        </Card>
      </div>

      <AdminCharts />
    </div>
  );
}

