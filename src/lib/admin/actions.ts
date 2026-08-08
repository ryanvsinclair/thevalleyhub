"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAllowlistedEmail } from "@/lib/auth/admin";
import type { ActionState } from "@/lib/admin/form";
import { parseForm } from "@/lib/admin/form";
import {
  clusterUpdate,
  comparisonUpdate,
  mediaUpload,
  placeUpdate,
  questionCreate,
  questionUpdate,
  sourceUpdate,
  statusLogCreate,
  unitTypeFields,
} from "@/lib/schema";
import { createActionClient } from "@/lib/supabase/action";
import type { Json } from "@/types/database";

async function requireSessionClient() {
  const supabase = await createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAllowlistedEmail(user.email)) {
    throw new Error("Not authenticated");
  }
  return { supabase, user };
}

export async function createStatusLog(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseForm(statusLogCreate, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { supabase } = await requireSessionClient();
  const { error } = await supabase.from("status_log").insert(parsed.data);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/status");
  redirect("/admin?message=Status+entry+created");
}

export async function createQuestion(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseForm(questionCreate, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { supabase } = await requireSessionClient();
  const { data, error } = await supabase
    .from("questions")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/questions");
  revalidatePath("/questions");
  redirect(`/admin/questions/${data.id}?message=Created`);
}

export async function updateQuestion(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing question id" };

  const parsed = parseForm(questionUpdate, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { supabase } = await requireSessionClient();
  const { error } = await supabase
    .from("questions")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/questions");
  revalidatePath(`/admin/questions/${id}`);
  revalidatePath("/questions");
  return { success: "Question saved." };
}

export async function deleteQuestion(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    throw new Error("Missing question id");
  }

  const { supabase } = await requireSessionClient();
  const { error } = await supabase.from("questions").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/questions");
  revalidatePath("/questions");
  redirect("/admin/questions?message=Deleted");
}

export async function updatePlace(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing place id" };

  const parsed = parseForm(placeUpdate, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { supabase } = await requireSessionClient();
  const { error } = await supabase
    .from("places")
    .update({
      ...parsed.data,
      hours: parsed.data.hours as Json,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/places");
  revalidatePath(`/admin/places/${id}`);
  revalidatePath("/places");
  revalidatePath("/living");
  return { success: "Place saved." };
}

export async function updateCluster(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing cluster id" };

  const parsed = parseForm(clusterUpdate, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { supabase } = await requireSessionClient();
  const { error } = await supabase
    .from("clusters")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/clusters");
  revalidatePath(`/admin/clusters/${id}`);
  revalidatePath("/clusters");
  return { success: "Cluster saved." };
}

export async function upsertUnitType(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const clusterId = String(formData.get("cluster_id") ?? "");
  if (!clusterId) return { error: "Missing cluster id" };

  const id = String(formData.get("id") ?? "");
  const parsed = parseForm(unitTypeFields, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { supabase } = await requireSessionClient();
  const payload = { ...parsed.data, cluster_id: clusterId };

  const { error } = id
    ? await supabase.from("unit_types").update(payload).eq("id", id)
    : await supabase.from("unit_types").insert(payload);

  if (error) return { error: error.message };

  revalidatePath(`/admin/clusters/${clusterId}`);
  revalidatePath("/clusters");
  return { success: id ? "Unit type updated." : "Unit type added." };
}

export async function uploadMedia(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }

  const parsed = parseForm(mediaUpload, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { supabase, user } = await requireSessionClient();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, file, {
      contentType: file.type || undefined,
      upsert: false,
    });

  if (uploadError) return { error: uploadError.message };

  const { error: insertError } = await supabase.from("media").insert({
    storage_path: storagePath,
    kind: parsed.data.kind,
    alt_text: parsed.data.alt_text,
    caption: parsed.data.caption,
    credit: parsed.data.credit,
    captured_on: parsed.data.captured_on,
    uploaded_by: user.id,
  });

  if (insertError) {
    await supabase.storage.from("media").remove([storagePath]);
    return { error: insertError.message };
  }

  revalidatePath("/admin/media");
  return { success: "Media uploaded." };
}

export async function updateComparison(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing comparison id" };

  const parsed = parseForm(comparisonUpdate, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { supabase } = await requireSessionClient();
  const { error } = await supabase
    .from("comparisons")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/comparisons");
  revalidatePath(`/admin/comparisons/${id}`);
  revalidatePath("/compare");
  return { success: "Comparison saved." };
}

export async function updateSource(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing source id" };

  const parsed = parseForm(sourceUpdate, formData);
  if ("error" in parsed) return { error: parsed.error };

  const { supabase } = await requireSessionClient();
  const { error } = await supabase
    .from("sources")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/sources");
  revalidatePath(`/admin/sources/${id}`);
  return { success: "Source saved." };
}
