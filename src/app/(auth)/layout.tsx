"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // If we are done loading and a user is found, kick them out
    if (!isLoading && user) {
      router.push("/explore"); // Or "/dashboard" depending on their role
    }
  }, [user, isLoading, router]);

  // Show a loading screen while checking, OR if we are about to redirect them
  if (isLoading || user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // If they are NOT logged in, let them see the login/register pages
  return <>{children}</>;
}