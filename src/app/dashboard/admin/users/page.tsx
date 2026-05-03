"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, UserX, UserCheck, MoreVertical, Loader2, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/apiClient"; // ✨ Import the API client

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ✨ 1. Fetch real users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiClient.get('/api/admin/users', true);
        setUsers(data);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✨ 2. Quick action to suspend/activate a user
  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    
    try {
      // Optimistic UI update for snappy feel
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      
      // Tell the backend to update
      await apiClient.post(`/api/admin/users/${userId}/status`, { status: newStatus }, true);
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Failed to update user status. Reverting change.");
      // Revert UI if the server request fails
      setUsers(users.map(u => u.id === userId ? { ...u, status: currentStatus } : u));
    }
  };

  // Helper to safely format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-blue-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Loading user database...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Manage Users</h1>
        <p className="text-slate-400">View, manage, and moderate platform accounts.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!error && (
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${user.role === 'SELLER' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
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
                  <td className="px-6 py-4 text-slate-400">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    {/* Action button to suspend/activate */}
                    <button 
                      onClick={() => toggleUserStatus(user.id, user.status || "ACTIVE")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        user.status === "ACTIVE" 
                          ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20" 
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                      }`}
                    >
                      {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}