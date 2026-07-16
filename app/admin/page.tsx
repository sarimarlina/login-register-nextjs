import Link from "next/link";

export const metadata = {
  title: "Admin | Admin System",
  description: "Halaman dashboard administrasi",
};

export default function AdminPage() {
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

          <Link
            href="/login"
            className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            Logout
          </Link>
        </header>

        <section className="mt-8 flex min-h-[500px] items-center justify-center rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-center shadow-2xl">
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
              Selamat datang di halaman admin. Tampilan ini dibuat menggunakan
              Next.js dan Tailwind CSS.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Status sistem aktif
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}