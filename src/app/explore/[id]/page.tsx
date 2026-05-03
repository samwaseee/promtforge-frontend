"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Star,
    ShoppingCart,
    ShieldCheck,
    Bot,
    CheckCircle2,
    MessageSquare,
    ArrowLeft,
    UserCircle,
    ImageIcon,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Sun, // ✨ NEW: Import Sun icon
    Moon // ✨ NEW: Import Moon icon
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext"; // ✨ NEW: Import your theme context

export default function PromptDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    
    const { user } = useAuth();
    const { addToCart, cartItems } = useCart();
    
    // ✨ NEW: Pull in theme state and toggle function
    const { theme, toggleTheme } = useTheme(); 

    const [prompt, setPrompt] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [relatedPrompts, setRelatedPrompts] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        const fetchPrompt = async () => {
            try {
                const data = await apiClient.get(`/api/prompts/${id}`, false);
                setPrompt(data);

                try {
                    const params = new URLSearchParams({
                        category: data.category,
                        limit: "4",
                    });
                    const related = await apiClient.get(`/api/prompts?${params.toString()}`, false);
                    const filtered = related.prompts?.filter((p: any) => p.id !== id) || [];
                    setRelatedPrompts(filtered.slice(0, 4));
                } catch (relatedError) {
                    console.error("Failed to fetch related prompts:", relatedError);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load prompt details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrompt();
    }, [id]);

    // ==========================================
    // SKELETON LOADER UI
    // ==========================================
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-8 pb-24 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800/50 rounded animate-pulse mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12 animate-pulse">
                            <div>
                                <div className="flex gap-3 mb-4">
                                    <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800/80 rounded-full" />
                                    <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800/80 rounded-full" />
                                </div>
                                <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800/80 rounded-xl mb-3" />
                                <div className="h-12 w-1/2 bg-slate-200 dark:bg-slate-800/80 rounded-xl mb-6" />
                                <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800/50 rounded" />
                            </div>
                            <div className="w-full aspect-[21/9] bg-slate-200 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800/50" />
                            <div>
                                <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800/80 rounded mb-4" />
                                <div className="h-32 w-full bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-2xl" />
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 backdrop-blur-md animate-pulse">
                                <div className="mb-8">
                                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800/80 rounded mb-4" />
                                    <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800/80 rounded" />
                                </div>
                                <div className="h-16 w-full bg-slate-200 dark:bg-slate-800/80 rounded-xl mb-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // ERROR UI
    // ==========================================
    if (error || !prompt) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-center px-6 transition-colors duration-300">
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-8 rounded-2xl max-w-md">
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Prompt Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">{error || "The prompt you are looking for does not exist."}</p>
                    <Link href="/explore" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                        &larr; Return to Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    // ==========================================
    // RENDER REAL DATA
    // ==========================================
    const features = prompt.features || ["Strict system instructions", "Tested for reliability", "Easy to integrate"];
    const exampleOutput = prompt.exampleOutput || "// No example output provided by the seller.";
    const reviewsCount = prompt.reviews?.length || 0;

    const galleryImages = [
        prompt.imageUrl,
        `https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?fm=jpg&q=60&w=3000&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1674027444485-cec3da58eef4?fm=jpg&q=60&w=3000&auto=format&fit=crop`,
    ].filter(Boolean);

    const rating = reviewsCount > 0
        ? (prompt.reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviewsCount).toFixed(1)
        : "New";

    const sellerName = prompt.seller?.name || "Anonymous Maker";
    const isInCart = cartItems?.some((item: any) => item.id === prompt.id);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-8 pb-24 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* ✨ NEW: Top Navigation Bar with Theme Toggle */}
                <div className="flex justify-between items-center mb-8">
                    <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* LEFT COLUMN: Main Details */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* HEADER SECTION */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-500/20 uppercase tracking-wider">
                                    {prompt.category}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-300 dark:border-transparent">
                                    <Bot className="w-3 h-3" /> {prompt.aiModel}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                                {prompt.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                                    <span className="font-bold text-slate-900 dark:text-slate-200">{rating}</span>
                                    ({reviewsCount} reviews)
                                </span>
                                <span>•</span>
                                <span>Created by <span className="font-bold text-slate-900 dark:text-slate-200">{sellerName}</span></span>
                            </div>
                        </motion.div>

                        {/* HERO IMAGE SECTION WITH GALLERY */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="space-y-4"
                        >
                            {/* Main Image with Navigation */}
                            <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl group bg-white dark:bg-transparent">
                                {galleryImages[selectedImageIndex] ? (
                                    <img
                                        src={galleryImages[selectedImageIndex]}
                                        alt={`${prompt.title} - Image ${selectedImageIndex + 1}`}
                                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-50 dark:bg-slate-900/40 flex flex-col items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-2" />
                                        <span className="text-sm font-medium text-slate-500">No preview image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 dark:from-slate-950 via-transparent to-transparent opacity-80" />
                                
                                {/* Navigation Arrows */}
                                {galleryImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImageIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 dark:bg-slate-950/60 hover:bg-white/40 dark:hover:bg-slate-950/90 backdrop-blur border border-white/30 dark:border-slate-700 rounded-full p-2 transition-all z-10"
                                        >
                                            <ChevronLeft className="w-6 h-6 text-white" />
                                        </button>
                                        <button
                                            onClick={() => setSelectedImageIndex((i) => (i + 1) % galleryImages.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 dark:bg-slate-950/60 hover:bg-white/40 dark:hover:bg-slate-950/90 backdrop-blur border border-white/30 dark:border-slate-700 rounded-full p-2 transition-all z-10"
                                        >
                                            <ChevronRight className="w-6 h-6 text-white" />
                                        </button>

                                        {/* Image Counter */}
                                        <div className="absolute bottom-4 right-4 bg-black/40 dark:bg-slate-950/60 backdrop-blur-md border border-white/20 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white dark:text-slate-300">
                                            {selectedImageIndex + 1} / {galleryImages.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {galleryImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {galleryImages.map((img, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            whileHover={{ scale: 1.05 }}
                                            className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                idx === selectedImageIndex ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                                            }`}
                                        >
                                            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                            {idx === selectedImageIndex && <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />}
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* DESCRIPTION */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About this prompt</h2>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none backdrop-blur-md whitespace-pre-wrap">
                                {prompt.description}
                            </p>
                        </motion.div>

                        {/* FEATURES */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">What you'll get</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {features.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 bg-white dark:bg-slate-900/20 p-4 rounded-xl border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-none">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* EXAMPLE OUTPUT */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Example Output</h2>
                            <div className="bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 font-mono text-sm overflow-x-auto relative group shadow-inner">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider">Preview</span>
                                </div>
                                <pre className="text-emerald-700 dark:text-emerald-400/90">{exampleOutput}</pre>
                            </div>
                        </motion.div>

                        {/* CUSTOMER REVIEWS SECTION */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                Customer Reviews
                                <span className="text-sm font-normal text-slate-600 dark:text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">{reviewsCount}</span>
                            </h2>

                            {reviewsCount === 0 ? (
                                <div className="text-center py-10 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl">
                                    <p className="text-slate-500">No reviews yet. Be the first to try this prompt!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {prompt.reviews.map((review: any) => (
                                        <div key={review.id} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between">
                                            <div>
                                                {/* Rating Stars */}
                                                <div className="flex gap-1 mb-4">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                                                        />
                                                    ))}
                                                </div>
                                                {/* Comment */}
                                                <p className="text-slate-700 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                                                    "{review.comment || "Excellent prompt. Highly recommended."}"
                                                </p>
                                            </div>

                                            {/* Reviewer Info */}
                                            <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/50 pt-4 mt-auto">
                                                {review.reviewer?.avatar ? (
                                                    <img src={review.reviewer.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                                                ) : (
                                                    <UserCircle className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                                                )}
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{review.reviewer?.name || "Anonymous Buyer"}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* RELATED ITEMS SECTION */}
                        {relatedPrompts.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Similar Prompts</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {relatedPrompts.map((relatedPrompt) => (
                                        <motion.div
                                            key={relatedPrompt.id}
                                            whileHover={{ y: -4 }}
                                            onClick={() => router.push(`/explore/${relatedPrompt.id}`)}
                                            className="group relative bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-none backdrop-blur-md transition-all hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] cursor-pointer"
                                        >
                                            {/* Image */}
                                            <div className="w-full h-32 mb-4 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/50 relative">
                                                {relatedPrompt.imageUrl ? (
                                                    <img
                                                        src={relatedPrompt.imageUrl}
                                                        alt={relatedPrompt.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                                        <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-50">No Preview</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                                                        {relatedPrompt.category}
                                                    </span>
                                                </div>
                                                <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-blue-50 dark:bg-slate-950 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-900/50">
                                                    {relatedPrompt.aiModel}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {relatedPrompt.title}
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                                                {relatedPrompt.description}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5">
                                                <span className="text-xs text-slate-500">{relatedPrompt.seller?.name || 'Unknown'}</span>
                                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">${relatedPrompt.price.toFixed(2)}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </div>

                    {/* RIGHT COLUMN: The Sticky Buy Box */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-24 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 backdrop-blur-md shadow-xl dark:shadow-2xl"
                        >
                            <div className="mb-8">
                                <span className="block text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">One-time purchase</span>
                                <div className="text-5xl font-black text-slate-900 dark:text-white flex items-start gap-1">
                                    <span className="text-2xl mt-1 text-slate-500 dark:text-slate-400">$</span>
                                    {prompt.price.toFixed(2)}
                                </div>
                            </div>

                            <button
                                onClick={() => addToCart({
                                    id: prompt.id,
                                    title: prompt.title,
                                    price: prompt.price,
                                    category: prompt.category,
                                    imageUrl: prompt.imageUrl
                                })}
                                disabled={isInCart}
                                className={`w-full font-bold text-lg py-4 rounded-xl transition-all flex items-center justify-center gap-2 mb-6 ${
                                    isInCart 
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-transparent" 
                                    : "bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] dark:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] dark:hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
                                }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {isInCart ? "Added to Cart" : "Add to Cart"}
                            </button>

                            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                                    <span>Tested and verified by Admins</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                                    <span>Includes usage instructions</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}