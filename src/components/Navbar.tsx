"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
[
  {
    "StartLine": 87,
    "EndLine": 94,
    "TargetContent": "                  <DropdownMenuTrigger asChild>\n                    <Avatar className=\"h-9 w-9 cursor-pointer border-2 border-white/20 hover:border-white/40 transition-colors shadow-sm\">\n                      <AvatarImage src={user.image || \"\"} alt={user.name || \"User\"} className=\"object-cover\" />\n                      <AvatarFallback className=\"bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300\">\n                        {user.name?.charAt(0) || \"U\"}\n                      </AvatarFallback>\n                    </Avatar>\n                  </DropdownMenuTrigger>",
    "ReplacementContent": "                  <DropdownMenuTrigger asChild>\n                    <div className=\"outline-none\">\n                        <UserAvatar user={user} className=\"h-9 w-9 border-2 hover:border-white/40 transition-colors\" />\n                    </div>\n                  </DropdownMenuTrigger>",
    "AllowMultiple": false
  },
  {
    "StartLine": 202,
    "EndLine": 205,
    "TargetContent": "                          <Avatar className=\"h-8 w-8\">\n                              <AvatarImage src={user.image || \"\"} />\n                              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>\n                          </Avatar>",
    "ReplacementContent": "                          <UserAvatar user={user} className=\"h-8 w-8\" />",
    "AllowMultiple": false
  }
]
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Menu, ShieldCheck, BookOpen } from "lucide-react";
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
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "@/components/UserAvatar";

const navLinks = [
  { name: "Home", link: "/" },
  { name: "Services", link: "/services" },
  { name: "Courses", link: "/internship/courses" },
  { name: "Careers", link: "/careers" },
  { name: "Contact", link: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <ResizableNavbar>
        {/* Desktop Navbar */}
        <NavBody>
          <Link href="/" className="relative flex-shrink-0 flex items-center gap-2 z-50">
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
          
          <div className="relative flex items-center gap-4 z-50 mr-4">
             {user ? (
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="outline-none">
                        <UserAvatar user={user} className="h-9 w-9 border-2 hover:border-white/40 transition-colors" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-white/20 shadow-2xl p-2 rounded-xl">
                    <DropdownMenuLabel className="font-normal p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground opacity-70">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10 my-1" />
                    <DropdownMenuItem asChild className="focus:bg-black/5 dark:focus:bg-white/10 rounded-lg cursor-pointer">
                      <Link href="/dashboard/profile" className="flex items-center gap-2 py-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-black/5 dark:focus:bg-white/10 rounded-lg cursor-pointer">
                      <Link href="/dashboard/explore" className="flex items-center gap-2 py-2">
                        <BookOpen className="h-4 w-4" />
                        <span>LMS</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild className="focus:bg-black/5 dark:focus:bg-white/10 rounded-lg cursor-pointer">
                        <Link href="/admin" className="flex items-center gap-2 py-2">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Admin Portal</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10 my-1" />
                    <DropdownMenuItem
                      className="focus:bg-red-500/10 focus:text-red-600 text-red-500 rounded-lg cursor-pointer flex items-center gap-2 py-2"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link href="/auth/sign-in">Get Started</Link>
                </Button>
              </div>
            )}
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
            {/* Mobile Dashboard link removed */}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
               {user ? (
                 <div className="flex justify-center w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer w-full justify-start transition-colors outline-none">
                            <UserAvatar user={user} className="h-10 w-10 border-2 border-white/20 shadow-sm" />
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
                            </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" side="top" className="w-[--radix-dropdown-menu-trigger-width] min-w-[240px]">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href="/dashboard/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 w-full">
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href="/dashboard/explore" onClick={() => setIsOpen(false)} className="flex items-center gap-2 w-full">
                            <BookOpen className="h-4 w-4" />
                            <span>LMS</span>
                          </Link>
                        </DropdownMenuItem>
                        {user.role === "admin" && (
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 w-full">
                              <ShieldCheck className="h-4 w-4" />
                              <span>Admin Portal</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
                          onClick={() => {
                              handleSignOut();
                              setIsOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          <span>Sign Out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
               ) : (
                  <Button
                  asChild
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link href="/auth/sign-in">Get Started</Link>
                </Button>
               )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>

      {/* Alternative Mobile Sheet Menu (Hidden, but keeping for reference) */}
      {/* This section caused hydration errors due to ID mismatches. Wrapped in false to prevent rendering but keep code. */}
      {false && (
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
            {/* Mobile Navigation */}
            {mobileMenuOpen && ( // Use mobileMenuOpen state
              <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b p-4 space-y-4 animate-in slide-in-from-top-5">
                {user ? ( // Use user object existence check
                  <>
                    <Link
                      href="/dashboard"
                      className="block text-sm font-medium text-muted-foreground hover:text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                ) : null}
              </div>
            )}
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
          </SheetContent>
        </Sheet>
      </div>
      )}
    </div>
  );
}
