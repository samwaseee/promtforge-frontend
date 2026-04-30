"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // --- Scroll Physics State ---
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  // Track scroll direction to hide/show Navbar
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    // If scrolling down AND past the 100px mark, hide it
    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      // If scrolling up, show it immediately
      setHidden(false);
    }
  });

  // --- Auth State ---
  useEffect(() => {
    const storedUser = localStorage.getItem("promptforge_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    // 1. Clear the local storage keys
    localStorage.removeItem("promptforge_user");
    localStorage.removeItem("promptforge_token");
    
    // 2. Force a hard browser refresh and redirect to the homepage
    window.location.href = "/";
  };

  return (
    <motion.nav
      // Framer Motion Animation Logic
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      
      // Liquid Glass Tailwind Classes
      className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] supports-[backdrop-filter]:bg-slate-950/40"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href={user ? "/explore" : "/"} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:bg-blue-500 transition-colors">
            PF
          </div>
          <span className="text-xl font-bold text-slate-100 tracking-tight">
            Prompt<span className="text-blue-500">Forge</span>
          </span>
        </Link>

        {/* DYNAMIC RIGHT SIDE */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/explore" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Explore
              </Link>
              <Link href="/create" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sell Prompts
              </Link>
              <div className="w-px h-6 bg-slate-800 mx-2"></div>
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover" 
                />
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link 
              href="/"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </motion.nav>
  );
}