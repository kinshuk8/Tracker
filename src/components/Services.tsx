import { FaCogs, FaNetworkWired, FaHome } from "react-icons/fa";
import Image from "next/image";

const services = [
  {
    icon: <FaCogs className="text-4xl" />,
    title: "Software Development Services",
    desc: "End-to-end software solutions tailored to meet unique client requirements and ensure quality.",
  },
  {
    icon: <FaNetworkWired className="text-4xl" />,
    title: "Networking Consultancy Services",
    desc: "Designing secure, scalable & efficient network infrastructures for businesses.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60",
  },
  {
    icon: <FaHome className="text-4xl" />,
    title: "Smart IoT Solutions",
    desc: "Automated & integrated IoT solutions for homes, industries and enterprises.",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="bg-slate-800 text-white py-20 sm:py-24 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Innovative Technology Solutions
          </h2>
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto text-sm sm:text-base px-1">
            Delivering customized software, networking, and IoT consultancy for
            businesses of all sizes.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((card) => (
            <div
              key={card.title}
              className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-blue-500/60 transition shadow-lg"
            >
              <div className="h-48 overflow-hidden">
                <Image
                  src={card.img}
                  alt={card.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="text-blue-400">{card.icon}</div>
                <h3 className="text-lg font-semibold leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
