"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Plus, Image as ImageIcon } from "lucide-react";

interface Prompt {
  id: string;
  title: string;
  description: string;
  price: number;
  aiModel: string;
  category: string;
  imageUrl?: string; // <-- Added this field
  seller: { name: string };
}

export default function ExplorePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("promptforge_user");
    if (!storedUser) { router.push("/"); return; }
    setUser(JSON.parse(storedUser));

    const fetchPrompts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prompts");
        if (res.ok) {
          const data = await res.json();
          // Adjust based on your backend response format (whether it's data or data.prompts)
          setPrompts(data.prompts || data);
        }
      } catch (error) { console.error("Failed to fetch prompts:", error); }
      finally { setIsLoading(false); }
    };
    fetchPrompts();
  }, [router]);

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Explore Marketplace</h1>
            <p className="text-slate-400">Discover premium AI systems engineered by the community.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button
              onClick={() => router.push("/create")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]"
            >
              <Plus className="w-5 h-5" /> Sell Prompt
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-10 max-w-xl">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search prompts (e.g. Midjourney, Data, Code...)"
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-all focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* GRID */}
        {prompts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
            <p className="text-slate-400">No prompts found.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {prompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                variants={itemVariants}
                onClick={() => router.push(`/explore/${prompt.id}`)}
                className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md transition-all hover:bg-slate-800/60 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] cursor-pointer flex flex-col justify-between"
              >
                <div>
                  
                  {/* THE IMAGE BLOCK */}
                  <div className="w-full h-48 mb-5 overflow-hidden rounded-xl bg-slate-950/50 border border-slate-800/50 relative">
                    {prompt.imageUrl ? (
                      <img 
                        src={prompt.imageUrl} 
                        alt={prompt.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-900/50">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs font-semibold uppercase tracking-wider opacity-50">No Preview</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                      {prompt.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-slate-950 text-blue-400 rounded-md border border-blue-900/50">
                      {prompt.aiModel}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{prompt.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                    {prompt.description}
                  </p>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-auto">
                   <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-slate-700">
                      {prompt.seller.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-slate-400">{prompt.seller.name}</span>
                  </div>
                  <div className="text-lg font-black text-emerald-400">${prompt.price.toFixed(2)}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}