"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Check, CloudCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS, TOTAL_STEPS } from "@/lib/pitch2product/schema";

// No percentage-based messages: the "Step N of 5" label above already says where you are.
function milestoneMessage(percent: number) {
  return "";
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 120, damping: 20 });
  const rounded = useTransform(spring, (v) => `${Math.round(v)}%`);
  useEffect(() => spring.set(value), [spring, value]);
  return <motion.span className="tabular-nums">{rounded}</motion.span>;
}

export default function ProgressHeader({
  step,
  percent,
  maxStep,
  savedAt,
  onJump,
}: {
  step: number;
  percent: number;
  maxStep: number;
  savedAt: Date | null;
  onJump: (step: number) => void;
}) {
  const message = milestoneMessage(percent);

  return (
    <div className="border-b border-slate-100 px-5 pb-5 pt-6 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Step {step + 1} of {TOTAL_STEPS} · {STEPS[step].title}
        </p>
        <p className="text-sm font-bold text-slate-900">
          <AnimatedNumber value={percent} />
          <span className="ml-1 font-normal text-slate-500">complete</span>
        </p>
      </div>

      <div
        className="relative mt-3 h-3 rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        aria-label="Form completion"
      >
        <motion.div
          className="absolute inset-y-0 left-0 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 shadow-[0_0_16px_rgba(139,92,246,0.55)]"
          initial={false}
          animate={{ width: `${Math.max(percent, 2)}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
        >
          <motion.div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        {STEPS.slice(1).map((_, i) => (
          <span
            key={i}
            className={cn(
              "absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors",
              percent >= ((i + 1) / TOTAL_STEPS) * 100 ? "bg-white" : "bg-slate-300",
            )}
            style={{ left: `${((i + 1) / TOTAL_STEPS) * 100}%` }}
          />
        ))}
      </div>

      <nav aria-label="Form steps" className="mt-4 grid grid-cols-5 gap-1.5">
        {STEPS.map((s, i) => {
          const done = i < maxStep;
          const current = i === step;
          const reachable = i <= maxStep;
          return (
            <button
              key={s.key}
              type="button"
              disabled={!reachable}
              onClick={() => onJump(i)}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition-colors sm:text-xs",
                current && "bg-indigo-600 text-white",
                !current && done && "text-indigo-700 hover:bg-indigo-50",
                !current && !done && "text-slate-400",
                reachable && !current && "cursor-pointer",
              )}
            >
              {done && !current ? <Check className="h-3 w-3" strokeWidth={3} /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{s.short}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-medium text-slate-600"
            aria-live="polite"
          >
            {message}
          </motion.p>
        </AnimatePresence>
        {savedAt && (
          <span className="flex shrink-0 items-center gap-1 text-slate-400">
            <CloudCheck className="h-3.5 w-3.5" /> Draft saved on this device
          </span>
        )}
      </div>
    </div>
  );
}
