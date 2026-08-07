type Props = {
  status: string;
};

const LABELS: Record<string, string> = {
  planned: "Planned",
  under_construction: "Under construction",
  partially_open: "Partially open",
  open: "Open",
  delivered: "Delivered",
  closed: "Closed",
};

export function StatusPill({ status }: Props) {
  const label = LABELS[status] ?? status.replaceAll("_", " ");

  return (
    <span className="inline-flex items-center rounded-sm border border-neutral-300 px-2 py-0.5 text-xs tracking-wide text-neutral-700 uppercase">
      {label}
    </span>
  );
}
