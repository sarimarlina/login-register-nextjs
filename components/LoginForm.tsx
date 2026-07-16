"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    // Karena tidak menggunakan database,
    // email dan password apa pun dapat digunakan.
    setTimeout(() => {
      router.push("/admin");
    }, 500);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
        {/* Bagian kiri */}
        <div className="hidden min-h-[650px] flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-12 text-white lg:flex">
          <div>
            <div className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              Admin Management System
            </div>

            <h1 className="mt-10 max-w-md text-5xl font-bold leading-tight">
              Kelola sistem dengan lebih mudah.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-white/80">
              Masuk ke halaman administrasi menggunakan tampilan login
              berbasis Next.js yang modern dan responsif.
            </p>
          </div>

          <p className="text-sm text-white/70">
            Next.js • Responsive Design • Vercel
          </p>
        </div>

        {/* Bagian kanan */}
        <div className="flex min-h-[650px] items-center p-6 sm:p-10 lg:p-14">
          <div className="w-full">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
                Admin Management System
              </div>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Selamat datang
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Masuk ke akun
            </h2>

            <p className="mt-3 text-slate-400">
              Masukkan email dan password untuk melanjutkan.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    Lupa password?
                  </button>
                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-600 bg-slate-950"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-slate-400"
                >
                  Ingat saya
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Belum mempunyai akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Daftar sekarang
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-slate-600">
              Ini merupakan halaman demonstrasi tanpa database.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}