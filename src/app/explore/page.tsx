"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Plus, Image as ImageIcon, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface Prompt {
  id: string;
  title: string;
  description: string;
  price: number;
  aiModel: string;
  category: string;
  imageUrl?: string;
  seller: { name: string };
  status: string;
}

export default function ExplorePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // --- DATA STATE ---
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FILTER & PAGINATION STATE ---
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // --- INITIALIZE USER ---
  useEffect(() => {
    const storedUser = localStorage.getItem("promptforge_user");
    // If a user exists, set it. If not, do nothing (don't redirect!)
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // --- DEBOUNCE SEARCH ---
  // Wait 500ms after the user stops typing to trigger a search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoading(true);
      try {
        // Build the query string
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "6", // Fetch 6 items per page
        });

        if (debouncedSearch) params.append("search", debouncedSearch);
        if (category) params.append("category", category);
        if (aiModel) params.append("aiModel", aiModel);
        if (sort) params.append("sort", sort);

        // ✨ Use apiClient instead of native fetch!
        // The 'false' indicates this is a public route (no token required)
        const data = await apiClient.get(`/api/prompts?${params.toString()}`, false);

        setPrompts(data.prompts || []);
        setTotalPages(data.totalPages || 1);

      } catch (error) {
        console.error("Failed to fetch prompts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, [debouncedSearch, category, aiModel, sort, page]);

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
            {/* ✨ CONDITION ADDED: Only show if user exists AND is not a BUYER */}
            {user && user.role !== "BUYER" && (
              <button
                onClick={() => router.push("/create")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]"
              >
                <Plus className="w-5 h-5" /> Sell Prompt
              </button>
            )}
          </div>
        </div>

        {/* FILTERS & SEARCH ROW */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search prompts (e.g. Midjourney, Data, Code...)"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500 transition-all focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex gap-4 flex-wrap">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none min-w-[140px]"
            >
              <option value="">All Categories</option>
              <option value="Development">Development</option>
              <option value="Copywriting">Copywriting</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
            </select>

            <select
              value={aiModel}
              onChange={(e) => { setAiModel(e.target.value); setPage(1); }}
              className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none min-w-[140px]"
            >
              <option value="">All Models</option>
              <option value="GPT4">GPT-4</option>
              <option value="CLAUDE">Claude 3</option>
              <option value="GEMINI">Gemini Pro</option>
              <option value="MIDJOURNEY">Midjourney</option>
            </select>

            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none min-w-[140px]"
            >
              <option value="">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* GRID AREA */}
        {isLoading ? (
          /* SKELETON GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-[420px] flex flex-col animate-pulse">
                <div className="w-full h-48 bg-slate-800/50 rounded-xl mb-5" />
                <div className="flex gap-2 mb-4">
                  <div className="h-5 w-20 bg-slate-800/80 rounded" />
                  <div className="h-5 w-16 bg-slate-800/80 rounded" />
                </div>
                <div className="h-6 w-3/4 bg-slate-800/80 rounded mb-3" />
                <div className="h-4 w-full bg-slate-800/50 rounded mb-2" />
                <div className="h-4 w-5/6 bg-slate-800/50 rounded mt-auto" />
                <div className="flex justify-between mt-6 pt-4 border-t border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800/80" />
                    <div className="h-4 w-20 bg-slate-800/50 rounded" />
                  </div>
                  <div className="h-6 w-16 bg-slate-800/80 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : prompts.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-24 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
            <Filter className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <p className="text-lg text-slate-300 font-bold mb-1">No prompts found</p>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { setSearchInput(""); setCategory(""); setAiModel(""); setSort(""); }}
              className="mt-6 text-blue-400 hover:text-blue-300 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* REAL DATA GRID */
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {prompts.map((prompt) => (
                <motion.div
                  key={prompt.id}
                  variants={itemVariants}
                  onClick={() => router.push(`/explore/${prompt.id}`)}
                  className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md transition-all hover:bg-slate-800/60 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] cursor-pointer flex flex-col justify-between min-h-[420px]"
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
                        {prompt.seller?.name ? prompt.seller.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="text-xs text-slate-400">{prompt.seller?.name || 'Unknown'}</span>
                    </div>
                    <div className="text-lg font-black text-emerald-400">${prompt.price.toFixed(2)}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 border-t border-slate-800 pt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-slate-400 font-medium">
                  Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}