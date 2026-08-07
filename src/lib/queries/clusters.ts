import { createAnonClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Cluster = Database["public"]["Tables"]["clusters"]["Row"];
export type UnitType = Database["public"]["Tables"]["unit_types"]["Row"];

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
