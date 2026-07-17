import Link from "next/link";
import { redirect } from "next/navigation";

import LogoutButton from "@/components/LogoutButton";
import { isAdminEmail } from "@/lib/admin-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard Admin",
  description: "Ringkasan sistem admin",
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

  /*
   * Halaman pengguna biasa.
   */
  if (!isAdminEmail(email)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
        <section className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex justify-end">
              <LogoutButton />
            </div>

            <div className="py-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-4xl">
                👋
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-100">
                Login berhasil
              </p>

              <h1 className="mt-3 text-4xl font-black">
                Selamat datang, {fullName}
              </h1>

              <p className="mt-3 text-blue-100">
                Akun kamu berhasil masuk ke dalam
                aplikasi.
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">
                Email akun
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {email}
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /*
   * Mengambil seluruh user untuk kartu statistik.
   */
  const supabaseAdmin = createAdminClient();

  const {
    data: usersData,
    error: usersError,
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  const users = usersError
    ? []
    : usersData.users;

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (registeredUser) =>
      Boolean(
        registeredUser.email_confirmed_at ??
          registeredUser.confirmed_at,
      ),
  ).length;

  const loggedInUsers = users.filter(
    (registeredUser) =>
      Boolean(registeredUser.last_sign_in_at),
  ).length;

  const recentUsers = [...users]
    .sort(
      (firstUser, secondUser) =>
        new Date(
          secondUser.created_at,
        ).getTime() -
        new Date(
          firstUser.created_at,
        ).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* JUDUL */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Admin Management System
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Selamat datang, {fullName}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Berikut ringkasan data pengguna aplikasi
              kamu.
            </p>
          </div>

          <Link
            href="/admin/users"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Lihat semua user
          </Link>
        </div>
      </section>

      {/* KARTU STATISTIK */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Total User"
          value={totalUsers}
          description="Semua akun terdaftar"
          color="blue"
          icon="users"
        />

        <DashboardCard
          title="User Aktif"
          value={activeUsers}
          description="Email sudah dikonfirmasi"
          color="green"
          icon="active"
        />

        <DashboardCard
          title="Pernah Login"
          value={loggedInUsers}
          description="Akun pernah masuk aplikasi"
          color="amber"
          icon="login"
        />
      </section>

      {/* USER TERBARU */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="font-bold text-slate-900">
              User terbaru
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Lima akun yang terakhir mendaftar.
            </p>
          </div>

          <Link
            href="/admin/users"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Lihat semua
          </Link>
        </div>

        {usersError ? (
          <div className="p-6 text-sm text-red-600">
            Data pengguna gagal dimuat:{" "}
            {usersError.message}
          </div>
        ) : recentUsers.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Belum ada pengguna.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentUsers.map((registeredUser) => {
              const name =
                typeof registeredUser.user_metadata
                  ?.full_name === "string"
                  ? registeredUser.user_metadata.full_name
                  : "Tanpa nama";

              return (
                <div
                  key={registeredUser.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {getInitial(name)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {name}
                      </p>

                      <p className="truncate text-sm text-slate-500">
                        {registeredUser.email}
                      </p>
                    </div>
                  </div>

                  <p className="hidden shrink-0 text-sm text-slate-500 sm:block">
                    {formatDate(
                      registeredUser.created_at,
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  color,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  color: "blue" | "green" | "amber";
  icon: "users" | "active" | "login";
}) {
  const styles = {
    blue: {
      container: "border-blue-200",
      icon: "bg-blue-100 text-blue-700",
      value: "text-blue-700",
    },
    green: {
      container: "border-emerald-200",
      icon: "bg-emerald-100 text-emerald-700",
      value: "text-emerald-700",
    },
    amber: {
      container: "border-amber-200",
      icon: "bg-amber-100 text-amber-700",
      value: "text-amber-700",
    },
  };

  const selectedStyle = styles[color];

  return (
    <article
      className={`rounded-2xl border bg-white p-6 shadow-sm ${selectedStyle.container}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p
            className={`mt-2 text-4xl font-black ${selectedStyle.value}`}
          >
            {value}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${selectedStyle.icon}`}
        >
          <CardIcon name={icon} />
        </div>
      </div>
    </article>
  );
}

function CardIcon({
  name,
}: {
  name: "users" | "active" | "login";
}) {
  if (name === "active") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m5 12 4 4L19 6"
        />
      </svg>
    );
  }

  if (name === "login") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 17l5-5-5-5M15 12H3"
        />

        <path
          strokeLinecap="round"
          d="M15 5h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />

      <circle cx="9" cy="7" r="4" />

      <path
        strokeLinecap="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87"
      />
    </svg>
  );
}

function getInitial(name: string) {
  const normalizedName = name.trim();

  return normalizedName
    ? normalizedName.charAt(0).toUpperCase()
    : "?";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(date);
}