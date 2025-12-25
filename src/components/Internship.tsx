"use client";

import Link from "next/link";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Code, BarChart3, Coffee } from "lucide-react";
import { motion } from "framer-motion";


const internships = [
  {
    icon: <BarChart3 className="h-8 w-8 text-brand-purple" />,
    title: "Power BI Internship",
    desc: "Master data visualization and business intelligence—transform raw data into actionable insights.",
    img: "/assets/powerbi_logo.png", 
  },
  {
    icon: <Code className="h-8 w-8 text-brand-purple" />,
    title: "Python Internship",
    desc: "Build a strong software foundation—work on automation, scripting, backend logic, and real-world Python applications.",
    img: "/assets/python_logo.png",
  },
  {
    icon: <Coffee className="h-8 w-8 text-brand-purple" />,
    title: "Java Internship",
    desc: "Comprehensive Java training for building robust, scalable enterprise applications and backend systems.",
    img: "/assets/java_logo.png", 
  },
];

export default function Internship() {
  return (
    <section
      id="internship"
      className="relative bg-white dark:bg-black dark:bg-grid-white/[0.05] bg-grid-black/[0.05]"
    >
      {/* Radial mask for subtle vignette */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-dark dark:text-white">
            Exclusive Internship Programs
          </h2>
          <p className="mt-4 sm:mt-5 text-base sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Learn directly from industry professionals through hands-on, project-driven internships designed to accelerate your career and make your portfolio stand out.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {internships.map((card) => (
            <motion.div
              key={card.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <CardContainer className="inter-var w-full">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border -mt-16">
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-neutral-600 dark:text-white flex items-center gap-3"
                  >
                    {card.icon}
                    {card.title}
                  </CardItem>

                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                  >
                    {card.desc}
                  </CardItem>

                  <CardItem translateZ="100" className="w-full mt-4">
                    <div className="relative w-full h-[220px] rounded-xl overflow-hidden">
                      <Image
                        src={card.img}
                        alt={card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                      />
                    </div>
                  </CardItem>

                  <div className="flex justify-end mt-8">
                    <Link href="/internship/courses">
                      <CardItem
                        translateZ={20}
                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                      >
                        Learn More →
                      </CardItem>
                    </Link>
                  </div>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
