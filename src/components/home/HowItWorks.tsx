"use client";

import { motion } from "framer-motion";
import { Search, Zap, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-6 h-6 text-blue-400" />,
      title: "1. Discover Vetted Prompts",
      description: "Browse our marketplace of highly-engineered prompts. Every submission is manually reviewed by our admins for quality and reliability."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "2. Instant Integration",
      description: "Purchase and instantly unlock the raw prompt text, parameter guidelines, and system instructions. No waiting, no friction."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "3. Secure & Guaranteed",
      description: "Payments are processed securely. If a prompt doesn't perform as advertised, our buyer protection ensures you get your money back."
    }
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Engineered for Results</h2>
          <p className="mt-4 text-lg text-slate-400">Stop wasting tokens on trial and error. Buy the exact instructions you need.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-md hover:border-slate-700 transition-colors"
            >
              <div className="bg-slate-800/50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}