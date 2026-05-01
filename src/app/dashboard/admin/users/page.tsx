"use client";

import { motion } from "framer-motion";
import { Shield, ShieldAlert, UserX, UserCheck, MoreVertical } from "lucide-react";

const mockUsers = [
  { id: "usr_1", name: "Alex W.", email: "alex@dev.com", role: "SELLER", status: "ACTIVE", joined: "Oct 1, 2026" },
  { id: "usr_2", name: "Spam Bot", email: "promo@scam.net", role: "BUYER", status: "SUSPENDED", joined: "Oct 25, 2026" },
  { id: "usr_3", name: "Sarah J.", email: "sarah@copy.io", role: "SELLER", status: "ACTIVE", joined: "Sep 14, 2026" },
];

export default function AdminUsersPage() {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Manage Users</h1>
        <p className="text-slate-400">View, manage, and moderate platform accounts.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${user.role === 'SELLER' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.status === "ACTIVE" ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400"><UserCheck className="w-4 h-4"/> Active</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-400"><UserX className="w-4 h-4"/> Suspended</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-400">{user.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}