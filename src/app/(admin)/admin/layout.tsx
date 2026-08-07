import { redirect } from "next/navigation";

/**
 * Auth gate stub — wire Supabase Auth + ADMIN_EMAIL allowlist in a later pass.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    redirect("/");
  }

  return (
    <div className="min-h-full bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 px-6 py-4">
        <p className="text-sm font-medium tracking-wide uppercase">Admin</p>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
