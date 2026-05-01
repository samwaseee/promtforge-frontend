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
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Platform Revenue</h1>
        <p className="text-slate-400">Track Gross Merchandise Value (GMV) and platform fees collected.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <p className="text-slate-400 text-sm font-medium mb-1">Total GMV (7d)</p>
          <h4 className="text-3xl font-black text-white">$15,400</h4>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-md">
          <p className="text-emerald-400/80 text-sm font-medium mb-1">Platform Take (10%)</p>
          <h4 className="text-3xl font-black text-emerald-400">$1,540</h4>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
          <p className="text-slate-400 text-sm font-medium mb-1">Pending Seller Payouts</p>
          <h4 className="text-3xl font-black text-white">$4,230</h4>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-lg font-bold text-white mb-6">Revenue Breakdown</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip cursor={{ fill: '#1e293b', opacity: 0.4 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }} />
              <Bar dataKey="gmv" fill="#1e293b" radius={[4, 4, 0, 0]} name="Total GMV" />
              <Bar dataKey="platformTake" fill="#10b981" radius={[4, 4, 0, 0]} name="Platform Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}