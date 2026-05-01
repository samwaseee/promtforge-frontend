"use client";

import { motion } from "framer-motion";
import { Wallet, ArrowDownRight, CheckCircle, Clock } from "lucide-react";

const mockPayouts = [
  { id: "PO-1042", amount: 450.00, status: "COMPLETED", date: "Oct 12, 2026", method: "Bank Transfer" },
  { id: "PO-1043", amount: 120.50, status: "PENDING", date: "Oct 28, 2026", method: "PayPal" },
];

export default function SellerPayoutsPage() {
  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Earnings & Payouts</h1>
        <p className="text-slate-400">Manage your revenue and withdrawal history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Wallet className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Available for Payout</span>
          </div>
          <h2 className="text-5xl font-black text-white my-4">$842.50</h2>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl w-max transition-colors">
            Request Withdrawal
          </button>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-center">
           <p className="text-slate-400 text-sm font-medium mb-1">Lifetime Earnings</p>
           <h4 className="text-2xl font-black text-white mb-6">$3,240.00</h4>
           <p className="text-slate-400 text-sm font-medium mb-1">Pending Clearance</p>
           <h4 className="text-2xl font-black text-amber-400">$120.50</h4>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">Payout History</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Transaction ID</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Method</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {mockPayouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-400">{payout.id}</td>
                <td className="px-6 py-4">{payout.date}</td>
                <td className="px-6 py-4">{payout.method}</td>
                <td className="px-6 py-4">
                  {payout.status === "COMPLETED" ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400"><CheckCircle className="w-3 h-3"/> COMPLETED</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400"><Clock className="w-3 h-3"/> PENDING</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-mono text-white font-bold">${payout.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}