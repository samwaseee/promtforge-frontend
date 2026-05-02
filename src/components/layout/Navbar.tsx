"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { User as UserIcon, Settings, LogOut, ShoppingCart, LayoutDashboard, Loader2, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { apiClient } from "@/lib/apiClient";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const { cartItems, removeFromCart, cartTotal } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCartCheckout = async () => {
    if (cartItems.length === 0 || !user) return;
    setIsCheckingOut(true);

    try {
      // Create an array of just the prompt IDs to send to your backend
      const promptIds = cartItems.map((item: any) => item.id);

      // Hit a (new) backend endpoint designed for multiple items
      const response = await apiClient.post('/api/orders/checkout-cart', {
        buyerId: user.id,
        promptIds: promptIds,
      }, true);

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    } catch (error) {
      console.error("Cart checkout failed", error);
      alert("Failed to initialize cart checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Scroll Physics
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 100) setHidden(true);
    else setHidden(false);
  });

  // Close dropdowns on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsCartOpen(false);
  }, [pathname]);

  // ✨ UPDATED: Click outside to close both dropdowns safely
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <motion.nav
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white group-hover:bg-blue-500 transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]">PF</div>
          <span className="text-xl font-extrabold text-slate-100 tracking-tight">Prompt<span className="text-blue-500">Forge</span></span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {isLoading ? (
            <div className="w-9 h-9 rounded-full border-2 border-slate-700 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            </div>
          ) : user ? (
            <>
              <Link href="/explore" className="text-sm font-semibold tracking-wide text-slate-300 hover:text-white transition-colors">
                Explore
              </Link>

              {user.role !== "BUYER" ? (
                <Link href="/dashboard" className="text-sm font-semibold tracking-wide text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              ) : (
                /* ✨ NEW: The Cart Dropdown Wrapper */
                <div className="relative" ref={cartRef}>
                  <button
                    onClick={() => {
                      setIsCartOpen(!isCartOpen);
                      setIsDropdownOpen(false); // Close profile if open
                    }}
                    className="relative p-2 text-slate-300 hover:text-blue-400 transition-colors rounded-full hover:bg-slate-800"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-950">
                        {cartItems.length}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isCartOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-2 cursor-default"
                      >
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">Your Cart</h3>
                          <span className="text-xs font-medium text-slate-400">{cartItems.length} items</span>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
                          {cartItems.length === 0 ? (
                            <div className="text-center py-8">
                              <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                              <p className="text-sm text-slate-400">Your cart is empty.</p>
                            </div>
                          ) : (
                            cartItems.map((item: any) => (
                              <div key={item.id} className="flex gap-3 p-2 hover:bg-slate-800/50 rounded-xl transition-colors group">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-slate-200 truncate">{item.title}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{item.category}</span>
                                    <span className="text-sm font-bold text-blue-400">${item.price.toFixed(2)}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        {cartItems.length > 0 && (
                          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm text-slate-400">Total</span>
                              <span className="text-lg font-black text-white">${cartTotal.toFixed(2)}</span>
                            </div>
                            <button
                              onClick={handleCartCheckout}
                              disabled={isCheckingOut}
                              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                              {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                              {isCheckingOut ? "Processing..." : "Checkout Now"}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Profile Dropdown */}
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsCartOpen(false); // Close cart if open
                  }}
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
                        onClick={logout}
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
              <Link href="/login" className="text-sm font-semibold tracking-wide text-slate-300 hover:text-white transition-colors">Log In</Link>
              <Link href="/register" className="text-sm font-bold tracking-wide bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}