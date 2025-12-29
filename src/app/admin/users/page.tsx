import { db } from "@/db";
import { users, enrollments, coursePlans, courses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStats } from "./components/UserStats";
import { UsersTable } from "./components/UsersTable";

export default async function AdminUsersPage() {
  // 1. Fetch all users
  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  // 2. Fetch all enrollments with course and plan details
  const allEnrollments = await db
    .select({
      userId: enrollments.userId,
      courseTitle: courses.title,
      planTitle: coursePlans.title,
      startDate: enrollments.startDate,
      isActive: enrollments.isActive,
    })
    .from(enrollments)
    .leftJoin(courses, eq(enrollments.courseId, courses.id))
    .leftJoin(coursePlans, eq(enrollments.planId, coursePlans.id));

  // 3. Merge Data
  // Map userId -> Enrollment Details (Prioritize active, then latest)
  const enrollmentMap = new Map<string, any>();
  
  // Sort enrollments by date (oldest to newest) so latest overwrites
  // If we want active to take precedence, we can sort by isActive too
  allEnrollments.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  allEnrollments.forEach(enr => {
    if (enr.userId) {
       enrollmentMap.set(enr.userId, enr);
    }
  });

  const enrichedUsers = allUsers.map(user => {
    const enrollment = enrollmentMap.get(user.id);
    return {
      ...user,
      isEnrolled: !!enrollment,
      courseName: enrollment?.courseTitle,
      planName: enrollment?.planTitle,
      enrollmentDate: enrollment?.startDate,
    };
  });

  // 4. Calculate Stats
  const totalUsers = enrichedUsers.length;
  const enrolledUsers = enrichedUsers.filter(u => u.isEnrolled).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Users
          </h1>
          <p className="text-slate-500 mt-1">Manage registered users and track enrollments.</p>
        </div>
      </div>

      <UserStats totalUsers={totalUsers} enrolledUsers={enrolledUsers} />

      <UsersTable initialUsers={enrichedUsers} />
    </div>
  );
}
