"use client";

import { useEffect, useState } from "react";
import AdminPortal from "@/components/dashboard/AdminPortal";
import SellerDashboard from "@/components/dashboard/SellerDashboard";

export default function DashboardOverview() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("promptforge_user") || "{}");
    setRole(user.role);
  }, []);

  return (
    <div className="p-8 md:p-12 text-slate-50">
      {role === "ADMIN" && <AdminPortal />}
      {role === "SELLER" && <SellerDashboard />}
    </div>
  );
}