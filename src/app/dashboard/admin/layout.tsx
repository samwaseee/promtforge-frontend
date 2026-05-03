import RoleGuard from "@/components/auth/RoleGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      {/* We removed the <div flex> and <main pl-16> here because 
        the parent DashboardLayout is already doing it! 
      */}
      {children}
    </RoleGuard>
  );
}