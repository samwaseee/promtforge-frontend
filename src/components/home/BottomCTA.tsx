"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function BottomCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Successfully subscribed! Check your email for confirmation.");
        setEmail("");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setMessage("Subscription failed. Please try again.");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
        
        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-[2.5rem] px-8 py-20 md:px-16 text-center shadow-2xl"
        >
          <div className="absolute inset-0 pointer-events-none">
            {/* Liquid glass animated blobs */}
            <motion.div 
              animate={{ 
                x: [0, 50, -30, 0], 
                y: [0, -50, 30, 0],
                scale: [1, 1.2, 0.8, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/4 w-[500px] h-[500px] bg-blue-600/30 blur-[100px] rounded-full" 
            />
            <motion.div 
              animate={{ 
                x: [0, -40, 20, 0], 
                y: [0, 40, -20, 0],
                scale: [1, 0.9, 1.1, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 right-1/4 translate-x-1/4 translate-y-1/4 w-[400px] h-[400px] bg-indigo-500/30 blur-[100px] rounded-full" 
            />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to forge better outputs?
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10">
              Whether you want to supercharge your workflow or monetize your prompt engineering skills, PromptForge is your hub.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/explore" 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-black rounded-xl shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                Explore Prompts
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 hover:border-slate-600 transition-all text-center"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </motion.div>

        {/* NEWSLETTER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden bg-slate-900/40 border border-slate-800 rounded-[2.5rem] px-8 py-10 md:px-16 flex flex-col lg:flex-row items-center justify-between backdrop-blur-md shadow-xl"
        >
          <div className="relative z-10 lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
            <h3 className="text-2xl font-bold text-white mb-2">
              Stay in the loop
            </h3>
            <p className="text-slate-400">
              Subscribe to our newsletter for exclusive prompts, AI trends, and platform updates. No spam, ever.
            </p>
          </div>

          <div className="relative z-10 lg:w-1/2 w-full max-w-md lg:max-w-none lg:pl-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_-3px_rgba(37,99,235,0.5)]"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
              {/* Status Messages */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center lg:justify-start gap-2 text-emerald-400 mt-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{message}</span>
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center lg:justify-start gap-2 text-rose-400 mt-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{message}</span>
                </motion.div>
              )}
            </form>
            </div>
        </motion.div>

      </div>
    </section>
  );
}