"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  TwitterAuthProvider 
} from "firebase/auth";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Initialize Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const twitterProvider = new TwitterAuthProvider();

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/explore";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Existing Email/Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await syncWithBackend(userCredential.user);
    } catch (err: any) {
      handleAuthError(err);
    }
  };

  // ✨ NEW: 2. Social Login Handler
  const handleSocialLogin = async (provider: any) => {
    setIsSubmitting(true);
    setError("");

    try {
      const userCredential = await signInWithPopup(auth, provider);
      await syncWithBackend(userCredential.user);
    } catch (err: any) {
      handleAuthError(err);
    }
  };

  // ✨ NEW: 3. Extracted Backend Sync Logic (to avoid repeating code)
  const syncWithBackend = async (firebaseUser: any) => {
    const idToken = await firebaseUser.getIdToken();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(`${API_URL}/api/auth/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to authenticate with server.");
    }

    login(data.token, data.user);
    router.push(redirectPath);
  };

  const handleAuthError = (err: any) => {
    // Check if user closed the popup prematurely
    if (err.code === 'auth/popup-closed-by-user') {
      setIsSubmitting(false);
      return; 
    }
    const message = err.message.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, "");
    setError(message || "Authentication failed.");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Log in to access your dashboard and purchases.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                required type="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-12 pr-12 py-3.5 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Log In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* ✨ NEW: Social Login Section */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/50 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin(googleProvider)}
              disabled={isSubmitting}
              className="flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
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
              onClick={() => handleSocialLogin(githubProvider)}
              disabled={isSubmitting}
              className="flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Twitter/X Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin(twitterProvider)}
              disabled={isSubmitting}
              className="flex items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          Don't have an account? <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}

// 2. The Suspense Wrapper
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}