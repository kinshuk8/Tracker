// components/ui/contact-button.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const ContactButton = () => {
  return (
    <Link
      href="/contact"
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3 font-semibold text-white transition-all duration-300"
    >
      {/* Background Gradient */}
      <motion.span
        className="absolute inset-0 h-full w-full bg-gradient-to-r from-indigo-600 to-violet-600"
        initial={{ scale: 10, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Glow Effect on Hover */}
      <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-500 ease-out group-hover:translate-x-[-9rem]" />

      {/* Text and Icon */}
      <span className="relative flex items-center space-x-2">
        <span>Contact Us</span>
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
};