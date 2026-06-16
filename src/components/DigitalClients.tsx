"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { digitalClients } from '../data/clients';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const DigitalClients = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  );

  return (
    <section id="digital-clients" className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration with slightly different colors */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Digital Marketing Clients</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Our Marketing Clients
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Empowering brands to reach their full potential through strategic digital marketing.
          </p>
        </div>

        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative"
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
        >
          <CarouselContent className="-ml-4">
            {(digitalClients.length > 0 && digitalClients.length < 4 ? [...digitalClients, ...digitalClients] : digitalClients).map((client, index) => (
              <CarouselItem key={`${client.id}-${index}`} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3">
                <Link
                  href={`/clients/${client.id}`}
                  className="flex h-full items-center justify-center py-8 px-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-orange-200 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative w-32 h-20 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default DigitalClients;
