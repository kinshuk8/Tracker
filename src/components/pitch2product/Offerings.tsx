"use client";

import { Check, MousePointerClick, Rocket, Presentation } from "lucide-react";
import { GradientText, Reveal, SectionHeading, SpotlightCard } from "./shared";

const OFFERS = [
  {
    level: "1",
    icon: MousePointerClick,
    title: "Prototype",
    tagline: "Perfect for proving your idea actually works.",
    items: ["UI prototype", "Functional prototype", "Proof of concept", "Technical demonstration"],
  },
  {
    level: "2",
    icon: Presentation,
    title: "Investor-Ready MVP",
    tagline: "Built to win over customers, investors and early adopters.",
    items: ["Working core features that people can try", "Code that can be extended later"],
  },
  {
    level: "3",
    icon: Rocket,
    title: "Market-Ready Product",
    tagline: "For validated ideas ready to go live and scale.",
    chips: ["Web", "Mobile", "SaaS", "AI", "Backend systems", "APIs", "Cloud infrastructure", "Admin systems"],
  },
];

export default function Offerings() {
  return (
    <section className="relative bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we offer"
          title={
            <>
              From idea to <GradientText>shipped product.</GradientText>
            </>
          }
          subtitle="Three ways we can help you build. Tell us which one fits in the form."
        />

        <div className="relative mt-16">
          <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-blue-200 via-indigo-400 to-fuchsia-400 lg:block" />
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {OFFERS.map((offer, i) => (
              <Reveal key={offer.title} delay={i * 0.12}>
                <SpotlightCard className="h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30">
                      <offer.icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-semibold tracking-[0.2em] text-slate-400">
                      Option {offer.level}
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-slate-900">{offer.title}</h3>
                  <p className="mt-2 text-slate-600">{offer.tagline}</p>

                  {offer.items && (
                    <ul className="mt-6 space-y-2.5">
                      {offer.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {offer.chips && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {offer.chips.map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-500"
                      style={{ width: `${(i + 1) * 33.3}%` }}
                    />
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
