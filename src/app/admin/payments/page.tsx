import { db } from "@/db";
import { payments, users, courses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function AdminPaymentsPage() {
  const data = await db
    .select({
      id: payments.id,
      paymentId: payments.paymentId,
      amount: payments.amount,
      status: payments.status,
      date: payments.createdAt,
      user_name: users.name,
      user_email: users.email,
      course_title: courses.title,
    })
    .from(payments)
    .leftJoin(users, eq(payments.userId, users.id))
    .leftJoin(courses, eq(payments.courseId, courses.id))
    .orderBy(desc(payments.createdAt));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            Payments
          </h1>
          <p className="text-slate-500 mt-1">Track all successful transactions.</p>
        </div>
      </div>

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
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <TableCell className="pl-6 font-mono text-xs text-slate-500">{item.paymentId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{item.user_name}</span>
                        <span className="text-xs text-slate-500">{item.user_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/10">
                      {item.course_title}
                    </Badge>
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
              {data.length === 0 && (
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
