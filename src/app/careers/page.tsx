"use client";

import Navbar from "@/components/Navbar";
import Careers from "@/components/Careers";
import Footer from "@/components/Footer";

export default function CareersPage() {
    return (
        <div className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen flex flex-col">
            <Navbar />
            <Careers />
            <Footer />
        </div>
    );
}
