"use client";

import { useEffect, useState } from "react";
// ✨ NEW: Imported useRouter and usePathname for URL cleanup
import { useSearchParams, useRouter, usePathname } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, LockOpen, Loader2, Search, ExternalLink, X, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/apiClient";
import { useCart } from "@/context/CartContext"; // Add this if you want to wipe the cart on success!

export default function PurchasesPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { clearCart } = useCart(); // Optional: clears the cart items
  
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✨ NEW: State specifically for the temporary toast
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // ✨ NEW: The Toast Controller
  useEffect(() => {
    if (success === "true") {
      setShowSuccessToast(true);
      clearCart(); // Wipe the cart since they just bought everything

      // 1. Silently remove '?success=true' from the URL without reloading the page
      router.replace(pathname, { scroll: false });

      // 2. Auto-dismiss the toast after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, pathname, router, clearCart]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await apiClient.get('/api/orders/my-purchases', true);
        setPurchases(data);
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const handleCopy = async () => {
    if (!selectedPrompt) return;
    const textToCopy = selectedPrompt.promptText || selectedPrompt.instructions || selectedPrompt.content || "No prompt content found.";
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 relative">
      
      {/* ✨ UPDATED: Stripe Success Banner (Now a disappearing Toast) */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }} // Smooth exit animation
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-emerald-400 font-bold text-lg">Payment Successful!</h2>
                <p className="text-emerald-500/80 text-sm">Your new prompts have been securely added to your library.</p>
              </div>
            </div>
            
            {/* Manual close button just in case they don't want to wait 5 seconds */}
            <button 
              onClick={() => setShowSuccessToast(false)}
              className="p-2 text-emerald-500/60 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">My Library</h1>
        <p className="text-slate-400">Access and manage the AI prompts you've purchased.</p>
      </div>

      {purchases.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center">
          <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Your library is empty</h3>
          <p className="text-slate-400 mb-6">Head over to the marketplace to find your first AI prompt.</p>
          <Link href="/explore" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-colors flex flex-col"
            >
              <div className="aspect-video w-full bg-slate-800 relative shrink-0">
                {order.prompt.imageUrl && (
                  <img src={order.prompt.imageUrl} alt={order.prompt.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                  <LockOpen className="w-3 h-3" /> Unlocked
                </div>
              </div>
              
              <div className="p-5 flex flex-col grow">
                <span className="text-xs font-bold text-blue-400 bg-blue-400/10 w-fit px-2 py-1 rounded uppercase tracking-wider mb-3">
                  {order.prompt.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-1 truncate">{order.prompt.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2 grow">{order.prompt.description}</p>
                
                <button 
                  onClick={() => setSelectedPrompt(order.prompt)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-600 mt-auto"
                >
                  <ExternalLink className="w-4 h-4" /> Reveal Prompt Content
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* The Secret Prompt Modal */}
      <AnimatePresence>
        {selectedPrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPrompt(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()} 
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedPrompt.title}</h3>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                      <LockOpen className="w-3 h-3 text-emerald-400" /> Fully Unlocked
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedPrompt(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto bg-[#0d1117]">
                  <pre className="text-emerald-400/90 font-mono text-sm whitespace-pre-wrap font-medium leading-relaxed">
                    {selectedPrompt.promptText || selectedPrompt.promptContent || selectedPrompt.content || "// No prompt instructions found."}
                  </pre>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                      isCopied 
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" 
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
                    }`}
                  >
                    {isCopied ? (
                      <><Check className="w-4 h-4" /> Copied to Clipboard!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy Prompt</>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}