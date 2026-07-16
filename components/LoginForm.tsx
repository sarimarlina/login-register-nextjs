"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (loginError) {
        setError(
          "Email atau password salah.",
        );
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      console.error(loginError);

      setError(
        "Tidak dapat terhubung ke Supabase.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
        <div className="hidden min-h-[650px] flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-12 text-white lg:flex">
          <div>
            <div className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              Admin Management System
            </div>

            <h1 className="mt-10 max-w-md text-5xl font-bold leading-tight">
              Kelola sistem dengan lebih mudah.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-white/80">
              Masuk menggunakan akun yang
              telah terdaftar di Supabase.
            </p>
          </div>

          <p className="text-sm text-white/70">
            Next.js • Supabase • Vercel
          </p>
        </div>

        <div className="flex min-h-[650px] items-center p-6 sm:p-10 lg:p-14">
          <div className="w-full">
            <div className="mb-8 lg:hidden">
              <span className="inline-flex rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
                Admin Management System
              </span>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Selamat datang
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Masuk ke akun
            </h2>

            <p className="mt-3 text-slate-400">
              Masukkan email dan password
              yang sudah terdaftar.
            </p>

            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-5"
            >
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
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="nama@email.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Memeriksa akun..."
                  : "Masuk"}
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
          </div>
        </div>
      </section>
    </main>
  );
}