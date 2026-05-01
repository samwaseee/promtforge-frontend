"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardTrafficCop() {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("promptforge_user");
    if (!userStr) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(userStr);

    // Act as a traffic cop and send them to their dedicated URLs
    if (user.role === "ADMIN") {
      router.replace("/dashboard/admin");
    } else if (user.role === "SELLER") {
      router.replace("/dashboard/seller");
    } else {
      router.replace("/explore"); // Catch-all for buyers
    }
  }, [router]);

  // Show a tiny spinner while the redirect happens instantly
  return (
    <div className="h-[80vh] flex items-center justify-center text-blue-500">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}