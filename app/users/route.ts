import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

import { getCurrentAdmin } from "@/lib/admin-session";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateUserBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

function serializeUser(user: User) {
  const metadataName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";

  return {
    id: user.id,
    name: metadataName || "Tanpa nama",
    email: user.email ?? "",
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at ?? null,
    confirmedAt:
      user.email_confirmed_at ??
      user.confirmed_at ??
      null,
  };
}

export async function GET() {
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

    const supabaseAdmin =
      createAdminClient();

    const {
      data: { users },
      error,
    } =
      await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

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

    const serializedUsers = users
      .map(serializeUser)
      .sort(
        (firstUser, secondUser) =>
          new Date(
            secondUser.createdAt,
          ).getTime() -
          new Date(
            firstUser.createdAt,
          ).getTime(),
      );

    return NextResponse.json({
      users: serializedUsers,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/users gagal:",
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

export async function POST(
  request: Request,
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

    const body =
      (await request.json()) as CreateUserBody;

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

    if (password.length < 6) {
      return NextResponse.json(
        {
          message:
            "Password minimal terdiri dari 6 karakter.",
        },
        {
          status: 400,
        },
      );
    }

    const supabaseAdmin =
      createAdminClient();

    const {
      data,
      error,
    } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
        },
      });

    if (error) {
      return NextResponse.json(
        {
          message: translateSupabaseError(
            error.message,
          ),
        },
        {
          status: 400,
        },
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          message:
            "Supabase tidak mengembalikan data pengguna.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        message:
          "Pengguna berhasil ditambahkan.",
        user: serializeUser(data.user),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/users gagal:",
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

function translateSupabaseError(
  message: string,
) {
  const normalizedMessage =
    message.toLowerCase();

  if (
    normalizedMessage.includes(
      "already registered",
    ) ||
    normalizedMessage.includes(
      "already been registered",
    ) ||
    normalizedMessage.includes(
      "already exists",
    )
  ) {
    return "Email tersebut sudah terdaftar.";
  }

  if (
    normalizedMessage.includes(
      "invalid email",
    )
  ) {
    return "Format email tidak valid.";
  }

  if (
    normalizedMessage.includes(
      "password",
    )
  ) {
    return "Password belum memenuhi persyaratan.";
  }

  return message;
}