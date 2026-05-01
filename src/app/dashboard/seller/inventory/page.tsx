"use client";

import { motion } from "framer-motion";
import { Search, Edit2, Trash2, Plus, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock Data - Fetch from GET /api/seller/prompts
const myPrompts = [
  { id: "1", title: "Senior React Component Architect", category: "Development", price: 9.99, status: "APPROVED", sales: 42 },
  { id: "2", title: "Advanced SEO Blog Generator", category: "Copywriting", price: 4.99, status: "PENDING", sales: 0 },
];

export default function SellerInventoryPage() {
  const router = useRouter();

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">My Prompts</h1>
          <p className="text-slate-400">Manage your published systems and pending submissions.</p>
        </div>
        <button 
          onClick={() => router.push('/create')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all"
        >
          <Plus className="w-5 h-5" /> Create New
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search my prompts..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Prompt Details</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Sales</th>
              <th className="px-6 py-4 font-medium text-right">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {myPrompts.map((item) => (
              <motion.tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-white mb-1">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.category}</div>
                </td>
                <td className="px-6 py-4">
                  {item.status === "APPROVED" ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">PENDING</span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4">{item.sales}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}