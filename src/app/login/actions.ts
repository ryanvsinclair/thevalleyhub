"use server";

import { redirect } from "next/navigation";

import { getAdminEmail, isAllowlistedEmail } from "@/lib/auth/admin";
import { createActionClient } from "@/lib/supabase/action";

export type LoginState = {
  error?: string;
  sent?: boolean;
};

export async function requestMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { error: "Enter your email." };
  }

  const adminEmail = getAdminEmail();
  if (!adminEmail) {
    return { error: "ADMIN_EMAIL is not configured." };
  }

  if (!isAllowlistedEmail(email)) {
    return { error: "This email is not authorised to sign in." };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const supabase = await createActionClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/admin`,
      shouldCreateUser: false,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { sent: true };
}

export async function signOut() {
  const supabase = await createActionClient();
  await supabase.auth.signOut();
  redirect("/login");
}
