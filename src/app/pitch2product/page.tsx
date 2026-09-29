import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Landing from "@/components/pitch2product/Landing";

const description =
  "Pitch2Product is for people with a software idea who need help turning it into a product. Submitting is free. If your idea is selected, we'll set up a 1:1 discussion about how we could help build it.";

export const metadata: Metadata = {
  title: "Pitch2Product | You Bring the Pitch. We Help Turn It Into a Product.",
  description,
  openGraph: {
    title: "Pitch2Product | You Bring the Pitch. We Help Turn It Into a Product.",
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pitch2Product | You Bring the Pitch. We Help Turn It Into a Product.",
    description,
  },
};

export default function Pitch2ProductPage() {
  return (
    <div className="font-sans bg-white text-slate-800">
      <Navbar />
      <main>
        <Landing />
      </main>
      <Footer />
    </div>
  );
}
