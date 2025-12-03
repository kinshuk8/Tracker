// components/Solutions.tsx

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { CheckCircle } from "lucide-react";

// Data now uses URL-based placeholders that work instantly
const solutions = [
  {
    title: "Networking Expertise",
    desc: "Designing secure, scalable, and highly efficient network infrastructures tailored for diverse business needs, ensuring robust connectivity and performance.",
    img: "/assets/undraw_server-status.svg",
    features: [
      "Scalable Architecture Design",
      "Advanced Security Protocols",
      "Performance Optimization",
    ],
  },
  {
    title: "Automation & IoT Services",
    desc: "Leveraging the power of the Internet of Things with our smart automation solutions to enhance efficiency and comfort for homes, industries, and enterprises.",
    img: "/assets/undraw_chat-with-ai.svg",
    features: [
      "Custom IoT Dashboards",
      "Sensor Integration",
      "Automated Workflow Creation",
    ],
  },
];

export default function Solutions() {
  return (
    <section id="solutions" className="bg-white dark:bg-black w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto text-left sm:text-center mb-8">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-dark dark:text-white">
            Our Core Solutions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-300">
            We build robust, scalable, and effective solutions to solve real-world business problems.
          </p>
        </div>

        <div className="space-y-12 sm:space-y-20">
          {solutions.map((solution, idx) => {
            const isImageFirst = idx % 2 === 0;

            const textVariants: Variants = {
              hidden: { opacity: 0, x: isImageFirst ? -50 : 50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, ease: "easeOut" as any }, // eslint-disable-line @typescript-eslint/no-explicit-any
              },
            };

            const imageVariants: Variants = {
              hidden: { opacity: 0, x: isImageFirst ? 50 : -50 },
              visible: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.6, ease: "easeOut" as any }, // eslint-disable-line @typescript-eslint/no-explicit-any
              },
            };

            return (
              <div
                key={solution.title}
                className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                {/* Text Content Column */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={textVariants}
                  className={`flex flex-col ${
                    isImageFirst ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <h3 className="text-xl sm:text-3xl font-bold text-brand-dark dark:text-white">
                    {solution.title}
                  </h3>
                  <p className="mt-4 text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {solution.desc}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-neutral-700 dark:text-neutral-200">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <HoverBorderGradient
                      containerClassName="rounded-full"
                      as="button"
                      className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                    >
                      <Link href="/contact">Request a Demo</Link>
                    </HoverBorderGradient>
                  </div>
                </motion.div>

                {/* Image Column */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={imageVariants}
                  className={`relative ${
                    isImageFirst ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <div className="relative w-full h-80 sm:h-96 lg:h-[450px] rounded-xl overflow-hidden">
                    <Image
                      src={solution.img}
                      alt={solution.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
