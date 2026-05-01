"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RoleGuard({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode; 
  allowedRole: "ADMIN" | "SELLER";
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // We already know they are logged in because DashboardLayout checked,
    // so we just need to verify their specific role for this page.
    const userStr = localStorage.getItem("promptforge_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === allowedRole) {
        setIsAuthorized(true);
      } else {
        // Snooping detected. Send them to their respective home.
        router.push(user.role === "ADMIN" ? "/dashboard" : "/dashboard/inventory");
      }
    }
  }, [router, allowedRole]);

  if (!isAuthorized) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-blue-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Verifying permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}