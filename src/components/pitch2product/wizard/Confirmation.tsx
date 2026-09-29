"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Handshake, MessagesSquare, Search } from "lucide-react";
import { toast } from "sonner";

const NEXT_STEPS = [
  { icon: Check, title: "Idea submitted", body: "We've received your submission.", done: true },
  { icon: Search, title: "Review", body: "Our team will read through your idea." },
  { icon: MessagesSquare, title: "1:1 discussion", body: "If it's selected, we'll contact you to set one up." },
  { icon: Handshake, title: "Sign-off & kickstart", body: "Once we agree on scope and commercial structure, development begins." },
];

export default function Confirmation({ reference, name }: { reference: string; name: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the ID. Please write it down instead.");
    }
  };

  return (
    <div className="px-5 py-12 text-center sm:px-10 sm:py-16">
      <div className="relative mx-auto h-28 w-28">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-indigo-400/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.8], opacity: [0.7, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-fuchsia-600 shadow-[0_0_60px_rgba(129,140,248,0.6)]"
        >
          <motion.svg viewBox="0 0 24 24" className="h-12 w-12 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </motion.svg>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
          Submission complete
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {name ? `Thank you, ${name}.` : "Thank you."}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          Your Pitch2Product submission has been received. Please note your Reference ID in case you need to contact us.
        </p>

        <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-fuchsia-50 py-3 pl-6 pr-3">
          <div className="text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Reference ID</p>
            <p className="font-mono text-2xl font-bold tracking-wider text-slate-900">{reference}</p>
          </div>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy Reference ID"
            className="rounded-xl bg-white p-3 text-indigo-600 shadow-sm transition-all hover:scale-105 hover:text-fuchsia-600"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>

      <motion.ol
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mx-auto mt-12 grid max-w-3xl gap-3 text-left sm:grid-cols-2"
      >
        {NEXT_STEPS.map((s, i) => (
          <li
            key={s.title}
            className={`flex gap-3 rounded-xl border p-4 ${
              s.done ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-white"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                s.done ? "bg-emerald-500 text-white" : "bg-indigo-50 text-indigo-600"
              }`}
            >
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                <span className="mr-1.5 font-mono text-xs text-slate-400">0{i + 1}</span>
                {s.title}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">{s.body}</p>
            </div>
          </li>
        ))}
      </motion.ol>

      <p className="mx-auto mt-8 max-w-lg text-xs text-slate-500">
        Submission does not guarantee selection, investment, funding or development.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/pitch2product"
          className="rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 px-7 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
        >
          Back to Pitch2Product
        </Link>
        <Link
          href="/services"
          className="rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-400 hover:text-indigo-700"
        >
          See our services
        </Link>
      </div>
    </div>
  );
}
