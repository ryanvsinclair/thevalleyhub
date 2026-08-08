import { redirect } from "next/navigation";

import { getAdminUser } from "@/lib/auth/admin";

import { LoginForm } from "./login-form";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const user = await getAdminUser();
  if (user) {
    redirect("/admin");
  }

  const { error: urlError } = await searchParams;

  const urlMessage =
    urlError === "not_allowed"
      ? "This account is not authorised to access admin."
      : urlError === "auth" || urlError === "missing_code"
        ? "Sign-in link was invalid or expired. Request a new one."
        : undefined;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[linear-gradient(180deg,#f7f4ef_0%,#ffffff_50%)] px-6 py-16 text-neutral-900">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl tracking-tight">Admin sign-in</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Magic link for the allowlisted editor only.
        </p>
        <div className="mt-8">
          <LoginForm urlError={urlMessage} />
        </div>
      </div>
    </div>
  );
}
