"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface S3ImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

export function S3Image({ src, alt, className, ...props }: S3ImageProps) {
  const [url, setUrl] = useState<string>("");
  const [isS3, setIsS3] = useState(false);

  useEffect(() => {
    if (!src) return;

    if (src.startsWith("http") || src.startsWith("/")) {
        setUrl(src);
        setIsS3(false);
        return;
    }
    
    // Handle s3:// protocol
    if (src.startsWith("s3://")) {
        const key = src.replace("s3://", "");
        if (!key) return;

        setIsS3(true);

        fetch(`/api/s3/presign?key=${encodeURIComponent(key)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.url) setUrl(data.url);
            })
            .catch((err) => console.error("Failed to load image", err));
    } else {
        // Fallback for unlikely local paths or other strings
        setUrl(src);
        setIsS3(false);
    }
  }, [src]);

  if (!url) {
      return (
          <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
             <Loader2 className="w-6 h-6 animate-spin" />
          </div>
      );
  }

  // If it was an S3 URL, we should use a standard <img> tag to avoid Next.js Image optimization hostname issues
  // unless we are sure all ephemeral S3 URLs are allowlisted.
  if (isS3) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={url} alt={alt} className={className} />;
  }

  // For normal URLs, use Next.js Image
  return (
    <Image 
        src={url} 
        alt={alt} 
        className={className}
        {...props} 
    />
  );
}
