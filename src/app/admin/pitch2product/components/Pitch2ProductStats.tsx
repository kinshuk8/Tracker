"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, GraduationCap, Briefcase, Paperclip } from "lucide-react";
import type { Pitch2ProductSubmission } from "../types";

interface Pitch2ProductStatsProps {
  submissions: Pitch2ProductSubmission[];
}

export function Pitch2ProductStats({ submissions }: Pitch2ProductStatsProps) {
  const totalSubmissions = submissions.length;
  const studentSubmissions = submissions.filter(
    (s) => s.applicantType === "STUDENT"
  ).length;
  const founderSubmissions = submissions.filter(
    (s) => s.applicantType === "FOUNDER" || s.applicantType === "COFOUNDER" || s.applicantType === "BUSINESS_OWNER"
  ).length;
  const submissionsWithFiles = submissions.filter(
    (s) => (s.files && s.files.length > 0) || s.figmaUrl || s.prototypeUrl || s.githubUrl
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Submissions */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Submissions
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Lightbulb className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {totalSubmissions}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Registered ideas & pitches
          </p>
        </CardContent>
      </Card>

      {/* Student Submissions */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Student Projects
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <GraduationCap className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {studentSubmissions}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            College & university applicants
          </p>
        </CardContent>
      </Card>

      {/* Founder / Business Submissions */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Founders & Businesses
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Briefcase className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {founderSubmissions}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Startups & business owners
          </p>
        </CardContent>
      </Card>

      {/* Submissions with Attachments / Links */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            With Pitch Decks / Files
          </CardTitle>
          <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Paperclip className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {submissionsWithFiles}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Uploaded pitch decks or prototypes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
