"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Option } from "@/lib/pitch2product/options";

const inputClass =
  "h-12 rounded-xl border-slate-200 bg-white/80 px-4 text-base shadow-sm transition-all placeholder:text-slate-400 hover:border-indigo-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20";

export function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  children,
  aside,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800">
          {label}
          {required ? (
            <span className="ml-0.5 text-fuchsia-600" aria-hidden>
              *
            </span>
          ) : (
            <span className="ml-2 text-xs font-normal text-slate-400">(optional)</span>
          )}
        </label>
        {aside}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const describedBy = (id: string, hint?: string, error?: string) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  hint,
  className,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
} & Omit<React.ComponentProps<"input">, "value" | "onChange" | "id">) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <Input
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, hint, error)}
        className={inputClass}
        {...rest}
      />
    </FieldShell>
  );
}

function lengthNudge(length: number, min: number) {
  if (length === 0) return null;
  if (length < min) return { text: `Please write at least ${min} characters.`, tone: "text-slate-400" };
  if (length < 150) return { text: "", tone: "text-indigo-500" };
  return { text: "", tone: "text-emerald-600" };
}

export function LongTextField({
  id,
  label,
  value,
  onChange,
  error,
  required,
  hint,
  placeholder,
  minLength = 0,
  rows = 4,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  minLength?: number;
  rows?: number;
}) {
  const nudge = minLength ? lengthNudge(value.trim().length, minLength) : null;
  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      aside={
        <span className="text-xs tabular-nums text-slate-400" aria-live="polite">
          {value.length}/2000
        </span>
      }
    >
      <Textarea
        id={id}
        name={id}
        value={value}
        rows={rows}
        maxLength={2000}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={describedBy(id, hint, error)}
        className="min-h-28 rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-base shadow-sm transition-all placeholder:text-slate-400 hover:border-indigo-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
      />
      {nudge && !error && <p className={cn("text-xs font-medium", nudge.tone)}>{nudge.text}</p>}
    </FieldShell>
  );
}

export function ChoiceCards({
  id,
  label,
  options,
  value,
  onChange,
  error,
  required,
  hint,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  id: string;
  label: string;
  options: readonly Option[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
  columns?: string;
}) {
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <div
        id={id}
        role="radiogroup"
        tabIndex={-1}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        className={cn("grid gap-3 outline-none", columns)}
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                "group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20",
                selected
                  ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-fuchsia-50 shadow-[0_8px_24px_-10px_rgba(79,70,229,0.5)]"
                  : "border-slate-200 bg-white/80 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md",
                error && !selected && "border-red-200",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 group-hover:border-indigo-400",
                )}
              >
                {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </span>
              <span>
                <span className={cn("block font-semibold", selected ? "text-indigo-900" : "text-slate-800")}>
                  {opt.label}
                </span>
                {opt.hint && <span className="mt-0.5 block text-xs text-slate-500">{opt.hint}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

export function ChipSelect({
  id,
  label,
  options,
  value,
  onChange,
  error,
  required,
  hint,
}: {
  id: string;
  label: string;
  options: readonly Option[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  error?: string;
  required?: boolean;
  hint?: string;
}) {
  const multi = Array.isArray(value);
  const isSelected = (v: string) => (multi ? value.includes(v) : value === v);
  const toggle = (v: string) => {
    if (!multi) return onChange(v);
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      aside={
        multi && value.length > 0 ? (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            {value.length} selected
          </span>
        ) : null
      }
    >
      <div
        id={id}
        role={multi ? "group" : "radiogroup"}
        tabIndex={-1}
        aria-invalid={!!error}
        aria-describedby={describedBy(id, hint, error)}
        className="flex flex-wrap gap-2 outline-none"
      >
        {options.map((opt) => {
          const selected = isSelected(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={selected}
              onClick={() => toggle(opt.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20",
                selected
                  ? "border-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-[0_6px_20px_-8px_rgba(79,70,229,0.8)]"
                  : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-300 hover:text-indigo-700",
              )}
            >
              {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              {opt.label}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

export function ConsentCheck({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
          checked ? "border-indigo-300 bg-indigo-50/60" : "border-slate-200 bg-white/80 hover:border-indigo-200",
          error && !checked && "border-red-300",
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-500/30",
            checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white",
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </span>
        <span className="text-sm leading-relaxed text-slate-700">{children}</span>
      </label>
      {error && !checked && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function StepIntro({ title, subtitle }: { title: React.ReactNode; subtitle: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      <p className="mt-2 text-slate-600">{subtitle}</p>
    </div>
  );
}

export function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 p-5 sm:p-6">
      <legend className="px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-600">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function Reaction({ message }: { message?: string | null }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          aria-live="polite"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-50 to-fuchsia-50 px-4 py-3 text-sm font-medium text-indigo-800"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-500" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
