"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Upload, Loader2, Save, Mail, Shield, Lock, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";
import { updateProfile, updatePassword } from "firebase/auth";
import { apiClient } from "@/lib/apiClient";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", avatar: "" });
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("promptforge_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormData({ name: parsed.name || "", avatar: parsed.avatar || "" });
    }
  }, []);

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
      if (!res.ok) throw new Error("Upload failed");
      
      setFormData((prev) => ({ ...prev, avatar: fileData.secure_url }));
    } catch {
      setMessage({ type: "error", text: "Image upload failed" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.new) {
      if (passwords.new !== passwords.confirm) {
        setMessage({ type: "error", text: "New passwords do not match." });
        return;
      }
      if (passwords.new.length < 6) {
        setMessage({ type: "error", text: "Password must be at least 6 characters long." });
        return;
      }
      if (!/[A-Z]/.test(passwords.new)) {
        setMessage({ type: "error", text: "Password must contain at least one uppercase letter." });
        return;
      }
      if (!/[a-z]/.test(passwords.new)) {
        setMessage({ type: "error", text: "Password must contain at least one lowercase letter." });
        return;
      }
      if (!/[^A-Za-z]/.test(passwords.new)) {
        setMessage({ type: "error", text: "Password must contain at least one number or special character." });
        return;
      }
    }

    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // ✨ FIX 1: Ensure Firebase is actually loaded before proceeding
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Authentication is still loading. Please wait a second and try again.");
      }

      // ✨ FIX 2: Check if they are a Google user trying to change a password
      const isGoogleUser = currentUser.providerData.some(
        (provider) => provider.providerId === 'google.com'
      );

      if (passwords.new && isGoogleUser) {
        throw new Error("You signed in with Google. You cannot change your password here.");
      }

      // 1. Update Firebase Profile
      await updateProfile(currentUser, {
        displayName: formData.name,
        photoURL: formData.avatar,
      });

      // 1.5 Update Firebase Password if provided
      if (passwords.new) {
        try {
          await updatePassword(currentUser, passwords.new);
        } catch (pwdErr: any) {
          if (pwdErr.code === 'auth/requires-recent-login') {
            throw new Error("For security, you must log out and log back in before changing your password.");
          }
          throw pwdErr;
        }
      }

      // 2. Sync changes with Backend
      const payload: any = {
        name: formData.name,
        avatar: formData.avatar,
      };

      // ✨ FIX 3: Your backend doesn't actually need the new password! 
      // Firebase handles auth. Do NOT send the raw password to your Prisma DB.
      // We only send name and avatar to keep your backend User table in sync.

      await apiClient.patch('/api/users/profile', payload, true);

      // 3. Update local state
      const updatedUser = { ...user, name: formData.name, avatar: formData.avatar };
      localStorage.setItem("promptforge_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setPasswords({ new: "", confirm: "" }); 
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      // ✨ ADD THIS LINE to see exactly what Firebase is complaining about:
      console.error("🔴 FIREBASE ERROR DETAILS:", err.code, err.message, err);
      
      setMessage({ type: "error", text: err.message || "Failed to save changes." });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-2">Profile Settings</h1>
      <p className="text-slate-400 mb-8">Manage your account details and preferences.</p>
      
      {message.text && (
        <div className={`p-4 rounded-xl mb-6 ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
        
        {/* Avatar Display & Edit */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
            {formData.avatar ? <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-slate-500" />}
          </div>
          <div>
            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer transition-colors text-sm font-medium w-fit">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? "Uploading..." : "Change Avatar"}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            <p className="text-xs text-slate-500 mt-2">Recommended size: 256x256px. Max 2MB.</p>
          </div>
        </div>

        {/* Text Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-sm font-medium text-slate-300">Full Name</label><input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-all" /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-slate-300 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-500" /> Email Address</label><input disabled value={user.email} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed" /><p className="text-xs text-slate-500">Email cannot be changed.</p></div>
          <div className="space-y-2"><label className="text-sm font-medium text-slate-300 flex items-center gap-2"><Shield className="w-4 h-4 text-slate-500" /> Account Role</label><input disabled value={user.role} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed font-medium" /></div>
        </div>

        {/* Password Change */}
        <div className="border-t border-slate-800 pt-6">
          <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2"><Lock className="w-4 h-4 text-slate-500" /> New Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-all placeholder:text-slate-600" placeholder="Leave blank to keep current" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2"><Lock className="w-4 h-4 text-slate-500" /> Confirm Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-all placeholder:text-slate-600" placeholder="Confirm new password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex justify-end">
          <button type="submit" disabled={isSaving || isUploading} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 min-w-[160px]">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}