import Solutions from "@/components/Solutions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="pt-24">
        <Solutions />
      </main>
      <Footer />
    </div>
  );
}
