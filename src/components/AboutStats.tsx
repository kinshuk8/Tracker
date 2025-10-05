import Image from "next/image";

const AboutStats = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
      <div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-5 sm:mb-6 leading-snug">
          Innovative Technology Consultancy Solutions
        </h2>
        <p className="text-slate-600 leading-relaxed mb-8 sm:mb-10 text-sm sm:text-base">
          At VMK NEXGEN SOLUTIONS, we deliver customized technology solutions,
          specializing in software development, testing, networking, and IoT
          consultancy to empower businesses of all sizes and industries.
        </p>
        <div className="flex gap-12 sm:gap-16">
          <div>
            <p className="text-4xl font-bold text-blue-600">150+</p>
            <p className="mt-2 text-sm uppercase tracking-wide text-slate-500">
              Proven Expertise
            </p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-600">15</p>
            <p className="mt-2 text-sm uppercase tracking-wide text-slate-500">
              Trusted Clients
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1555421689-03ac6361ade1?auto=format&fit=crop&w=1200&q=60"
            alt="consultancy"
            width={1200}
            height={675}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
