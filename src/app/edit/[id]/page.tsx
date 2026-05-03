"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, X, Link as LinkIcon, Loader2, ArrowLeft } from "lucide-react";

export default function EditPromptPage() {
  const router = useRouter();
  const params = useParams();
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    promptContent: "", 
    price: "",
    imageUrl: "",
    aiModel: "",
    category: "",
  });

  // 1. Fetch Existing Data on Load
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_URL}/api/prompts/${params.id}`);
        if (!res.ok) throw new Error("Failed to load prompt data");
        
        const data = await res.json();
        
        // Populate the form with existing data
        setFormData({
          title: data.title,
          description: data.description,
          promptContent: data.promptContent || "", 
          price: data.price.toString(),
          imageUrl: data.imageUrl || "",
          aiModel: data.aiModel,
          category: data.category,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchPrompt();
  }, [params.id, router]);

  // 2. Handle Cloudinary Image Upload
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
      if (!res.ok) throw new Error(fileData.error?.message || "Upload failed");
      
      setFormData((prev) => ({ ...prev, imageUrl: fileData.secure_url }));
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit the PATCH Request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("promptforge_token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${API_URL}/api/prompts/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update prompt");
      }
      
      router.push(`/explore/${params.id}`);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 py-12 px-6 transition-colors duration-300">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Edit Prompt</h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
          
          {/* IMAGE UPLOAD */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Display Image</label>
            {formData.imageUrl ? (
              <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setFormData({...formData, imageUrl: ""})} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                  {isUploading ? <Loader2 className="animate-spin w-8 h-8 text-blue-600 dark:text-blue-500" /> : <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-2" />}
                  <span className="text-xs text-slate-500">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                <div className="flex flex-col justify-center h-48 p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 transition-colors">
                  <div className="flex items-center gap-2 mb-3 text-slate-500"><LinkIcon className="w-4 h-4" /> <span className="text-xs">Paste URL</span></div>
                  <input 
                    name="imageUrl" 
                    value={formData.imageUrl} 
                    onChange={handleChange} 
                    className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 py-1 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors" 
                    placeholder="https://..." 
                  />
                </div>
              </div>
            )}
          </div>

          {/* TITLE & PRICE */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Prompt Title</label>
              <input 
                required 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price ($)</label>
              <input 
                required 
                type="number" 
                step="0.01" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all" 
              />
            </div>
          </div>

          {/* MODEL & CATEGORY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Model</label>
              <select 
                name="aiModel" 
                value={formData.aiModel} 
                onChange={handleChange} 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
              >
                <option value="GPT4">GPT-4o</option>
                <option value="CLAUDE">Claude 3.5 Sonnet</option>
                <option value="MIDJOURNEY">Midjourney v6</option>
                <option value="GEMINI">Gemini 1.5 Pro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all appearance-none"
              >
                <option value="Development">Development</option>
                <option value="Copywriting">Copywriting</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Art & Design">Art & Design</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea 
              required 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={3} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all resize-none" 
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Actual Prompt (Hidden from public)</label>
            <textarea 
              required 
              name="promptContent" 
              value={formData.promptContent} 
              onChange={handleChange} 
              rows={6} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all resize-none font-mono text-sm" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || isUploading} 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm dark:shadow-none"
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}