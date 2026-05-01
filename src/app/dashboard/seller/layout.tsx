import RoleGuard from "@/components/auth/RoleGuard";
import Sidebar from "@/components/layout/Sidebar"; // Your single dynamic sidebar

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="SELLER">
      <div className="flex min-h-screen bg-slate-950">
        <main className="flex-1 pl-16 transition-all duration-300">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}