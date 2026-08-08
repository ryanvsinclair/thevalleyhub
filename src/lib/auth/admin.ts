import "server-only";

import { createClient } from "@/lib/supabase/server";

/** Allowlisted editor email from env, normalised. */
export function getAdminEmail(): string | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return email || null;
}

export function isAllowlistedEmail(email: string | undefined | null): boolean {
  const admin = getAdminEmail();
  if (!admin || !email) return false;
  return email.trim().toLowerCase() === admin;
}

/** Session user that passes the ADMIN_EMAIL allowlist, or null. */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowlistedEmail(user.email)) {
    return null;
  }

  return user;
}
