"use client";

import { useState, useEffect } from "react";
import { getAdminChartData, Period } from "../actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Bar, 
    BarChart, 
    Line, 
    LineChart, 
    ResponsiveContainer, 
    Tooltip, 
    XAxis, 
    YAxis, 
    PieChart, 
    Pie, 
    Cell,
    CartesianGrid,
    Legend
} from "recharts";
import { Loader2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);
}

export function AdminCharts() {
    const [period, setPeriod] = useState<Period>("monthly");
    const [data, setData] = useState<{
        revenue: any[];
        enrollments: any[];
        distribution: any[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getAdminChartData(period);
                setData(result);
            } catch (error) {
                console.error("Failed to fetch chart data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [period]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Analytics Overview</h2>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {(["daily", "weekly", "monthly", "all"] as Period[]).map((p) => (
                        <Button
                            key={p}
                            variant={period === p ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setPeriod(p)}
                            className="capitalize"
                        >
                            {p}
                        </Button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="h-[400px] flex items-center justify-center border rounded-xl bg-white dark:bg-slate-900">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* REVENUE CHART */}
                    <Card className="md:col-span-4 lg:col-span-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle>Revenue Received</CardTitle>
                            <CardDescription>
                                Total income from course sales over the selected period.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                             <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data?.revenue}>
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#888888" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tickFormatter={(value) => {
                                                const date = new Date(value);
                                                if (period === 'daily') return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                                                if (period === 'monthly' || period === 'all') return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
                                                return value;
                                            }}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `₹${value}`}
                                        />
                                        <Tooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="rounded-lg border bg-white p-2 shadow-sm dark:bg-black dark:border-slate-800">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                                                                    <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
                                                                    <span className="font-bold">{formatCurrency(payload[0].value as number)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar
                                            dataKey="amount"
                                            fill="#10b981" // Emerald
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                        </CardContent>
                    </Card>

                    {/* ENROLLMENT BY COURSE */}
                    <Card className="md:col-span-3 lg:col-span-3 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle>Enrollment Distribution</CardTitle>
                             <CardDescription>
                                Which courses are most popular?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data?.distribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="count"
                                        >
                                            {(data?.distribution || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                     {/* ENROLLMENT TREND */}
                     <Card className="md:col-span-4 lg:col-span-7 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <CardHeader>
                            <CardTitle>Enrollment Trends</CardTitle>
                            <CardDescription>
                                Number of new students joining over time.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                             <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data?.enrollments}>
                                          <XAxis 
                                            dataKey="date" 
                                            stroke="#888888" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tickFormatter={(value) => {
                                                const date = new Date(value);
                                                if (period === 'daily') return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                                                if (period === 'monthly' || period === 'all') return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
                                                return value;
                                            }}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <Tooltip 
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="rounded-lg border bg-white p-2 shadow-sm dark:bg-black dark:border-slate-800">
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                                                                    <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Enrollments</span>
                                                                    <span className="font-bold">{payload[0].value}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#6366f1" // Indigo
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
