import { services } from "@/data/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const IconComponent = (LucideIcons as any)[service.iconName] || LucideIcons.HelpCircle;

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 z-0">
             <Image 
                src={service.image} 
                alt="Background" 
                fill 
                className="object-cover opacity-20 blur-sm"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6">
            <Link href="/#services" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
            </Link>
            <div className="max-w-4xl">
                <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-xl mb-6 shadow-2xl border border-white/10">
                    <IconComponent className="w-10 h-10 text-brand-purple" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    {service.title}
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed">
                    {service.shortDescription}
                </p>
            </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Description */}
            <div className="space-y-8">
                <div>
                     <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        About the Service
                     </h2>
                     <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        {service.description}
                     </p>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                        Key Features
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-zinc-900/50 rounded-lg border border-slate-100 dark:border-zinc-800 hover:border-brand-purple/50 transition-colors group">
                                <CheckCircle2 className="w-5 h-5 text-brand-purple shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium text-slate-700 dark:text-slate-200">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-8">
                     <Button size="lg" className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black shadow-lg shadow-slate-900/20 text-lg px-8 h-12 rounded-full">
                         Book a Consultation
                     </Button>
                </div>
            </div>

            {/* Visual/Image */}
            <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple to-pink-500 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl"></div>
                 <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-square lg:aspect-auto lg:h-[600px]">
                     <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                     />
                 </div>
            </div>
        </div>
      </section>
    </div>
  );
}
