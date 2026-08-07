type Props = {
  verifiedAt: string | null | undefined;
};

export function VerifiedBadge({ verifiedAt }: Props) {
  if (!verifiedAt) return null;

  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dubai",
  }).format(new Date(verifiedAt));

  return (
    <span className="inline-flex items-center text-xs tracking-wide text-neutral-500 uppercase">
      Verified {formatted}
    </span>
  );
}
