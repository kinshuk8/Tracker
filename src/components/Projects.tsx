"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { Badge } from "@/components/ui/badge";

export default function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32 bg-slate-50 dark:bg-black/40 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[6000ms]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 sm:mb-24 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light"
          >
            Discover how we transform visionary ideas into stunning digital realities.
          </motion.p>
        </div>

        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {projects.map((project, index) => (
              <CarouselItem key={project.id} className="pl-4 basis-full">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-1 h-full"
                >
                  <Card className="h-full border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden group flex flex-col lg:flex-row p-4 gap-6 rounded-3xl">
                    {/* Image Section - Left Side */}
                    <div className="relative w-full lg:w-[45%] aspect-square overflow-hidden rounded-2xl shrink-0">
                        <div className="absolute inset-0 bg-slate-200 dark:bg-zinc-800 animate-pulse" /> {/* Skeleton placeholder */}
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          priority={index === 0}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                        
                        {/* Mobile Tag Overlay */}
                        <div className="absolute top-3 right-3 lg:hidden flex flex-wrap gap-2 justify-end">
                            {project.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-white/90 dark:bg-black/90 text-xs backdrop-blur-md shadow-sm">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Content Section - Right Side */}
                    <div className="flex flex-col w-full lg:w-[55%] relative justify-center">
                      <div className="absolute -top-2 -right-2 p-2 opacity-5">
                         <Github className="w-20 h-20 rotate-12" />
                      </div>

                      <div className="flex-grow flex flex-col justify-center">
                        <div className="hidden lg:flex flex-wrap gap-2 mb-4">
                            {project.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="px-2 py-0.5 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/10 text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        
                        <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-slate-900 dark:text-white leading-tight">
                          {project.title}
                        </h3>
                        
                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                          {project.description}
                        </p>
                      </div>

                      <div className="mt-auto">
                        <Button asChild size="lg" className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md rounded-xl group/btn h-11 px-6">
                            <Link href={project.link} className="flex items-center justify-center gap-2">
                            Visit Project
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Custom Navigation */}
          <div className="hidden md:flex justify-center gap-4 mt-12 w-full">
             <CarouselPrevious className="static translate-y-0 translate-x-0 h-12 w-12 border-2 border-slate-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all" />
             <CarouselNext className="static translate-y-0 translate-x-0 h-12 w-12 border-2 border-slate-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
