"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  confirmedAt: string | null;
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

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loadingUsers, setLoadingUsers] =
    useState(true);
  const [submitting, setSubmitting] =
    useState(false);
  const [deletingId, setDeletingId] = useState<
    string | null
  >(null);
  const [modalOpen, setModalOpen] =
    useState(false);
  const [editingId, setEditingId] = useState<
    string | null
  >(null);
  const [form, setForm] =
    useState<UserForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/users",
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const result =
        await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Data pengguna gagal dimuat.",
        );
      }

      setUsers(result.users ?? []);
    } catch (caughtError) {
      setUsers([]);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Data pengguna gagal dimuat.",
      );
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

    return users.filter(
      (user) =>
        user.name
          .toLowerCase()
          .includes(keyword) ||
        user.email
          .toLowerCase()
          .includes(keyword),
    );
  }, [search, users]);

  const activeUsers = users.filter((user) =>
    Boolean(user.confirmedAt),
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

      const method = editingId
        ? "PATCH"
        : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email
            .trim()
            .toLowerCase(),
          password: form.password,
        }),
      });

      const result =
        await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Data pengguna gagal disimpan.",
        );
      }

      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);

      setMessage(
        result.message ??
          "Data pengguna berhasil disimpan.",
      );

      await loadUsers();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Data pengguna gagal disimpan.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(
    user: UserRecord,
  ) {
    const confirmed = window.confirm(
      `Hapus akun ${user.name} (${user.email})?`,
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

      const result =
        await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Pengguna gagal dihapus.",
        );
      }

      setMessage(
        result.message ??
          "Pengguna berhasil dihapus.",
      );

      await loadUsers();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Pengguna gagal dihapus.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER HALAMAN */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Manajemen pengguna
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Semua User
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Tambah, edit, cari, dan hapus akun
              pengguna.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Tambah User
          </button>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total user
          </p>

          <p className="mt-2 text-3xl font-black text-blue-700">
            {users.length}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            User aktif
          </p>

          <p className="mt-2 text-3xl font-black text-emerald-700">
            {activeUsers}
          </p>
        </div>
      </section>

      {message && (
        <Notification
          type="success"
          message={message}
          onClose={() => setMessage("")}
        />
      )}

      {error && !modalOpen && (
        <Notification
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      {/* TABEL */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <label
            htmlFor="user-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Cari user
          </label>

          <input
            id="user-search"
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Cari nama atau email..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">
                  Pengguna
                </th>

                <th className="px-5 py-4">
                  Tanggal daftar
                </th>

                <th className="px-5 py-4">
                  Login terakhir
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loadingUsers ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-14 text-center text-sm text-slate-500"
                  >
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-14 text-center text-sm text-slate-500"
                  >
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                          {getInitial(user.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {user.name}
                          </p>

                          <p className="truncate text-sm text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {user.lastSignInAt
                        ? formatDate(
                            user.lastSignInAt,
                          )
                        : "Belum pernah login"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          user.confirmedAt
                            ? "inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                            : "inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
                        }
                      >
                        {user.confirmedAt
                          ? "Aktif"
                          : "Belum aktif"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(user)
                          }
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            deletingId === user.id
                          }
                          onClick={() =>
                            void handleDelete(user)
                          }
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
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
      </section>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 px-4 py-8">
          <section className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  {editingId
                    ? "Edit pengguna"
                    : "Pengguna baru"}
                </p>

                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  {editingId
                    ? "Perbarui data user"
                    : "Tambah user"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-500 hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <FormInput
                id="name"
                label="Nama lengkap"
                type="text"
                value={form.name}
                placeholder="Masukkan nama lengkap"
                required
                onChange={(value) =>
                  updateForm("name", value)
                }
              />

              <FormInput
                id="email"
                label="Email"
                type="email"
                value={form.email}
                placeholder="nama@email.com"
                required
                onChange={(value) =>
                  updateForm("email", value)
                }
              />

              <FormInput
                id="password"
                label={
                  editingId
                    ? "Password baru"
                    : "Password"
                }
                type="password"
                value={form.password}
                placeholder={
                  editingId
                    ? "Kosongkan jika tidak diubah"
                    : "Minimal 6 karakter"
                }
                required={!editingId}
                onChange={(value) =>
                  updateForm("password", value)
                }
              />

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting
                    ? "Menyimpan..."
                    : editingId
                      ? "Simpan perubahan"
                      : "Tambah user"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function FormInput({
  id,
  label,
  type,
  value,
  placeholder,
  required,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  required: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        required={required}
        minLength={
          type === "password" && value
            ? 6
            : undefined
        }
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}

function Notification({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border px-5 py-4 text-sm ${
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        className="text-lg font-bold"
      >
        ×
      </button>
    </div>
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
    timeStyle: "short",
  }).format(date);
}

async function readApiResponse(
  response: Response,
): Promise<ApiResponse> {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (
    contentType.includes("application/json")
  ) {
    return (await response.json()) as ApiResponse;
  }

  const responseText =
    await response.text();

  console.error("Respons API bukan JSON:", {
    status: response.status,
    body: responseText,
  });

  return {
    message:
      response.status === 404
        ? "Endpoint API tidak ditemukan."
        : `Server mengalami kesalahan (${response.status}).`,
  };
}