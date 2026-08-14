import { isOpenNow } from "@/lib/places/open-now";
import {
  listMediaForSubjects,
  type LinkedMedia,
} from "@/lib/queries/clusters";
import { createAnonClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Place = Database["public"]["Tables"]["places"]["Row"];
export type { LinkedMedia };

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

export async function listMediaForPlace(placeId: string): Promise<LinkedMedia[]> {
  return listMediaForSubjects("place", [placeId]);
}

export async function getPublishedPlaceById(id: string) {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("places")
    .select("id, slug, name")
    .eq("id", id)
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

export type LivingCategoryStat = {
  category: LivingCategory;
  count: number;
  openNow: number;
};

/** Counts for Living index — one places query, no Google. */
export async function listLivingCategoryStats(): Promise<LivingCategoryStat[]> {
  const places = await listPublishedPlaces();
  return LIVING_CATEGORIES.map((category) => {
    const categories = LIVING_CATEGORY_MAP[category];
    const inCategory = places.filter((place) =>
      categories.includes(place.category),
    );
    return {
      category,
      count: inCategory.length,
      openNow: inCategory.filter((place) => isOpenNow(place.hours)).length,
    };
  });
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

/** Places currently open in Asia/Dubai, derived from places.hours (Q24). */
export async function listPlacesOpenNow() {
  const places = await listPublishedPlaces();
  return places.filter((place) => isOpenNow(place.hours));
}
