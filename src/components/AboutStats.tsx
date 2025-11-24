import Image from "next/image";
import { Counter } from "@/components/ui/Counter";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const stats = [
  { value: "10+", label: "Projects Completed" },
  { value: "10+", label: "Trusted Clients" },
  { value: "99%", label: "Satisfaction Rate" },
];

export default function AboutStats() {
  const headline = "Driving Innovation with Tailored Tech Solutions.";
  const subheadline =
    "At VMK NEXGEN SOLUTIONS, we empower businesses with bespoke technology strategies. From cutting-edge software development to robust networking and scalable IoT implementations, our expertise delivers measurable impact and unlocks true potential.";

  return (
    <section className="dark:bg-black bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center px-4 sm:px-6 py-20 sm:py-32">
        {/* Left Column: Content */}
        <div className="flex flex-col justify-center">
          <TextGenerateEffect
            words={headline}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-800 dark:text-white !leading-tight"
          />
          <p className="mt-6 text-lg text-neutral-600 dark:text-neutral-300">
            {subheadline}
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-8 sm:gap-12">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-extrabold text-brand-purple">
                  <Counter value={stat.value} />
                </p>
                <p className="mt-1 text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Button
            asChild
            size="lg"
            className="mt-12 w-fit bg-brand-purple hover:bg-brand-purple/90 text-white"
          >
            <Link href="/services">Explore Our Services</Link>
          </Button>
        </div>

        {/* Right Column: Visual */}
        <div className="relative w-full h-80 sm:h-96 lg:h-[450px]">
          <Image
            src="/assets/welcome-image.svg"
            alt="Abstract visualization of data networks and technology"
            fill
            className="object-contain" // <-- FIXED: Use object-contain to show the whole image
          />
        </div>
      </div>
    </section>
  );
}
