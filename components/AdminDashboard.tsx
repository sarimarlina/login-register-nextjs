"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import LogoutButton from "@/components/LogoutButton";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  confirmedAt: string | null;
};

type AdminDashboardProps = {
  currentUserName: string;
  currentUserEmail: string;
};

type UserForm = {
  name: string;
  email: string;
  password: string;
};

type ApiResponse = {
  users?: UserRecord[];
  message?: string;
};

const emptyForm: UserForm = {
  name: "",
  email: "",
  password: "",
};

export default function AdminDashboard({
  currentUserName,
  currentUserEmail,
}: AdminDashboardProps) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [form, setForm] = useState<UserForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setError("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Data pengguna tidak dapat dimuat.",
        );
      }

      setUsers(result.users ?? []);
    } catch (caughtError) {
      const errorMessage =
        caughtError instanceof Error
          ? caughtError.message
          : "Data pengguna tidak dapat dimuat.";

      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      );
    });
  }, [search, users]);

  const confirmedUsers = users.filter((user) =>
    Boolean(user.confirmedAt),
  ).length;

  const usersWhoLoggedIn = users.filter((user) =>
    Boolean(user.lastSignInAt),
  ).length;

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setModalOpen(true);
  }

  function openEditModal(user: UserRecord) {
    setEditingId(user.id);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
    });

    setError("");
    setMessage("");
    setModalOpen(true);
  }

  function closeModal() {
    if (submitting) {
      return;
    }

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function updateForm(
    field: keyof UserForm,
    value: string,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const endpoint = editingId
        ? `/api/admin/users/${editingId}`
        : "/api/admin/users";

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message ?? "Data gagal disimpan.",
        );
      }

      const successMessage =
        result.message ??
        (editingId
          ? "Pengguna berhasil diperbarui."
          : "Pengguna berhasil ditambahkan.");

      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setMessage(successMessage);

      await loadUsers();
    } catch (caughtError) {
      const errorMessage =
        caughtError instanceof Error
          ? caughtError.message
          : "Data gagal disimpan.";

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(user: UserRecord) {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus akun ${user.name} (${user.email})?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(user.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/users/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message ?? "Pengguna gagal dihapus.",
        );
      }

      setMessage(
        result.message ?? "Pengguna berhasil dihapus.",
      );

      await loadUsers();
    } catch (caughtError) {
      const errorMessage =
        caughtError instanceof Error
          ? caughtError.message
          : "Pengguna gagal dihapus.";

      setError(errorMessage);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <header className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
                  Admin Management System
                </p>

                <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                  Selamat datang, {currentUserName}
                </h1>

                <p className="mt-2 text-sm text-white/75">
                  {currentUserEmail}
                </p>
              </div>

              <LogoutButton />
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
            <StatCard
              title="Total pengguna"
              value={users.length}
              description="Semua akun terdaftar"
              icon="👥"
            />

            <StatCard
              title="Akun aktif"
              value={confirmedUsers}
              description="Email telah dikonfirmasi"
              icon="✅"
            />

            <StatCard
              title="Pernah login"
              value={usersWhoLoggedIn}
              description="Akun pernah masuk"
              icon="🔐"
            />
          </div>
        </header>

        {/* NOTIFIKASI BERHASIL */}
        {message && (
          <div
            role="status"
            className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300"
          >
            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="font-bold"
              aria-label="Tutup pemberitahuan"
            >
              ×
            </button>
          </div>
        )}

        {/* NOTIFIKASI ERROR UTAMA */}
        {error && !modalOpen && (
          <div
            role="alert"
            className="mt-6 flex items-start justify-between gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold"
              aria-label="Tutup pesan kesalahan"
            >
              ×
            </button>
          </div>
        )}

        {/* DATA PENGGUNA */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="flex flex-col gap-5 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
                Manajemen akun
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Data Pengguna
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Lihat, tambah, ubah, dan hapus akun pengguna.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
            >
              + Tambah Pengguna
            </button>
          </div>

          <div className="border-b border-slate-800 p-5 sm:p-6">
            <label
              htmlFor="search-user"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Cari pengguna
            </label>

            <input
              id="search-user"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Cari berdasarkan nama atau email..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* TABEL DESKTOP */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-left">
              <thead className="bg-slate-950/60">
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">
                    Pengguna
                  </th>

                  <th className="px-6 py-4">
                    Tanggal daftar
                  </th>

                  <th className="px-6 py-4">
                    Login terakhir
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {loadingUsers ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-14 text-center text-slate-400"
                    >
                      Memuat data pengguna...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-14 text-center text-slate-400"
                    >
                      Tidak ada pengguna yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-5">
                        <UserIdentity user={user} />
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        {user.lastSignInAt
                          ? formatDate(user.lastSignInAt)
                          : "Belum pernah login"}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge
                          active={Boolean(
                            user.confirmedAt,
                          )}
                        />
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(user)
                            }
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleDelete(user)
                            }
                            disabled={
                              deletingId === user.id
                            }
                            className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === user.id
                              ? "Menghapus..."
                              : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* KARTU MOBILE */}
          <div className="divide-y divide-slate-800 md:hidden">
            {loadingUsers ? (
              <p className="px-5 py-14 text-center text-slate-400">
                Memuat data pengguna...
              </p>
            ) : filteredUsers.length === 0 ? (
              <p className="px-5 py-14 text-center text-slate-400">
                Tidak ada pengguna yang ditemukan.
              </p>
            ) : (
              filteredUsers.map((user) => (
                <article
                  key={user.id}
                  className="space-y-5 p-5"
                >
                  <UserIdentity user={user} />

                  <div className="grid gap-4 text-sm sm:grid-cols-2">
                    <InformationItem
                      label="Tanggal daftar"
                      value={formatDate(
                        user.createdAt,
                      )}
                    />

                    <InformationItem
                      label="Login terakhir"
                      value={
                        user.lastSignInAt
                          ? formatDate(
                              user.lastSignInAt,
                            )
                          : "Belum pernah login"
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <StatusBadge
                      active={Boolean(
                        user.confirmedAt,
                      )}
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(user)
                        }
                        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleDelete(user)
                        }
                        disabled={
                          deletingId === user.id
                        }
                        className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-300 disabled:opacity-50"
                      >
                        {deletingId === user.id
                          ? "Menghapus..."
                          : "Hapus"}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* MODAL TAMBAH DAN EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/85 px-4 py-8 backdrop-blur-sm">
          <section className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
                  {editingId
                    ? "Edit pengguna"
                    : "Pengguna baru"}
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {editingId
                    ? "Perbarui data akun"
                    : "Tambah akun pengguna"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                aria-label="Tutup formulir"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="user-name"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Nama lengkap
                </label>

                <input
                  id="user-name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateForm(
                      "name",
                      event.target.value,
                    )
                  }
                  required
                  minLength={3}
                  maxLength={100}
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="user-email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email
                </label>

                <input
                  id="user-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateForm(
                      "email",
                      event.target.value,
                    )
                  }
                  required
                  placeholder="nama@email.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="user-password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  {editingId
                    ? "Password baru"
                    : "Password"}
                </label>

                <input
                  id="user-password"
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    updateForm(
                      "password",
                      event.target.value,
                    )
                  }
                  required={!editingId}
                  minLength={
                    form.password.length > 0
                      ? 6
                      : undefined
                  }
                  autoComplete="new-password"
                  placeholder={
                    editingId
                      ? "Kosongkan jika tidak ingin diubah"
                      : "Minimal 6 karakter"
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

                {editingId && (
                  <p className="mt-2 text-xs text-slate-500">
                    Kosongkan kolom password apabila
                    password tidak ingin diubah.
                  </p>
                )}
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Menyimpan..."
                    : editingId
                      ? "Simpan perubahan"
                      : "Tambah pengguna"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black text-white">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl">
          {icon}
        </div>
      </div>
    </article>
  );
}

function UserIdentity({
  user,
}: {
  user: UserRecord;
}) {
  const initial = user.name
    ? user.name.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 font-bold text-indigo-300">
        {initial}
      </div>

      <div className="min-w-0">
        <p className="truncate font-semibold text-white">
          {user.name || "Tanpa nama"}
        </p>

        <p className="mt-1 truncate text-sm text-slate-400">
          {user.email}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={
        active
          ? "inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300"
          : "inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
      }
    >
      {active ? "Aktif" : "Belum aktif"}
    </span>
  );
}

function InformationItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-300">
        {value}
      </p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function readApiResponse(
  response: Response,
): Promise<ApiResponse> {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (
    contentType
      .toLowerCase()
      .includes("application/json")
  ) {
    return (await response.json()) as ApiResponse;
  }

  const responseText = await response.text();

  console.error(
    "API mengembalikan HTML atau non-JSON:",
    {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      body: responseText,
    },
  );

  if (response.status === 404) {
    return {
      message:
        "Endpoint API tidak ditemukan. Pastikan file app/api/admin/users/route.ts berada di lokasi yang benar.",
    };
  }

  if (response.status === 401) {
    return {
      message:
        "Sesi login tidak ditemukan. Silakan logout kemudian login kembali.",
    };
  }

  if (response.status === 403) {
    return {
      message:
        "Akses admin ditolak. Pastikan ADMIN_EMAILS sama dengan email yang sedang login.",
    };
  }

  if (response.status >= 500) {
    return {
      message:
        `Terjadi kesalahan server (${response.status}). ` +
        "Periksa terminal VS Code untuk melihat error aslinya.",
    };
  }

  return {
    message:
      `Server mengembalikan respons tidak valid (${response.status}). ` +
      "Periksa endpoint API dan terminal VS Code.",
  };
}