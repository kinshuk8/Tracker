"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const AnimatedSphere = () => {
    const meshRef = useRef<any>(null);

    useFrame((state) => {
        if (meshRef.current) {
            const time = state.clock.getElapsedTime();
            meshRef.current.rotation.x = time * 0.2;
            meshRef.current.rotation.y = time * 0.3;
        }
    });

    return (
        <Sphere args={[1, 100, 200]} scale={2.4} ref={meshRef}>
            <MeshDistortMaterial
                color="#00089f"
                attach="material"
                distort={0.5}
                speed={2}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
};

export default function ThreeDCharacter() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual lead generation logic
        console.log("Lead captured:", email);
        setSubmitted(true);
    };

    return (
        <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/50 rounded-3xl my-12">
            <div className="absolute inset-0 w-full h-full">
                <Canvas>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[2, 5, 2]} intensity={1} />
                    <AnimatedSphere />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>

            <div className="relative z-10 max-w-md w-full p-8 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-brand to-purple-600">
                        Unlock the Future
                    </h2>
                    <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
                        Interact with our AI-driven solutions. Enter your email to get started with a personalized demo.
                    </p>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white/50 dark:bg-black/50"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-white">
                                Get Early Access
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-300">
                            <p className="font-semibold">Thank you!</p>
                            <p className="text-sm">We'll be in touch shortly.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
