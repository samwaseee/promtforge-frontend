"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("promptforge_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    
    // Kick buyers out of the dashboard layout completely
    if (parsedUser.role === "BUYER") {
      router.push("/explore");
      return;
    }

    setUser(parsedUser);
  }, [router]);

  if (!user) return null; // Or a loading spinner

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* The Sidebar is locked in here for all dashboard routes */}
      <Sidebar role={user.role} />
      
      {/* Main content area for the dashboard pages */}
      <main className="flex-1 pl-16">
        {children}
      </main>
    </div>
  );
}