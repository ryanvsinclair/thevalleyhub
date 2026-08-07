import Link from "next/link";

const LINKS = [
  { href: "/clusters", label: "Clusters" },
  { href: "/living", label: "Living" },
  { href: "/questions", label: "Questions" },
  { href: "/compare", label: "Compare" },
  { href: "/status", label: "Status" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          Valley
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm text-neutral-600">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-neutral-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
