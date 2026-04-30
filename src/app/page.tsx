"use client";

import { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { motion } from "framer-motion";

// Import our components
import HeroSection from "@/components/home/HeroSection";
import TrendingCategories from "@/components/home/TrendingCategories";
import FeaturedPrompts from "@/components/home/FeaturedPrompts";

export default function Home() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  
  const [featuredPrompts, setFeaturedPrompts] = useState<any[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("promptforge_user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsAuthLoaded(true);

    const fetchPrompts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prompts?limit=6");
        if (res.ok) {
          const data = await res.json();
          // Safely extract the array whether using the old or new backend
          const promptsArray = Array.isArray(data) ? data : (data.prompts || []);
          
          // FORCING 6 CARDS HERE
          setFeaturedPrompts(promptsArray.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch featured prompts:", error);
      } finally {
        setIsLoadingPrompts(false);
      }
    };
    fetchPrompts();
  }, []);

  const handleGoogleLogin = async () => {
    // ... your existing login logic ...
    try {
      setIsLoggingIn(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("http://localhost:5000/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("promptforge_token", data.token);
        localStorage.setItem("promptforge_user", JSON.stringify(data.user));
        window.location.href = "/explore";
      } else {
        alert("Login failed to sync with database.");
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setIsLoggingIn(false);
    }
  };

  return (
    // FIX: Removed overflow-x-hidden from this main wrapper!
    <div className="relative min-h-screen bg-slate-950 text-slate-50 font-sans pb-24">
      
      {/* FIX: Isolated the glowing blobs in their own overflow-hidden container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[5%] right-0 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 md:pt-32 flex flex-col items-center">
        <HeroSection user={user} isAuthLoaded={isAuthLoaded} onLogin={handleGoogleLogin} isLoggingIn={isLoggingIn} />
        <TrendingCategories />
        <FeaturedPrompts prompts={featuredPrompts} isLoading={isLoadingPrompts} />
      </div>
    </div>
  );
}