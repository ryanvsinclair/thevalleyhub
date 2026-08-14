import { createAnonClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type StatusLog = Database["public"]["Tables"]["status_log"]["Row"];
export type CurrentStatus = Database["public"]["Views"]["current_status"]["Row"];

export async function listDeliveredClusterStatus() {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("status_log")
    .select("*")
    .eq("subject_type", "cluster")
    .eq("status", "delivered")
    .order("observed_on", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listCurrentStatus() {
  const supabase = createAnonClient();
  const { data, error } = await supabase.from("current_status").select("*");
  if (error) throw error;
  return data ?? [];
}

/** Latest status_log row for a place (e.g. closed amenity). */
export async function getCurrentStatusForPlace(placeId: string) {
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("current_status")
    .select("*")
    .eq("subject_type", "place")
    .eq("subject_id", placeId)
    .is("amenity_key", null)
    .maybeSingle();

  if (error) throw error;
  return data;
}
