"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

export default function CreatePromptPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    promptText: "",
    price: "",
    imageUrl: "",
    aiModel: "GPT4",
    category: "Development",
  });

  useEffect(() => {
    const token = localStorage.getItem("promptforge_token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  // Note: Cloudinary STILL uses standard fetch because it's an external file upload!
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "promptforge"); 
    data.append("cloud_name", "danp5ejbu");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/danp5ejbu/image/upload", {
        method: "POST",
        body: data,
      });
      const fileData = await res.json();
      setFormData({ ...formData, imageUrl: fileData.secure_url });
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await apiClient.post("/api/prompts", {
        title: formData.title,
        description: formData.description,
        promptText: formData.promptText,
        price: parseFloat(formData.price), 
        aiModel: formData.aiModel,
        category: formData.category,
        imageUrl: formData.imageUrl,
      }, true); 

      // Success! Send them to the marketplace
      router.push("/explore");

    } catch (err: any) {
      // apiClient already extracts the error message for us
      setError(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 py-12 px-6 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Sell a Prompt</h1>
          <p className="text-slate-600 dark:text-slate-400">Package your best AI systems and share them with the world.</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors">
          
          {/* IMAGE UPLOAD SECTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Prompt Image</label>
            
            {/* Preview Box */}
            {formData.imageUrl ? (
              <div className="relative h-40 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, imageUrl: ""})}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Upload Button */}
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                  {isUploading ? <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" /> : <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500 mb-2" />}
                  <span className="text-xs text-slate-500">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>

                {/* URL Paste */}
                <div className="flex flex-col justify-center h-40 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-xs">Paste URL</span>
                  </div>
                  <input 
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 py-1 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* TITLE & PRICE ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Prompt Title</label>
              <input 
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Ultimate React Component Architect"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price ($)</label>
              <input 
                required
                type="number"
                step="0.01"
                min="0.99"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="4.99"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* MODEL & CATEGORY ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Model</label>
              <select 
                name="aiModel"
                value={formData.aiModel}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
              >
                <option value="GPT4">GPT-4o</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                <option value="Midjourney v6">Midjourney v6</option>
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
              >
                <option value="Development">Development</option>
                <option value="Copywriting">Copywriting</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Art & Design">Art & Design</option>
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (Public)</label>
            <textarea 
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Explain what this prompt does and why it is valuable. Buyers will see this."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>

          {/* THE SECRET PROMPT */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Actual Prompt (Hidden until purchased)
            </label>
            <textarea 
              required
              name="promptText"
              value={formData.promptText}
              onChange={handleChange}
              rows={6}
              placeholder="Paste the exact prompt text here. E.g., 'Act as a Senior Developer...'"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none font-mono text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:font-sans"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] dark:shadow-[0_0_30px_-10px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center disabled:opacity-70"
          >
            {isSubmitting ? (
               <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Publish Prompt"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}