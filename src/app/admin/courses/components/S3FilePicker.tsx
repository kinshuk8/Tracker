"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, File as FileIcon, Loader2, Music, Video, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface S3File {
  key: string;
  size: number;
}

interface S3FilePickerProps {
  onSelect: (url: string, key: string) => void;
  trigger?: React.ReactNode;
}

import { useS3Files } from "@/hooks/use-s3-files";
import { RefreshCw } from "lucide-react";

export function S3FilePicker({ onSelect, trigger }: S3FilePickerProps) {
  const { files, loading, refresh } = useS3Files();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // No effect needed for fetch, the hook handles it on mount/subscription

  const filteredFiles = files.filter((f: S3File) => f.key.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (file: S3File) => {
      onSelect(`s3://${file.key}`, file.key); 
      setOpen(false);
  };
  
  const getFileIcon = (key: string) => {
      // ... same implementation ...
      const ext = key.split('.').pop()?.toLowerCase();
      if (['mp4', 'mov', 'webm'].includes(ext || '')) return <Video className="w-4 h-4 text-blue-500" />;
      if (['png', 'jpg', 'jpeg', 'gif'].includes(ext || '')) return <ImageIcon className="w-4 h-4 text-purple-500" />;
      if (['mp3', 'wav'].includes(ext || '')) return <Music className="w-4 h-4 text-green-500" />;
      return <FileIcon className="w-4 h-4 text-slate-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Select from S3</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
             <span>Select File from S3</span>
             <Button variant="ghost" size="icon" onClick={refresh} title="Refresh List">
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
             </Button>
          </DialogTitle>
          <DialogDescription>
            Choose a file safely stored in your S3 bucket.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                   placeholder="Search files..." 
                   className="pl-9"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <ScrollArea className="h-[300px] border rounded-md p-2">
                {loading ? (
                    <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                             <div key={i} className="flex items-center gap-3 p-2">
                                 <Skeleton className="h-4 w-4 rounded-sm" />
                                 <Skeleton className="h-4 w-[200px]" />
                                 <Skeleton className="h-4 w-[50px] ml-auto" />
                             </div>
                        ))}
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center text-slate-500 py-10">No files found.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-1">
                        {filteredFiles.map((file) => (
                            <div 
                                key={file.key}
                                className={cn(
                                    "flex items-center gap-3 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors",
                                )}
                                onClick={() => handleSelect(file)}
                            >
                                {getFileIcon(file.key)}
                                <span className="text-sm truncate flex-1" title={file.key}>{file.key}</span>
                                <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
