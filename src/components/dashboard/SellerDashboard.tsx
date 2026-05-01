"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, TrendingUp, Package, Clock, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";

// Mock data - Your backend will generate this using Prisma's groupBy!
const mockChartData = [
  { name: "Mon", revenue: 45, sales: 3 },
  { name: "Tue", revenue: 120, sales: 8 },
  { name: "Wed", revenue: 85, sales: 5 },
  { name: "Thu", revenue: 210, sales: 14 },
  { name: "Fri", revenue: 290, sales: 19 },
  { name: "Sat", revenue: 190, sales: 12 },
  { name: "Sun", revenue: 340, sales: 22 },
];

export default function SellerDashboard() {
  const router = useRouter();
  const [prompts, setPrompts] = useState([]);
  
  // In reality, fetch this from /api/dashboard/seller
  const stats = {
    totalRevenue: 1280.50,
    totalSales: 83,
    activePrompts: 12,
    pendingPrompts: 2
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Seller Overview</h1>
          <p className="text-slate-400">Track your revenue, sales, and prompt performance.</p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<DollarSign />} title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} trend="+14.5%" />
          <StatCard icon={<ShoppingCart />} title="Total Sales" value={stats.totalSales} trend="+5.2%" />
          <StatCard icon={<CheckCircle />} title="Active Prompts" value={stats.activePrompts} />
          <StatCard icon={<Clock />} title="Pending Approvals" value={stats.pendingPrompts} alert />
        </div>

        {/* CHARTS SECTION */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Trend (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OFFERING PROMPTS TABLE */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Your Prompts</h3>
            <button onClick={() => router.push('/create')} className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-colors">
              + New Prompt
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-medium">Prompt Title</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Sales</th>
                </tr>
              </thead>
              <tbody className="text-slate-300 divide-y divide-slate-800/50">
                {/* Mock Row 1 */}
                <tr className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 font-medium text-white">Senior React Component Architect</td>
                  <td className="py-4">Development</td>
                  <td className="py-4 font-mono text-emerald-400">$9.99</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      APPROVED
                    </span>
                  </td>
                  <td className="py-4 text-right">42</td>
                </tr>
                {/* Mock Row 2 */}
                <tr className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 font-medium text-white">Advanced SEO Blog Generator</td>
                  <td className="py-4">Copywriting</td>
                  <td className="py-4 font-mono text-emerald-400">$4.99</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      PENDING
                    </span>
                  </td>
                  <td className="py-4 text-right text-slate-500">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// Mini component for the top KPI cards
function StatCard({ icon, title, value, trend, alert }: any) {
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${alert ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-black text-white">{value}</h4>
      </div>
    </motion.div>
  );
}