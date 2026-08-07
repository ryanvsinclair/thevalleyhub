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
