import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/admin-session";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateUserBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

type UpdateAttributes = {
  email: string;
  password?: string;
  user_metadata: {
    full_name: string;
  };
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) {
      return NextResponse.json(
        {
          message:
            "Akses ditolak. Silakan login sebagai admin.",
        },
        {
          status: 403,
        },
      );
    }

    const { id } = await context.params;

    const body =
      (await request.json()) as UpdateUserBody;

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (name.length < 3) {
      return NextResponse.json(
        {
          message:
            "Nama minimal terdiri dari 3 karakter.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !email ||
      !email.includes("@") ||
      !email.includes(".")
    ) {
      return NextResponse.json(
        {
          message: "Format email tidak valid.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      password.length > 0 &&
      password.length < 6
    ) {
      return NextResponse.json(
        {
          message:
            "Password baru minimal terdiri dari 6 karakter.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      id === currentAdmin.id &&
      email !==
        currentAdmin.email
          ?.trim()
          .toLowerCase()
    ) {
      return NextResponse.json(
        {
          message:
            "Email admin yang sedang digunakan tidak dapat diubah.",
        },
        {
          status: 400,
        },
      );
    }

    const attributes: UpdateAttributes = {
      email,
      user_metadata: {
        full_name: name,
      },
    };

    if (password) {
      attributes.password = password;
    }

    const supabaseAdmin =
      createAdminClient();

    const {
      data,
      error,
    } =
      await supabaseAdmin.auth.admin.updateUserById(
        id,
        attributes,
      );

    if (error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      message:
        "Data pengguna berhasil diperbarui.",
      user: data.user,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/users/[id] gagal:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan pada server.";

    return NextResponse.json(
      {
        message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) {
      return NextResponse.json(
        {
          message:
            "Akses ditolak. Silakan login sebagai admin.",
        },
        {
          status: 403,
        },
      );
    }

    const { id } = await context.params;

    if (id === currentAdmin.id) {
      return NextResponse.json(
        {
          message:
            "Akun admin yang sedang digunakan tidak dapat dihapus.",
        },
        {
          status: 400,
        },
      );
    }

    const supabaseAdmin =
      createAdminClient();

    const { error } =
      await supabaseAdmin.auth.admin.deleteUser(
        id,
      );

    if (error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json({
      message:
        "Pengguna berhasil dihapus.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/users/[id] gagal:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan pada server.";

    return NextResponse.json(
      {
        message,
      },
      {
        status: 500,
      },
    );
  }
}