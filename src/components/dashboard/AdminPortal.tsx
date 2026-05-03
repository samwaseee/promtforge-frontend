"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, Activity, Database, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useRouter } from "next/navigation";

// --- MOCK DATA (Fetch from /api/admin/overview) ---
const revenueData = [
  { name: "Mon", revenue: 1200 },
  { name: "Tue", revenue: 1800 },
  { name: "Wed", revenue: 1400 },
  { name: "Thu", revenue: 2200 },
  { name: "Fri", revenue: 2900 },
  { name: "Sat", revenue: 3100 },
  { name: "Sun", revenue: 2800 },
];

const categoryData = [
  { name: 'Development', value: 400 },
  { name: 'Copywriting', value: 300 },
  { name: 'Marketing', value: 300 },
  { name: 'Design', value: 200 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const recentActivity = [
  { id: 1, action: "New Sale", details: "'Senior React Architect' sold for $9.99", time: "2 mins ago", type: "sale" },
  { id: 2, action: "New User", details: "alex.dev joined as Seller", time: "15 mins ago", type: "user" },
  { id: 3, action: "Prompt Submitted", details: "'SEO Blog Post' is waiting for approval", time: "1 hour ago", type: "system" },
];

export default function AdminOverview() {
  const router = useRouter();

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Platform Overview</h1>
          <p className="text-slate-600 dark:text-slate-400">High-level metrics and health of the PromptForge marketplace.</p>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total GMV" value="$12,450" icon={<DollarSign />} trend="+18.2%" color="blue" />
        <MetricCard title="Total Users" value="1,204" icon={<Users />} trend="+4.1%" color="emerald" />
        <MetricCard title="Active Prompts" value="842" icon={<Database />} trend="+12%" color="amber" />
        
        {/* Interactive card linking to the Approval Queue */}
        <motion.div 
          whileHover={{ y: -2 }} 
          onClick={() => router.push('/dashboard/approvals')}
          className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl backdrop-blur-md cursor-pointer hover:border-blue-400 dark:hover:border-blue-500/50 shadow-sm dark:shadow-none transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl transition-colors"><Activity /></div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1">
              View Queue <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-1">14</h4>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Approvals</p>
          </div>
        </motion.div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN REVENUE CHART (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Platform GMV (Last 7 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlatformRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#10b981' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPlatformRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY DISTRIBUTION (Spans 1 column) */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col shadow-sm dark:shadow-none transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Inventory by Category</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((category, idx) => (
              <div key={category.name} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[idx] }} />
                {category.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY LOG */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Live Platform Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${activity.type === 'sale' ? 'bg-emerald-500' : activity.type === 'user' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.details}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, icon, trend, color }: any) {
  // Dynamic color maps for the icons
  const colorMap: any = {
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
  };

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl transition-colors ${colorMap[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-1 rounded-lg transition-colors">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{value}</h4>
      </div>
    </div>
  );
}