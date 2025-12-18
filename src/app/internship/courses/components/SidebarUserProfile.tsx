"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/UserAvatar";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarUserProfileProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | undefined;
}

export function SidebarUserProfile({ user }: SidebarUserProfileProps) {
  const { open, animate } = useSidebar();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 p-2">
      <UserAvatar user={user} className="h-8 w-8 shrink-0" />
      
      <motion.div
        animate={{
          display: animate ? (open ? "block" : "none") : "block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="overflow-hidden whitespace-nowrap"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col text-sm text-neutral-700 dark:text-neutral-200">
                <span className="font-medium truncate max-w-[150px]">
                  {user.name}
                </span>
                <span className="text-xs text-neutral-500 truncate max-w-[150px]">
                  {user.email}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{user.name}</p>
              <p className="text-xs text-neutral-400">{user.email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </div>
  );
}
