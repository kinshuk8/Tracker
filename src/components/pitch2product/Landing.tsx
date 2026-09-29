"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import Hero from "./Hero";
import Offerings from "./Offerings";
import Collaboration from "./Collaboration";
import Process from "./Process";
import Audience from "./Audience";
import { GradientText, PrimaryCTA, Reveal, gridBackground } from "./shared";
import { track } from "@/lib/pitch2product/analytics";

const IDEA_EXAMPLES = [
  "Stock app for kirana shops",
  "College canteen pre-orders",
  "Clinic appointment booking",
  "Crop prices for farmers",
  "Tuition fee tracker",
  "Attendance app for colleges",
  "GST billing for small shops",
  "Plumber and electrician booking",
  "Delivery van tracking",
  "Invoice reminders",
];

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500"
      style={{ scaleX }}
    />
  );
}

function IdeaMarquee() {
  const row = [...IDEA_EXAMPLES, ...IDEA_EXAMPLES];
  return (
    <div className="relative overflow-hidden border-y border-slate-200 bg-slate-950 py-4">
      <p className="sr-only">Some examples of ideas you could submit:{IDEA_EXAMPLES.join(", ")}.</p>
      <motion.div
        aria-hidden
        className="flex w-max gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em] text-slate-400"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {row.map((idea, i) => (
          <span key={i} className="flex items-center gap-10">
            {idea}
            <span className="text-fuchsia-500">·</span>
          </span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-950 to-transparent" />
    </div>
  );
}

function Statement() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]"
        style={gridBackground("rgba(79,70,229,0.06)")}
      />
      <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          Your idea could be the next big thing. <GradientText>Let&apos;s build it.</GradientText>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
          Pitch2Product helps ambitious founders, students and businesses turn ideas into working products —
          with the technology, expertise and resources to take them forward.
        </p>
      </Reveal>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-[#03041f] py-24 text-center text-white sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_65%)]"
        style={gridBackground("rgba(129,140,248,0.12)")}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-indigo-400/20"
            animate={{ scale: [0.6, 1.2], opacity: [0.6, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
          />
        ))}
        <div className="absolute inset-[30%] rounded-full bg-gradient-to-br from-blue-600/40 to-fuchsia-600/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-3xl px-4 sm:px-6"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-indigo-300">Next step</p>
        <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Your{" "}
          <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
            product idea
          </span>{" "}
          starts here.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
          No deck, no demo, no problem — supporting material is optional.
        </p>
        <div className="mt-10">
          <PrimaryCTA location="closing" />
        </div>
        <p className="mt-6 text-xs text-slate-500">
          Submission does not guarantee selection, investment, funding or development.
        </p>
      </motion.div>
    </section>
  );
}

function MobileStickyCTA() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 700));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 p-3 backdrop-blur-lg lg:hidden"
        >
          <PrimaryCTA location="mobile_sticky" className="w-full py-3.5">
            Submit your idea
          </PrimaryCTA>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Landing() {
  useEffect(() => {
    track("page_view", { page: "pitch2product_landing" });
  }, []);

  return (
    <>
      <ScrollProgress />
      <Hero />
      <IdeaMarquee />
      <Offerings />
      <Collaboration />
      <Process />
      <Statement />
      <Audience />
      <ClosingCTA />
      <MobileStickyCTA />
    </>
  );
}
