"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditCard, CheckCircle2, XCircle, AlertCircle, TrendingUp } from "lucide-react";

interface PaymentStatsProps {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalRevenue: number;
  successRate: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PaymentStats({
  totalPayments,
  completedPayments,
  pendingPayments,
  failedPayments,
  totalRevenue,
  successRate,
}: PaymentStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-muted-foreground">Gross income from all sales</p>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
          <Progress value={successRate} className="h-2 mt-2 bg-slate-100 dark:bg-slate-800" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedPayments} / {totalPayments} transactions successful
          </p>
        </CardContent>
      </Card>

      {/* Valid Payments (Captured) */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Successful</CardTitle>
          <CreditCard className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedPayments}</div>
          <p className="text-xs text-muted-foreground">Payments captured</p>
        </CardContent>
      </Card>

      {/* Failed/Pending */}
      <Card className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Issues</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-baseline">
            <div className="text-2xl font-bold">{failedPayments}</div>
            <div className="text-sm font-medium text-amber-500">
               {pendingPayments} Pending
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Failed or incomplete attempts</p>
        </CardContent>
      </Card>
    </div>
  );
}
