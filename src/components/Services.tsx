import Link from "next/link";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { services } from "@/data/services";
import * as LucideIcons from "lucide-react";

export default function Services({ hideViewAll = false }: { hideViewAll?: boolean }) {
  return (
    <section
      id="services"
      className="dark:bg-black bg-white dark:bg-grid-white/[0.05] bg-grid-black/[0.05] relative"
    >
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-dark dark:text-white">
            Innovative Technology Solutions
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Delivering customized software, IoT, and AI solutions for businesses of all sizes.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {(hideViewAll ? services : services.slice(0, 3)).map((service) => {
             // Dynamic Icon Rendering
             const IconComponent = (LucideIcons as any)[service.iconName] || LucideIcons.HelpCircle;

             return (
                <CardContainer key={service.slug} className="inter-var">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-full h-auto rounded-xl p-6 border flex flex-col h-full">
                    <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-neutral-600 dark:text-white flex items-center gap-3"
                    >
                    <IconComponent className="h-8 w-8 text-brand-purple" />
                    {service.title}
                    </CardItem>
                    <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 flex-grow"
                    >
                    {service.shortDescription}
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                    <div className="w-full h-[200px] relative rounded-lg overflow-hidden">
                        <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        />
                    </div>
                    </CardItem>
                    <div className="flex justify-end items-center mt-8">
                    <Link href={`/services/${service.slug}`}>
                        <CardItem
                        translateZ={20}
                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:text-brand-purple transition-colors"
                        >
                        Learn more →
                        </CardItem>
                    </Link>
                    </div>
                </CardBody>
                </CardContainer>
             );
          })}
        </div>
        
        {!hideViewAll && (
            <div className="flex justify-center mt-12">
                <Link href="/services" className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white transition-all duration-200 bg-brand-purple border border-transparent rounded-full hover:bg-brand-purple/90 shadow-lg hover:shadow-xl hover:-translate-y-1">
                    View All Services
                </Link>
            </div>
        )}
      </div>
    </section>
  );
}
