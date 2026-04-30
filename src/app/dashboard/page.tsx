"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPortal from "@/components/dashboard/AdminPortal";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import BuyerHub from "@/components/dashboard/BuyerHub";

export default function UnifiedDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("promptforge_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pt-24 pb-12 px-6 md:px-12">
      {user?.role === "ADMIN" && <AdminPortal />}
      {user?.role === "SELLER" && <SellerDashboard />}
      {user?.role === "BUYER" && <BuyerHub />}
    </div>
  );
}