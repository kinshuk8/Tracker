
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Cog, Network, Home } from "lucide-react"; // Using lucide-react for consistency

// Updated data structure with consistent properties and placeholders
const services = [
  {
    icon: <Cog className="h-8 w-8 text-brand-purple" />,
    title: "Software Development",
    desc: "End-to-end software solutions tailored to meet unique client requirements and ensure quality.",
    img: "/images/placeholder-dev.png", // Placeholder image path
  },
  {
    icon: <Network className="h-8 w-8 text-brand-purple" />,
    title: "Networking Consultancy",
    desc: "Designing secure, scalable, and efficient network infrastructures for modern businesses.",
    img: "/assets/undraw_server-status.svg", 
  },
  {
    icon: <Home className="h-8 w-8 text-brand-purple" />,
    title: "Smart IoT Solutions",
    desc: "Automated and integrated IoT solutions for homes, industries, and enterprises.",
    img: "/images/placeholder-iot.png", // Placeholder image path
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="dark:bg-black bg-white dark:bg-grid-white/[0.05] bg-grid-black/[0.05] relative"
    >
      {/* Radial gradient for a subtle background effect */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-dark dark:text-white">
            Innovative Technology Solutions
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Delivering customized software, networking, and IoT consultancy for
            businesses of all sizes.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map((card) => (
            <CardContainer key={card.title} className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-full h-auto rounded-xl p-6 border">
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
                  <div className="w-full h-[200px] bg-gray-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                    {/* Your placeholder goes here. You can use an <Image> component once you have images. */}
                    <span className="text-sm text-gray-400 dark:text-zinc-600">
                      Placeholder
                    </span>
                  </div>
                </CardItem>
                <div className="flex justify-end items-center mt-8">
                  <Link href="/services">
                    <CardItem
                      translateZ={20}
                      className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                    >
                      Learn more →
                    </CardItem>
                  </Link>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
