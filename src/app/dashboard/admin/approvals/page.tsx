"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ExternalLink, AlertCircle } from "lucide-react";
import { button } from "framer-motion/client";

// Mock Data - In reality, fetch from GET /api/admin/pending-prompts
const mockPending = [
  {
    id: "1",
    title: "Advanced SEO Blog Generator",
    seller: "Alex W.",
    category: "Copywriting",
    price: 4.99,
    submittedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "SQL Schema Architect",
    seller: "Sarah J.",
    category: "Development",
    price: 12.99,
    submittedAt: "5 hours ago",
  }
];

export default function ApprovalQueuePage() {
  const [pending, setPending] = useState(mockPending);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    // In reality: await apiClient.post(`/api/admin/prompts/${id}/${action}`)
    setPending(pending.filter(p => p.id !== id));
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Approval Queue</h1>
        <p className="text-slate-400">Review and approve new prompts before they hit the marketplace.</p>
      </div>

      {pending.length === 0 ? (
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
                    <div className="text-xs text-slate-500">By {item.seller} • Submitted {item.submittedAt}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{item.category}</td>
                  <td className="px-6 py-4 font-mono text-emerald-400">${item.price.toFixed(2)}</td>
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