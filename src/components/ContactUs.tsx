"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, MapPin } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(3, "Please enter a subject."),
  message: z.string().min(10, "Your message should be at least 10 characters."),
});

type FormValues = z.infer<typeof schema>;

function FormField({ field, label, placeholder, type = "text", as: Component = Input }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  label: string;
  placeholder: string;
  type?: string;
  as?: typeof Input | typeof Textarea;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Component
        id={field.name}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        aria-invalid={!!field.state.meta.touchedErrors?.length}
        rows={Component === Textarea ? 5 : undefined}
      />
      {field.state.meta.touchedErrors ? (
        <p className="mt-1 text-sm text-red-500">{field.state.meta.touchedErrors[0]}</p>
      ) : null}
    </div>
  );
}

export default function ContactUs() {
  const form = useForm({
    defaultValues: useMemo(() => ({ name: "", email: "", subject: "", message: "" }), []),
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Message sent! We&apos;ll get back to you shortly.");
      console.log("Contact submit", value);
      form.reset();
    },
    validators: {
      onChange: ({ value }) => {
        const result = schema.safeParse(value);
        if (result.success) return undefined;
        const errors: Partial<Record<keyof FormValues, string[]>> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof FormValues;
          if (!key) continue;
          if (!errors[key]) errors[key] = [];
          errors[key]!.push(issue.message);
        }
        return errors;
      },
    },
  });

  return (
    <section className="bg-slate-50 dark:bg-black w-full min-h-screen py-20 sm:py-24">
      <Toaster position="top-center" richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-8 lg:sticky lg:top-20">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark dark:text-white">
              Let&apos;s build together.
            </h1>            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-lg">
              Have a project in mind or just want to learn more? We&apos;d love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            className="hidden lg:block"
          >
            <Image
              src="/assets/welcome-image.svg"
              alt="Contact illustration"
              width={520}
              height={420}
              className="w-full h-auto"
            />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand" />
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">Email</p>
                <p className="font-medium">vmkedgemind@gmail.com</p>
              </div>
            </div>
            <div className="relative rounded-xl p-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center gap-3">
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-brand to-transparent h-[2px] w-3/4 blur-sm" />
              <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-brand to-transparent h-px w-3/4" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
              <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
              <MapPin className="w-5 h-5 text-brand" />
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">Address</p>
                <p className="font-medium">Vijayawada, AP, India</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="relative group overflow-hidden">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void form.handleSubmit();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <form.Field name="name">{(field) => <FormField field={field} label="Full Name" placeholder="Jane Doe" />}</form.Field>
                  <form.Field name="email">{(field) => <FormField field={field} label="Email" placeholder="jane@example.com" type="email" />}</form.Field>
                </div>

                <form.Field name="subject">{(field) => <FormField field={field} label="Subject" placeholder="Project Inquiry" />}</form.Field>

                <form.Field name="message">{(field) => <FormField field={field} label="Message" placeholder="Tell us about your project..." as={Textarea} />}</form.Field>

                <div className="flex justify-end">
                  <Button type="submit" size="lg" className="bg-brand hover:bg-brand/90 text-white" disabled={form.state.isSubmitting}>
                    {form.state.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
