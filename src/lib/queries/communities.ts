import { createAnonClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Community = Database["public"]["Tables"]["communities"]["Row"];
export type Comparison = Database["public"]["Tables"]["comparisons"]["Row"];

export async function listPublishedCommunities() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("state", "published")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listPublishedCommunitySlugs() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("communities")
    .select("slug")
    .eq("state", "published");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export async function getPublishedCommunityBySlug(slug: string) {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("slug", slug)
    .eq("state", "published")
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listComparisonsForCommunity(communityId: string) {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("comparisons")
    .select("*")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
