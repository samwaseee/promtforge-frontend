import RoleGuard from "@/components/auth/RoleGuard";

export default function EditLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRole="SELLER">
      {children}
    </RoleGuard>
  );
}