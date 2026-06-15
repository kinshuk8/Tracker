"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Linkedin } from "lucide-react";

export default function CEOMessage() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-slate-50/50 dark:bg-black">
      {/* Background decorations - soft and elegant */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-xs md:text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2 md:mb-3 block">
            Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 md:mb-6">
            Message From The <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Managing Director</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 items-center bg-white/60 dark:bg-white/[0.02] backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-blue-900/5">
          
          {/* Photo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 relative mx-auto w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-full"
          >
            <div className="relative aspect-[4/5] w-full rounded-3xl md:rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 group">
              {/* Soft overlay gradient on the image bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src="/assets/ceokarthik.png"
                alt="V.V.S. Maheedhara Karthik - Managing Director"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 384px, (max-width: 1024px) 448px, 50vw"
                priority
              />
            </div>
            {/* Cute/Premium decorative dots pattern behind image */}
            <div className="absolute -z-10 -top-4 -left-4 md:-top-6 md:-left-6 w-24 h-24 md:w-32 md:h-32 bg-[radial-gradient(#3b82f6_2px,transparent_2px)] [background-size:16px_16px] opacity-20 dark:opacity-40" />
            <div className="absolute -z-10 -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 bg-[radial-gradient(#a855f7_2px,transparent_2px)] [background-size:16px_16px] opacity-20 dark:opacity-40" />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center mt-4 lg:mt-0 lg:pl-10"
          >
            <div className="relative">
              <Quote className="absolute -top-6 -left-2 md:-top-10 md:-left-6 w-16 h-16 md:w-28 md:h-28 text-blue-600/5 dark:text-blue-400/10 -rotate-6" />
              
              <blockquote className="relative z-10 text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-slate-700 dark:text-slate-300 mb-8 md:mb-12 italic px-2 sm:px-0">
                "At VMK Edgemind Solutions, our mission is to deliver world-class software and security services that help organizations innovate, protect, and scale. We believe in combining technology, creativity, and customer-centric thinking to create long-term value."
              </blockquote>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mt-auto w-full px-2 sm:px-0">
              <div className="hidden sm:block w-14 h-[3px] rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="flex-1 flex flex-row items-center justify-between gap-3 w-full">
                <div className="flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    V.V.S. Maheedhara Karthik
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">
                    Managing Director
                  </p>
                </div>
                
                <a 
                  href="https://www.linkedin.com/in/vvsmaheedharakarthik" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center min-w-[40px] w-10 h-10 sm:min-w-[48px] sm:w-12 sm:h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-blue-500/25 shrink-0"
                  aria-label="LinkedIn Profile"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
