"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BottomCTA() {
  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-slate-900/40 border border-slate-800 rounded-[2.5rem] px-8 py-20 md:px-16 text-center backdrop-blur-md shadow-2xl"
        >
          {/* Inner background glow emanating from the top center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/30 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to forge better outputs?
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Whether you want to supercharge your workflow or monetize your prompt engineering skills, PromptForge is your hub.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-600 hover:border-slate-500 transition-all text-center"
              >
                Become a Seller
              </Link>
              <Link 
                href="/explore" 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                Explore Prompts
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}