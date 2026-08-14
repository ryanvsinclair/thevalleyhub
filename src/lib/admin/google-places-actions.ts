"use server";

import { isAllowlistedEmail } from "@/lib/auth/admin";
import {
  autocompleteGooglePlaces,
  fetchGooglePlaceDetails,
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
