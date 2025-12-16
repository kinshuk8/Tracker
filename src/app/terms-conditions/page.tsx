
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="space-y-4 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
            <h1 className="text-4xl xs:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Terms & Conditions
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400">
                Last updated on Dec 17 2025
            </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
          <p className="leading-relaxed mb-6">
            For the purpose of these Terms and Conditions, The term &quot;we&quot;, &quot;us&quot;, &quot;our&quot; used anywhere on this page shall mean <strong className="text-slate-900 dark:text-white">VMK EDGEMIND SOLUTIONS PRIVATE LIMITED</strong>, whose registered/operational office is <span className="font-medium text-slate-900 dark:text-white">22-5-8, G2 Harsha Elite Apartment Kunchanapalle Guntur Tadepalle Andhra Pradesh India 522501 Undavalli ANDHRA PRADESH 522501</span> . &quot;you&quot;, &quot;your&quot;, &quot;user&quot;, &quot;visitor&quot; shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
          </p>
          <p className="leading-relaxed mb-4">
            Your use of the website and/or purchase from us are governed by following Terms and Conditions:
          </p>
          <ul className="list-disc pl-6 space-y-4 marker:text-slate-400">
            <li className="pl-2">
              <span className="block mb-1">The content of the pages of this website is subject to change without notice.</span>
            </li>
            <li className="pl-2">
              <span className="block mb-1">Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</span>
            </li>
            <li className="pl-2">
              <span className="block mb-1">Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</span>
            </li>
            <li className="pl-2">
               <span className="block mb-1">Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</span>
            </li>
            <li className="pl-2">
              <span className="block mb-1">All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</span>
            </li>
             <li className="pl-2">
              <span className="block mb-1">Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</span>
            </li>
             <li className="pl-2">
              <span className="block mb-1">From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.</span>
            </li>
             <li className="pl-2">
              <span className="block mb-1">You may not create a link to our website from another website or document without <strong className="text-slate-900 dark:text-white">VMK EDGEMIND SOLUTIONS PRIVATE LIMITED</strong>&apos;s prior written consent.</span>
            </li>
             <li className="pl-2">
              <span className="block mb-1">Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India .</span>
            </li>
             <li className="pl-2">
              <span className="block mb-1">We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time</span>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}
