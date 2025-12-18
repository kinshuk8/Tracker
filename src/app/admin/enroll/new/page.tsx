"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Script from "next/script";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  college: z.string().min(2, "College name is required"),
  courseId: z.string().min(1, "Please select a course"),
});

interface Course {
  id: number;
  title: string;
}

import { authClient } from "@/lib/auth-client";

export default function AdminEnrollNewPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = authClient.useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      college: "",
      courseId: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.setValue("name", session.user.name || "");
      form.setValue("email", session.user.email || "");
      // phone and college might not be in session depending on auth provider, but if they are custom fields in user table...
      // For now we autofill what we can.
    }
  }, [session, form]);

  useEffect(() => {
    // Fetch courses to populate dropdown
    fetch("/api/admin/courses")
      .then((res) => res.json())
      .then((data) => {
        // Adapt data if structure is different, admin/courses usually returns summary
        // Assuming data is array of objects with id and title
        setCourses(data);
      })
      .catch((err) => console.error("Failed to load courses", err));
  }, []);

  const handlePayment = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // 1. Create Order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: data.courseId }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");
      const order = await orderRes.json();

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key here if creating env var, or fetch from server? 
        // Usually safe to generic key, but let's assume valid key is available.
        // Actually best practice is to not hardcode, but for this task I will assume env var.
        // If not available, we might fail.
        // Let's rely on window.Razorpay for now.
        amount: order.amount,
        currency: order.currency,
        name: "Admin Enrollment",
        description: `Enrollment for Course #${data.courseId}`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: data.courseId,
                userDetails: {
                  name: data.name,
                  email: data.email.toLowerCase(),
                  phone: data.phone,
                  college: data.college,
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("Enrollment Successful!");
              router.push("/admin/enrollments");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error(error);
            toast.error("Error confirming enrollment");
          }
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          New Enrollment
        </h1>
        <p className="text-slate-500 text-lg">
          Manually enroll a student into a course and process payment.
        </p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 pb-8 pt-8">
          <CardTitle className="text-xl">Student Details</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-8 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium">Full Name</Label>
                <Input id="name" {...form.register("name")} placeholder="e.g. John Doe" className="h-12 text-base transition-all focus:ring-2 ring-offset-2 ring-blue-500/20" />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium">Email Address</Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="john@example.com" className="h-12 text-base transition-all focus:ring-2 ring-offset-2 ring-blue-500/20" />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base font-medium">Phone Number</Label>
                <Input id="phone" {...form.register("phone")} placeholder="+91..." className="h-12 text-base transition-all focus:ring-2 ring-offset-2 ring-blue-500/20" />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="college" className="text-base font-medium">College / Organization</Label>
                <Input id="college" {...form.register("college")} placeholder="e.g. ABC Institute" className="h-12 text-base transition-all focus:ring-2 ring-offset-2 ring-blue-500/20" />
                {form.formState.errors.college && (
                  <p className="text-red-500 text-sm">{form.formState.errors.college.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="course" className="text-base font-medium">Select Course</Label>
              <Select onValueChange={(val) => form.setValue("courseId", val)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Choose a course to enroll..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               {form.formState.errors.courseId && (
                  <p className="text-red-500 text-sm">{form.formState.errors.courseId.message}</p>
                )}
            </div>

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]" disabled={isLoading}>
                {isLoading ? "Processing..." : "Pay & Enroll (₹1)"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
