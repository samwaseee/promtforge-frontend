"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Eye, MousePointerClick, TrendingUp, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// Mock Data - In reality, fetched from GET /api/seller/analytics
const conversionData = [
  { name: "Mon", views: 400, clicks: 240, sales: 24 },
  { name: "Tue", views: 300, clicks: 139, sales: 18 },
  { name: "Wed", views: 550, clicks: 380, sales: 45 },
  { name: "Thu", views: 278, clicks: 190, sales: 12 },
  { name: "Fri", views: 189, clicks: 98, sales: 8 },
  { name: "Sat", views: 239, clicks: 150, sales: 15 },
  { name: "Sun", views: 349, clicks: 210, sales: 28 },
];

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8 transition-colors duration-300">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Analytics & Traffic</h1>
        <p className="text-slate-600 dark:text-slate-400">Measure your prompt performance and marketplace conversion rates.</p>
      </div>

      {/* QUICK STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Impressions" value="2,305" icon={<Eye />} trend="+12.5%" />
        <MetricCard title="Detail Page Views" value="1,407" icon={<MousePointerClick />} trend="+8.2%" />
        <MetricCard title="Conversion Rate" value="10.6%" icon={<TrendingUp />} trend="-1.1%" alert />
      </div>

      {/* MAIN CHART - THE FUNNEL */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Views vs. Sales (Last 7 Days)</h3>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversionData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} vertical={false} />
              <XAxis dataKey="name" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9', opacity: 0.4 }}
                contentStyle={{ 
                  backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                  borderColor: isDark ? '#1e293b' : '#e2e8f0', 
                  borderRadius: '8px', 
                  color: isDark ? '#f8fafc' : '#0f172a',
                  boxShadow: isDark ? 'none' : '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              {/* Layered bars to show the funnel: Views -> Clicks -> Sales */}
              <Bar dataKey="views" fill={isDark ? "#1e293b" : "#cbd5e1"} radius={[4, 4, 0, 0]} name="Impressions" />
              <Bar dataKey="clicks" fill="#3b82f6" fillOpacity={isDark ? 0.5 : 0.8} radius={[4, 4, 0, 0]} name="Page Views" />
              <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} name="Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}

function MetricCard({ title, value, icon, trend, alert }: any) {
  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-sm dark:shadow-none transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-blue-600 dark:text-blue-400 transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${alert ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
          {trend}
          {!alert && <ArrowUpRight className="w-3 h-3" />}
        </div>
      </div>
      <div>
        <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</h4>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      </div>
    </div>
  );
}