"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useState,
} from "react";

import LogoutButton from "@/components/LogoutButton";

type AdminShellProps = {
  children: ReactNode;
  currentUserName: string;
  currentUserEmail: string;
};

const navigationItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: "dashboard",
  },
  {
    href: "/admin/users",
    label: "Semua User",
    icon: "users",
  },
];

export default function AdminShell({
  children,
  currentUserName,
  currentUserEmail,
}: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const pageTitle =
    pathname.startsWith("/admin/users")
      ? "Semua User"
      : "Dashboard";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          <Link
            href="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20">
              A
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Admin Panel
              </p>

              <p className="text-xs text-slate-500">
                Management System
              </p>
            </div>
          </Link>
        </div>

        {/* PROFIL */}
        <div className="border-b border-slate-200 px-4 py-5">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {getInitial(currentUserName)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {currentUserName}
              </p>

              <p className="truncate text-xs text-slate-500">
                {currentUserEmail}
              </p>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Menu utama
          </p>

          <div className="space-y-1">
            {navigationItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-blue-700"
                  }`}
                >
                  <MenuIcon
                    name={item.icon}
                    active={active}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <p className="mb-3 mt-8 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Informasi
          </p>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              Supabase aktif
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              Data pengguna terhubung dengan Supabase
              Authentication.
            </p>
          </div>
        </nav>

        {/* FOOTER SIDEBAR */}
        <div className="border-t border-slate-200 p-4">
          <p className="text-center text-xs text-slate-400">
            Admin Management © 2026
          </p>
        </div>
      </aside>

      {/* BAGIAN KANAN */}
      <div className="min-h-screen lg:pl-64">
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setSidebarOpen((current) => !current)
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              aria-label="Buka sidebar"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div>
              <h1 className="font-bold text-slate-900 sm:text-lg">
                {pageTitle}
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                Admin Management System
              </p>
            </div>
          </div>

          <LogoutButton variant="light" />
        </header>

        {/* ISI HALAMAN */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function MenuIcon({
  name,
  active,
}: {
  name: string;
  active: boolean;
}) {
  const className = `h-5 w-5 ${
    active ? "text-white" : "text-slate-500"
  }`;

  if (name === "users") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
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
          d="M19 8v6M22 11h-6"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
      />
    </svg>
  );
}

function getInitial(name: string) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return "A";
  }

  return normalizedName.charAt(0).toUpperCase();
}