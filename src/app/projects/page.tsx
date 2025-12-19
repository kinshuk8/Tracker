"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const projects = [
  {
    title: "Artgram – Your Hobby Lobby",
    subtitle: "Creative studio & experience platform",
    description:
      "A full-fledged creative studio website built to showcase workshops, events, and multiple studio locations. The platform highlights hands-on activities, birthday & corporate events, real-time engagement, and seamless navigation across services — crafted to reflect Artgram’s vibrant, community-driven brand.",
    image: "/assets/artgram_thumbnail.png",
    link: "https://artgram.in",
  },
  {
    title: "Ruhi Flavours — Artisan Food Brand Website",
    subtitle: "Modern e-commerce for traditional tastes",
    description:
      "A modern e-commerce website for a traditional food brand, showcasing authentic veg & non-veg pickles, sweets, spices, and homemade products with a clean, premium visual identity.",
    image: "/assets/ruhiflavours_thumbnail.png",
    link: "https://ruhiflavours.com",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pt-24 pb-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900 dark:text-white">
            Our <span className="text-blue-600 dark:text-blue-400">Projects</span>
          </h1>
          <p className="max-w-[700px] text-slate-600 dark:text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Showcasing our best work and the impact we've created for our clients.
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {projects.map((project, index) => (
                <CarouselItem key={index} className="md:basis-full lg:basis-full pl-4">
                  <div className="p-1">
                    <Card className="border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden rounded-3xl">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[500px]">
                            {/* Image Section */}
                          <div className="relative h-[300px] lg:h-full w-full bg-slate-100 dark:bg-slate-800 p-6 flex items-center justify-center overflow-hidden">
                             <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
                                <Image
                                  src={project.image}
                                  alt={project.title}
                                  fill
                                  className="object-cover transition-transform duration-500 hover:scale-105"
                                  priority={index === 0}
                                />
                             </div>
                          </div>

                          {/* Content Section */}
                          <div className="flex flex-col justify-center p-8 lg:p-12 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                                    {project.subtitle}
                                </h3>
                                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                {project.title.split("—")[0].split("–")[0]}
                                </h2>
                            </div>
                            
                            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                              {project.description}
                            </p>
                            
                            <div className="pt-4">
                              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-blue-500/20 shadow-lg">
                                <Link href={project.link} target="_blank" rel="noopener noreferrer">
                                  <Globe className="mr-2 h-5 w-5" />
                                  Visit Website
                                  <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 h-12 w-12 border-slate-200 dark:border-slate-800" />
            <CarouselNext className="hidden md:flex -right-12 h-12 w-12 border-slate-200 dark:border-slate-800" />
          </Carousel>
        </div>
      </div>
    </main>
  );
}
