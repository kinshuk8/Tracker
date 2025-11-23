"use client";

import React from "react";
import { MapPin, Building2, Users } from "lucide-react";

const branches = [
    {
        title: "Headquarters",
        location: "Vijayawada, AP",
        country: "India",
        description: "Our main innovation hub and headquarters",
        address: "123 Tech Park, Vijayawada",
        icon: Building2,
    },
    {
        title: "Hyderabad Office",
        location: "Hyderabad, Telangana",
        country: "India",
        description: "Enterprise solutions and client services",
        address: "Hitech City, Hyderabad",
        icon: Users,
    },
    {
        title: "Bangalore R&D",
        location: "Bangalore, Karnataka",
        country: "India",
        description: "Research and development center",
        address: "Electronic City, Bangalore",
        icon: Building2,
    },
];

export default function Branches() {
    return (
        <section id="branches" className="py-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                    Our Global Presence
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Expanding our reach to serve you better across multiple locations
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                {branches.map((branch, index) => {
                    const Icon = branch.icon;
                    return (
                        <div
                            key={index}
                            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500"
                        >
                            {/* Icon */}
                            <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                <Icon className="w-7 h-7" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {branch.title}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-400">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {branch.location}, {branch.country}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {branch.description}
                            </p>

                            {/* Address */}
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                {branch.address}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
