"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ModuleList, ModuleItem } from "./ModuleList";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { S3FilePicker } from "./S3FilePicker";

// Helper component to render S3 images
function S3Image({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [url, setUrl] = useState<string>(src.startsWith("http") ? src : "");

  useEffect(() => {
    if (src.startsWith("http")) {
        setUrl(src);
        return;
    }
    
    // Handle s3:// protocol or plain keys if we decide to change format
    let key = src;
    if (src.startsWith("s3://")) {
        key = src.replace("s3://", "");
    }
    
    if (!key) return;

    // Fetch presigned URL
    fetch(`/api/s3/presign?key=${encodeURIComponent(key)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.url) setUrl(data.url);
      })
      .catch((err) => console.error("Failed to load image", err));
  }, [src]);

  if (!url) {
      return (
          <div className="flex items-center justify-center w-full h-full bg-slate-100 dark:bg-slate-800 text-slate-400">
             <Loader2 className="w-6 h-6 animate-spin" />
          </div>
      );
  }

  return <img src={url} alt={alt} className={className} />;
}

interface CourseData {
  id?: number;
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  modules: ModuleItem[];
  plans?: CoursePlan[];
}

interface CoursePlan {
  planType: "1_month" | "3_months" | "6_months";
  price: number;
  isActive: boolean;
}

interface CourseEditorProps {
  initialData?: CourseData;
  isEditing?: boolean;
}

export function CourseEditor({ initialData, isEditing = false }: CourseEditorProps) {
  const router = useRouter();
  const [course, setCourse] = useState<CourseData>(
    initialData || {
      title: "",
      description: "",
      slug: "",
      imageUrl: "",
      modules: [],
      plans: [
        { planType: "1_month", price: 199, isActive: true }, // Default enabled 1 month
        { planType: "3_months", price: 429, isActive: false },
        { planType: "6_months", price: 1499, isActive: false },
      ]
    }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
      // Basic validation
      if (!course.title || !course.slug) {
          toast.error("Title and Slug are required.");
          return;
      }

      setSaving(true);
      try {
          const url = isEditing 
            ? `/api/admin/courses/${course.id}`
            : "/api/admin/courses";
          
          const method = isEditing ? "PUT" : "POST";

          const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(course),
          });

          if (!res.ok) throw new Error("Failed to save course");

          const data = await res.json();
          toast.success(`Course ${isEditing ? "updated" : "created"} successfully!`);
          
          if (!isEditing && data.id) {
              // Redirect to edit page to add modules if this was just a metadata create
              router.push(`/admin/courses/${data.id}/edit`);
          } else {
              router.refresh(); // Refresh current page
          }

      } catch (error) {
          console.error(error);
          toast.error("Something went wrong. Please try again.");
      } finally {
          setSaving(false);
      }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between sticky top-[var(--header-height,0px)] bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 py-4 -mx-4 px-4 border-b">
         <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" asChild>
                 <Link href="/admin/courses"><ChevronLeft className="w-5 h-5" /></Link>
             </Button>
             <h1 className="text-2xl font-bold">{isEditing ? "Edit Course" : "Create New Course"}</h1>
         </div>
          <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
             {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
             {isEditing ? "Save Changes" : "Create Course"}
         </Button>
      </div>

      {/* METADATA FORM */}
      <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
              <div className="space-y-2">
                  <Label>Course Title</Label>
                  <Input 
                    value={course.title}
                    onChange={(e) => setCourse({...course, title: e.target.value})}
                    placeholder="Mastering Next.js"
                  />
              </div>
              <div className="space-y-2">
                  <Label>Slug (URL Friendly)</Label>
                  <Input 
                    value={course.slug}
                    onChange={(e) => setCourse({...course, slug: e.target.value})}
                    placeholder="mastering-next-js"
                  />
              </div>
               <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    value={course.description}
                    onChange={(e) => setCourse({...course, description: e.target.value})}
                    placeholder="Short description of the course..."
                    rows={4}
                  />
              </div>
          </div>
          
          <div className="space-y-4">
               <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="border-2 border-dashed rounded-lg h-[200px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 overflow-hidden relative group">
                      {course.imageUrl ? (
                          <>
                             <S3Image src={course.imageUrl} alt="Cover" className="h-full w-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <S3FilePicker 
                                    onSelect={(url) => setCourse({...course, imageUrl: url})} 
                                    trigger={<Button variant="secondary">Change Image</Button>}
                                />
                             </div>
                          </>
                      ) : (
                          <div className="text-center space-y-2">
                              <p className="text-sm text-slate-500">No image selected</p>
                              <S3FilePicker 
                                  onSelect={(url) => setCourse({...course, imageUrl: url})} 
                              />
                          </div>
                      )}
                  </div>
               </div>
          </div>
      </div>
      
      <hr className="border-slate-200 dark:border-slate-800" />
      
      {/* PLANS CONFIGURATION */}
      <div className="space-y-4">
          <h2 className="text-xl font-bold">Course Plans & Pricing</h2>
          <Card className="p-6">
              <div className="grid gap-4">
                  {(["1_month", "3_months", "6_months"] as const).map((planType) => {
                      const existingPlan = course.plans?.find(p => p.planType === planType) || { planType, price: 0, isActive: false };
                      const label = planType === "1_month" ? "1 Month" : planType === "3_months" ? "3 Months" : "6 Months";
                      
                      return (
                          <div key={planType} className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                              <div className="flex items-center gap-2 min-w-[120px]">
                                  <input 
                                    type="checkbox"
                                    id={`plan-${planType}`}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={existingPlan.isActive}
                                    onChange={(e) => {
                                        const newIsActive = e.target.checked;
                                        const newPlans = [...(course.plans || [])];
                                        const index = newPlans.findIndex(p => p.planType === planType);
                                        if (index > -1) {
                                            newPlans[index].isActive = newIsActive;
                                        } else {
                                            newPlans.push({ planType, price: 0, isActive: newIsActive });
                                        }
                                        setCourse({ ...course, plans: newPlans });
                                    }}
                                  />
                                  <Label htmlFor={`plan-${planType}`} className="font-medium cursor-pointer">{label}</Label>
                              </div>
                              
                              <div className="flex-1 flex items-center gap-2">
                                  <Label className="text-sm text-slate-500 w-12">Price (₹)</Label>
                                  <Input 
                                    type="number"
                                    min="0"
                                    value={existingPlan.price}
                                    onChange={(e) => {
                                        const newPrice = parseInt(e.target.value) || 0;
                                        const newPlans = [...(course.plans || [])];
                                        const index = newPlans.findIndex(p => p.planType === planType);
                                        if (index > -1) {
                                            newPlans[index].price = newPrice;
                                        } else {
                                            newPlans.push({ planType, price: newPrice, isActive: false });
                                        }
                                        setCourse({ ...course, plans: newPlans });
                                    }}
                                    disabled={!existingPlan.isActive}
                                    className="w-32"
                                  />
                              </div>
                              <div className="text-sm text-slate-500">
                                  {existingPlan.isActive ? (
                                      <span className="text-green-600 font-medium">Active</span>
                                  ) : (
                                      <span className="text-slate-400">Inactive</span>
                                  )}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </Card>
      </div>

      <hr className="border-slate-200 dark:border-slate-800" />

      <hr className="border-slate-200 dark:border-slate-800" />
      
      {/* MODULES & CURRICULUM */}
      <div className="space-y-4">
          <ModuleList 
             modules={course.modules}
             onUpdate={(modules) => setCourse({ ...course, modules })}
          />
      </div>

      <div className="flex justify-end pt-4 pb-4 sticky bottom-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t -mx-8 px-8 z-40 mt-8">
          <Button onClick={handleSave} disabled={saving} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[200px] shadow-lg">
             {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
             {isEditing ? "Save Changes" : "Create Course"}
         </Button>
      </div>
    </div>
  );
}
