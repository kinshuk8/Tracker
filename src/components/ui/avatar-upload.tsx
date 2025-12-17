"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { S3Image } from "@/components/ui/s3-image"; 
// Note: S3Image handles rendering s3:// urls, but here we might want immediate preview of the File object 
// or the public URL if we have it. S3Image is async for s3:// keys.

interface AvatarUploadProps {
  value?: string;
  onChange: (value: string) => void;
  name?: string;
  className?: string;
}

export function AvatarUpload({ value, onChange, name, className }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local preview state for immediate feedback before upload completes
  // or to show current value.
  // Actually, 'value' is controlled.

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please ensure the file is an image.");
      return;
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get presigned URL
      const res = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            fileName: file.name,
            contentType: file.type 
        }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      
      const { url, key } = await res.json();

      // 2. Upload file to S3
      const uploadRes = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload image");

      toast.success("Image uploaded successfully!");
      onChange(key); // Return the s3:// key
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <Avatar className="h-40 w-40 border-4 border-background shadow-xl transition-opacity group-hover:opacity-80">
            {value ? (
                // Use S3Image if value is s3:// or S3-like, otherwise regular AvatarImage
                // AvatarImage is standard img, so it won't resolve presigned urls.
                // We'll use a wrapper since S3Image renders an img or div. 
                // But Avatar component expects AvatarImage child...
                // Actually S3Image returns <img ... /> or <Image ... />.
                // We can't nest S3Image inside AvatarImage.
                // We should replace AvatarImage with S3Image but keep styling.
                <div className="w-full h-full overflow-hidden rounded-full">
                    <S3Image src={value} alt="Avatar" className="object-cover w-full h-full" />
                </div>
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

      <Button 
        type="button" 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        Change Picture
      </Button>

      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
