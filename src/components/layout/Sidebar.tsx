"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, Users, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("promptforge_token");
    localStorage.removeItem("promptforge_user");
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 z-50 transition-all duration-300 w-16 hover:w-64 group overflow-hidden flex flex-col">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800 whitespace-nowrap px-4">
        <span className="text-blue-500 font-bold text-xl group-hover:hidden">PF</span>
        <span className="text-white font-bold text-xl hidden group-hover:block ml-2">PromptForge</span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 flex flex-col gap-2 px-3">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors whitespace-nowrap ${pathname === '/dashboard' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">Overview</span>
        </Link>

        {/* Seller Specific Links */}
        {role === "SELLER" && (
          <Link 
            href="/dashboard/inventory" 
            className="flex items-center gap-4 px-3 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors whitespace-nowrap"
          >
            <Package className="w-5 h-5 flex-shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">My Prompts</span>
          </Link>
        )}

        {/* Admin Specific Links */}
        {role === "ADMIN" && (
          <Link 
            href="/dashboard/users" 
            className="flex items-center gap-4 px-3 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors whitespace-nowrap"
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">Manage Users</span>
          </Link>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors whitespace-nowrap w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">Logout</span>
        </button>
      </div>
    </aside>
  );
}