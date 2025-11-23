"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";

// Custom authentication components
const AuthComponents = () => {
  return (
    <>
      <SignedOut>
        <div className="flex items-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
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
  { name: "Home", link: "/" },
  { name: "Services", link: "#services" },
  { name: "Solutions", link: "#solutions" },
  { name: "Careers", link: "/careers" },
  { name: "Contact", link: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <ResizableNavbar>
        {/* Desktop Navbar */}
        <NavBody>
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 z-10">
            <Image
              src="/assets/company-logo.svg"
              alt="VMK Edgemind Solutions"
              width={240}
              height={80}
              className="h-28 w-auto object-contain"
              priority
            />
          </Link>
          <NavItems items={navLinks} />
          <div className="flex items-center gap-4">
            <AuthComponents />
          </div>
        </NavBody>

        {/* Mobile Navbar */}
        <MobileNav>
          <MobileNavHeader>
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Image
                src="/assets/company-logo.svg"
                alt="VMK Edgemind Solutions"
                width={200}
                height={60}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>
            <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {navLinks.map((link, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={link.link}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-lg font-medium transition-colors hover:text-brand py-2",
                  pathname === link.link
                    ? "text-brand font-semibold"
                    : "text-slate-600 dark:text-slate-300"
                )}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <AuthComponents />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>

      {/* Alternative Mobile Sheet Menu (Hidden, but keeping for reference) */}
      <div className="hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px] flex flex-col p-0">
            <nav className="flex flex-col items-center justify-center flex-1 gap-2 px-6 py-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.link}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-xl font-medium transition-colors hover:text-brand py-3 px-6 rounded-lg w-full text-center",
                    pathname === link.link
                      ? "text-brand font-semibold bg-blue-50 dark:bg-blue-950/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="border-t border-slate-200 dark:border-slate-800 p-6">
              <div className="flex justify-center">
                <AuthComponents />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
