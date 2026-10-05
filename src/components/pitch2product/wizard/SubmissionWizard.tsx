"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signInAnonymously } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { ArrowLeft, ArrowRight, Check, Info, Loader2, Lock, PartyPopper, RotateCcw, Send } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { auth, storage } from "@/lib/firebase/client";
import { APPLICANT_TYPES, STUDENT_BUDGETS } from "@/lib/pitch2product/options";
import {
  STEPS,
  TOTAL_STEPS,
  defaultValues,
  stepCompletion,
  validateStep,
  type FieldErrors,
  type FieldName,
  type FileRef,
  type FormValues,
} from "@/lib/pitch2product/schema";
import { track, type P2PEvent } from "@/lib/pitch2product/analytics";
import ProgressHeader from "./ProgressHeader";
import Confirmation from "./Confirmation";
import SearchParamsBridge from "./SearchParamsBridge";
import { StepApplicant, StepIdea, StepRequirements, StepStage, firstName } from "./Steps";
import { StepMaterial, type UploadItem } from "./StepMaterial";

const DRAFT_KEY = "p2p-submission-draft";

const STEP_TIPS = [
  "If you're a student, the college questions help us suggest the right kind of support.",
  "A real example of the problem, like who faces it and when, is often the most useful part.",
  "Your stage tells us what would make sense to build next.",
  "Budget and timeline help us see what could realistically be built first.",
  "Supporting material is optional. A short deck or a photo of a rough sketch is fine.",
];

// No between-step banners: each step's own intro already says what comes next.
function celebration(step: number, v: FormValues): string | null {
  return null;
}

function firstErrorStep(v: FormValues) {
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const errs = validateStep(i, v);
    if (Object.keys(errs).length) return { step: i, errors: errs };
  }
  return null;
}

function focusField(errors: FieldErrors, delay = 100) {
  const key = Object.keys(errors)[0];
  if (!key) return;

  const tryFocus = () => {
    const el =
      document.getElementById(key) ||
      document.querySelector(`[name="${key}"]`) ||
      document.querySelector(`[data-field="${key}"]`) ||
      document.querySelector(`[aria-describedby*="${key}"]`);

    if (el && el instanceof HTMLElement) {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      el.classList.add("ring-4", "ring-rose-500/40", "transition-all", "duration-300");
      setTimeout(() => {
        el.classList.remove("ring-4", "ring-rose-500/40");
      }, 2500);
      return true;
    }
    return false;
  };

  setTimeout(() => {
    if (!tryFocus()) {
      setTimeout(tryFocus, 250);
    }
  }, delay);
}

/**
 * Uploads supporting files directly from the browser to Firebase Storage — never
 * through our own API route, which can't accept large request bodies in production
 * (Vercel's serverless functions hard-cap request bodies at 4.5MB). Applicants aren't
 * logged in, so this signs them in anonymously first; Storage security rules gate
 * writes on that anonymous uid plus per-file type/size checks.
 */
async function uploadSubmissionFiles(uploads: UploadItem[]): Promise<FileRef[]> {
  if (!uploads.length) return [];
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
  // Force a fresh ID token before uploading. signInAnonymously() resolving doesn't
  // guarantee the Storage SDK's own auth-token listener has synced yet — starting an
  // upload immediately can occasionally race ahead of it and go out unauthenticated,
  // which Storage's security rules correctly reject with a 403 even though sign-in
  // itself succeeded. Awaiting getIdToken() first closes that window.
  await user.getIdToken();
  return Promise.all(
    uploads.map(async (u) => {
      const safeName = u.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `pitch2product/${user.uid}/${u.id}-${safeName}`;
      const fileRef = ref(storage, path);
      // Plain single-shot upload, not uploadBytesResumable: our files are small (the
      // whole submission is capped at 10MB total), so resumable's chunking buys
      // nothing here and a single PUT keeps the Storage rules evaluation simple.
      await uploadBytes(fileRef, u.file, { contentType: u.file.type });
      // Deliberately no getDownloadURL() here: that's a *read* against the object,
      // which storage.rules denies so the bucket stays genuinely private. The server
      // mints a short-lived signed URL instead, via the Admin SDK (which bypasses
      // rules), so no permanently-public tokened URL ever exists. `path` is the
      // durable reference the server resolves.
      return { name: u.file.name, url: "", path, size: u.file.size, type: u.file.type, description: u.description.trim() };
    }),
  );
}

export default function SubmissionWizard() {
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [cheer, setCheer] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const started = useRef(false);
  const hasDraft = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let draft: { values?: Partial<FormValues>; step?: number; maxStep?: number } | null = null;
    try {
      draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null");
    } catch {
      draft = null;
    }

    if (draft?.values) {
      const clamp = (n: unknown) => Math.min(Math.max(Number(n) || 0, 0), TOTAL_STEPS - 1);
      setValues({ ...defaultValues, ...draft.values });
      setStep(clamp(draft.step));
      setMaxStep(clamp(draft.maxStep));
      setRestored(true);
      started.current = true;
      hasDraft.current = true;
    }
    setHydrated(true);
  }, []);

  // Applies ?type= from the URL, e.g. a "Students" landing link preselecting the applicant
  // type. Comes from SearchParamsBridge rather than useSearchParams() directly so that only
  // that tiny, invisible component is deferred behind Suspense — not the whole wizard.
  const applyPresetType = useCallback((type: string) => {
    if (hasDraft.current) return;
    if (!APPLICANT_TYPES.some((t) => t.value === type)) return;
    setValues((prev) => (prev.applicantType ? prev : { ...prev, applicantType: type }));
  }, []);

  useEffect(() => {
    if (!hydrated || reference || !started.current) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ values, step, maxStep }));
        setSavedAt(new Date());
      } catch {
        // Storage unavailable (private mode, quota) — the form still works without drafts.
      }
    }, 600);
    return () => clearTimeout(id);
  }, [values, step, maxStep, hydrated, reference]);

  useEffect(() => {
    if (!cheer) return;
    const id = setTimeout(() => setCheer(null), 5000);
    return () => clearTimeout(id);
  }, [cheer]);

  const set = useCallback(<K extends FieldName>(key: K, value: FormValues[K]) => {
    if (!started.current) {
      started.current = true;
      track("form_started");
    }
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "applicantType" && value !== "STUDENT" && STUDENT_BUDGETS.some((b) => b.value === prev.budget)) {
        next.budget = "";
      }
      return next;
    });
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const rest = { ...prev };
      delete rest[key];
      return rest;
    });
  }, []);

  const goTo = (target: number, newErrors?: FieldErrors) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
    setErrors(newErrors ?? {});
    requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const next = () => {
    const stepErrors = validateStep(step, values);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      focusField(stepErrors, 60);
      const firstErrorMsg = Object.values(stepErrors)[0];
      toast.error(firstErrorMsg || "Please fill in all required fields.");
      return;
    }
    track(`step_${step + 1}_completed` as P2PEvent);
    setCheer(celebration(step, values));
    setMaxStep((m) => Math.max(m, step + 1));
    goTo(step + 1);
  };

  const submit = async () => {
    const invalid = firstErrorStep(values);
    if (invalid) {
      goTo(invalid.step, invalid.errors);
      focusField(invalid.errors, 300);
      const firstErrorMsg = Object.values(invalid.errors)[0];
      toast.error(firstErrorMsg || "Some answers are missing or need a change. Please check the marked fields.");
      return;
    }

    setSubmitting(true);
    try {
      let files: FileRef[];
      try {
        files = await uploadSubmissionFiles(uploads);
      } catch (err) {
        console.error("Pitch2Product file upload failed:", err);
        toast.error("We couldn't upload your files. Please check your connection and try again.");
        return;
      }

      const res = await fetch("/api/pitch2product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, files }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.fieldErrors) {
          const serverInvalid = firstErrorStep(values);
          const targetStep = serverInvalid ? serverInvalid.step : 0;
          goTo(targetStep, data.fieldErrors);
          focusField(data.fieldErrors, 300);
        }
        toast.error(data.error || "We couldn't send your submission. Your answers are still here, so please try again.");
        return;
      }

      track("form_submitted", { applicant_type: values.applicantType, stage: values.currentStage });
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      setReference(data.referenceNumber);
      requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch {
      toast.error("We couldn't connect. Your answers are still here. Check your internet and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const startFresh = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setValues(defaultValues);
    setUploads([]);
    setErrors({});
    setStep(0);
    setMaxStep(0);
    setRestored(false);
    setSavedAt(null);
    started.current = false;
  };

  const percent = reference ? 100 : Math.min(100, ((step + stepCompletion(step, values)) / TOTAL_STEPS) * 100);
  const isLast = step === TOTAL_STEPS - 1;
  const stepProps = { values, errors, set };
  const name = firstName(values.fullName);

  return (
    <>
    <Suspense fallback={null}>
      <SearchParamsBridge onType={applyPresetType} />
    </Suspense>
    <Toaster position="top-center" richColors />
    <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-10">
      {/* Mission panel */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Your steps
            </p>
            <ol className="mt-4 space-y-1">
              {STEPS.map((s, i) => {
                const done = reference !== null || i < maxStep;
                const current = !reference && i === step;
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      disabled={!!reference || i > maxStep}
                      onClick={() => goTo(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                        current && "bg-indigo-50 font-semibold text-indigo-900",
                        !current && i <= maxStep && !reference && "hover:bg-slate-50",
                        !current && !done && "text-slate-400",
                      )}
                    >
                      <span
                        className={cn(
                          "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          done && !current && "bg-gradient-to-br from-blue-600 to-fuchsia-600 text-white",
                          current && "bg-indigo-600 text-white",
                          !done && !current && "border-2 border-slate-200",
                        )}
                      >
                        {current && <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/40" />}
                        {done && !current ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                      </span>
                      <span className={cn(done && !current && "text-slate-700")}>{s.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {!reference && (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-gradient-to-br from-[#03041f] to-indigo-950 p-5 text-white"
              >
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-indigo-300">
                  <Info className="h-3.5 w-3.5" /> Why we ask
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">{STEP_TIPS[step]}</p>
              </motion.div>
            </AnimatePresence>
          )}

          <ul className="space-y-2.5 px-1 text-xs text-slate-500">
            <li className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-indigo-500" /> Reviewed only by our internal team
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5 text-indigo-500" /> You can go back and edit any step
            </li>
          </ul>
        </div>
      </aside>

      {/* Form card */}
      <div
        ref={cardRef}
        className="relative scroll-mt-28 overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-[0_30px_80px_-30px_rgba(30,27,75,0.35)] backdrop-blur-md sm:backdrop-blur-xl"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500" />

        {reference ? (
          <Confirmation reference={reference} name={name} />
        ) : (
          <>
            <ProgressHeader step={step} percent={percent} maxStep={maxStep} savedAt={savedAt} onJump={goTo} />

            <div className="px-5 pt-5 sm:px-8">
              <AnimatePresence>
                {restored && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-sm">
                      <span className="text-indigo-900">
                        We've restored your saved draft. Please attach your files again.
                      </span>
                      <span className="flex gap-3">
                        <button type="button" onClick={() => setRestored(false)} className="font-semibold text-indigo-700 hover:underline">
                          Keep this draft
                        </button>
                        <button type="button" onClick={startFresh} className="font-semibold text-slate-500 hover:underline">
                          Start again
                        </button>
                      </span>
                    </div>
                  </motion.div>
                )}
                {cheer && (
                  <motion.div
                    key={cheer}
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    role="status"
                    className="mb-2 flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 px-4 py-3 text-sm font-medium text-white shadow-lg"
                  >
                    <PartyPopper className="h-4 w-4 shrink-0" />
                    {cheer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (isLast) void submit();
                else next();
              }}
              className="px-5 pb-8 pt-4 sm:px-8"
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {step === 0 && <StepApplicant {...stepProps} />}
                  {step === 1 && <StepIdea {...stepProps} />}
                  {step === 2 && <StepStage {...stepProps} />}
                  {step === 3 && <StepRequirements {...stepProps} />}
                  {step === 4 && <StepMaterial {...stepProps} uploads={uploads} setUploads={setUploads} />}
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  disabled={step === 0 || submitting}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 disabled:invisible"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(79,70,229,0.8)] transition-all hover:scale-[1.03] disabled:opacity-80 disabled:hover:scale-100"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {isLast ? (
                    submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Submit your idea
                      </>
                    )
                  ) : (
                    <>
                      Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
    </>
  );
}
