"use client";

import { useRef, useId } from "react";
import { Loader2, Upload } from "lucide-react";
import { useUploadThing } from "@/utils/uploadthing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; 


interface AvatarUploadProps {
  value?: string;
  onChange: (value: string) => void;
  name?: string;
  className?: string;
}

export function AvatarUpload({ value, onChange, name, className }: AvatarUploadProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      toast.success("Image uploaded successfully!");
      if (res && res[0]) {
        onChange(res[0].url);
      }
    },
    onUploadError: (error: Error) => {
      console.error(error);
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("HandleFileSelect triggered");
    const file = e.target.files?.[0];
    if (!file) {
        console.log("No file selected");
        return;
    }

    console.log("File selected:", file.name, file.type, file.size);

    if (!file.type.startsWith("image/")) {
      toast.error("Please ensure the file is an image.");
      e.target.value = "";
      return;
    }

    // Max 4MB (matching core.ts config)
    if (file.size > 4 * 1024 * 1024) {
      const errorMsg = "File size must be less than 4MB.";
      console.error(errorMsg + " Actual size: " + file.size);
      toast.error(errorMsg);
      e.target.value = "";
      return;
    }

    // Reset input immediately via event target to be safe
    e.target.value = "";

    try {
        console.log("Starting upload...");
        await startUpload([file]);
        console.log("Upload started");
    } catch (err) {
        console.error("Upload error in handler:", err);
    }
  };

  const triggerUpload = () => {
    console.log("Triggering upload click");
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div 
        className="relative group cursor-pointer" 
        onClick={triggerUpload}
      >
        <Avatar className="h-40 w-40 border-4 border-background shadow-xl transition-opacity group-hover:opacity-80">
            {value ? (
                <AvatarImage src={value} alt="Avatar" className="object-cover" />
            ) : (
                <AvatarFallback className="text-4xl bg-primary/10 text-primary uppercase">
                    {name?.charAt(0) || <Upload className="w-8 h-8 text-slate-400" />}
                </AvatarFallback>
            )}
        </Avatar>
        
        {/* Overlay for uploading */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="w-8 h-8 text-white" />
        </div>

        {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 z-10 cursor-not-allowed">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        )}
      </div>

      <input 
        id={inputId}
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
