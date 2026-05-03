"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("promptforge_user");
    if (!storedUser) {
      router.replace("/login");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    
    // Kick buyers back to the marketplace
    if (parsedUser.role === "BUYER") {
      router.replace("/explore");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-blue-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex">
      <Sidebar role={user.role} onHoverChange={setIsHovered} />
      
      <main className={`flex-1 transition-all duration-300 relative z-0 ${
        isHovered ? "pl-64" : "pl-16"
      }`}>
        {children}
      </main>
    </div>
  );
}