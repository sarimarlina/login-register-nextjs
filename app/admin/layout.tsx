import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import AdminShell from "@/components/AdminShell";
import { isAdminEmail } from "@/lib/admin-access";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

  const currentUserName =
    metadataName || "Pengguna";

  const currentUserEmail = user.email ?? "";

  /*
   * Sidebar admin hanya muncul untuk email
   * yang terdaftar dalam ADMIN_EMAILS.
   */
  if (!isAdminEmail(currentUserEmail)) {
    return <>{children}</>;
  }

  return (
    <AdminShell
      currentUserName={currentUserName}
      currentUserEmail={currentUserEmail}
    >
      {children}
    </AdminShell>
  );
}