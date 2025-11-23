"use client";

import React from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { MapPin } from "lucide-react";

export default function Branches() {
    return (
        <section id="branches" className="py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl my-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                    Our Global Presence
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    We are expanding our reach to serve you better. Visit us at our offices.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900 h-full">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-6 h-6 text-brand" />
                        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
                            Headquarters
                        </p>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Vijayawada, AP, India
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                        Our main innovation hub where it all begins.
                        <br />
                        123 Tech Park
                    </p>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900 h-full">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-6 h-6 text-brand" />
                        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
                            Hyderabad Branch
                        </p>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Hyderabad, Telangana
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                        Serving our enterprise clients in the tech capital.
                        <br />
                        Hitech City
                    </p>
                </BackgroundGradient>

                <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900 h-full">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-6 h-6 text-brand" />
                        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200 font-bold">
                            Bangalore Branch
                        </p>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Bangalore, Karnataka
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                        Our research and development center.
                        <br />
                        Electronic City
                    </p>
                </BackgroundGradient>
            </div>
        </section>
    );
}
