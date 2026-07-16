"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleRegister(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (name.trim().length < 3) {
      setError("Nama minimal terdiri dari 3 karakter.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password minimal terdiri dari 6 karakter.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Konfirmasi password tidak sama dengan password.",
      );
      return;
    }

    if (!agree) {
      setError(
        "Kamu harus menyetujui syarat dan ketentuan.",
      );
      return;
    }

    setLoading(true);

    // Tidak menggunakan database.
    // Proses register hanya simulasi tampilan.
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }, 600);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
        {/* Bagian kiri */}
        <div className="hidden min-h-[720px] flex-col justify-between bg-gradient-to-br from-fuchsia-600 via-violet-600 to-indigo-600 p-12 text-white lg:flex">
          <div>
            <div className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              Admin Management System
            </div>

            <h1 className="mt-10 max-w-md text-5xl font-bold leading-tight">
              Buat akun dan mulai mengelola sistem.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-white/80">
              Lengkapi formulir registrasi untuk membuat
              akun administrasi baru.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                ✓
              </span>

              <p className="text-sm text-white/80">
                Tampilan responsif untuk semua perangkat
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                ✓
              </span>

              <p className="text-sm text-white/80">
                Dibuat menggunakan Next.js
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                ✓
              </span>

              <p className="text-sm text-white/80">
                Siap di-deploy ke Vercel
              </p>
            </div>
          </div>
        </div>

        {/* Bagian kanan */}
        <div className="flex min-h-[720px] items-center p-6 sm:p-10 lg:p-14">
          <div className="w-full">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
                Admin Management System
              </div>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Registrasi akun
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Buat akun baru
            </h2>

            <p className="mt-3 text-slate-400">
              Isi informasi berikut untuk mendaftar.
            </p>

            <form
              onSubmit={handleRegister}
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Nama lengkap
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Masukkan nama lengkap"
                  autoComplete="name"
                  required
                  minLength={3}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email
                </label>

                <input
                  id="register-email"
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
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Minimal 6 karakter"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Konfirmasi password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  placeholder="Masukkan kembali password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(event) =>
                    setAgree(event.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-950"
                />

                <label
                  htmlFor="agree"
                  className="text-sm leading-6 text-slate-400"
                >
                  Saya menyetujui syarat dan ketentuan
                  yang berlaku.
                </label>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                >
                  Registrasi berhasil. Mengarahkan ke
                  halaman login...
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Memproses..."
                  : success
                    ? "Registrasi berhasil"
                    : "Daftar sekarang"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Sudah mempunyai akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Masuk di sini
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-slate-600">
              Ini merupakan halaman demonstrasi tanpa
              database.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}