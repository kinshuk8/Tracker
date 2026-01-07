"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EnrollActionProps {
  userId: string;
  userName: string;
  userEmail: string;
  courses: { id: number; title: string }[];
}

export function EnrollAction({ userId, userName, userEmail, courses }: EnrollActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const router = useRouter();

  const handleEnroll = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/enroll/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          courseId: selectedCourseId,
          isFree: true,
          // Phone and college are optional or not available here, 
          // but API might expect them if creating new user. 
          // For existing user (which this action is for), they are ignored/not needed if user exists.
          // We can pass dummy data or update API to handle missing fields for existing users better.
          // Let's rely on API handling existing users gracefully.
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to enroll user");
      }

      toast.success(`Successfully enrolled ${userName}`);
      setIsOpen(false);
      setSelectedCourseId("");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
          <BookOpen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enroll User</DialogTitle>
          <DialogDescription>
            Grant <strong>{userName}</strong> free access to a course.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="course">Select Course</Label>
            <Select onValueChange={setSelectedCourseId} value={selectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course..." />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancel
            </Button>
          <Button onClick={handleEnroll} disabled={isLoading || !selectedCourseId}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enroll
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
