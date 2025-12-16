"use client";

import React, { useEffect, useState, useRef } from "react";
import { Play, FileText, Download, CheckCircle, Circle, ChevronRight, Video, File } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming basic shadcn utility exists, if not I'll handle it

type Item = {
  key: string;
  size: number;
  url?: string;
  type: 'video' | 'document';
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileInfo = (key: string) => {
  const parts = key.split("/");
  const fileName = parts.pop() || key;
  // Beautify filename: remove extension, replace common separators
  const cleanName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  const folder = parts.length > 0 ? parts.join("/") : "Course Content";
  return { fileName, cleanName, folder };
};

const isVideo = (key: string) => {
  const ext = key.split(".").pop()?.toLowerCase();
  return ["mp4", "webm", "mov", "mkv"].includes(ext || "");
};

// Group items by folder for a better playlist experience? 
// For now, flat list sorted by name/type as per "playlist" requirement.

export default function S3VideoList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/s3/list")
      .then((r) => r.json())
      .then((data) => {
        const allItems: Item[] = (data.items || []).map((it: any) => ({
            ...it,
            type: isVideo(it.key) ? 'video' : 'document'
        }));
        
        // Sort items: Videos first, then name
        allItems.sort((a, b) => {
            if (a.type !== b.type) return a.type === 'video' ? -1 : 1;
            return a.key.localeCompare(b.key);
        });

        setItems(allItems);
        
        // Auto-select first video
        const firstVideo = allItems.find(i => i.type === 'video');
        if (firstVideo) {
            playResource(firstVideo, false); // Don't auto-play on load to avoid annoyance/policies
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function playResource(item: Item, autoPlay = true) {
    // Optimistic UI update
    const alreadyHasUrl = !!item.url;
    
    if (alreadyHasUrl) {
         setActiveItem(item);
         if (autoPlay && videoRef.current && item.type === 'video') {
             // Small timeout to allow render
             setTimeout(() => videoRef.current?.play(), 100);
         }
         return;
    }

    try {
      const res = await fetch(`/api/s3/presign?key=${encodeURIComponent(item.key)}`);
      const json = await res.json();
      const updatedItem = { ...item, url: json.url };
      
      // Update item in list so we don't fetch again
      setItems(prev => prev.map(i => i.key === item.key ? updatedItem : i));
      setActiveItem(updatedItem);

      if (autoPlay && updatedItem.type === 'video') {
          setTimeout(() => videoRef.current?.play(), 100);
      }
    } catch (err) {
      console.error("Failed to load resource", err);
    }
  }

  const handleDownload = (e: React.MouseEvent, item: Item) => {
      e.stopPropagation();
      playResource(item, false).then(() => {
          // Verify we have the latest item state with URL
          // Actually playResource updates state, but we might need to find it from items or wait.
          // For simplicity, re-fetch or use logic if URL is known. 
          // Since playResource updates via setItems, let's just do a quick specialized fetch if needed
          // or trust playResource finished.
          // Better: direct window open if we have url
          // But playResource is async and void.
          // Let's just do the fetch here again or extract the fetch logic.
          fetch(`/api/s3/presign?key=${encodeURIComponent(item.key)}`)
            .then(r => r.json())
            .then(json => {
                const a = document.createElement('a');
                a.href = json.url;
                a.download = getFileInfo(item.key).fileName;
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
      });
  };

  if (loading) {
      return (
          <div className="flex h-[50vh] items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
      );
  }

  const { cleanName: activeTitle, folder: activeFolder } = activeItem ? getFileInfo(activeItem.key) : { cleanName: "Select a video", folder: "" };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-8 p-6 lg:p-8 max-w-[1920px] mx-auto">
      {/* Main Content Area (Player) */}
      <div className="flex-1 flex flex-col min-w-0 space-y-6">
         <div className="bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-video relative group">
            {activeItem?.type === 'video' ? (
                activeItem.url ? (
                    <video
                        ref={videoRef}
                        src={activeItem.url}
                        controls
                        className="w-full h-full object-contain"
                        controlsList="nodownload" 
                    >
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="flex items-center justify-center h-full text-white/50">
                        <div className="animate-pulse">Loading video...</div>
                    </div>
                )
            ) : activeItem?.type === 'document' ? (
                <div className="flex flex-col items-center justify-center h-full bg-zinc-900 text-white gap-6 p-10 text-center">
                    <div className="p-6 bg-zinc-800 rounded-full">
                        <FileText className="w-16 h-16 text-zinc-400" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-semibold tracking-tight">{activeTitle}</h3>
                        <p className="text-zinc-400">Document File • {formatSize(activeItem.size)}</p>
                    </div>
                    {activeItem.url && (
                        <a 
                            href={activeItem.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" /> Download / Preview
                        </a>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full bg-zinc-900 text-white/30">
                    <p className="text-lg">Select an item from the course content to view</p>
                </div>
            )}
         </div>

         <div className="space-y-2 px-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{activeTitle}</h1>
            {activeFolder && (
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="px-2 py-1 bg-muted rounded text-xs uppercase tracking-wider font-semibold">{activeFolder}</span>
                 </div>
            )}
         </div>
      </div>

      {/* Sidebar Playlist */}
      <div className="w-full lg:w-[400px] flex flex-col border rounded-xl bg-card h-full shadow-sm overflow-hidden flex-shrink-0">
        <div className="p-5 border-b bg-muted/30 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
            <div>
                <h2 className="font-semibold text-lg tracking-tight">Course Content</h2>
                <p className="text-xs text-muted-foreground font-medium">{items.length} lessons</p>
            </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-3 space-y-2 custom-scrollbar">
            {items.map((item, idx) => {
                const isActive = activeItem?.key === item.key;
                const info = getFileInfo(item.key);
                
                return (
                    <div 
                        key={item.key}
                        onClick={() => playResource(item)}
                        className={cn(
                            "flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all border border-transparent",
                            isActive 
                                ? "bg-primary/5 border-primary/20 shadow-sm" 
                                : "hover:bg-muted/80 hover:border-border/50"
                        )}
                    >
                        <div className="mt-1 flex-shrink-0">
                           {item.type === 'video' ? (
                               isActive 
                                ? <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><Play className="w-4 h-4 text-primary fill-current" /></div>
                                : <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><Video className="w-4 h-4 text-muted-foreground" /></div>
                           ) : (
                               <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center"><FileText className="w-4 h-4 text-blue-500" /></div>
                           )}
                        </div>
                        
                        <div className="flex-1 min-w-0 pt-0.5">
                            <p className={cn("font-medium text-sm leading-snug line-clamp-2", isActive ? "text-primary" : "text-foreground")}>
                                {info.cleanName}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <span>{item.type === 'video' ? 'Video' : 'Document'}</span>
                                <span className="text-border">•</span>
                                <span>{formatSize(item.size)}</span>
                            </div>
                        </div>

                        {item.type === 'document' && (
                            <button 
                                onClick={(e) => handleDownload(e, item)}
                                className="self-center p-2 hover:bg-background rounded-full text-muted-foreground hover:text-foreground transition-all"
                                title="Download"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}
