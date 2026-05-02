"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { question: "How do I access my purchased prompts?", answer: "Once your payment is complete, head over to 'My Library' from the navigation bar. You will see all your unlocked prompts there." },
  { question: "Are payments secure?", answer: "Yes. All payments are securely processed through Stripe. We do not store your credit card information on our servers." },
  { question: "Can I sell my own prompts?", answer: "Absolutely! Sign up and navigate to your Dashboard to apply as a seller. Once approved, you can start listing your prompts." },
  { question: "Do you offer refunds?", answer: "Because prompts are digital assets that cannot be 'returned' once revealed, we generally do not offer refunds unless the prompt is proven to be misleading or entirely non-functional." }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white text-center mb-12">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-slate-200">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}