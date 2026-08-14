import { createAnonClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { Place } from "@/lib/queries/places";

export type Cluster = Database["public"]["Tables"]["clusters"]["Row"];
export type UnitType = Database["public"]["Tables"]["unit_types"]["Row"];
export type FacadeStyleDescription =
  Database["public"]["Tables"]["facade_style_descriptions"]["Row"];
export type Media = Database["public"]["Tables"]["media"]["Row"];

export type LinkedMedia = Media & {
  is_primary: boolean;
  link_sort_order: number;
  subject_id: string;
  subject_type: string;
};

export type MediaSubjectType =
  | "cluster"
  | "place"
  | "unit_type"
  | "facade_style_description";

/** Public Storage URL for an object in the `media` bucket. */
export function mediaPublicUrl(storagePath: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/media/${storagePath}`;
}

export async function listPublishedClusters() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("clusters")
    .select("*")
    .eq("state", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listPublishedClusterSlugs() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("clusters")
    .select("slug")
    .eq("state", "published")
    .is("deleted_at", null);

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export async function getPublishedClusterBySlug(slug: string) {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("clusters")
    .select("*")
    .eq("slug", slug)
    .eq("state", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listUnitTypesForCluster(clusterId: string) {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("unit_types")
    .select("*")
    .eq("cluster_id", clusterId)
    .order("sort_order", { ascending: true })
    .order("bedrooms", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listFacadeStylesForCluster(clusterId: string) {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("facade_style_descriptions")
    .select("*")
    .eq("cluster_id", clusterId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/** Published on-site amenities scoped to a cluster (`places.cluster_id`). */
export async function listPublishedClusterPlaces(
  clusterId: string,
): Promise<Place[]> {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("cluster_id", clusterId)
    .eq("state", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listMediaForSubject(
  subjectType: MediaSubjectType,
  subjectId: string,
): Promise<LinkedMedia[]> {
  return listMediaForSubjects(subjectType, [subjectId]);
}

export async function listMediaForSubjects(
  subjectType: MediaSubjectType,
  subjectIds: string[],
): Promise<LinkedMedia[]> {
  if (subjectIds.length === 0) return [];

  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("media_links")
    .select(
      "subject_id, subject_type, is_primary, sort_order, media:media_id (*)",
    )
    .eq("subject_type", subjectType)
    .in("subject_id", subjectIds)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const rows: LinkedMedia[] = [];
  for (const link of data ?? []) {
    const media = link.media;
    if (!media || Array.isArray(media)) continue;
    rows.push({
      ...(media as Media),
      is_primary: link.is_primary,
      link_sort_order: link.sort_order,
      subject_id: link.subject_id,
      subject_type: link.subject_type,
    });
  }

  return rows;
}
