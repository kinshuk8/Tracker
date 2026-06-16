import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, CheckCircle } from "lucide-react";
import { clients, digitalClients, technicalClients } from "../../../data/clients";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClientPage({ params }: PageProps) {
  const { id } = await params;
  const allClients = [...clients, ...digitalClients];
  const client = allClients.find((c) => c.id === id);

  if (!client) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-grow pt-32 md:pt-40 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header / Logo section */}
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-40 h-40 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center p-4">
                <Image 
                  src={client.logo} 
                  alt={client.name} 
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-blue-600 bg-blue-100 rounded-full">
                  {client.industry}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {client.name}
                </h1>
                {client.websiteUrl && (
                  <a 
                    href={client.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-1.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Content section */}
            <div className="p-10 flex flex-col md:flex-row gap-12">
              <div className="md:w-2/3">
                <h2 className="text-xl font-bold text-slate-900 mb-4">About the Brand</h2>
                <p className="text-slate-600 leading-relaxed text-lg mb-8">
                  {client.description}
                </p>

                {technicalClients.some(c => c.id === client.id) && (
                  <div className="mt-10">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Technical Partnership</h3>
                    <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                      <Image 
                        src={client.id === "quick-property-services" ? "/assets/ramu.jpg" : "/assets/ceokarthik.png"} 
                        alt="Technical Partnership Agreement" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="md:w-1/3">
                {client.softwareProvided && client.softwareProvided.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Software & Solutions</h2>
                    <ul className="space-y-4">
                      {client.softwareProvided.map((software, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="ml-3 text-slate-700 font-medium">{software}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {client.servicesProvided && client.servicesProvided.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Services Provided</h2>
                    <ul className="space-y-4">
                      {client.servicesProvided.map((service, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="ml-3 text-slate-700 font-medium">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
