"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "./ui/button";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { useState } from "react";


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.8,
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const words = [
    { text: "Transform" },
    { text: "Your" },
    { text: "Business" },
    { text: "with" },
    { text: "Innovation", className: "text-blue-600 dark:text-blue-500" },
  ];

  return (
    <div
      id="hero"
      className="h-screen w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* Radial gradient overlay */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      {/* Animated gradient orbs - VISIBLE */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 dark:bg-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Mouse-following gradient halo */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
        }}
      />

      {/* Content */}
      <div className="container relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-4 sm:px-6">
        <TypewriterEffectSmooth words={words} />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center text-center"
        >
          <motion.p
            variants={itemVariants}
            className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base text-neutral-600 dark:text-neutral-300 md:text-xl px-4 sm:px-0"
          >
            Empowering industries with cutting-edge IoT solutions, industrial
            automation, and intelligent technology systems.{" "}
            <span className="font-semibold text-neutral-800 dark:text-white">
              Built for the future.
            </span>
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full"
          >
            <Button
              asChild
              size="lg"
              className="min-w-[160px] rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all hover:scale-105"
            >
              <Link href="/auth/sign-in">Get Started Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[160px] rounded-full border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all hover:scale-105"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-6 sm:mt-8"
          >
            <a href="https://peerlist.io/vmkedgemind/project/vmk-edgemind-solutions-website" target="_blank" rel="noreferrer">
              <img
                src="https://peerlist.io/api/v1/projects/embed/PRJHGNQQDDGBLJK6RCMP86LON6PEBK?showUpvote=true&theme=light"
                alt="VMK EDGEMIND SOLUTIONS WEBSITE"
                style={{ width: 'auto', height: '72px' }}
              />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
