"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck } from "lucide-react";

interface UserStatsProps {
  totalUsers: number;
  enrolledUsers: number;
}

export function UserStats({ totalUsers, enrolledUsers }: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Users */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">Registered on platform</p>
        </CardContent>
      </Card>

      {/* Enrolled Users */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Users</CardTitle>
          <UserCheck className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{enrolledUsers}</div>
          <p className="text-xs text-muted-foreground">Active students</p>
        </CardContent>
      </Card>
    </div>
  );
}
