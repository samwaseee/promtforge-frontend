"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // Ensure your firebase config path is correct
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Upload, Link as LinkIcon, X, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "BUYER", // Default role
        avatar: "",    // URL for avatar
    });

    // Handle Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Cloudinary Image Upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "promptforge"); // Replace with your preset
        data.append("cloud_name", "danp5ejbu"); // Replace with your cloud name

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/danp5ejbu/image/upload", {
                method: "POST",
                body: data,
            });
            const fileData = await res.json();
            if (!res.ok) throw new Error("Upload failed");
            setFormData((prev) => ({ ...prev, avatar: fileData.secure_url }));
        } catch {
            setError("Image upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // 1. Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // 2. Update Firebase profile
            await updateProfile(userCredential.user, {
                displayName: formData.name,
                photoURL: formData.avatar,
            });

            // 3. Get Firebase ID Token
            const idToken = await userCredential.user.getIdToken();

            // 4. Sync with Backend
            const response = await fetch("http://process.env.NEXT_PUBLIC_API_URL/api/auth/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    role: formData.role,
                    avatar: formData.avatar,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Sync failed");

            // 5. Store data
            localStorage.setItem("promptforge_token", data.token);
            localStorage.setItem("promptforge_user", JSON.stringify(data.user));

            router.push("/explore");
        } catch (err: any) {
            const message = err.message.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, "");
            setError(message || "Failed to create account.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl relative z-10 shadow-2xl"
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400 text-sm">Welcome to PromptForge</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">

                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative w-20 h-20 rounded-full border-2 border-slate-700 bg-slate-950 mb-2 overflow-hidden">
                            {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-5 text-slate-600" />}
                        </div>
                        <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider">
                            <label className="cursor-pointer text-blue-400 hover:text-blue-300">
                                {isUploading ? "Uploading..." : "Upload Photo"}
                                <input type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                            <input type="text"
                                placeholder="Or URL"
                                className="bg-transparent border-b border-slate-700 w-16 text-slate-400 outline-none"
                                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                        {['BUYER', 'SELLER'].map((role) => (
                            <button key={role} type="button" onClick={() => setFormData({ ...formData, role })} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${formData.role === role ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                                {role}
                            </button>
                        ))}
                    </div>

                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600" placeholder="Full Name" />
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600" placeholder="Email" />

                    {/* Password Field with Toggle */}
                    <div className="relative">
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <button type="submit" disabled={isSubmitting || isUploading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign Up <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-6">
                    Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
}