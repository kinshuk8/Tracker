"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { } from "lucide-react";
import Logo from "../../public/assets/company-logo.svg";

// Custom authentication components
const AuthComponents = () => {
  return (
    <>
      <SignedOut>
        <Button asChild variant="ghost" className="dark:text-neutral-300">
          <Link href="/sign-in">Login</Link>
        </Button>
        <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
        />
      </SignedIn>
    </>
  );
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "#services" },
  { name: "Solutions", href: "#solutions" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  });

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMobileMenuOpen(false);
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
      setIsMobileMenuOpen(false);
    }
  };

  const navAnimation = {
    top: { y: 0, paddingLeft: "1.5rem", paddingRight: "1.5rem", width: "100%", maxWidth: "1280px", borderRadius: "0px", backgroundColor: "rgba(255, 255, 255, 0)", backdropFilter: "none", boxShadow: "none", border: "1px solid rgba(0, 0, 0, 0)", },
    scrolled: { y: 16, paddingLeft: "1rem", paddingRight: "1rem", width: "auto", maxWidth: "100%", borderRadius: "9999px", backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(12px)", boxShadow: "0 4px_30px rgba(0, 0, 0, 0.1)", border: "1px solid rgba(255, 255, 255, 0.3)", },
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-24 flex items-start justify-center">
      <motion.nav
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        variants={navAnimation}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("relative hidden lg:flex items-center justify-between dark:bg-[rgba(0,0,0,0.8)] dark:border-[rgba(255,255,255,0.1)]")}
      >
        <Link href="/" onClick={(e) => handleSmoothScroll(e, "/")} className="flex items-center gap-3 flex-shrink-0 mr-4">
          <Image src={Logo} alt="Company Logo" width={32} height={32} className="rounded-md" />
          <motion.div className="overflow-hidden" animate={{ width: isScrolled ? 0 : "auto" }} transition={{ duration: 0.4, ease: "easeOut" }}>
            <span className="font-semibold tracking-wide text-lg text-neutral-800 dark:text-white whitespace-nowrap">VMK NEXGEN SOLUTIONS</span>
          </motion.div>
        </Link>
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={(e) => handleSmoothScroll(e, link.href)} className={buttonVariants({ variant: "ghost", className: "dark:text-neutral-300" })}>
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 pl-4 flex-shrink-0">
          <AuthComponents />
        </div>
      </motion.nav>
      {/* TODO: Mobile Navbar... */}
    </header>
  );
}
