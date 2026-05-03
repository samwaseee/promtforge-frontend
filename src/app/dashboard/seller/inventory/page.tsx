"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Edit2, Trash2, Plus, Eye, Loader2, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SellerInventoryPage() {
  const router = useRouter();
  const [myPrompts, setMyPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const token = localStorage.getItem("promptforge_token");
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const res = await fetch(`${API_URL}/api/seller/my-prompts`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        console.log("Fetched My Prompts:", data);
        setMyPrompts(data.prompts || []);
      } catch (err) {
        console.error("Failed to fetch prompts");
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  if (loading) return <div className="text-slate-900 dark:text-white text-center mt-20"><Loader2 className="animate-spin mx-auto w-10 h-10" /></div>;

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto transition-colors duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">My Prompts</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your published systems and pending submissions.</p>
        </div>
        <button
          onClick={() => router.push('/create')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all"
        >
          <Plus className="w-5 h-5" /> Create New
        </button>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl backdrop-blur-md overflow-hidden shadow-sm dark:shadow-none transition-colors">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Prompt Details</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Sales</th>
              <th className="px-6 py-4 font-medium text-right">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
            {Array.isArray(myPrompts) && myPrompts.length > 0 ? (
              myPrompts.map((item: any) => (
                <motion.tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white mb-1">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.status === "APPROVED" ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">LIVE</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">PENDING</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{item.sales}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button 
                        onClick={() => router.push(`/edit/${item.id}`)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No prompts found. Create your first one to get started!
                </td>
              </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}