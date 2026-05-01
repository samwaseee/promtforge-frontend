import RoleGuard from "@/components/auth/RoleGuard";

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="SELLER">
      {children}
    </RoleGuard>
  );
}