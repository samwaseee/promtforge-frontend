"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient"; // ✨ Import your apiClient

export default function ApprovalQueuePage() {
  const [pending, setPending] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ✨ 1. Fetch real data on component mount
  useEffect(() => {
    const fetchPendingPrompts = async () => {
      try {
        // Adjust this endpoint if your backend route is named differently!
        const data = await apiClient.get('/api/admin/pending-prompts', true);
        setPending(data);
      } catch (err: any) {
        console.error("Error fetching prompts:", err);
        setError("Failed to load pending prompts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingPrompts();
  }, []);

  // ✨ 2. Wire up the actual API call for approve/reject
  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      // Optimistically remove it from the UI immediately for a snappy feel
      setPending((prev) => prev.filter(p => p.id !== id));
      
      // Tell the backend to update the database
      await apiClient.post(`/api/admin/prompts/${id}/${action}`, {}, true);
    } catch (err) {
      console.error(`Failed to ${action} prompt:`, err);
      alert(`Failed to ${action} prompt. Please refresh and try again.`);
      // If it fails, you might want to fetch the list again to restore the UI
    }
  };

  // Helper to safely format dates from the database
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-blue-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Loading pending prompts...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Approval Queue</h1>
        <p className="text-slate-400">Review and approve new prompts before they hit the marketplace.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!error && pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 text-slate-500">
          <CheckCircle className="w-12 h-12 mb-4 text-slate-700" />
          <p>The queue is empty. Great job!</p>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Prompt Details</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {pending.map((item) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white mb-1 flex items-center gap-2">
                      {item.title}
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    </div>
                    {/* Maps to how Prisma typically returns relations (item.seller.name) */}
                    <div className="text-xs text-slate-500">
                      By {item.seller?.name || "Unknown"} • Submitted {formatDate(item.createdAt || item.submittedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{item.category}</td>
                  <td className="px-6 py-4 font-mono text-emerald-400">${Number(item.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors" title="Review Content">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction(item.id, 'reject')}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction(item.id, 'approve')}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
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
  );
}