import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Rocket, TrendingUp, Users, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Careers() {
    return (
        <main className="flex-grow bg-slate-50 dark:bg-slate-950 font-sans">
            {/* Hero Section */}
            <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-black border-b border-slate-100 dark:border-slate-800">
                <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium border-blue-100 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 rounded-full">
                        <Sparkles className="w-3 h-3 mr-2 fill-current" />
                        We are hiring!
                    </Badge>
                    
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white">
                        Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Future</span> With Us
                    </h1>
                    
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join a team of passionate innovators dedicated to transforming the way people learn and grow. We're looking for big thinkers and doers who want to make a real impact.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-blue-500/20">
                            <a 
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=hr@vmkedgemindsolutions.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Apply via Email
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                             <Link href="/internship">
                                View Internships
                             </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Why Join Us?</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg">
                            We believe in fostering a culture where creativity meets execution. Here's what makes us different.
                        </p>
                    </div>
                    
                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow duration-300 h-full">
                            <CardHeader>
                                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-800">
                                    <Rocket className="h-7 w-7" />
                                </div>
                                <CardTitle className="text-xl">Innovation First</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    We push boundaries and experiment with new technologies. Your ideas matter here, and we give you the freedom to explore them and turn them into reality.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow duration-300 h-full">
                            <CardHeader>
                                <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 ring-1 ring-purple-100 dark:ring-purple-800">
                                    <TrendingUp className="h-7 w-7" />
                                </div>
                                <CardTitle className="text-xl">Continuous Growth</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Learning is part of our DNA. We provide resources, mentorship, and opportunities to upskill yourself every single day, helping you reach your full potential.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow duration-300 h-full">
                            <CardHeader>
                                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-100 dark:ring-indigo-800">
                                    <Users className="h-7 w-7" />
                                </div>
                                <CardTitle className="text-xl">Collaborative Team</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    We win together. Our diverse team supports one another, ensuring that everyone feels valued and empowered to succeed. Collaboration is key to our success.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    )
}