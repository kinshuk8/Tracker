"use client";

import { useState } from "react";
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

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);

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
    <div className="container mx-auto py-10 px-8 max-w-5xl">
      <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile and account preferences.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-3">
            {/* Left Column: Avatar & Basic Info */}
            <Card className="md:col-span-1 border-none shadow-md bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Click save after entering a new URL.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <Avatar className="h-40 w-40 border-4 border-background shadow-xl">
                        <AvatarImage src={form.watch("imageUrl") || ""} className="object-cover" />
                        <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                            {session.user.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="w-full space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input 
                            id="imageUrl" 
                            placeholder="https://..." 
                            {...form.register("imageUrl")} 
                        />
                    </div>
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
    </div>
  );
}
