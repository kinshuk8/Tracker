import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="relative py-20 sm:py-24 bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-center px-4">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          Ready to Transform Your Operations?
        </h2>
        <p className="mt-6 text-slate-100 text-base sm:text-lg leading-relaxed">
          Partner with us for tailor-made technology solutions that accelerate
          growth and innovation.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#contact"
            className="px-8 py-3 rounded-full bg-white text-slate-900 font-medium hover:bg-slate-200 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
