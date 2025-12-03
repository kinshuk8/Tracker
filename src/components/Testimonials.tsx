"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "CTO, TechCorp",
        content:
            "VMK Edgemind Solutions transformed our infrastructure. Their IoT implementation saved us 30% in operational costs.",
        avatar: "SJ",
    },
    {
        name: "Michael Chen",
        role: "Director of Operations, BuildSmart",
        content:
            "The industrial automation project was delivered on time and exceeded our expectations. Highly recommended.",
        avatar: "MC",
    },
    {
        name: "Emily Davis",
        role: "Product Manager, HealthPlus",
        content:
            "Their analytics platform gave us insights we never had before. Patient care has improved significantly.",
        avatar: "ED",
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl my-8 sm:my-12">
            <div className="text-center mb-12 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                    What Our Clients Say
                </h2>
                <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Trusted by industry leaders for innovative solutions
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-8">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="bg-white dark:bg-black border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                            <Image
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}&backgroundColor=e5e7eb`}
                                alt={testimonial.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full"
                                unoptimized
                            />
                            <div>
                                <CardTitle className="text-base font-semibold">{testimonial.name}</CardTitle>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                &quot;{testimonial.content}&quot;
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
