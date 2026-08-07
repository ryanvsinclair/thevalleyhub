import { createAnonClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Post = Database["public"]["Tables"]["posts"]["Row"];

export async function listPublishedPosts() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("state", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function listPublishedPostSlugs() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("state", "published")
    .is("deleted_at", null);

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export async function getPublishedPostBySlug(slug: string) {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("state", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data;
}
