"use client";

import { DollarSign, TrendingUp, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revData = [
  { name: "Mon", gmv: 1200, platformTake: 120 },
  { name: "Tue", gmv: 1800, platformTake: 180 },
  { name: "Wed", gmv: 1400, platformTake: 140 },
  { name: "Thu", gmv: 2200, platformTake: 220 },
  { name: "Fri", gmv: 2900, platformTake: 290 },
  { name: "Sat", gmv: 3100, platformTake: 310 },
  { name: "Sun", gmv: 2800, platformTake: 280 },
];

export default function AdminFinancialsPage() {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8 transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Platform Revenue</h1>
        <p className="text-slate-600 dark:text-slate-400">Track Gross Merchandise Value (GMV) and platform fees collected.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total GMV (7d)</p>
          <h4 className="text-3xl font-black text-slate-900 dark:text-white">$15,400</h4>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
          <p className="text-emerald-700 dark:text-emerald-400/80 text-sm font-medium mb-1">Platform Take (10%)</p>
          <h4 className="text-3xl font-black text-emerald-600 dark:text-emerald-400">$1,540</h4>
        </div>
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Pending Seller Payouts</p>
          <h4 className="text-3xl font-black text-slate-900 dark:text-white">$4,230</h4>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Revenue Breakdown</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.4} vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                cursor={{ fill: '#64748b', opacity: 0.1 }} 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }} 
              />
              <Bar dataKey="gmv" fill="#64748b" radius={[4, 4, 0, 0]} name="Total GMV" />
              <Bar dataKey="platformTake" fill="#10b981" radius={[4, 4, 0, 0]} name="Platform Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}