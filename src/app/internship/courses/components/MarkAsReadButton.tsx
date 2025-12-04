"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { markAsCompleted } from "../actions";
import { toast } from "sonner";

interface MarkAsReadButtonProps {
  courseId: number;
  contentId: number;
  initialIsCompleted: boolean;
}

export default function MarkAsReadButton({
  courseId,
  contentId,
  initialIsCompleted,
}: MarkAsReadButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsRead = async () => {
    if (isCompleted) return;

    setIsLoading(true);
    try {
      await markAsCompleted(courseId, contentId);
      setIsCompleted(true);
      toast.success("Marked as read!");
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message === "Unauthorized") {
        toast.error("Please sign in to save progress");
        // Optional: Redirect to sign-in
        // window.location.href = "/sign-in";
      } else {
        toast.error("Failed to mark as read");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isCompleted ? "secondary" : "default"}
      size="sm"
      onClick={handleMarkAsRead}
      disabled={isLoading || isCompleted}
      className={isCompleted ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-blue-600 hover:bg-blue-700 text-white"}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <CheckCircle className="w-4 h-4 mr-2" />
      )}
      {isCompleted ? "Completed" : "Mark as Read"}
    </Button>
  );
}
