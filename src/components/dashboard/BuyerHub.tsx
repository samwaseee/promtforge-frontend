"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, LockKeyhole, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BuyerHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("vault");
  
  // This will eventually be populated by a fetch to /api/orders/me
  const [purchases, setPurchases] = useState<any[]>([]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">My Account</h1>
          <p className="text-slate-400">Access your purchased systems and manage your profile.</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-6 mb-8 border-b border-slate-800">
        <button 
          onClick={() => setActiveTab("vault")}
          className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === "vault" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-300"}`}
        >
          <div className="flex items-center gap-2"><LockKeyhole className="w-4 h-4" /> The Vault</div>
        </button>
        <button 
          onClick={() => setActiveTab("profile")}
          className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === "profile" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-slate-300"}`}
        >
          <div className="flex items-center gap-2"><Settings className="w-4 h-4" /> Profile Settings</div>
        </button>
      </div>

      {/* VAULT CONTENT */}
      {activeTab === "vault" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Purchased Prompts</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search vault..."
                className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-blue-500 transition-all focus:outline-none"
              />
            </div>
          </div>

          {purchases.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center backdrop-blur-md">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockKeyhole className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Your vault is empty</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">You haven't purchased any AI systems yet. Browse the marketplace to find premium prompts.</p>
              <button 
                onClick={() => router.push("/explore")}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                Explore Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Maps over purchases when API is ready */}
            </div>
          )}
        </motion.div>
      )}

      {/* PROFILE CONTENT */}
      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-6">Account Details</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-slate-400">
                <User className="w-8 h-8" />
              </div>
              <button className="text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-700">
                Change Avatar
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Display Name</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all" defaultValue="Current User" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                <input type="email" disabled className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed" defaultValue="user@example.com" />
                <p className="text-xs text-slate-500 mt-1">Emails are managed via your authentication provider.</p>
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}