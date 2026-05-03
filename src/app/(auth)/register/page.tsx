"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; 
import { 
    createUserWithEmailAndPassword, 
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    TwitterAuthProvider
} from "firebase/auth";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Initialize Social Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "BUYER", 
        avatar: "",    
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            setError("Image upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    // Extracted Sync Logic (handles both Email/Password and Social)
    const syncWithBackend = async (firebaseUser: any) => {
        const idToken = await firebaseUser.getIdToken();
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${API_URL}/api/auth/sync`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`,
            },
            body: JSON.stringify({
                name: formData.name || firebaseUser.displayName, 
                role: formData.role, 
                avatar: formData.avatar || firebaseUser.photoURL,
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Sync failed");

        login(data.token, data.user);
        router.push("/explore");
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            
            await updateProfile(userCredential.user, {
                displayName: formData.name,
                photoURL: formData.avatar,
            });

            await syncWithBackend(userCredential.user);
        } catch (err: any) {
            handleAuthError(err);
        }
    };

    const handleSocialRegister = async (provider: any) => {
        setIsSubmitting(true);
        setError("");

        try {
            const userCredential = await signInWithPopup(auth, provider);
            await syncWithBackend(userCredential.user);
        } catch (err: any) {
            handleAuthError(err);
        }
    };

    const handleAuthError = (err: any) => {
        if (err.code === 'auth/popup-closed-by-user') {
            setIsSubmitting(false);
            return; 
        }
        const message = err.message.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, "");
        setError(message || "Failed to create account.");
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 backdrop-blur-xl relative z-10 shadow-xl dark:shadow-2xl transition-colors"
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Welcome to PromptForge</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-4">
                        <div className="relative w-20 h-20 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 mb-2 overflow-hidden">
                            {formData.avatar ? (
                                <img src={formData.avatar} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-full h-full p-5 text-slate-400 dark:text-slate-600" />
                            )}
                        </div>
                        <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider">
                            <label className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                                {isUploading ? "Uploading..." : "Upload Photo"}
                                <input type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                            <input 
                                type="text"
                                placeholder="Or URL"
                                className="bg-transparent border-b border-slate-300 dark:border-slate-700 w-16 text-slate-600 dark:text-slate-400 outline-none"
                                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Role Toggle */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                        {['BUYER', 'SELLER'].map((role) => (
                            <button 
                                key={role} 
                                type="button" 
                                onClick={() => setFormData({ ...formData, role })} 
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                    formData.role === role 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>

                    <input 
                        required 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors" 
                        placeholder="Full Name" 
                    />
                    <input 
                        required 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors" 
                        placeholder="Email" 
                    />

                    {/* Password Field with Toggle */}
                    <div className="relative">
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || isUploading} 
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign Up <ArrowRight className="w-4 h-4" /></>}
                    </button>
                </form>

                {/* Social Sign Up Section */}
                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-900/50 text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-6">
                        {/* Google Button */}
                        <button
                            type="button"
                            onClick={() => handleSocialRegister(googleProvider)}
                            disabled={isSubmitting}
                            className="flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </button>

                        {/* GitHub Button */}
                        <button
                            type="button"
                            onClick={() => handleSocialRegister(githubProvider)}
                            disabled={isSubmitting}
                            className="flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            <svg className="w-5 h-5 text-slate-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Twitter/X Button */}
                        <button
                            type="button"
                            onClick={() => handleSocialRegister(twitterProvider)}
                            disabled={isSubmitting}
                            className="flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            <svg className="w-4 h-4 text-slate-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <p className="text-center text-slate-600 dark:text-slate-400 text-sm mt-6">
                    Already have an account? <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">Log in</Link>
                </p>
            </motion.div>
        </div>
    );
}