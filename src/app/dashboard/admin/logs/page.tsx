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
    <div className="p-6 md:p-12 max-w-5xl mx-auto transition-colors duration-300">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">System Logs</h1>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Level</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider ${
                        log.level === 'ERROR' 
                          ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10' 
                          : 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-400/10'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                      {log.action}
                    </td>
                    <td className="px-6 py-4">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-500 text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}