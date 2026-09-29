"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/pitch2product/analytics";

export const SUBMIT_HREF = "/pitch2product/submit";

export function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em]",
        dark
          ? "border-white/15 bg-white/5 text-blue-200"
          : "border-blue-600/15 bg-blue-600/5 text-blue-700",
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-500 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fuchsia-500" />
      </span>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("mx-auto max-w-3xl text-center", className)}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "mt-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl",
          dark ? "text-white" : "text-slate-900",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-base sm:text-lg", dark ? "text-slate-300" : "text-slate-600")}>{subtitle}</p>
      )}
    </Reveal>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PrimaryCTA({
  location,
  href = SUBMIT_HREF,
  children = "Submit your idea",
  className,
}: {
  location: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={() => track("cta_click", { location })}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_10px_40px_-10px_rgba(79,70,229,0.7)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_14px_50px_-8px_rgba(192,38,211,0.6)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/50",
        className,
      )}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
      <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function SpotlightCard({
  children,
  className,
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, ${
    dark ? "rgba(129,140,248,0.18)" : "rgba(79,70,229,0.10)"
  }, transparent 70%)`;

  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 sm:p-8",
        dark
          ? "border-white/10 bg-white/[0.04] hover:border-indigo-400/40"
          : "border-slate-200 bg-white hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_20px_60px_-20px_rgba(79,70,229,0.35)]",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export const gridBackground = (color: string) => ({
  backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
  backgroundSize: "48px 48px",
});
