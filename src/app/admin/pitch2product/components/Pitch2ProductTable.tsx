"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Trash2,
  Loader2,
  Eye,
  Download,
  Copy,
  Check,
  FileText,
  Mail,
  Phone,
  GraduationCap,
  Building,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Pitch2ProductSubmission } from "../types";
import { Pitch2ProductDetailModal } from "./Pitch2ProductDetailModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Pitch2ProductTableProps {
  initialSubmissions: Pitch2ProductSubmission[];
}

export function Pitch2ProductTable({
  initialSubmissions,
}: Pitch2ProductTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [applicantFilter, setApplicantFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [filesFilter, setFilesFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Pitch2ProductSubmission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const filteredSubmissions = initialSubmissions.filter((sub) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      sub.projectName.toLowerCase().includes(q) ||
      sub.fullName.toLowerCase().includes(q) ||
      sub.email.toLowerCase().includes(q) ||
      sub.referenceNumber.toLowerCase().includes(q) ||
      sub.city.toLowerCase().includes(q) ||
      (sub.collegeName && sub.collegeName.toLowerCase().includes(q)) ||
      (sub.companyName && sub.companyName.toLowerCase().includes(q));

    const matchesApplicant =
      applicantFilter === "all" || sub.applicantType === applicantFilter;

    const matchesStage =
      stageFilter === "all" || sub.currentStage === stageFilter;

    const matchesFiles =
      filesFilter === "all" ||
      (filesFilter === "with_files" && sub.files && sub.files.length > 0) ||
      (filesFilter === "no_files" && (!sub.files || sub.files.length === 0));

    return matchesSearch && matchesApplicant && matchesStage && matchesFiles;
  });

  const handleCopyRef = (ref: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    toast.success(`Copied ${ref}`);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Submissions refreshed");
    }, 600);
  };

  const handleDelete = async (id: string, ref: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !confirm(
        `Are you sure you want to delete submission ${ref}? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/pitch2product/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`Submission ${ref} deleted successfully`);
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete submission");
      }
    } catch {
      toast.error("Error deleting submission");
    } finally {
      setDeletingId(null);
    }
  };

  const exportCSV = () => {
    if (!filteredSubmissions.length) {
      toast.error("No submissions to export");
      return;
    }

    const headers = [
      "Reference Number",
      "Date",
      "Full Name",
      "Email",
      "Phone",
      "City",
      "Applicant Type",
      "College / Company",
      "Course / Year",
      "Project Name",
      "Idea Description",
      "Problem Statement",
      "Target Customer",
      "Current Stage",
      "Has Users",
      "User Count",
      "Has Revenue",
      "Revenue Range",
      "Has Investment",
      "Investment Range",
      "Tech Team",
      "Requirements",
      "Timeline",
      "Budget",
      "Collaboration",
      "Files Count",
    ];

    const rows = filteredSubmissions.map((s) => [
      `"${s.referenceNumber}"`,
      `"${s.createdAt ? format(new Date(s.createdAt), "yyyy-MM-dd HH:mm") : ""}"`,
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      `"${s.city}"`,
      `"${s.applicantType}"`,
      `"${(s.collegeName || s.companyName || "").replace(/"/g, '""')}"`,
      `"${(s.course ? `${s.course} (${s.yearOfStudy})` : "").replace(/"/g, '""')}"`,
      `"${s.projectName.replace(/"/g, '""')}"`,
      `"${s.ideaDescription.replace(/"/g, '""')}"`,
      `"${(s.problemStatement || "").replace(/"/g, '""')}"`,
      `"${(s.targetCustomer || "").replace(/"/g, '""')}"`,
      `"${s.currentStage}"`,
      `"${s.hasUsers || ""}"`,
      `"${s.userCount || ""}"`,
      `"${s.hasRevenue || ""}"`,
      `"${s.revenueRange || ""}"`,
      `"${s.hasInvestment || ""}"`,
      `"${s.investmentRange || ""}"`,
      `"${s.technicalTeam || ""}"`,
      `"${(s.requirements || []).join("; ").replace(/"/g, '""')}"`,
      `"${s.timeline || ""}"`,
      `"${s.budget || ""}"`,
      `"${s.preferredCollaboration || ""}"`,
      `"${s.files?.length || 0}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `pitch2product_submissions_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported CSV successfully");
  };

  const formatTypeBadge = (type: string) => {
    switch (type) {
      case "STUDENT":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 text-[11px] gap-1"
          >
            <GraduationCap className="h-3 w-3" /> Student
          </Badge>
        );
      case "FOUNDER":
      case "COFOUNDER":
        return (
          <Badge
            variant="outline"
            className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 text-[11px] gap-1"
          >
            <Building className="h-3 w-3" /> Founder
          </Badge>
        );
      case "BUSINESS_OWNER":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-[11px]"
          >
            Business
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px]">
            {type.toLowerCase()}
          </Badge>
        );
    }
  };

  const formatStageBadge = (stage: string) => {
    switch (stage) {
      case "IDEA":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 text-[11px]"
          >
            Idea
          </Badge>
        );
      case "PROTOTYPE":
        return (
          <Badge
            variant="secondary"
            className="bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 text-[11px]"
          >
            Prototype
          </Badge>
        );
      case "EXISTING_PRODUCT":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 text-[11px]"
          >
            Live Product
          </Badge>
        );
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  return (
    <>
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Registrations & Pitches
              </CardTitle>
              <Badge variant="secondary" className="font-mono text-xs">
                {filteredSubmissions.length}{" "}
                {filteredSubmissions.length === 1 ? "entry" : "entries"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search ref, name, project..."
                  className="pl-9 bg-white dark:bg-slate-900 h-9 text-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Applicant Type Filter */}
              <Select
                value={applicantFilter}
                onValueChange={setApplicantFilter}
              >
                <SelectTrigger className="w-[130px] bg-white dark:bg-slate-900 h-9 text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <Filter className="h-3 w-3 text-slate-500 shrink-0" />
                    <SelectValue placeholder="Applicant" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applicants</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="FOUNDER">Founder</SelectItem>
                  <SelectItem value="COFOUNDER">Co-Founder</SelectItem>
                  <SelectItem value="BUSINESS_OWNER">Business Owner</SelectItem>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* Stage Filter */}
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[120px] bg-white dark:bg-slate-900 h-9 text-xs">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="IDEA">Idea</SelectItem>
                  <SelectItem value="PROTOTYPE">Prototype</SelectItem>
                  <SelectItem value="EXISTING_PRODUCT">Live Product</SelectItem>
                </SelectContent>
              </Select>

              {/* Files Filter */}
              <Select value={filesFilter} onValueChange={setFilesFilter}>
                <SelectTrigger className="w-[110px] bg-white dark:bg-slate-900 h-9 text-xs">
                  <SelectValue placeholder="Files" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Files</SelectItem>
                  <SelectItem value="with_files">With Files</SelectItem>
                  <SelectItem value="no_files">No Files</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh */}
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5 text-xs gap-1.5"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              {/* Export CSV */}
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs gap-1.5 bg-white dark:bg-slate-900"
                onClick={exportCSV}
              >
                <Download className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="w-[40px] pl-6 text-center text-xs font-bold text-slate-500">
                    #
                  </TableHead>
                  <TableHead className="font-semibold text-xs">
                    Ref ID
                  </TableHead>
                  <TableHead className="font-semibold text-xs">
                    Applicant
                  </TableHead>
                  <TableHead className="font-semibold text-xs">
                    Project & Idea
                  </TableHead>
                  <TableHead className="text-xs">Stage</TableHead>
                  <TableHead className="text-xs">Files</TableHead>
                  <TableHead className="text-xs text-right">
                    Submitted
                  </TableHead>
                  <TableHead className="pr-6 text-right text-xs">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((sub, index) => (
                  <TableRow
                    key={sub.id}
                    className="hover:bg-indigo-50/30 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedSubmission(sub)}
                  >
                    <TableCell className="pl-6 text-center text-slate-400 font-medium text-xs">
                      {index + 1}
                    </TableCell>

                    {/* Ref ID */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-xs text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          {sub.referenceNumber}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) =>
                                  handleCopyRef(sub.referenceNumber, e)
                                }
                              >
                                {copiedRef === sub.referenceNumber ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy reference</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>

                    {/* Applicant */}
                    <TableCell>
                      <div className="flex flex-col gap-1 max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                            {sub.fullName}
                          </span>
                          {formatTypeBadge(sub.applicantType)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="truncate" title={sub.email}>
                            {sub.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{sub.phone}</span>
                          <span>•</span>
                          <span>{sub.city}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Project & Idea */}
                    <TableCell>
                      <div className="flex flex-col gap-1 max-w-[280px]">
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {sub.projectName}
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {sub.ideaDescription}
                        </p>
                        {sub.industries && sub.industries.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {sub.industries.slice(0, 2).map((ind) => (
                              <span
                                key={ind}
                                className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded"
                              >
                                {ind.replace(/_/g, " ")}
                              </span>
                            ))}
                            {sub.industries.length > 2 && (
                              <span className="text-[10px] text-slate-400">
                                +{sub.industries.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Stage */}
                    <TableCell>{formatStageBadge(sub.currentStage)}</TableCell>

                    {/* Files */}
                    <TableCell>
                      {sub.files && sub.files.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          <FileText className="h-3.5 w-3.5" />
                          <span>
                            {sub.files.length}{" "}
                            {sub.files.length === 1 ? "file" : "files"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">—</span>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {sub.createdAt
                            ? format(new Date(sub.createdAt), "dd MMM yyyy")
                            : "N/A"}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {sub.createdAt
                            ? format(new Date(sub.createdAt), "hh:mm a")
                            : ""}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-6 text-right">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                                onClick={() => setSelectedSubmission(sub)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View full registration</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={`mailto:${sub.email}?subject=Regarding your Pitch2Product Submission: ${encodeURIComponent(sub.projectName)} [${sub.referenceNumber}]`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Email applicant</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) =>
                                  handleDelete(sub.id, sub.referenceNumber, e)
                                }
                                disabled={deletingId === sub.id}
                              >
                                {deletingId === sub.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete submission</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-16 text-slate-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="h-8 w-8 text-slate-300" />
                        <p className="text-base font-medium">
                          No Pitch2Product registrations found
                        </p>
                        <p className="text-xs text-slate-400">
                          {search ||
                          applicantFilter !== "all" ||
                          stageFilter !== "all" ||
                          filesFilter !== "all"
                            ? "Try adjusting your search or filters."
                            : "Submissions will appear here once applicants submit ideas."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Pitch2ProductDetailModal
        submission={selectedSubmission}
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </>
  );
}
