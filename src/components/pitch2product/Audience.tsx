"use client";

import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, Rocket } from "lucide-react";
import { GradientText, Reveal, SUBMIT_HREF, SectionHeading, SpotlightCard } from "./shared";
import { track } from "@/lib/pitch2product/analytics";

const TRACKS = [
  {
    type: "STUDENT",
    icon: GraduationCap,
    title: "Students",
    prompt: "Got a college project or startup idea with real potential?",
    listTitle: "How we could help",
    items: ["Prototype", "Technical mentorship", "MVP", "Startup conversion"],
    cta: "Submit as a student",
  },
  {
    type: "FOUNDER",
    icon: Rocket,
    title: "Founders",
    prompt: "Building something — an idea, a prototype, an early-stage startup?",
    listTitle: "We could work on",
    items: [
      "MVP development",
      "AI implementation",
      "Product engineering",
      "Technical architecture",
      "Equity/deferred-payment arrangements",
    ],
    cta: "Submit as a founder",
  },
  {
    type: "BUSINESS_OWNER",
    icon: Building2,
    title: "Businesses",
    prompt: "Got a business problem only technology can solve?",
    listTitle: "We could work on",
    items: ["Automation", "AI integration", "Internal systems", "Customer applications", "Digital transformation"],
    cta: "Submit as a business",
  },
];

export default function Audience() {
  return (
    <section className="relative bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Who can apply?"
          title={
            <>
              Built for <GradientText>builders like you.</GradientText>
            </>
          }
          subtitle="Pick the card that sounds like you — we'll pre-fill the form, and you can always change it later."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {TRACKS.map((t, i) => (
            <Reveal key={t.type} delay={i * 0.12}>
              <SpotlightCard className="flex h-full flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 transition-colors group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-fuchsia-600 group-hover:text-white">
                  <t.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">{t.title}</h3>
                <p className="mt-2 text-slate-600">{t.prompt}</p>
                <p className="mt-2 font-semibold text-indigo-600">Submit it.</p>

                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">{t.listTitle}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {t.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`${SUBMIT_HREF}?type=${t.type}`}
                  onClick={() => track("cta_click", { location: `audience_${t.type.toLowerCase()}` })}
                  className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-indigo-600 transition-colors hover:text-fuchsia-600"
                >
                  {t.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
