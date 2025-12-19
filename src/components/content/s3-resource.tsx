"use client";

import { useEffect, useState } from "react";
import { Loader2, FileText, Download, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { markAsCompleted } from "@/app/internship/courses/actions";
import { toast } from "sonner";

interface S3ResourceProps {
  src: string;
  title?: string;
  courseId: number;
  contentId: number;
}

export function S3Resource({ src, title, courseId, contentId }: S3ResourceProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
        setLoading(false);
        return;
    }

    // If it's already a regular URL, just use it
    if (src.startsWith("http")) {
        setUrl(src);
        setLoading(false);
        return;
    }

    let key = src;
    if (src.startsWith("s3://")) {
        key = src.replace("s3://", "");
    }

    // Fetch presigned URL
    setLoading(true);
    fetch(`/api/s3/presign?key=${encodeURIComponent(key)}`)
      .then((res) => {
          if (!res.ok) throw new Error("Failed to sign");
          return res.json();
      })
      .then((data) => {
        if (data.url) setUrl(data.url);
        else setError(true);
      })
      .catch((err) => {
          console.error(err);
          setError(true);
      })
      .finally(() => setLoading(false));
  }, [src]);

  const getExtension = (path: string) => path.split('.').pop()?.toLowerCase() || "";
  const isVideo = ["mp4", "mov", "webm", "mkv", "avi"].includes(getExtension(src));

  const handleVideoEnded = async () => {
    try {
        await markAsCompleted(courseId, contentId);
        toast.success("Video completed! Lesson marked as read.");
    } catch (err) {
        console.error("Failed to mark video as read", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-slate-50 border rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-slate-500">Loading resource...</span>
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-100 rounded-lg text-red-600">
         <p>Failed to load resource.</p>
      </div>
    );
  }

  // VIDEO PLAYER
  if (isVideo) {
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative group">
            <video 
                src={url} 
                controls 
                className="w-full h-full" 
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                onEnded={handleVideoEnded}
            >
                Your browser does not support the video tag.
            </video>
        </div>
      );
  }

  // FILE DOWNLOAD
  return (
    <Card className="bg-slate-50 border-slate-200">
        <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                    <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-900">{title || "Attached Resource"}</h3>
                    <p className="text-sm text-slate-500 uppercase">{getExtension(src)} File</p>
                </div>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href={url} download target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" /> Download
                </a>
            </Button>
        </CardContent>
    </Card>
  );
}
