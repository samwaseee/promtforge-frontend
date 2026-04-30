"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";

interface FeaturedPromptsProps {
  prompts: any[];
  isLoading: boolean;
}

export default function FeaturedPrompts({ prompts, isLoading }: FeaturedPromptsProps) {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">Trending Prompts</h2>
          <p className="text-slate-400 mt-2">The highest-rated systems this week</p>
        </div>
        <button 
          onClick={() => router.push('/explore')}
          className="hidden md:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          View all <TrendingUp className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
           <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-lg">No prompts available yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <motion.div 
              key={prompt.id} 
              whileHover={{ y: -8 }}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm transition-all hover:bg-slate-800/60 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                    {prompt.aiModel}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md text-xs font-medium border border-yellow-400/20">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    5.0
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-blue-400 transition-colors leading-tight">
                  {prompt.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6 font-light">
                  {prompt.description}
                </p>
              </div>
              
              <div className="flex justify-between items-end pt-4 border-t border-slate-800/50 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    {prompt.seller?.name ? prompt.seller.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm text-slate-300 font-medium">
                    {prompt.seller?.name || "Unknown"}
                  </span>
                </div>
                <div className="text-lg font-bold text-emerald-400">
                  ${prompt.price.toFixed(2)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}