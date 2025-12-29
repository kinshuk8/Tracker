import { db } from "@/db";
import { payments, users, courses, enrollments, coursePlans } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PaymentStats } from "./components/PaymentStats";

export default async function AdminPaymentsPage() {
  // 1. Fetch raw payments data
  const rawPayments = await db
    .select({
      id: payments.id,
      paymentId: payments.paymentId,
      amount: payments.amount,
      status: payments.status,
      date: payments.createdAt,
      userId: payments.userId,
      courseId: payments.courseId,
      user_name: users.name,
      user_email: users.email,
      course_title: courses.title,
    })
    .from(payments)
    .leftJoin(users, eq(payments.userId, users.id))
    .leftJoin(courses, eq(payments.courseId, courses.id))
    .orderBy(desc(payments.createdAt));

  // 2. Calculate Stats
  const totalPayments = rawPayments.length;
  const completedPayments = rawPayments.filter(p => p.status === "captured").length;
  const pendingPayments = rawPayments.filter(p => p.status === "created" || p.status === "authorized").length; // "created" is common for Razorpay initial state
  const failedPayments = rawPayments.filter(p => p.status === "failed").length;
  
  const totalRevenue = rawPayments
    .filter(p => p.status === "captured")
    .reduce((sum, p) => sum + (p.amount / 100), 0);
  
  const successRate = totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0;

  // 3. Fetch Enrollments to map Plans
  // Ideally we would do a smart join, but since payments doesn't have planId, we do best-effort matching.
  // We fetch all INNER enrollments that match the users and courses present in payments.
  // Actually, let's just fetch all enrollments with plan info for simplicity unless scale is huge.
  // For better performance, we'd extract userIds/courseIds arrays, but let's keep it simple first.
  const allEnrollments = await db
    .select({
      userId: enrollments.userId,
      courseId: enrollments.courseId,
      planTitle: coursePlans.title,
      planDuration: coursePlans.durationMonths,
      createdAt: enrollments.createdAt,
    })
    .from(enrollments)
    .leftJoin(coursePlans, eq(enrollments.planId, coursePlans.id));

  // Create a lookup map: (userId_courseId) -> Plan Details
  // We prioritize the most recent enrollment if duplicates exist
  const enrollmentMap = new Map<string, string>();
  
  // Sort enrollments by date asc, so latest overwrites earlier
  allEnrollments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  allEnrollments.forEach(enr => {
    if (enr.userId && enr.courseId && enr.planTitle) {
      const key = `${enr.userId}_${enr.courseId}`;
      enrollmentMap.set(key, enr.planTitle);
    }
  });

  const enrichedPayments = rawPayments.map(p => {
    const key = `${p.userId}_${p.courseId}`;
    const planName = enrollmentMap.get(key) || "Unknown Plan";
    return { ...p, planName };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            Payments
          </h1>
          <p className="text-slate-500 mt-1">Track transaction history and revenue.</p>
        </div>
      </div>

      {/* Stats Section */}
      <PaymentStats 
        totalPayments={totalPayments}
        completedPayments={completedPayments}
        pendingPayments={pendingPayments}
        failedPayments={failedPayments}
        totalRevenue={totalRevenue}
        successRate={successRate}
      />

      <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="pl-6 font-semibold">Payment ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Course & Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedPayments.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <TableCell className="pl-6 font-mono text-xs text-slate-500">{item.paymentId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{item.user_name}</span>
                        <span className="text-xs text-slate-500">{item.user_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <Badge variant="outline" className="w-fit font-normal text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/10 border-slate-200">
                        {item.course_title}
                      </Badge>
                      <span className="text-xs text-slate-500 ml-1">{item.planName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-white">₹{(item.amount / 100).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={`${item.status === "captured" ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : "bg-red-100 text-red-700 border-red-200"}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right text-slate-500 text-xs font-mono">{format(item.date, "dd MMM yyyy, HH:mm")}</TableCell>
                </TableRow>
              ))}
              {enrichedPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-slate-500">
                    <p className="text-lg font-medium">No payments recorded</p>
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
