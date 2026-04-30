"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

interface FeaturedPromptsProps {
  prompts: any[];
  isLoading: boolean;
}

export default function FeaturedPrompts({ prompts, isLoading }: FeaturedPromptsProps) {
  const router = useRouter();
  
  // Track which card is in the center
  const [currentIndex, setCurrentIndex] = useState(0);

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
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Trending Prompts</h2>
          <p className="text-slate-400 mt-2 font-medium">
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
        <div className="flex justify-center items-center py-20 h-[400px]">
           <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-16 text-slate-400 w-full h-[400px] flex items-center justify-center border border-dashed border-slate-800 rounded-3xl">
          No prompts available yet.
        </div>
      ) : (
        // The perspective class is CRITICAL for the 3D effect to work
        <div className="relative w-full max-w-6xl h-[450px] flex items-center justify-center perspective-[1200px] overflow-hidden">
          
          {/* Navigation Controls */}
          <button 
            onClick={handlePrev}
            className="absolute left-2 md:left-10 z-50 p-4 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-blue-600 hover:border-blue-500 transition-all backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-2 md:right-10 z-50 p-4 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-blue-600 hover:border-blue-500 transition-all backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* The Deck of Cards */}
          <div className="relative w-[300px] h-[380px] md:w-[340px] md:h-[420px]">
            {prompts.map((prompt, index) => {
              // Mathematical magic to calculate position relative to center
              let offset = index - currentIndex;
              const N = prompts.length;
              
              // Infinite wrap-around math
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
                    // If clicked when centered, go to page. If clicked when in background, bring to front.
                    if (isActive) {
                      router.push(`/explore/${prompt.id}`);
                    } else {
                      setCurrentIndex(index);
                    }
                  }}
                  animate={{
                    x: offset * 180,              // Spread them horizontally
                    scale: 1 - absOffset * 0.15,   // Make background cards smaller
                    zIndex: 10 - absOffset,       // Center card is always on top
                    rotateY: offset * -15,        // Tilt them inward like a wheel
                    opacity: 1 - absOffset * 0.15,// Fade out distant cards
                    filter: absOffset > 0 ? `blur(${absOffset * 3}px)` : "blur(0px)", // The Glass Blur Effect
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
                  // Absolute positioning stacks them all perfectly in the center initially
                  className={`absolute top-0 left-0 w-full h-full bg-slate-900/60 border border-slate-700 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between group ${isActive ? 'cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)]' : 'cursor-pointer'}`}
                >
                  {/* Subtle top gradient line that only appears on the active card hover */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-purple-500/0 transition-opacity ${isActive ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}></div>

                  <div>
                    {/* THE IMAGE BLOCK */}
                    <div className="w-full h-32 md:h-36 mb-4 overflow-hidden rounded-xl bg-slate-950/50 border border-slate-800/50 relative pointer-events-none">
                      {prompt.imageUrl ? (
                        <img 
                          src={prompt.imageUrl} 
                          alt={prompt.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-900/50">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-30" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-30">No Preview</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
                        {prompt.aiModel}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-yellow-400" /> 5.0
                      </div>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-slate-100 leading-snug mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {prompt.title}
                    </h3>
                    
                    {/* Reduced to line-clamp-2 to accommodate the new image height */}
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