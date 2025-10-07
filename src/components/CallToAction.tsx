import { ContactButton } from "@/components/ui/contact-button";


export default function CallToAction() {
  return (
    <section className="bg-white dark:bg-black w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="relative bg-slate-50 dark:bg-brand-dark/20 rounded-2xl p-8 md:p-12 lg:p-16 overflow-hidden">
          {/* Subtle background pattern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#3f3d56_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
          ></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Text Content */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark dark:text-white">
                Ready to Start Your Project?
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl text-base sm:text-lg">
                Let's talk about how our expertise can help you achieve your goals.
              </p>
            </div>

            {/* Button */}
            <div className="flex-shrink-0">
              <ContactButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}