import ContactUs from "@/components/ContactUs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="font-sans bg-white text-slate-800 pt-32">
      <Navbar />
      <ContactUs />
      <Footer />
    </div>
  );
}