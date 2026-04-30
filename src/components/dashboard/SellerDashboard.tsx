"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Image as ImageIcon, Clock } from "lucide-react";

export default function SellerDashboard() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("promptforge_token");
    if (!token) return;

    const fetchMyPrompts = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const res = await fetch(`${API_URL}/api/prompts/seller/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setPrompts(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPrompts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Seller Dashboard</h1>
          <p className="text-slate-400">Manage your inventory, update pricing, and track your listings.</p>
        </div>
        <button
          onClick={() => router.push("/create")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]"
        >
          <Plus className="w-5 h-5" /> New Prompt
        </button>
      </div>

      {/* INVENTORY LIST */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md overflow-hidden">
        {prompts.length === 0 ? (
          <div className="text-center py-20 text-slate-400 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-lg font-medium text-slate-300">No prompts listed yet</p>
            <p className="text-sm mt-1">Create your first prompt to start selling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="p-5 font-semibold">Prompt Info</th>
                  <th className="p-5 font-semibold">Category</th>
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold">Price</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {prompts.map((prompt) => (
                  <motion.tr 
                    key={prompt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="p-5 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                        {prompt.imageUrl ? (
                          <img src={prompt.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">{prompt.title}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 
                          {new Date(prompt.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
                        {prompt.category}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                        prompt.status === 'APPROVED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : prompt.status === 'REJECTED'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {prompt.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-5 font-bold text-emerald-400">
                      ${prompt.price.toFixed(2)}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/edit/${prompt.id}`)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}