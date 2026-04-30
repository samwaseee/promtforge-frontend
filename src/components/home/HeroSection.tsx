"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface HeroProps {
  user: any;
  isAuthLoaded: boolean;
  onLogin: () => void;
  isLoggingIn: boolean;
}

export default function HeroSection({ user, isAuthLoaded, onLogin, isLoggingIn }: HeroProps) {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center max-w-3xl mb-24 space-y-8">

      <motion.div variants={itemVariants} className="relative inline-flex items-center justify-center">
        {/* Professional Asymmetric Pulse (Expand -> Wait -> Fast Snap) - Blue Theme */}
        <motion.div
          animate={{
            scale: [1, 1.03, 1.03, 1],
            boxShadow: [
              "0 0 0px rgba(59, 130, 246, 0)",       // State 1: Start invisible
              "0 0 20px rgba(59, 130, 246, 0.6)",    // State 2: Outward pulse reaches peak
              "0 0 15px rgba(59, 130, 246, 0.3)",    // State 3: The Wait (glow softens slightly)
              "0 0 0px rgba(59, 130, 246, 0)"        // State 4: Fast inward snap
            ]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            // The secret to professional UI pacing:
            times: [0, 0.4, 0.85, 1]
          }}
          className="relative inline-flex items-center px-5 py-1.5 rounded-full bg-slate-900 border border-blue-500/50 text-blue-400 text-sm font-bold backdrop-blur-md"
        >
          Marketplace Live
        </motion.div>
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight">
        Master the <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
          Machine Whisper.
        </span>
      </motion.h1>

      <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
        The premium marketplace for discovering, buying, and selling highly-engineered AI prompts for GPT-4, Claude, and Midjourney.
      </motion.p>

      <motion.div variants={itemVariants} className="pt-4 min-h-[80px] flex items-center justify-center">
        {!isAuthLoaded ? (
          <div className="w-8 h-8 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
        ) : user ? (
          <button
            onClick={() => router.push("/explore")}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] transition-all duration-300"
          >
            <span>Enter Marketplace</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onLogin}
            disabled={isLoggingIn}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoggingIn ? (
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            <span>{isLoggingIn ? "Authenticating..." : "Continue with Google"}</span>
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}