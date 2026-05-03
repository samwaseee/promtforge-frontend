"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  Users,
  LogOut,
  BarChart3,
  Wallet,
  MessageSquare,
  ClipboardCheck,
  Activity,
  HelpCircle,
  Moon,
  Sun
} from "lucide-react";
import { auth } from "@/lib/firebase";

interface SidebarProps {
  role: string;
  onHoverChange: (isHovered: boolean) => void;
}

// Helper component to keep the code clean and handle active states
const NavItem = ({ href, icon: Icon, label, pathname }: { href: string, icon: any, label: string, pathname: string }) => {
  // Exact match for dashboard root, partial match for sub-routes
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors whitespace-nowrap ${isActive
          ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium">
        {label}
      </span>
    </Link>
  );
};

export default function Sidebar({ role, onHoverChange }: SidebarProps) {
  const pathname = usePathname() || "";
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("promptforge_theme");
    if (storedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("promptforge_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("promptforge_token");
    localStorage.removeItem("promptforge_user");
    window.location.href = "/login";
  };

  return (
    <aside
      // ✨ Tell the layout when the mouse enters and leaves!
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      // We keep 'group', 'w-16', and 'hover:w-64' so the CSS still handles the smooth expansion
      className="fixed left-0 top-0 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 overflow-hidden flex flex-col group w-16 hover:w-64 shadow-2xl"
    >
      {/* Logo Area */}
      <Link href="/" className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 whitespace-nowrap px-4 bg-slate-50/50 dark:bg-slate-900/50">
        <span className="text-blue-600 dark:text-blue-500 font-black text-xl group-hover:hidden">PF</span>
        <div className="hidden group-hover:flex items-center gap-2 ml-2 w-full">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">PF</span>
          </div>
          <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">PromptForge</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto overflow-x-hidden scrollbar-hide">

        {/* COMMON / GLOBAL */}
        <div className="mb-2">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Overview
          </p>
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" pathname={pathname} />
        </div>

        {/* SELLER SPECIFIC MENU */}
        {role === "SELLER" && (
          <div className="mb-2 border-t border-slate-200 dark:border-slate-800/50 pt-4 mt-2">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Store Management
            </p>
            <NavItem href="/dashboard/seller/inventory" icon={Package} label="My Prompts" pathname={pathname} />
            <NavItem href="/dashboard/seller/analytics" icon={BarChart3} label="Analytics & Traffic" pathname={pathname} />
            <NavItem href="/dashboard/seller/reviews" icon={MessageSquare} label="Customer Reviews" pathname={pathname} />
            <NavItem href="/dashboard/seller/payouts" icon={Wallet} label="Earnings & Payouts" pathname={pathname} />
          </div>
        )}

        {/* ADMIN SPECIFIC MENU */}
        {role === "ADMIN" && (
          <div className="mb-2 border-t border-slate-200 dark:border-slate-800/50 pt-4 mt-2">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Platform Admin
            </p>
            {/* The most important route based on our previous logic fixes: */}
            <NavItem href="/dashboard/admin/approvals" icon={ClipboardCheck} label="Approval Queue" pathname={pathname} />
            <NavItem href="/dashboard/admin/users" icon={Users} label="Manage Users" pathname={pathname} />
            <NavItem href="/dashboard/admin/financials" icon={Wallet} label="Platform Revenue" pathname={pathname} />
            <NavItem href="/dashboard/admin/logs" icon={Activity} label="System Logs" pathname={pathname} />
          </div>
        )}
      </div>

      {/* Bottom Actions (Shared) */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col gap-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-4 px-3 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors whitespace-nowrap w-full"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
        <NavItem href="/dashboard/settings" icon={Settings} label="Settings" pathname={pathname} />
        <NavItem href="/support" icon={HelpCircle} label="Help & Support" pathname={pathname} />

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-3 py-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors whitespace-nowrap w-full mt-2"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}