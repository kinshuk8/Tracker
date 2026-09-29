import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubmissionWizard from "@/components/pitch2product/wizard/SubmissionWizard";

export const metadata: Metadata = {
  title: "Submit Your Idea | Pitch2Product",
  description:
    "Tell us what you're building. Submit your idea to Pitch2Product and add any supporting material you already have.",
};

export default function SubmitPitchPage() {
  return (
    <div className="font-sans bg-slate-50 text-slate-800">
      <Navbar />
      <main className="relative overflow-hidden pb-24 pt-32 sm:pt-36">
        <div
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(79,70,229,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Fewer, lighter blurred blobs on phones: blur + mix-blend-multiply are costly for
              mobile GPUs, and the extra layers add little on a narrow viewport anyway. */}
          <div className="animate-blob absolute -left-20 top-20 h-72 w-72 rounded-full bg-purple-500/15 blur-2xl mix-blend-multiply sm:h-96 sm:w-96 sm:blur-3xl" />
          <div className="animate-blob animation-delay-2000 absolute -right-20 top-60 hidden h-96 w-96 rounded-full bg-blue-500/15 blur-3xl mix-blend-multiply sm:block" />
          <div className="animate-blob animation-delay-4000 absolute bottom-40 left-1/3 hidden h-80 w-80 rounded-full bg-pink-500/15 blur-3xl mix-blend-multiply sm:block" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center lg:text-left">
            <Link
              href="/pitch2product"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" /> Pitch2Product
            </Link>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Submit your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
                idea
              </span>
            </h1>
            <p className="mt-4 text-lg font-semibold text-indigo-700">
              You bring the idea. We bring the technology.
            </p>
            <p className="mt-3 max-w-2xl text-lg text-slate-600 lg:mx-0 mx-auto">
              Tell us what you want to build. If we see the potential, we&apos;ll explore how we can help you
              take it from idea to a real product.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-slate-500 lg:mx-0 mx-auto">
              Fields marked * are required. We save a draft on this device as you go, but not your files.
            </p>
          </div>

          <SubmissionWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
