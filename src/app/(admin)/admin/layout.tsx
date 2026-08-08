import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { getAdminUser } from "@/lib/auth/admin";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/status/new", label: "Status" },
  { href: "/admin/questions", label: "Questions" },
  { href: "/admin/places", label: "Places" },
  { href: "/admin/clusters", label: "Clusters" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/comparisons", label: "Comparisons" },
  { href: "/admin/sources", label: "Sources" },
  { href: "/admin/audit", label: "Audit" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-full bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/admin"
            className="text-sm font-medium tracking-wide uppercase"
          >
            Admin
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">{user.email}</span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-neutral-600 hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
