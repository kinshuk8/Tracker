"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Handshake, Lightbulb, MessagesSquare } from "lucide-react";
import { GradientText, SectionHeading, gridBackground } from "./shared";

const PHASES = [
  {
    n: "01",
    icon: Lightbulb,
    title: "Idea Submission",
    lead: "Tell us what you're building.",
    body: "Submit your idea and provide any supporting material you already have.",
  },
  {
    n: "02",
    icon: MessagesSquare,
    title: "1:1 Discussion",
    lead: "Only for ideas we select.",
    body: "If selected for further discussion, we'll understand the opportunity, product, users, technical requirements and possible ways to take it forward.",
  },
  {
    n: "03",
    icon: Handshake,
    title: "Sign-off & Kickstart",
    lead: "We agree on the terms in writing.",
    body: "Once both parties agree on the scope and commercial structure, documentation is completed and development begins.",
  },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden bg-slate-50 py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        style={gridBackground("rgba(15,23,42,0.05)")}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From pitch to <GradientText>product, step by step.</GradientText>
            </>
          }
          subtitle="Submitting takes minutes and costs nothing. We review every idea — though not all make the cut."
        />

        <div ref={ref} className="relative mt-16">
          {/* Connector: vertical on mobile, horizontal on desktop */}
          <div className="absolute bottom-0 left-7 top-0 w-0.5 bg-slate-200 lg:bottom-auto lg:left-[16.66%] lg:right-[16.66%] lg:top-7 lg:h-0.5 lg:w-auto">
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-blue-600 via-indigo-500 to-fuchsia-500 lg:hidden"
              style={{ height: fill }}
            />
            <motion.div
              className="hidden h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 lg:block"
              style={{ width: fill }}
            />
          </div>

          <ol className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
            {PHASES.map((phase, i) => (
              <motion.li
                key={phase.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.15 }}
                className="relative flex gap-6 lg:flex-col lg:items-center lg:text-center"
              >
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_8px_30px_-6px_rgba(79,70,229,0.45)] ring-1 ring-indigo-100">
                    <phase.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <span className="font-mono text-5xl font-black text-transparent [-webkit-text-stroke:1.5px_rgb(165,180,252)] lg:mt-6 lg:block">
                      {phase.n}
                    </span>
                    <h3 className="mt-2 text-xl font-bold uppercase tracking-wide text-slate-900">{phase.title}</h3>
                    <p className="mt-1 font-semibold text-indigo-600">{phase.lead}</p>
                    <p className="mt-3 max-w-sm text-slate-600 lg:mx-auto">{phase.body}</p>
                  </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
