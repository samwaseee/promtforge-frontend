"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("promptforge_token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen bg-slate-950 items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // We keep the pl-16 here to ensure the sidebar doesn't overlap the content
  return (
    <div className="flex min-h-screen bg-slate-950">
      <main className="flex-1 pl-16 transition-all duration-300 w-full">
        {children}
      </main>
    </div>
  );
}