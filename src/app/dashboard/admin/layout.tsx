import RoleGuard from "@/components/auth/RoleGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="ADMIN">
      <div className="flex min-h-screen bg-slate-950">
        <main className="flex-1 pl-16 transition-all duration-300">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}