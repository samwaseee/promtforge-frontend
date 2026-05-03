"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { AlertCircle, Info, ShieldAlert } from "lucide-react";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/api/admin/logs', true).then(setLogs);
  }, []);

  return (
    <div className="p-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">System Logs</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {logs.map((log) => (
              <tr key={log.id} className="text-slate-300">
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.level === 'ERROR' ? 'text-red-400 bg-red-400/10' : 'text-blue-400 bg-blue-400/10'
                  }`}>
                    {log.level}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{log.action}</td>
                <td className="px-6 py-4">{log.message}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}