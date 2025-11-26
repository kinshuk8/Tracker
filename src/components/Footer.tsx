import Link from "next/link";
import { Meteors } from "@/components/ui/meteors";
import { buttonVariants } from "@/components/ui/button";
import {
  Linkedin,
  Instagram,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 text-slate-300 py-16 overflow-hidden">
      {/* Meteors background effect */}
      <Meteors number={20} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 md:gap-12">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className="text-white font-semibold">
                VMK EDGEMIND SOLUTIONS
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Delivering innovative software, networking & IoT solutions for
              modern businesses.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#home"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#solutions"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-neutral-400">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Vijayawada, AP, India</span>
              </li>
              <li className="flex items-start gap-2 text-neutral-400">
                <Mail className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:vmkedgemind@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  vmkedgemind@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-neutral-400">
                <Phone className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+918686854024"
                  className="hover:text-white transition-colors"
                >
                  +91 8686854024
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-2">
              <a
                href="https://www.linkedin.com/company/vmkedgemind-solutions-private-limited/"
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: "text-neutral-400 hover:text-white",
                })}
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/vmkedgemindsolutions/"
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                  className: "text-neutral-400 hover:text-white",
                })}
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {currentYear} VMK EDGEMIND SOLUTIONS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
