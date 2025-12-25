"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { S3Image } from "@/components/ui/s3-image";
import { cn } from "@/lib/utils";
import { User, Image as ImageIcon } from "lucide-react";

interface UserAvatarProps {
  user: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
  } | undefined;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({ user, className, fallbackClassName }: UserAvatarProps) {
  if (!user) return null;

  // Check if image is S3 protocol
  const isS3 = user.image?.startsWith("s3://");

  return (
    <Avatar className={cn("h-8 w-8 cursor-pointer border-white/20 shadow-sm", className)}>
      {user.image ? (
        isS3 ? (
             // S3Image handles its own loading and rendering of s3:// urls
             <div className="w-full h-full overflow-hidden rounded-full">
                 <S3Image 
                    src={user.image} 
                    alt={user.name || "User"} 
                    className="object-cover w-full h-full"
                 />
             </div>
        ) : (
             <AvatarImage 
                src={user.image} 
                alt={user.name || "User"} 
                className="object-cover" 
             />
        )
      ) : null}
      
      <AvatarFallback className={cn("bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300", fallbackClassName)}>
        {user.name ? (
            user.name.split(" ").map((n, i, arr) => (i === 0 || i === arr.length - 1) ? n[0] : "").join("").toUpperCase()
        ) : (
            <User className="w-4 h-4" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
