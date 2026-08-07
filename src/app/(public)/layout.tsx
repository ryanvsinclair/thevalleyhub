export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <main className="flex-1">{children}</main>
      <footer className="border-t border-neutral-200 px-6 py-8 text-center text-sm text-neutral-500">
        Independent community resource. Not affiliated with Emaar Properties.
      </footer>
    </div>
  );
}
