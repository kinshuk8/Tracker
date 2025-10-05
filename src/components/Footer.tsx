import Link from "next/link";

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid gap-10 md:grid-cols-4 md:gap-12">
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-blue-600 grid place-items-center text-white font-bold text-sm">
              T
            </span>
            VMK NEXGEN SOLUTIONS
          </h3>
          <p className="text-sm leading-relaxed">
            Delivering innovative software, networking & IoT solutions for
            modern businesses.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#home" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-white">
                Services
              </a>
            </li>
            <li>
              <a href="#solutions" className="hover:text-white">
                Solutions
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 Vijayawada, AP, India</li>
            <li>📧 contact@VMK NEXGEN SOLUTIONS.com</li>
            <li>📞 +91 123 456 789</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4 text-lg">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              in
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              X
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              Ig
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-slate-700 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} VMK NEXGEN SOLUTIONS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
