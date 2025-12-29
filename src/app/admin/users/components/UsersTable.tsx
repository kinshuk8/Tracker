"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  createdAt: Date;
  isEnrolled: boolean;
  courseName?: string;
  planName?: string;
  enrollmentDate?: Date;
}

interface UsersTableProps {
  initialUsers: User[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = initialUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "enrolled" && user.isEnrolled) ||
      (statusFilter === "not_enrolled" && !user.isEnrolled);

    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            User Registry
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9 bg-white dark:bg-slate-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-slate-500" />
                  <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
                <SelectItem value="not_enrolled">Not Enrolled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="pl-6 font-semibold">Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Enrolled?</TableHead>
              <TableHead>Course & Plan</TableHead>
              <TableHead className="pr-6 text-right">Joined / Enrolled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {user.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {user.email}
                    </span>
                    {user.phoneNumber && (
                      <span className="text-xs text-slate-400">
                        {user.phoneNumber}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {user.isEnrolled ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-600 border-emerald-200 flex w-fit gap-1 items-center"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Yes
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-500 border-slate-200 flex w-fit gap-1 items-center opacity-50"
                    >
                      <XCircle className="w-3 h-3" /> No
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.isEnrolled ? (
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                        {user.courseName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {user.planName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">N/A</span>
                  )}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <div className="flex flex-col items-end">
                    {user.enrollmentDate ? (
                      <>
                        <span className="text-xs font-bold text-slate-600">
                          Enrolled:
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          {format(new Date(user.enrollmentDate), "dd MMM yyyy")}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-slate-400">Joined:</span>
                        <span className="text-xs font-mono text-slate-400">
                          {format(new Date(user.createdAt), "dd MMM yyyy")}
                        </span>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-16 text-slate-500"
                >
                  <p className="text-lg font-medium">No users found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
