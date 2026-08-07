import { createAnonClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Question = Database["public"]["Tables"]["questions"]["Row"];

export async function listPublishedQuestions(audience?: "prospect" | "resident") {
  const supabase = createAnonClient();
  let query = supabase
    .from("questions")
    .select("*")
    .eq("state", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (audience === "prospect") {
    query = query.in("audience", ["prospect", "both"]);
  } else if (audience === "resident") {
    query = query.in("audience", ["resident", "both"]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listPublishedQuestionSlugs() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("questions")
    .select("slug")
    .eq("state", "published")
    .is("deleted_at", null);

  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export async function getPublishedQuestionBySlug(slug: string) {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("slug", slug)
    .eq("state", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data;
}
