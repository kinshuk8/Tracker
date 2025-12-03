import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center px-4 sm:px-6"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
          Let&apos;s Build Something Great Together
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
          Have a project in mind? We&apos;d love to hear from you. Get in touch and let&apos;s discuss how we can help bring your vision to life.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Link href="/contact">Contact Us</Link>
        </Button>
      </motion.div>
    </section>
  );
}