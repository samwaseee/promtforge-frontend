"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, UserCircle } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

// 1. Helper to render text with Typewriter effect
const TypewriterText = ({ text, isVisible }: { text: string; isVisible: boolean }) => {
    // We use a key to force re-render when isVisible toggles, effectively "resetting" the animation
    return (
        <motion.p
            key={isVisible ? "visible" : "hidden"}
            className="text-slate-300 mb-8 italic leading-relaxed text-sm h-24" // h-24 ensures layout stability
        >
            {isVisible ? (
                text.split("").map((char, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.09, delay: i * 0.05 }}
                    >
                        {char}
                    </motion.span>
                ))
            ) : (
                <span>&nbsp;</span> // Empty state
            )}
        </motion.p>
    );
};

// 2. Individual Card Component
const TestimonialCard = ({ t }: { t: any }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <motion.div
            // 1. Remove onViewportLeave to stop the reset
            onViewportEnter={() => setIsVisible(true)}

            // 2. Set once: true so it only triggers the first time it enters view
            viewport={{ once: true, amount: 0.65 }}

            // Hover effects
            whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.3)" }}
            className="w-[380px] shrink-0 bg-slate-900/40 border border-slate-800 p-8 rounded-2xl shadow-lg flex flex-col justify-between transition-colors duration-300"
        >
            <div>
                <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
                    ))}
                </div>
                {/* When isVisible becomes true, the TypewriterText starts. 
                   Since we set 'once: true', it stays true forever.
                */}
                <TypewriterText text={`"${t.comment}"`} isVisible={isVisible} />
            </div>

            <div className="flex items-center gap-3 border-t border-slate-800/50 pt-4 mt-auto">
                {t.reviewer.avatar ? (
                    <img src={t.reviewer.avatar} alt="avatar" className="w-9 h-9 rounded-full bg-slate-800" />
                ) : (
                    <UserCircle className="w-9 h-9 text-slate-600" />
                )}
                <div>
                    <p className="font-medium text-white text-sm">{t.reviewer.name}</p>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                        Purchased: {t.prompt.title}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await apiClient.get('/api/reviews/featured', false);
                setTestimonials(data);
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
            }
        };
        fetchTestimonials();
    }, []);

    if (testimonials.length === 0) return null;

    const doubledTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="py-24 bg-slate-950 w-full overflow-x-hidden relative border-y border-slate-900">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]">
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, backgroundSize: "64px 64px" }} />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
                <h2 className="text-3xl font-semibold text-white">Trusted by Professionals</h2>
            </div>

            <div
                className="relative z-20 w-full flex items-center"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-slate-950 to-transparent z-30 pointer-events-none" />
                <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-slate-950 to-transparent z-30 pointer-events-none" />

                <motion.div
                    className="flex gap-6 px-3 w-max"
                    animate={{ x: isPaused ? "0%" : ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
                >
                    {doubledTestimonials.map((t, index) => (
                        <TestimonialCard key={`${t.id}-${index}`} t={t} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}