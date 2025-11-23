"use client";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutStats from "../components/AboutStats";
import Services from "../components/Services";
import Solutions from "../components/Solutions";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

import dynamic from "next/dynamic";
const WorldGlobe = dynamic(() => import("../components/WorldGlobe"), { ssr: false });

import Projects from "../components/Projects";

import Testimonials from "../components/Testimonials";
import Branches from "../components/Branches";

const LandingPage = () => {
  return (
    <div className="font-sans bg-white text-slate-800">
      {/* Skip link for accessibility */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded shadow-lg"
      >
        Skip to content
      </a>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <HeroSection />
        <WorldGlobe />
        <AboutStats />
        <Services />
        <Solutions />
        <Projects />
        <Testimonials />
        <Branches />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
