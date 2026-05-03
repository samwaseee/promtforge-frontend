"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RoleGuard({ 
  children, 
  allowedRoles // ✨ CHANGED: Now accepts an array of roles
}: { 
  children: React.ReactNode; 
  allowedRoles: ("ADMIN" | "SELLER")[]; // ✨ Array type
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("promptforge_user");
    
    if (userStr) {
      const user = JSON.parse(userStr);
      
      // ✨ THE FIX: Check if the user's role exists inside the allowed array
      if (allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        // Snooping detected. Send them to their respective home.
        if (user.role === "ADMIN") {
          router.push("/dashboard");
        } else if (user.role === "SELLER") {
          router.push("/dashboard/inventory");
        } else {
          // Absolute failsafe: Kick standard BUYERs back to the public store
          router.push("/explore"); 
        }
      }
    } else {
      // Failsafe: No user found at all
      router.push("/login");
    }
  }, [router, allowedRoles]);

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