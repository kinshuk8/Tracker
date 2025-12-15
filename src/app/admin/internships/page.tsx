"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Download, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the type based on the schema
type Registration = {
  id: number;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  internshipDuration: string;
  courses: string[];
  areaOfInterest: string | null;
  createdAt: string;
};

import { TableSkeleton } from "@/components/skeletons/TableSkeleton";

export default function InternshipRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/admin/internships");
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error("Failed to fetch registrations", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (registrations.length === 0) return;

    // Define CSV headers
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "College",
      "Year",
      "Duration",
      "Courses",
      "Area of Interest",
      "Date",
    ];

    // Convert data to CSV format
    const csvContent = [
      headers.join(","),
      ...registrations.map((reg) =>
        [
          reg.id,
          `"${reg.name}"`, // Quote strings to handle commas
          reg.email,
          reg.phone,
          `"${reg.college}"`,
          reg.year,
          reg.internshipDuration,
          `"${reg.courses.join("; ")}"`, // Join courses with semicolon
          `"${reg.areaOfInterest || ""}"`,
          format(new Date(reg.createdAt), "yyyy-MM-dd HH:mm:ss"),
        ].join(",")
      ),
    ].join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `internship_registrations_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRegistrations = registrations.filter((reg) =>
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Internship Registrations
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and export internship applications.
          </p>
        </div>
        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
          <Download className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Applications ({filteredRegistrations.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search name, email, college..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton columns={6} rows={5} />
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No registrations found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Courses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="whitespace-nowrap text-slate-500">
                        {format(new Date(reg.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">{reg.name}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.college}</TableCell>
                      <TableCell className="capitalize">
                        {reg.internshipDuration.replace("_", " ")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {reg.courses.map((course, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
