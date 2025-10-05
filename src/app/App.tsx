"use client";

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutStats from "../components/AboutStats";
import Services from "../components/Services";
import Solutions from "../components/Solutions";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

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
      <HeroSection />
      <AboutStats />
      <Services />
      <Solutions />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
