"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Code, Database, BrainCircuit, CheckCircle } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Link from "next/link";
import { motion } from "framer-motion";


const internships = [
  {
    title: "Python Internship",
    icon: <Code className="h-10 w-10 text-blue-500" />,
    description:
      "Our Python internship program takes you from the basics of syntax to advanced concepts like decorators, generators, and context managers. You will work on real-world projects involving data analysis, web scraping, and automation.",
    features: [
      "Core Python & Data Structures",
      "Object-Oriented Programming (OOP)",
      "Web Development with Django/Flask",
      "Data Analysis with Pandas & NumPy",
    ],
    gradient: "from-blue-500 to-purple-600",
  },
  {
    title: "MySQL Internship",
    icon: <Database className="h-10 w-10 text-cyan-500" />,
    description:
      "Master the art of database management. Learn how to design efficient schemas, write complex queries, and optimize database performance for high-load applications.",
    features: [
      "Relational Database Design",
      "Advanced SQL Queries & Joins",
      "Indexing & Performance Tuning",
      "Stored Procedures & Triggers",
    ],
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Agentic AI Internship",
    icon: <BrainCircuit className="h-10 w-10 text-violet-500" />,
    description:
      "Step into the cutting edge of Artificial Intelligence. Learn to build autonomous agents that can reason, plan, and execute tasks. Work with LLMs and modern AI frameworks.",
    features: [
      "Large Language Models (LLMs)",
      "Prompt Engineering & RAG",
      "Building Autonomous Agents",
      "AI Ethics & Safety",
    ],
    gradient: "from-violet-600 to-fuchsia-600",
  },
];

export default function InternshipPage() {
  return (
    <div className="font-sans bg-slate-50 dark:bg-black text-slate-800 dark:text-white min-h-screen flex flex-col">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Internship Programs
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Join our intensive internship programs designed to give you real-world experience and industry-ready skills.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {internships.map((internship, idx) => (
            <motion.div
              key={internship.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="h-full"
            >
              <div className="bg-gray-50 dark:bg-black border border-black/[0.1] dark:border-white/[0.2] rounded-xl p-6 h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                <div className="w-full flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${internship.gradient} bg-opacity-10`}>
                    <div className="bg-white dark:bg-black p-2 rounded-xl">
                      {internship.icon}
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-600 dark:text-white">
                    {internship.title}
                  </h2>
                </div>

                <p className="text-neutral-500 text-sm mt-2 dark:text-neutral-300 flex-grow">
                  {internship.description}
                </p>

                <div className="w-full mt-6 mb-6">
                  <ul className="space-y-3">
                    {internship.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-neutral-500 dark:text-neutral-300">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/[0.1]">
                  <div className="w-full">
                    <HoverBorderGradient
                      containerClassName="rounded-full w-full"
                      as="button"
                      className="dark:bg-black bg-white text-black dark:text-white flex items-center justify-center space-x-2 w-full py-3"
                    >
                      <Link href="/contact" className="w-full h-full flex items-center justify-center">
                        Apply Now
                      </Link>
                    </HoverBorderGradient>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
