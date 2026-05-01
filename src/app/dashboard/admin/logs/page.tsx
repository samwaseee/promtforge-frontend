"use client";

import { Activity, AlertTriangle, Info, XCircle } from "lucide-react";

const mockLogs = [
  { id: "lg_001", type: "ERROR", service: "Stripe Webhook", message: "Failed to verify signature for sub_123", time: "10:42 AM" },
  { id: "lg_002", type: "INFO", service: "Auth", message: "User alex@dev.com successfully logged in", time: "10:15 AM" },
  { id: "lg_003", type: "WARN", service: "Database", message: "Connection pool utilization at 85%", time: "09:30 AM" },
  { id: "lg_004", type: "INFO", service: "Prompt API", message: "New prompt 'SEO Generator' submitted for review", time: "08:12 AM" },
];

export default function AdminLogsPage() {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">System Logs</h1>
        <p className="text-slate-400">Live feed of application events, warnings, and errors.</p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden font-mono text-sm shadow-2xl">
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex gap-4 text-slate-400 text-xs uppercase font-bold tracking-wider">
          <div className="w-24">Status</div>
          <div className="w-32">Service</div>
          <div className="flex-1">Message</div>
          <div className="w-24 text-right">Time</div>
        </div>
        
        <div className="divide-y divide-slate-800/50">
          {mockLogs.map((log) => (
            <div key={log.id} className="p-4 flex gap-4 hover:bg-slate-900/50 transition-colors items-start">
              <div className="w-24 flex items-center gap-2">
                {log.type === 'ERROR' && <XCircle className="w-4 h-4 text-red-500" />}
                {log.type === 'WARN' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                {log.type === 'INFO' && <Info className="w-4 h-4 text-blue-500" />}
                <span className={`font-bold ${log.type === 'ERROR' ? 'text-red-400' : log.type === 'WARN' ? 'text-amber-400' : 'text-blue-400'}`}>
                  {log.type}
                </span>
              </div>
              <div className="w-32 text-slate-500">{log.service}</div>
              <div className="flex-1 text-slate-300">{log.message}</div>
              <div className="w-24 text-right text-slate-600">{log.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}