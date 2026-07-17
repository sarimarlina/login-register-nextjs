import { redirect } from "next/navigation";

import AdminDashboard from "@/components/AdminDashboard";
import { isAdminEmail } from "@/lib/admin-access";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Semua User",
  description: "Kelola seluruh pengguna",
};

export default async function UsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/admin");
  }

  return <AdminDashboard />;
}