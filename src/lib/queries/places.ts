import { createAnonClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Place = Database["public"]["Tables"]["places"]["Row"];

export type LivingCategory =
  | "schools"
  | "healthcare"
  | "groceries"
  | "services"
  | "getting-around";

export const LIVING_CATEGORIES: LivingCategory[] = [
  "schools",
  "healthcare",
  "groceries",
  "services",
  "getting-around",
];

const LIVING_CATEGORY_MAP: Record<LivingCategory, string[]> = {
  schools: ["school", "nursery"],
  healthcare: ["hospital", "clinic", "pharmacy", "dental", "optical", "vet"],
  groceries: ["grocery"],
  services: ["salon", "spa", "gym", "mosque"],
  "getting-around": ["fuel", "mall"],
};

export function isLivingCategory(value: string): value is LivingCategory {
  return (LIVING_CATEGORIES as string[]).includes(value);
}

export async function listPublishedPlaces() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("state", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listPublishedPlaceSlugs() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("places")
    .select("slug")
    .eq("state", "published")
    .is("deleted_at", null);

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export async function getPublishedPlaceBySlug(slug: string) {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("slug", slug)
    .eq("state", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listPlacesByLivingCategory(category: LivingCategory) {
  const categories = LIVING_CATEGORY_MAP[category];
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("state", "published")
    .is("deleted_at", null)
    .in("category", categories)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listInCommunityPlaces() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("state", "published")
    .eq("in_community", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

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

function isOpenNow(hours: Place["hours"]): boolean {
  if (!hours || typeof hours !== "object" || Array.isArray(hours)) return false;
  const { dayKey, time } = dubaiNowParts();
  const day = (hours as Record<string, DayHours>)[dayKey];
  if (!day || typeof day !== "object") return false;
  if (!day.open || !day.close) return false;
  return time >= day.open && time <= day.close;
}

/** Places currently open in Asia/Dubai, derived from places.hours (Q24). */
export async function listPlacesOpenNow() {
  const places = await listPublishedPlaces();
  return places.filter((place) => isOpenNow(place.hours));
}
