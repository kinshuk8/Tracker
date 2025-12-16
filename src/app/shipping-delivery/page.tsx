
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ShippingDelivery() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="space-y-4 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
            <h1 className="text-4xl xs:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Shipping & Delivery Policy
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400">
                Last updated on Dec 17 2025
            </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
          <p className="leading-relaxed mb-6">
            For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only.
          </p>
          <p className="leading-relaxed mb-6">
            Orders are shipped within Not Applicable or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms.
          </p>
          <p className="leading-relaxed mb-6">
            <strong className="text-slate-900 dark:text-white">VMK EDGEMIND SOLUTIONS PRIVATE LIMITED</strong> is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within Not Applicable rom the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
          </p>
          <p className="leading-relaxed mb-6">
            Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration.
          </p>
          <p className="leading-relaxed mb-8">
            For any issues in utilizing our services you may contact our helpdesk on <a href="tel:+918686854024" className="text-blue-600 dark:text-blue-400 hover:underline">8686854024</a> or <a href="mailto:hr@vmkedgemindsolutions.com" className="text-blue-600 dark:text-blue-400 hover:underline">hr@vmkedgemindsolutions.com</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
