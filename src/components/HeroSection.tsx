// components/HeroSection.jsx

"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "./ui/button"; // Adjust path if needed
import { BackgroundBeams } from "./ui/background-beams";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect"; // Import the new component

// --- Animation Variants (for subheading and buttons) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.8, // Delay children to start after typewriter
      staggerChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// --- Main Component ---
export default function HeroSection() {
  // Structure the headline words for the TypewriterEffect component
  const words = [
    { text: "Unlock" },
    { text: "Your" },
    { text: "Team's" },
    { text: "Full" },
    { text: "Potential", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div
      id="hero"
      className="relative flex h-screen min-h-[700px] w-full flex-col items-center justify-center overflow-hidden antialiased md:h-[90vh]"
    >
      <div className="container relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-4">
        <TypewriterEffectSmooth words={words} />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center text-center"
        >
          {/* Animated Subheading */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-base text-slate-600 md:text-xl dark:text-slate-400"
          >
            Streamline projects, enhance collaboration, and track progress
            effortlessly with our intuitive platform.{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Built for modern teams.
            </span>
          </motion.p>

          {/* Animated Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="w-48">
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-48 border-slate-300 dark:border-slate-700"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <BackgroundBeams />
    </div>
  );
}
