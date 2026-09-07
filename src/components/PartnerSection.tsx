"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Tag, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function PartnerSection() {
  const tags = ["Hosting", "Deployment", "Migration", "Technical Support"];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("UCVVMKNEXCND");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-white dark:bg-black">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 translate-x-1/3"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs md:text-sm font-bold tracking-widest text-[#673DE6] dark:text-[#8b65ff] uppercase mb-3 block">
            Our Technology Partners
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#673DE6] to-[#4F46E5]">Digital Journey</span>
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="bg-white dark:bg-slate-900/50 rounded-3xl md:rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(103,61,230,0.05)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Side: Logo & Badge */}
              <div className="lg:col-span-5 relative p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/50 border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(#673DE6_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] dark:opacity-[0.05]" />
                
                <a 
                  href="https://www.hostinger.com/in?REFERRALCODE=UCVVMKNEXCND" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative z-10 w-full max-w-[240px] sm:max-w-[280px] transform transition-transform duration-500 hover:scale-[1.03] active:scale-95 block"
                >
                  <div className="relative w-full aspect-[8/3] rounded-2xl overflow-hidden drop-shadow-xl hover:drop-shadow-2xl transition-all">
                    <Image 
                      src="/assets/Badge_brand_dark_640×240..webp" 
                      alt="Hostinger Partner" 
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
              </div>

              {/* Right Side: Content */}
              <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-white dark:bg-transparent">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Hostinger Partner
                </h3>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-[#673DE6] dark:text-[#8b65ff] mb-4 sm:mb-6">
                  Reliable hosting solutions for your digital journey.
                </p>
                
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 sm:mb-8">
                  We partner with Hostinger to help businesses and individuals build, launch, and manage their online presence with reliable hosting infrastructure and professional technical assistance.
                </p>

                <div className="flex flex-wrap gap-2 md:gap-3 mb-8 sm:mb-10">
                  {tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#673DE6] mr-1.5 sm:mr-2 opacity-70"></span>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-5 items-start xl:items-center mt-auto w-full">
                  <a
                    href="https://www.hostinger.com/in?REFERRALCODE=UCVVMKNEXCND"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full xl:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-bold text-white bg-[#673DE6] hover:bg-[#5b32cc] rounded-full transition-all duration-300 shadow-[0_4px_14px_0_rgba(103,61,230,0.39)] hover:shadow-[0_6px_20px_rgba(103,61,230,0.23)] hover:-translate-y-0.5 group shrink-0"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  
                  <button 
                    onClick={handleCopy}
                    className="w-full xl:w-auto flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-2.5 text-[13px] sm:text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-full font-medium border border-emerald-200/60 dark:border-emerald-800/30 text-center sm:text-left leading-tight cursor-pointer transition-colors duration-200 group"
                    title="Click to copy coupon code"
                    aria-label="Copy coupon code"
                  >
                    <Tag className="w-4 h-4 shrink-0 hidden sm:block" />
                    <span>Use code <strong className="font-bold tracking-wide">UCVVMKNEXCND</strong> for flat 20% off</span>
                    
                    <div className="ml-1 sm:ml-2 flex items-center justify-center bg-emerald-200/50 dark:bg-emerald-800/50 p-1.5 rounded-md group-hover:bg-emerald-300/50 dark:group-hover:bg-emerald-700/50 transition-colors">
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
