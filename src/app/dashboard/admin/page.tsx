"use client";

import AdminPortal from "@/components/dashboard/AdminPortal";

export default function AdminOverviewPage() {
  return (
    // Your RoleGuard is already handling the security in the layout, 
    // so this page literally just summons your component!
    <div className="w-full h-full">
      <AdminPortal />
    </div>
  );
}