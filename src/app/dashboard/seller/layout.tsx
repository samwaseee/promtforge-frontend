import RoleGuard from "@/components/auth/RoleGuard";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["SELLER"]}>
      {children}
    </RoleGuard>
  );
}