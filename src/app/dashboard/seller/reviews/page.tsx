"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare, Reply } from "lucide-react";

const mockReviews = [
  { id: 1, prompt: "Senior React Component Architect", customer: "David Chen", rating: 5, date: "2 days ago", comment: "Absolutely brilliant prompt. Saved me hours of boilerplate generation." },
  { id: 2, prompt: "Advanced SEO Blog Generator", customer: "Sarah Jenkins", rating: 4, date: "1 week ago", comment: "Great structure, but I had to tweak the tone parameters slightly for my niche." },
];

export default function SellerReviewsPage() {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Customer Reviews</h1>
        <p className="text-slate-400">Monitor feedback and reply to your buyers.</p>
      </div>

      <div className="grid gap-4">
        {mockReviews.map((review) => (
          <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-bold text-white">{review.prompt}</h3>
                <p className="text-xs text-slate-500">Purchased by <span className="text-slate-300">{review.customer}</span> • {review.date}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                ))}
              </div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 mb-4">
              <p className="text-sm text-slate-300">"{review.comment}"</p>
            </div>
            <div className="flex justify-end">
              <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
                <Reply className="w-4 h-4" /> Reply to Customer
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}