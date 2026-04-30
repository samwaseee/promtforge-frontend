"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { User as UserIcon, Settings, LogOut, ShoppingCart, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll Physics (Hide on scroll down, show on scroll up)
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 100) setHidden(true);
    else setHidden(false);
  });

  // Auth State
  useEffect(() => {
    const storedUser = localStorage.getItem("promptforge_user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
    setIsDropdownOpen(false); // Close dropdown on route change
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("promptforge_user");
    localStorage.removeItem("promptforge_token");
    window.location.href = "/";
  };

  return (
    <motion.nav
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo - Enhanced Typography */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white group-hover:bg-blue-500 transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]">PF</div>
          <span className="text-xl font-extrabold text-slate-100 tracking-tight">Prompt<span className="text-blue-500">Forge</span></span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Premium Typography applied to links */}
              <Link href="/explore" className="text-sm font-semibold tracking-wide text-slate-300 hover:text-white transition-colors">
                Explore
              </Link>
              
              {/* ✨ Conditional Logic: Dashboard for Sellers/Admins, Cart for Buyers */}
              {user.role !== "BUYER" ? (
                <Link href="/dashboard" className="text-sm font-semibold tracking-wide text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              ) : (
                <Link href="/cart" className="relative p-2 text-slate-300 hover:text-blue-400 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="relative ml-2" ref={dropdownRef}>
                {/* Avatar Trigger */}
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity ring-2 ring-transparent hover:ring-blue-500/50 rounded-full"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full border-2 border-slate-700 object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden py-1"
                    >
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <Settings className="w-4 h-4 text-slate-400" /> Profile Management
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              {/* Unauthenticated State */}
              <Link href="/login" className="text-sm font-semibold tracking-wide text-slate-300 hover:text-white transition-colors">Log In</Link>
              <Link href="/register" className="text-sm font-bold tracking-wide bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}