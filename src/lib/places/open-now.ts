type DayHours = { open: string; close: string } | null;

function dubaiNowParts() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  const dayKey = {
    Mon: "mon",
    Tue: "tue",
    Wed: "wed",
    Thu: "thu",
    Fri: "fri",
    Sat: "sat",
    Sun: "sun",
  }[weekday] as keyof Record<string, DayHours>;

  return { dayKey, time: `${hour}:${minute}` };
}

/** True when `hours` says open right now in Asia/Dubai. */
export function isOpenNow(hours: unknown): boolean {
  if (!hours || typeof hours !== "object" || Array.isArray(hours)) return false;
  const { dayKey, time } = dubaiNowParts();
  const day = (hours as Record<string, DayHours>)[dayKey];
  if (!day || typeof day !== "object") return false;
  if (!day.open || !day.close) return false;
  // Overnight windows (close < open) e.g. 10:00–00:00
  if (day.close < day.open) {
    return time >= day.open || time <= day.close;
  }
  return time >= day.open && time <= day.close;
}
