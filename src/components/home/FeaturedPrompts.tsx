"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const LOADING_MESSAGES = [
  "Analyzing trending systems...",
  "Fetching top-rated prompts...",
  "Calibrating 3D carousel...",
  "Almost ready..."
];

export default function FeaturedPrompts() {
  const router = useRouter();
  
  // --- STATE ---
  const [prompts, setPrompts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchTrendingPrompts = async () => {
      try {
        // Fetch a limited number of prompts for the carousel (e.g., top 5)
        const data = await apiClient.get('/api/prompts?limit=5', false);
        setPrompts(data.prompts || data);
      } catch (error) {
        console.error("Failed to fetch trending prompts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingPrompts();
  }, []);

  // --- ROTATING LOADING MESSAGES ---
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000); // Change message every 2 seconds
    
    return () => clearInterval(interval);
  }, [isLoading]);

  // --- CAROUSEL CONTROLS ---
  const handleNext = () => {
    if (prompts.length > 0) {
      setCurrentIndex(prev => (prev + 1) % prompts.length);
    }
  };

  const handlePrev = () => {
    if (prompts.length > 0) {
      setCurrentIndex(prev => (prev - 1 + prompts.length) % prompts.length);
    }
  };

  return (
    <section className="relative w-full mb-24 flex flex-col items-center">
      
      {/* HEADER AREA WITH SIMPLE BUTTON */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">Trending Prompts</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">
            Swipe through the highest-rated systems
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/explore')}
          className="group flex items-center gap-2 px-6 py-3 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 hover:border-blue-500 rounded-xl font-bold transition-all w-max"
        >
          View All Prompts <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 3D CAROUSEL CONTAINER */}
      {isLoading ? (
        
        // ==========================================
        // 3D SKELETON LOADER
        // ==========================================
        <div className="relative w-full max-w-6xl h-[450px] flex flex-col items-center justify-center perspective-[1200px] overflow-hidden">
          
          {/* Animated Loading Text */}
          <div className="absolute top-0 z-50 h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={loadingMsgIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-blue-400 font-bold tracking-wide"
              >
                {LOADING_MESSAGES[loadingMsgIdx]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="relative w-[300px] h-[380px] md:w-[340px] md:h-[420px] mt-8">
            {/* Render exactly 3 skeleton cards to fake the 3D effect */}
            {[0, 1, -1].map((offset, idx) => {
              const absOffset = Math.abs(offset);
              return (
                <motion.div
                  key={`skeleton-${idx}`}
                  animate={{
                    x: offset * 180,
                    scale: 1 - absOffset * 0.15,
                    zIndex: 10 - absOffset,
                    rotateY: offset * -15,
                    opacity: 1 - absOffset * 0.15,
                    filter: absOffset > 0 ? `blur(${absOffset * 3}px)` : "blur(0px)",
                  }}
                className="absolute top-0 left-0 w-full h-full bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
                >
                  <div className="animate-pulse">
                    {/* Image Skeleton */}
                    <div className="w-full h-32 md:h-36 mb-4 rounded-xl bg-slate-200 dark:bg-slate-800/50" />
                    
                    {/* Badges Skeleton */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-16 h-5 bg-slate-300 dark:bg-slate-800/80 rounded" />
                      <div className="w-10 h-4 bg-slate-300 dark:bg-slate-800/80 rounded" />
                    </div>

                    {/* Text Skeleton */}
                    <div className="w-3/4 h-6 bg-slate-300 dark:bg-slate-800/80 rounded mb-4" />
                    <div className="w-full h-4 bg-slate-200 dark:bg-slate-800/50 rounded mb-2" />
                    <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800/50 rounded" />
                  </div>
                  
                  {/* Footer Skeleton */}
                  <div className="flex justify-between items-end pt-3 border-t border-slate-200 dark:border-slate-800/50 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-800/80" />
                      <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800/50 rounded" />
                    </div>
                    <div className="w-16 h-6 bg-slate-300 dark:bg-slate-800/80 rounded" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      ) : prompts.length === 0 ? (
        
        // ==========================================
        // EMPTY STATE
        // ==========================================
        <div className="text-center py-16 text-slate-600 dark:text-slate-400 w-full h-[400px] flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
          No prompts available yet.
        </div>
        
      ) : (

        // ==========================================
        // REAL 3D CAROUSEL
        // ==========================================
        <div className="relative w-full max-w-6xl h-[450px] flex items-center justify-center perspective-[1200px] overflow-hidden">
          
          {/* Navigation Controls */}
          <button 
            onClick={handlePrev}
            className="absolute left-2 md:left-10 z-50 p-4 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-2 md:right-10 z-50 p-4 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* The Deck of Cards */}
          <div className="relative w-[300px] h-[380px] md:w-[340px] md:h-[420px]">
            {prompts.map((prompt, index) => {
              
              let offset = index - currentIndex;
              const N = prompts.length;
              
              if (offset > N / 2) {
                offset -= N;
              } else if (offset < -N / 2) {
                offset += N;
              }

              const absOffset = Math.abs(offset);
              const isActive = offset === 0;

              return (
                <motion.div
                  key={prompt.id}
                  onClick={() => {
                    if (isActive) {
                      router.push(`/explore/${prompt.id}`);
                    } else {
                      setCurrentIndex(index);
                    }
                  }}
                  animate={{
                    x: offset * 180,              
                    scale: 1 - absOffset * 0.15,   
                    zIndex: 10 - absOffset,       
                    rotateY: offset * -15,        
                    opacity: 1 - absOffset * 0.15,
                    filter: absOffset > 0 ? `blur(${absOffset * 3}px)` : "blur(0px)", 
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  {...(isActive ? {
                    drag: "x",
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.2,
                    onDragEnd: (_, { offset: dragOffset, velocity }) => {
                      if (dragOffset.x < -100 || velocity.x < -500) {
                        handleNext();
                      } else if (dragOffset.x > 100 || velocity.x > 500) {
                        handlePrev();
                      }
                    }
                  } : {})}
                className={`absolute top-0 left-0 w-full h-full bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between group ${isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)]' : 'cursor-pointer'}`}
                >
                  {/* Subtle top gradient line that only appears on the active card hover */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-purple-500/0 transition-opacity ${isActive ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}></div>

                  <div>
                    {/* THE IMAGE BLOCK */}
                  <div className="w-full h-32 md:h-36 mb-4 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/50 relative pointer-events-none">
                      {prompt.imageUrl ? (
                        <img 
                          src={prompt.imageUrl} 
                          alt={prompt.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-700 bg-slate-200 dark:bg-slate-900/50">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-30" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-30">No Preview</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                        {prompt.aiModel}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400" /> 
                        {/* Fallback to 5.0 if no reviews exist */}
                        {prompt.reviews?.length > 0 ? (prompt.reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / prompt.reviews.length).toFixed(1) : "5.0"}
                      </div>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {prompt.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm font-light line-clamp-2 mb-2">
                      {prompt.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end pt-3 mt-auto border-t border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-700">
                        {prompt.seller?.name ? prompt.seller.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="text-sm text-slate-400 truncate max-w-[90px]">
                        {prompt.seller?.name || "Unknown"}
                      </span>
                    </div>
                    <div className="text-xl font-black text-emerald-400">
                      ${prompt.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Invisible overlay on background cards to prevent highlighting text when clicking */}
                  {!isActive && <div className="absolute inset-0 z-10"></div>}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}