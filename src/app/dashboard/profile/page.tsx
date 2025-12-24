"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileSkeleton } from "@/components/ui/skeletons";
import { Loader2 } from "lucide-react";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface Enrollment {
  id: number;
  course: {
    title: string;
    slug: string;
  };
  plan: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function ProfilePage() {
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  // We need to wait for session before initializing form, or update it via useEffect
  // For simplicity, we'll conditionally render the form
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      phoneNumber: (session?.user as any)?.phoneNumber || "", // Cast to any if type not updated yet
      imageUrl: session?.user?.image || "",
    },
    values: { // Update form when session loads
        name: session?.user?.name || "",
        phoneNumber: (session?.user as any)?.phoneNumber || "",
        imageUrl: session?.user?.image || "",
    }
  });

  useEffect(() => {
    if (session?.user) {
        fetch("/api/user/enrollments")
            .then(res => res.json())
            .then(data => {
                if (data.enrollments) setEnrollments(data.enrollments);
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingEnrollments(false));
    }
  }, [session]);

  const getPlanLabel = (plan: string) => {
      switch(plan) {
          case "1_month": return "1 Month";
          case "3_months": return "3 Months";
          case "6_months": return "6 Months";
          return plan;
      }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully");
      // Optionally reload session or invalidate cache (Better Auth might handle this if we trigger it, or simple reload)
       window.location.reload(); 
    } catch (error) {
      toast.error("An error occurred while saving");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthPending) {
    return <ProfileSkeleton />;
  }

  if (!session?.user) return null;

  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-8 max-w-5xl">
      <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and account preferences.</p>
      </div>

      <div className="space-y-8">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-8 md:grid-cols-3">
            {/* Left Column: Avatar & Basic Info */}
            <Card className="md:col-span-1 border-none shadow-md bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Click save after entering a new URL.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <AvatarUpload 
                        value={form.watch("imageUrl") || ""} 
                        onChange={(val) => form.setValue("imageUrl", val, { shouldDirty: true })}
                        name={form.watch("name")}
                    />
                    
                    {/* Hidden input to keep form state bound if needed for manual entry fallback, 
                        but standard users will use the upload. 
                        We can keep the manual input below or remove it. 
                        User asked for "upload image, not entering URL". So removing URL input is better. 
                    */}
                </CardContent>
            </Card>

            {/* Right Column: Personal Details */}
            <Card className="md:col-span-2 border-none shadow-md bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                                id="name" 
                                {...form.register("name")} 
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input 
                                id="phoneNumber" 
                                placeholder="+1 234 567 890" 
                                {...form.register("phoneNumber")} 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <Label>Email</Label>
                         <Input value={session.user.email} disabled className="bg-muted" />
                         <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving} size="lg">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </form>

      {/* Enrollments Section */}
      <Card className="border-none shadow-md bg-card/80 backdrop-blur-sm">
          <CardHeader>
              <CardTitle>My Enrollments</CardTitle>
              <CardDescription>View your active course enrollments.</CardDescription>
          </CardHeader>
          <CardContent>
              {loadingEnrollments ? (
                  <div className="flex justify-center p-4">
                      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  </div>
              ) : enrollments.length === 0 ? (
                  <div className="text-center p-8 text-slate-500">
                      No active enrollments found.
                  </div>
              ) : (
                  <div className="space-y-4">
                      {enrollments.map((enrollment) => (
                          <div key={enrollment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
                              <div>
                                  <h3 className="font-semibold text-lg">{enrollment.course.title}</h3>
                                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                                      <Badge variant="outline" className="bg-white">
                                          {getPlanLabel(enrollment.plan)}
                                      </Badge>
                                      <span>
                                          Expires: {enrollment.endDate ? format(new Date(enrollment.endDate), "PPP") : "N/A"}
                                      </span>
                                  </div>
                              </div>
                              <div>
                                   <Badge className={enrollment.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                                       {enrollment.isActive ? "Active" : "Expired"}
                                   </Badge>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </CardContent>
      </Card>
      </div>
    </div>
  );
}
