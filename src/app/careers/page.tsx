"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CareersPage() {
    return (
        <div className="font-sans bg-white text-slate-800 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-8">
                    <Construction className="w-16 h-16 text-brand" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-6">
                    Join Our Team
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
                    If you are interested, mail us at <a href="mailto:hr@vmkedgemindsolutions.com" className="text-brand font-semibold hover:underline">hr@vmkedgemindsolutions.com</a> with your resume and skills mentioned.
                </p>
                
                <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 w-full max-w-md">
                    <p className="text-slate-600 dark:text-slate-300">
                        Also check for the internships available
                    </p>
                    <Button asChild className="bg-brand hover:bg-brand/90 text-white w-full sm:w-auto">
                        <Link href="/internship/courses">Explore Internships</Link>
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
