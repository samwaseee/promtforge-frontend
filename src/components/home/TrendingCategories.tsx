"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Code, MessageSquare, Paintbrush, LineChart, TrendingUp } from "lucide-react";

const CATEGORIES = [
  { name: "Development", icon: <Code className="w-4 h-4" /> },
  { name: "Copywriting", icon: <MessageSquare className="w-4 h-4" /> },
  { name: "Midjourney", icon: <Paintbrush className="w-4 h-4" /> },
  { name: "Data Analysis", icon: <LineChart className="w-4 h-4" /> },
  { name: "Marketing", icon: <TrendingUp className="w-4 h-4" /> },
];

export default function TrendingCategories() {
  const router = useRouter();

  const handleCategoryClick = (categoryName: string) => {
    // encodeURIComponent ensures spaces (like "Data Analysis") don't break the URL
    router.push(`/explore?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="w-full mb-24"
    >
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Explore by Category</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Find the exact tool for your workflow</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {CATEGORIES.map((cat, idx) => (
          <motion.button 
            key={idx}
            onClick={() => handleCategoryClick(cat.name)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors backdrop-blur-sm"
          >
            <span className="text-blue-400">{cat.icon}</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{cat.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}