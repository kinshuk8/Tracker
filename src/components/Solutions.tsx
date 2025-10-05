import Image from "next/image";

const solutions = [
  {
    title: "Networking Expertise",
    desc: "Designing secure and scalable network infrastructures for diverse business needs.",
    img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1000&q=60",
  },
  {
    title: "Automation Services",
    desc: "Providing smart IoT solutions that enhance automation in homes and industries for efficiency and comfort.",
    img: "https://images.unsplash.com/photo-1598970605070-bd23a5080b87?auto=format&fit=crop&w=1000&q=60",
  },
];

const Solutions = () => {
  return (
    <section id="solutions" className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-10 sm:mb-14">
        Innovative Solutions
      </h2>
      <div className="space-y-20 sm:space-y-24">
        {solutions.map((row, idx) => {
          const imageFirst = idx % 2 === 0;
          return (
            <div
              key={row.title}
              className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              <div
                className={`aspect-[16/9] rounded-xl overflow-hidden shadow ring-1 ring-slate-200 mb-6 md:mb-0 ${
                  imageFirst ? "md:order-1" : "md:order-2"
                }`}
              >
                <Image
                  src={row.img}
                  alt={row.title}
                  width={1000}
                  height={563} // Maintain aspect ratio for 16/9
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`${imageFirst ? "md:order-2" : "md:order-1"}`}>
                <h3 className="text-2xl font-semibold mb-4">{row.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {row.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Solutions;
