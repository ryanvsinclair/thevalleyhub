"use server";

import { revalidatePath } from "next/cache";

import type { ActionState } from "@/lib/admin/form";
import { isAllowlistedEmail } from "@/lib/auth/admin";
import {
  autocompleteGooglePlaces,
  fetchGooglePlaceDetails,
  fetchGooglePlacePrimaryPhoto,
  type GooglePlaceFill,
  type GooglePlaceSuggestion,
} from "@/lib/google/places";
import { createActionClient } from "@/lib/supabase/action";

async function requireAdmin() {
  const supabase = await createActionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAllowlistedEmail(user.email)) {
    throw new Error("Not authenticated");
  }
  return { supabase, user };
}

export async function searchGooglePlacesAction(
  query: string,
): Promise<{ suggestions: GooglePlaceSuggestion[] } | { error: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Not authenticated" };
  }
  return autocompleteGooglePlaces(query);
}

export async function getGooglePlaceDetailsAction(
  placeId: string,
): Promise<{ fill: GooglePlaceFill } | { error: string }> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Not authenticated" };
  }
  return fetchGooglePlaceDetails(placeId);
}

/**
 * Pull the first Google Place Photo into Storage and link it as primary
 * place media. Valley-wide places only (cluster amenities stay brochure-only).
 */
export async function importGooglePlacePhotoAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let supabase;
  let user;
  try {
    ({ supabase, user } = await requireAdmin());
  } catch {
    return { error: "Not authenticated" };
  }

  const placeId = String(formData.get("place_id") ?? "").trim();
  if (!placeId) return { error: "Missing place id" };

  const { data: place, error: placeError } = await supabase
    .from("places")
    .select("id, slug, name, cluster_id, google_place_id")
    .eq("id", placeId)
    .maybeSingle();

  if (placeError) return { error: placeError.message };
  if (!place) return { error: "Place not found" };
  if (place.cluster_id) {
    return {
      error:
        "Cluster-scoped amenities cannot import Google photos (Doc 11).",
    };
  }
  if (!place.google_place_id) {
    return { error: "Set google_place_id first (Autocomplete or paste)." };
  }

  const { data: existingLinks } = await supabase
    .from("media_links")
    .select("media_id")
    .eq("subject_type", "place")
    .eq("subject_id", place.id)
    .eq("is_primary", true)
    .limit(1);

  if (existingLinks && existingLinks.length > 0) {
    return {
      error:
        "This place already has a primary photo. Remove that link in Media first, or upload manually.",
    };
  }

  const photoResult = await fetchGooglePlacePrimaryPhoto(place.google_place_id);
  if ("error" in photoResult) return { error: photoResult.error };

  const { photo } = photoResult;
  const ext = photo.contentType.includes("png")
    ? "png"
    : photo.contentType.includes("webp")
      ? "webp"
      : "jpg";
  const storagePath = `places/${place.slug}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, photo.bytes, {
      contentType: photo.contentType,
      upsert: false,
    });

  if (uploadError) return { error: uploadError.message };

  const { data: mediaRow, error: insertError } = await supabase
    .from("media")
    .insert({
      storage_path: storagePath,
      kind: "photo",
      alt_text: photo.placeName
        ? `${photo.placeName} (Google Place Photo)`
        : `${place.name} (Google Place Photo)`,
      caption: null,
      credit: photo.attribution
        ? `Google · ${photo.attribution}`
        : "Google Place Photo",
      captured_on: null,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (insertError || !mediaRow) {
    await supabase.storage.from("media").remove([storagePath]);
    return { error: insertError?.message ?? "Media insert failed" };
  }

  const { error: linkError } = await supabase.from("media_links").upsert(
    {
      media_id: mediaRow.id,
      subject_type: "place",
      subject_id: place.id,
      sort_order: 0,
      is_primary: true,
    },
    { onConflict: "media_id,subject_type,subject_id" },
  );

  if (linkError) {
    return { error: linkError.message };
  }

  revalidatePath("/admin/media");
  revalidatePath(`/admin/places/${place.id}`);
  revalidatePath(`/places/${place.slug}`);
  revalidatePath("/living");
  return {
    success: "Google photo imported and linked as primary.",
  };
}
