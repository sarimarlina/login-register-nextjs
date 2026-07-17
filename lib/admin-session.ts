import type { User } from "@supabase/supabase-js";

import { isAdminEmail } from "@/lib/admin-access";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentAdmin(): Promise<
  User | null
> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  if (!isAdminEmail(user.email)) {
    return null;
  }

  return user;
}