import { redirect } from "next/navigation";

import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | Admin System",
  description:
    "Halaman dashboard administrasi",
};

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName =
    typeof user.user_metadata?.full_name ===
      "string" &&
    user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name
      : "Administrator";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              Admin Management System
            </p>

            <h1 className="mt-1 text-xl font-bold">
              Dashboard Admin
            </h1>
          </div>

          <LogoutButton />
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-center shadow-2xl">
            <div>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-4xl">
                👋
              </div>

              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-400">
                Berhasil login
              </p>

              <h2 className="mt-4 text-5xl font-black sm:text-7xl">
                Hello World
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                Selamat datang, {fullName}.
                Kamu berhasil masuk menggunakan
                Supabase Authentication.
              </p>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Status terautentikasi
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Informasi akun
            </p>

            <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold">
              {fullName
                .charAt(0)
                .toUpperCase()}
            </div>

            <h3 className="mt-5 text-2xl font-bold">
              {fullName}
            </h3>

            <p className="mt-2 break-all text-sm text-slate-400">
              {user.email}
            </p>

            <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-sm font-medium text-emerald-300">
                Akun aktif
              </p>

              <p className="mt-1 text-sm text-emerald-400">
                Terhubung dengan Supabase
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}