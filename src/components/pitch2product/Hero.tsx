"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, FileText, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { Eyebrow, GradientText, PrimaryCTA, gridBackground } from "./shared";
import { track } from "@/lib/pitch2product/analytics";

const IDEA_TYPES = ["an AI product", "a SaaS platform", "a mobile or web app", "your business"];
const STAGE_TICKER = ["Idea", "Prototype", "MVP", "Product"];

function useCycle(length: number, ms: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms]);
  return index;
}

function PitchToProductVisual() {
  const stage = useCycle(STAGE_TICKER.length, 1800);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-fuchsia-500/20 blur-2xl" />

      <div className="relative rounded-[1.75rem] border border-white/60 bg-white/70 p-5 shadow-[0_30px_80px_-30px_rgba(30,27,75,0.45)] backdrop-blur-md sm:p-6 sm:backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
          <span>Sample project</span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> in progress
          </span>
        </div>

        {/* Pitch input */}
        <motion.div
          initial={{ opacity: 0, x: -20, rotate: -4 }}
          animate={{ opacity: 1, x: 0, rotate: -2 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative w-[78%] rounded-xl border border-slate-200 bg-white p-4 shadow-md"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700">your-idea.pptx</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-4/5 rounded-full bg-slate-200" />
            <div className="h-2 w-3/5 rounded-full bg-slate-200" />
            <div className="h-2 w-2/3 rounded-full bg-slate-100" />
          </div>
          <div className="absolute -right-3 -top-3 rotate-6 rounded-md bg-yellow-200 px-2 py-1 font-mono text-[10px] text-yellow-900 shadow">
            first draft
          </div>
        </motion.div>

        {/* Core */}
        <div className="relative my-3 flex h-24 items-center justify-center">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-amber-300 via-indigo-500 to-blue-500" />
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.9)]"
              initial={{ top: "0%", opacity: 0 }}
              animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
            />
          ))}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600 font-mono text-xs font-bold text-white shadow-[0_0_40px_rgba(99,102,241,0.6)]"
          >
            P2P
            <span className="absolute inset-0 animate-ping rounded-2xl border border-indigo-400/60" />
          </motion.div>
        </div>

        {/* Product output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="ml-auto w-[88%] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="ml-2 truncate font-mono text-[10px] text-slate-400">yourproduct.app/dashboard</span>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            {["Login", "Payments", "Reports"].map((label, i) => (
              <div key={label} className="rounded-lg bg-slate-50 p-2">
                <div className="text-[9px] uppercase tracking-wider text-slate-400">{label}</div>
                <div className="text-sm font-bold text-slate-800">{["Done", "Done", "Next"][i]}</div>
              </div>
            ))}
          </div>
          <div className="flex h-16 items-end gap-1.5 px-3 pb-3">
            {[40, 55, 35, 70, 60, 85, 75, 95].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-blue-600 to-fuchsia-500"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, delay: 0.9 + i * 0.08 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Stage ticker */}
        <div className="mt-5 grid grid-cols-4 gap-1.5" aria-hidden>
          {STAGE_TICKER.map((s, i) => (
            <div key={s} className="relative overflow-hidden rounded-full bg-slate-100 px-2 py-1.5 text-center">
              {i <= stage && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === stage ? 1 : 0.25 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span
                className={`relative font-mono text-[10px] font-semibold uppercase tracking-wider ${
                  i === stage ? "text-white" : "text-slate-500"
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const idea = useCycle(IDEA_TYPES.length, 2200);

  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-36 sm:pt-40 lg:pb-28">
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        style={gridBackground("rgba(79,70,229,0.07)")}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Fewer, lighter blurred blobs on phones: blur + mix-blend-multiply are costly for
            mobile GPUs, and the extra layers add little on a narrow viewport anyway. */}
        <div className="animate-blob absolute left-[10%] top-24 h-64 w-64 rounded-full bg-purple-500/20 blur-2xl mix-blend-multiply sm:h-80 sm:w-80 sm:blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute right-[8%] top-40 hidden h-96 w-96 rounded-full bg-blue-500/20 blur-3xl mix-blend-multiply sm:block" />
        <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 hidden h-80 w-80 rounded-full bg-pink-500/20 blur-3xl mix-blend-multiply sm:block" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:px-8">
        <div className="text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Eyebrow>Pitch2Product · Now accepting ideas</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] xl:text-6xl"
          >
            You Bring the Pitch.
            <br />
            We Help You Build the <GradientText>Product.</GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 text-lg font-medium text-slate-800 sm:text-xl"
          >
            Have a great idea for{" "}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={IDEA_TYPES[idea]}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                  transition={{ duration: 0.35 }}
                  className="inline-block font-bold text-indigo-600"
                >
                  {IDEA_TYPES[idea]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="block text-slate-600">but no technical team to build it?</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg lg:mx-0"
          >
            We spot promising ideas and help the founders, students and businesses behind them go from a rough
            concept to a prototype, an MVP, or a fully-fledged product.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <PrimaryCTA location="hero" />
            <a
              href="#how-it-works"
              onClick={() => track("cta_click", { location: "hero_how_it_works" })}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-slate-800 backdrop-blur transition-all hover:scale-[1.03] hover:border-indigo-400 hover:text-indigo-700"
            >
              <Layers className="h-4 w-4" /> How it works
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-600 lg:justify-start"
          >
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-fuchsia-500" /> Always free to submit
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" /> 5 quick steps, ~10 minutes
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" /> Selective — only the best make it
            </li>
          </motion.ul>
        </div>

        <PitchToProductVisual />
      </div>
    </section>
  );
}
