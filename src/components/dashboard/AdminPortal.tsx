"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";

export default function AdminPortal() {
  const [pendingPrompts, setPendingPrompts] = useState<any[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);

  useEffect(() => {
    const fetchPending = async () => {
      const token = localStorage.getItem("promptforge_token");
      try {
        const res = await fetch("http://localhost:5000/api/prompts/admin/pending", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) setPendingPrompts(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchPending();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const token = localStorage.getItem("promptforge_token");
    try {
      const res = await fetch(`http://localhost:5000/api/prompts/admin/status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setPendingPrompts(prev => prev.filter(p => p.id !== id));
        setSelectedPrompt(null);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 border-b border-slate-800 pb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2">Admin Approval Queue</h1>
        <p className="text-slate-400">Review pending submissions before they go live on the marketplace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COL: The Queue */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400"/> Needs Review ({pendingPrompts.length})
          </h2>
          
          {pendingPrompts.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500">Inbox Zero! No pending prompts.</div>
          ) : (
            pendingPrompts.map(prompt => (
              <div 
                key={prompt.id} 
                onClick={() => setSelectedPrompt(prompt)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPrompt?.id === prompt.id ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}
              >
                <p className="font-bold text-sm text-white truncate">{prompt.title}</p>
                <p className="text-xs text-slate-400 mt-1">By: {prompt.seller.name}</p>
              </div>
            ))
          )}
        </div>

        {/* RIGHT COL: The Review Panel */}
        <div className="lg:col-span-2">
          {selectedPrompt ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-md">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPrompt.title}</h2>
                  <p className="text-sm text-slate-400 mt-1">Seller: {selectedPrompt.seller.email}</p>
                </div>
                <div className="text-xl font-black text-emerald-400">${selectedPrompt.price.toFixed(2)}</div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Public Description</h3>
                  <p className="text-sm text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-800 leading-relaxed">{selectedPrompt.description}</p>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold uppercase text-emerald-500 mb-2 flex items-center gap-2"><Eye className="w-4 h-4" /> Secret Prompt Content</h3>
                  <p className="text-sm text-emerald-100 bg-emerald-950/30 p-4 rounded-lg border border-emerald-900/50 font-mono leading-relaxed whitespace-pre-wrap">{selectedPrompt.promptContent}</p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mt-10 pt-6 border-t border-slate-800">
                <button onClick={() => handleStatusChange(selectedPrompt.id, "APPROVED")} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <CheckCircle className="w-5 h-5" /> Approve & Publish
                </button>
                <button onClick={() => handleStatusChange(selectedPrompt.id, "REJECTED")} className="flex-1 py-3 bg-slate-800 hover:bg-red-600/20 text-slate-300 hover:text-red-400 font-bold border border-slate-700 hover:border-red-500/50 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <XCircle className="w-5 h-5" /> Reject
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 text-slate-500 min-h-[400px]">
              <Eye className="w-12 h-12 mb-4 opacity-50" />
              <p>Select a prompt from the queue to review its contents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}