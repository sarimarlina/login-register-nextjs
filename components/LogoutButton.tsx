"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const supabase = createClient();

      await supabase.auth.signOut();

      router.replace("/login");
      router.refresh();
    } catch (logoutError) {
      console.error(logoutError);

      alert(
        "Logout gagal. Silakan coba kembali.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-red-400 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Keluar..." : "Logout"}
    </button>
  );
}