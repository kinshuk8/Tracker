"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Rocket, Users, TrendingUp, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CareersPage() {
    return (
        <div className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-background flex flex-col items-center text-center overflow-hidden">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                    
                    <Badge variant="outline" className="mb-6 px-4 py-1 text-sm border-primary/50 text-primary bg-primary/10">
                        We are hiring!
                    </Badge>
                    
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Build the Future With Us
                    </h1>
                    
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join a team of passionate innovators dedicated to transforming the way people learn and grow. We're looking for big thinkers and doers.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="text-lg px-8 h-12 rounded-full shadow-lg shadow-primary/25">
                            <a href="mailto:hr@vmkedgemindsolutions.com">
                                <Mail className="mr-2 h-5 w-5" />
                                Apply via Email
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="text-lg px-8 h-12 rounded-full border-2">
                             <Link href="/internship/courses">
                                View Internships
                             </Link>
                        </Button>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Why Join Us?</h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                                We believe in fostering a culture where creativity meets execution. Here's what makes us different.
                            </p>
                        </div>
                        
                        <div className="grid gap-8 md:grid-cols-3">
                            <Card className="border-none shadow-lg bg-background hover:translate-y-[-5px] transition-transform duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                        <Rocket className="h-6 w-6" />
                                    </div>
                                    <CardTitle>Innovation First</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        We push boundaries and experiment with new technologies. Your ideas matter here, and we give you the freedom to explore them.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-lg bg-background hover:translate-y-[-5px] transition-transform duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <CardTitle>Continuous Growth</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Learning is part of our DNA. We provide resources, mentorship, and opportunities to upskill yourself every single day.
                                    </p>
                                </CardContent>
                            </Card>

                             <Card className="border-none shadow-lg bg-background hover:translate-y-[-5px] transition-transform duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <CardTitle>Collaborative Team</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        We win together. Our diverse team supports one another, ensuring that everyone feels valued and empowered to succeed.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Open Positions / CTA */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Ready to make an impact?</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            We are always looking for talented individuals. Even if you don't see a role that fits, drop us a line.
                        </p>
                         <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-2xl mx-auto">
                            <div className="text-left">
                                <h3 className="font-semibold text-lg">General Application</h3>
                                <p className="text-sm text-muted-foreground">Send your resume and portfolio.</p>
                            </div>
                            <Button asChild className="shrink-0">
                                <a href="mailto:hr@vmkedgemindsolutions.com">
                                    Email HR Team <ArrowRight className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                         <div className="mt-12 pt-8 border-t border-dashed">
                             <p className="text-muted-foreground mb-4">Looking for an internship instead?</p>
                             <Link href="/internship/courses" className="text-primary font-semibold hover:underline inline-flex items-center">
                                Browse Internship Programs <ArrowRight className="ml-1 h-3 w-3" />
                             </Link>
                         </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
