"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileImage, FileSpreadsheet, FileText, Presentation, UploadCloud, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LINK_FIELDS } from "@/lib/pitch2product/options";
import { FILE_RULES, validateFile } from "@/lib/pitch2product/schema";
import { track } from "@/lib/pitch2product/analytics";
import { ConsentCheck, Reaction, StepIntro, SubSection, TextField } from "./fields";
import type { StepProps } from "./Steps";

export type UploadItem = { id: string; file: File; description: string };

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function FileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const Icon = ["ppt", "pptx"].includes(ext)
    ? Presentation
    : ["xls", "xlsx"].includes(ext)
      ? FileSpreadsheet
      : ["png", "jpg", "jpeg"].includes(ext)
        ? FileImage
        : FileText;
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-fuchsia-600 text-white">
      <Icon className="h-5 w-5" />
    </div>
  );
}

export function StepMaterial({
  values: v,
  errors: e,
  set,
  uploads,
  setUploads,
}: StepProps & { uploads: UploadItem[]; setUploads: React.Dispatch<React.SetStateAction<UploadItem[]>> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const remaining = FILE_RULES.maxFiles - uploads.length;

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const errors: string[] = [];
    const accepted: UploadItem[] = [];
    for (const file of Array.from(list)) {
      if (uploads.length + accepted.length >= FILE_RULES.maxFiles) {
        errors.push(`You can upload up to ${FILE_RULES.maxFiles} files. Remove one to add another.`);
        break;
      }
      if (uploads.some((u) => u.file.name === file.name && u.file.size === file.size)) continue;
      const err = validateFile(file);
      if (err) errors.push(err);
      else accepted.push({ id: crypto.randomUUID(), file, description: "" });
    }
    if (accepted.length) {
      setUploads((prev) => [...prev, ...accepted]);
      accepted.forEach((u) => track("file_uploaded", { type: u.file.name.split(".").pop() }));
    }
    setFileErrors(errors);
  };

  const linkCount = LINK_FIELDS.filter((l) => v[l.key].trim()).length;
  const materialCount = uploads.length + linkCount;

  return (
    <div className="space-y-6">
      <StepIntro
        title="Share what you already have"
        subtitle="Files and links are optional. If you have a deck or a demo link, add it here so we can understand your idea better."
      />

      <div
        onDragOver={(ev) => {
          ev.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(ev) => {
          ev.preventDefault();
          setDragging(false);
          addFiles(ev.dataTransfer.files);
        }}
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all",
          dragging ? "scale-[1.01] border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white/70 hover:border-indigo-400",
          remaining <= 0 && "pointer-events-none opacity-60",
        )}
      >
        <motion.div
          animate={dragging ? { y: -6, scale: 1.1 } : { y: [0, -4, 0] }}
          transition={dragging ? { duration: 0.2 } : { duration: 2.5, repeat: Infinity }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30"
        >
          <UploadCloud className="h-7 w-7" />
        </motion.div>
        <p className="mt-4 font-semibold text-slate-800">
          {dragging ? "Release to add files" : "Drag & drop files here"}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-semibold text-indigo-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            browse your device
          </button>
        </p>
        <p className="mt-3 text-xs text-slate-400">
          PDF, PPT, DOC, XLS, PNG, JPG · up to {FILE_RULES.maxSizeMb} MB each · {uploads.length}/{FILE_RULES.maxFiles}{" "}
          files
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={FILE_RULES.accept}
          className="sr-only"
          aria-label="Upload supporting files"
          onChange={(ev) => {
            addFiles(ev.target.files);
            ev.target.value = "";
          }}
        />
      </div>

      {fileErrors.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {fileErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <AnimatePresence initial={false}>
        {uploads.map((u) => (
          <motion.div
            key={u.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <FileIcon name={u.file.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-800">{u.file.name}</p>
                <p className="text-xs uppercase text-slate-500">
                  {u.file.name.split(".").pop()} · {formatSize(u.file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploads((prev) => prev.filter((x) => x.id !== u.id))}
                aria-label={`Remove ${u.file.name}`}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Input
              value={u.description}
              maxLength={200}
              onChange={(ev) =>
                setUploads((prev) => prev.map((x) => (x.id === u.id ? { ...x, description: ev.target.value } : x)))
              }
              placeholder="e.g. Latest deck, with our pricing plan"
              aria-label={`Description for ${u.file.name}`}
              className="mt-3 h-10 rounded-lg border-slate-200 bg-slate-50"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <SubSection title="Supporting links">
        <div className="grid gap-5 sm:grid-cols-2">
          {LINK_FIELDS.map((l) => (
            <TextField
              key={l.key}
              id={l.key}
              label={l.label}
              type="url"
              placeholder={l.placeholder}
              value={v[l.key]}
              onChange={(x) => set(l.key, x)}
              error={e[l.key]}
            />
          ))}
        </div>
      </SubSection>

      <Reaction
        message={
          materialCount >= 3
            ? ""
            : materialCount > 0
              ? ""
              : null
        }
      />

      <div className="space-y-3 pt-2">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Before you submit
        </p>
        <ConsentCheck id="consentAccurate" checked={v.consentAccurate} onChange={(x) => set("consentAccurate", x)}
          error={e.consentAccurate}>
          I confirm that the information provided is accurate to the best of my knowledge.
        </ConsentCheck>
        <ConsentCheck id="consentRights" checked={v.consentRights} onChange={(x) => set("consentRights", x)}
          error={e.consentRights}>
          I confirm that I have the right to submit the materials uploaded with this application.
        </ConsentCheck>
        <ConsentCheck id="consentContact" checked={v.consentContact} onChange={(x) => set("consentContact", x)}
          error={e.consentContact}>
          I agree to be contacted regarding my submission.
        </ConsentCheck>
        <p className="text-xs text-slate-500">
          Read our{" "}
          <Link href="/privacy-policy" target="_blank" className="font-medium text-indigo-600 hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-conditions" target="_blank" className="font-medium text-indigo-600 hover:underline">
            Terms
          </Link>
          . Submitting does not create a confidentiality agreement or NDA.
        </p>
      </div>
    </div>
  );
}
