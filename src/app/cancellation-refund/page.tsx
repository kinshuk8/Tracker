
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function CancellationRefund() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="space-y-4 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
            <h1 className="text-4xl xs:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Cancellation & Refund Policy
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400">
                Last updated on Dec 17 2025
            </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
          <p className="leading-relaxed mb-6">
            <strong className="text-slate-900 dark:text-white">VMK EDGEMIND SOLUTIONS PRIVATE LIMITED</strong> believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
          </p>
          <ul className="list-disc pl-6 space-y-4 marker:text-slate-400">
            <li className="pl-2">
              <span className="block mb-1">Cancellations will be considered only if the request is made within 7 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.</span>
            </li>
            <li className="pl-2">
              <span className="block mb-1">VMK EDGEMIND SOLUTIONS PRIVATE LIMITED does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.</span>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
