"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // e.g., ["ADMIN", "SELLER"]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("promptforge_token");
    const userStr = localStorage.getItem("promptforge_user");

    // 1. Not logged in at all? Kick them to login.
    if (!token || !userStr) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    try {
      const user = JSON.parse(userStr);

      // 2. Role Check: If this route requires specific roles, check them.
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          // Kick them back to their appropriate dashboard if they snoop
          if (user.role === "ADMIN") {
            router.replace("/dashboard");
          } else if (user.role === "SELLER") {
            router.replace("/dashboard/inventory");
          } else {
            router.replace("/explore");
          }
          return;
        }
      }

      // 3. Passed all checks! Show the page.
      setIsAuthorized(true);

    } catch (error) {
      // Catch bad JSON in localStorage
      localStorage.removeItem("promptforge_token");
      localStorage.removeItem("promptforge_user");
      router.replace("/login");
    }
  }, [router, pathname, allowedRoles]);

  // Prevent the "flash" of unauthorized content while checking
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-blue-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Verifying access...</p>
      </div>
    );
  }

  return <>{children}</>;
}