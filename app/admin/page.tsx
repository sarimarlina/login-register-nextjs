import { redirect } from "next/navigation";

import AdminDashboard from "@/components/AdminDashboard";
import LogoutButton from "@/components/LogoutButton";
import { isAdminEmail } from "@/lib/admin-access";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard Admin",
  description: "Dashboard pengelolaan pengguna",
};

export default async function AdminPage() {
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

  const fullName = metadataName || "Pengguna";
  const email = user.email ?? "";

  if (isAdminEmail(email)) {
    return (
      <AdminDashboard
        currentUserName={fullName}
        currentUserEmail={email}
      />
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <section className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-6 sm:p-8">
          <div className="flex justify-end">
            <LogoutButton />
          </div>

          <div className="mt-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-4xl backdrop-blur">
              👋
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
              Login berhasil
            </p>

            <h1 className="mt-4 text-4xl font-black sm:text-6xl">
              Selamat datang,
              <span className="mt-2 block">
                {fullName}
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-white/75">
              Akun kamu berhasil masuk menggunakan
              Supabase Authentication.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
            <p className="text-sm text-slate-500">
              Email akun
            </p>

            <p className="mt-2 break-all font-semibold">
              {email}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
            <p className="text-sm font-medium text-emerald-300">
              Akun aktif dan terautentikasi
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}