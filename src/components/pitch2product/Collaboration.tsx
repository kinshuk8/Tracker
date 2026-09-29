"use client";

import { Briefcase, CalendarClock, Info, PieChart } from "lucide-react";
import { Reveal, SectionHeading, SpotlightCard, gridBackground } from "./shared";

const MODELS = [
  {
    tag: "Model A",
    icon: PieChart,
    title: "Equity / Stake",
    body: "Pitch2Product may contribute technical resources and development capabilities in exchange for an agreed stake/equity interest in the startup/company.",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    tag: "Model B",
    icon: CalendarClock,
    title: "Deferred Development Payment",
    body: "Where an equity arrangement is not suitable or possible, Pitch2Product may consider development with payment deferred until an agreed funding milestone, subject to mutually agreed terms.",
    accent: "from-indigo-500 to-fuchsia-500",
  },
  {
    tag: "Model C",
    icon: Briefcase,
    title: "Conventional Development",
    body: "The founder/business may engage Pitch2Product through a conventional paid development engagement.",
    accent: "from-fuchsia-500 to-pink-500",
  },
];

export default function Collaboration() {
  return (
    <section className="relative overflow-hidden bg-[#03041f] py-20 text-white sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
        style={gridBackground("rgba(129,140,248,0.12)")}
      />
      <div className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-brand/60 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-fuchsia-700/30 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="How we could work together"
          title={
            <>
              Selected Ideas May Unlock a{" "}
              <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
                Different Kind of Engagement
              </span>
            </>
          }
          subtitle={
            <>
              Not every submission follows a standard development path. For ideas with strong potential, real
              commercial viability and a capable founding team, we may explore alternative arrangements — from an
              equity stake to deferred payment.
            </>
          }
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {MODELS.map((model, i) => (
            <Reveal key={model.tag} delay={i * 0.12}>
              <SpotlightCard dark className="h-full">
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${model.accent}`} />
                <div className="flex items-center justify-between pt-3">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-indigo-300">{model.tag}</span>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${model.accent} shadow-lg`}
                  >
                    <model.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h3 className="mt-8 text-2xl font-bold">{model.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{model.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div
            role="note"
            className="mx-auto mt-12 flex max-w-4xl gap-4 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5 sm:p-6"
          >
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div className="space-y-2 text-sm leading-relaxed text-slate-300">
              <p className="font-semibold uppercase tracking-wider text-amber-200">Important</p>
              <p>
                Final development scope, commercial structure, equity/stake, payment schedule, funding conditions
                and other terms are determined only after the 1:1 discussion and are subject to a mutually executed
                agreement.
              </p>
              <p className="font-medium text-white">
                Submission does not guarantee selection, investment, funding or development.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
