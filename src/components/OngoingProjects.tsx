"use client";

import { motion } from "framer-motion";
import CountUp from "@/components/CountUp";
import { Laptop, Megaphone } from "lucide-react";

export default function OngoingProjects() {
  const ongoingStats = [
    { value: 3, label: "Software Projects", icon: Laptop },
    { value: 5, label: "Digital Marketing Projects", icon: Megaphone },
  ];

  return (
    <section className="bg-white dark:bg-black py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#673DE6] dark:text-[#8b65ff] uppercase mb-2 block">
            Current Focus
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            On-going Projects
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {ongoingStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-slate-900/10 hover:bg-white dark:hover:bg-slate-900/30 hover:border-[#673DE6]/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(103,61,230,0.06)] dark:hover:shadow-none"
              >
                {/* Subtle background glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#673DE6]/[0.03] rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 mb-4 rounded-2xl bg-[#673DE6]/10 dark:bg-[#673DE6]/20 flex items-center justify-center text-[#673DE6] dark:text-[#8b65ff] group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
                    <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                  </div>
                  
                  <p className="text-4xl md:text-5xl font-black text-[#673DE6] mb-2 tabular-nums">
                    <CountUp
                      from={0}
                      to={stat.value}
                      separator=","
                      direction="up"
                      duration={1.5}
                    />
                  </p>
                  
                  <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors text-center">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
