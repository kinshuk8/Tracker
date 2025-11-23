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
        <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl my-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                    What Our Clients Say
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="bg-white dark:bg-black border-slate-200 dark:border-slate-800">


                        <CardHeader className="flex flex-row items-center gap-4">
                            <Image
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}&backgroundColor=e5e7eb`}
                                alt={testimonial.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full"
                            />
                            <div>
                                <CardTitle className="text-base">{testimonial.name}</CardTitle>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-300">&quot;{testimonial.content}&quot;</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
