import { SiteNav } from "@/components/content/SiteNav";

/** Safety net when SQL promotions bypass Server Actions (Doc 4 #14). */
export const revalidate = 3600;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[linear-gradient(180deg,#f7f4ef_0%,#ffffff_42%)] text-neutral-900">
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
      <footer className="border-t border-neutral-200 px-6 py-8 text-center text-sm text-neutral-500">
        Independent community resource. Not affiliated with Emaar Properties.
      </footer>
    </div>
  );
}
