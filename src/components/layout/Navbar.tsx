"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, ShoppingCart, LayoutDashboard, Loader2, Trash2, X, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { apiClient } from "@/lib/apiClient";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const { cartItems, removeFromCart, cartTotal } = useCart();

  // ✨ Helper function to check if the current route matches the link
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // ✨ Helper functions for glowing active states AND animated hover lines
  const desktopLinkClass = (path: string) => `relative pb-1 text-sm font-semibold tracking-wide transition-all duration-300 
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-400 after:transition-all after:duration-300
    ${isActive(path)
      ? "text-blue-400 [text-shadow:_0_0_15px_rgba(96,165,250,0.6)] after:w-full" // Active: Text glows, line is full width
      : "text-slate-300 hover:text-white after:w-0 hover:after:w-full"            // Inactive: Line expands on hover
    }`;

  const mobileLinkClass = (path: string) => `block text-lg font-semibold transition-all duration-300 ${isActive(path)
    ? "text-blue-400 [text-shadow:_0_0_15px_rgba(96,165,250,0.6)]" // The Blue Glow
    : "text-slate-300 hover:text-white"
    }`;

  const handleCartCheckout = async () => {
    if (cartItems.length === 0 || !user) return;
    setIsCheckingOut(true);
    try {
      const promptIds = cartItems.map((item: any) => item.id);
      const response = await apiClient.post('/api/orders/checkout-cart', {
        buyerId: user.id,
        promptIds: promptIds,
      }, true);
      if (response.checkoutUrl) window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error("Cart checkout failed", error);
      alert("Failed to initialize cart checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 100) setHidden(true);
    else setHidden(false);
  });

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) setIsCartOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname.startsWith("/dashboard")) return null;

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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={desktopLinkClass("/")}>Home</Link>
          <Link href="/explore" className={desktopLinkClass("/explore")}>Explore</Link>
          <Link href="/about" className={desktopLinkClass("/about")}>About</Link>
          <Link href="/contact" className={desktopLinkClass("/contact")}>Contact</Link>
        </div>

        {/* Actions Container */}
        <div className="flex items-center gap-3 md:gap-6">
          {isLoading ? (
            <div className="w-9 h-9 rounded-full border-2 border-slate-700 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            </div>
          ) : user ? (
            <>
              {/* Desktop-only Library Link */}
              {user.role === "BUYER" && (
                <Link href="/purchases" className={`hidden md:block ${desktopLinkClass("/purchases")}`}>
                  My Library
                </Link>
              )}

              {/* Desktop-only Dashboard Link */}
              {user.role !== "BUYER" ? (
                <Link href="/dashboard" className={`hidden md:flex items-center gap-1.5 ${desktopLinkClass("/dashboard")}`}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              ) : (
                /* CART */
                <div className="relative" ref={cartRef}>
                  <button onClick={() => { setIsCartOpen(!isCartOpen); setIsDropdownOpen(false); setIsMobileMenuOpen(false); }} className="relative p-2 text-slate-300 hover:text-blue-400 transition-colors rounded-full hover:bg-slate-800">
                    <ShoppingCart className="w-6 h-6 md:w-5 md:h-5" />
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
                        className="absolute right-0 top-12 w-[calc(100vw-2rem)] max-w-[320px] md:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-2 cursor-default z-50"
                      >
                        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">Your Cart</h3>
                          <span className="text-xs font-medium text-slate-400">{cartItems.length} items</span>
                        </div>
                        <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1">
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
                                <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 opacity-0 group-hover:opacity-100">
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
                            <button onClick={handleCartCheckout} disabled={isCheckingOut} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2">
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

              {/* PROFILE */}
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsCartOpen(false); }} className={`flex items-center gap-2 hover:opacity-80 transition-all ring-2 ring-transparent hover:ring-blue-500/50 rounded-full ${isActive("/profile") ? "ring-blue-500/80 shadow-[0_0_15px_rgba(96,165,250,0.5)]" : ""}`}>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=User&background=0D1424&color=3B82F6"; }} className="w-9 h-9 rounded-full border-2 border-slate-700 object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 text-slate-400"><User className="w-4 h-4" /></div>
                  )}
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-12 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"><Settings className="w-4 h-4 text-slate-400" /> Profile</Link>
                      <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"><LogOut className="w-4 h-4" /> Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* LOGIN/SIGNUP */
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold tracking-wide text-slate-300 hover:text-white transition-colors">Log In</Link>
              <Link href="/register" className="text-sm font-bold tracking-wide bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_-3px_rgba(37,99,235,0.6)]">Sign Up</Link>
            </div>
          )}

          {/* HAMBURGER BUTTON */}
          <button className="md:hidden p-2 text-slate-300" onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsCartOpen(false); }}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* FULL MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-white/10 px-6 py-4 space-y-4 overflow-hidden absolute top-16 left-0 w-full shadow-2xl"
          >
            {/* Mobile Profile Header */}
            {user && (
              <div className="flex items-center gap-4 pb-4 border-b border-slate-800/50 mb-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=User&background=0D1424&color=3B82F6"; }} className={`w-12 h-12 rounded-full border-2 object-cover ${isActive("/profile") ? "border-blue-500 shadow-[0_0_15px_rgba(96,165,250,0.5)]" : "border-slate-700"}`} />
                ) : (
                  <div className={`w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border-2 text-slate-400 ${isActive("/profile") ? "border-blue-500 shadow-[0_0_15px_rgba(96,165,250,0.5)] text-blue-400" : "border-slate-700"}`}>
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <p className="text-white font-bold">{user.name || "Prompt Crafter"}</p>
                  <Link href="/profile" className="text-blue-500 text-sm font-medium">Manage Account</Link>
                </div>
              </div>
            )}

            {/* Mobile Links */}
            <Link href="/" className={mobileLinkClass("/")}>Home</Link>
            <Link href="/explore" className={mobileLinkClass("/explore")}>Explore</Link>
            {user?.role === "BUYER" && <Link href="/purchases" className={mobileLinkClass("/purchases")}>My Library</Link>}
            {user?.role !== "BUYER" && user && <Link href="/dashboard" className={mobileLinkClass("/dashboard")}>Dashboard</Link>}
            <Link href="/about" className={mobileLinkClass("/about")}>About</Link>
            <Link href="/contact" className={mobileLinkClass("/contact")}>Contact</Link>
            <Link href="/faq" className={mobileLinkClass("/faq")}>FAQ</Link>

            <hr className="border-white/10 mt-2 mb-2" />

            {user ? (
              <button onClick={logout} className="block w-full text-left text-lg font-bold text-red-400 py-2 hover:text-red-300 transition-colors">Logout</button>
            ) : (
              <Link href="/login" className="block text-lg font-bold text-blue-500 py-2 hover:text-blue-400 transition-colors [text-shadow:_0_0_10px_rgba(59,130,246,0.4)]">Log In / Sign Up</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}