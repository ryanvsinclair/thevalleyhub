import "server-only";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
type DayKey = (typeof DAY_KEYS)[number];

export type GooglePlaceSuggestion = {
  placeId: string;
  description: string;
};

export type GooglePlaceFill = {
  google_place_id: string;
  name: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  website: string | null;
  hours: Partial<Record<DayKey, { open: string; close: string } | null>> | null;
  hoursJson: string;
};

type AutocompletePrediction = {
  place_id?: string;
  description?: string;
};

type PlaceDetailsResult = {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  geometry?: { location?: { lat?: number; lng?: number } };
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  opening_hours?: {
    periods?: Array<{
      open?: { day?: number; time?: string };
      close?: { day?: number; time?: string };
    }>;
  };
};

function apiKey(): string | null {
  const key = process.env.GOOGLE_MAPS_API_KEY?.trim();
  return key || null;
}

function formatHhMm(time: string | undefined): string | null {
  if (!time || !/^\d{4}$/.test(time)) return null;
  return `${time.slice(0, 2)}:${time.slice(2)}`;
}

/** Map Google Places periods (Sun=0) into our hours JSON shape. */
export function periodsToHoursJson(
  periods: NonNullable<PlaceDetailsResult["opening_hours"]>["periods"],
): GooglePlaceFill["hours"] {
  if (!periods?.length) return null;

  const hours: NonNullable<GooglePlaceFill["hours"]> = {};
  for (const key of DAY_KEYS) {
    hours[key] = null;
  }

  for (const period of periods) {
    const openDay = period.open?.day;
    if (openDay == null || openDay < 0 || openDay > 6) continue;
    const dayKey = DAY_KEYS[openDay];
    const open = formatHhMm(period.open?.time);
    // 24h open: Google omits close
    if (!period.close) {
      if (open) hours[dayKey] = { open: "00:00", close: "23:59" };
      continue;
    }
    const close = formatHhMm(period.close.time);
    if (open && close) {
      hours[dayKey] = { open, close };
    }
  }

  return hours;
}

export async function autocompleteGooglePlaces(
  input: string,
): Promise<{ suggestions: GooglePlaceSuggestion[] } | { error: string }> {
  const key = apiKey();
  if (!key) {
    return {
      error:
        "GOOGLE_MAPS_API_KEY is not set. Add it to .env.local and Vercel (Places API enabled).",
    };
  }

  const q = input.trim();
  if (q.length < 2) return { suggestions: [] };

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json",
  );
  url.searchParams.set("input", q);
  url.searchParams.set("key", key);
  url.searchParams.set("components", "country:ae");
  // Bias toward Dubai / The Valley corridor
  url.searchParams.set("location", "25.0120,55.4250");
  url.searchParams.set("radius", "40000");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    return { error: `Google Autocomplete HTTP ${res.status}` };
  }

  const body = (await res.json()) as {
    status?: string;
    error_message?: string;
    predictions?: AutocompletePrediction[];
  };

  if (body.status && body.status !== "OK" && body.status !== "ZERO_RESULTS") {
    return {
      error: body.error_message
        ? `${body.status}: ${body.error_message}`
        : body.status,
    };
  }

  const suggestions = (body.predictions ?? [])
    .filter((p) => p.place_id && p.description)
    .map((p) => ({
      placeId: p.place_id as string,
      description: p.description as string,
    }));

  return { suggestions };
}

export async function fetchGooglePlaceDetails(
  placeId: string,
): Promise<{ fill: GooglePlaceFill } | { error: string }> {
  const key = apiKey();
  if (!key) {
    return {
      error:
        "GOOGLE_MAPS_API_KEY is not set. Add it to .env.local and Vercel (Places API enabled).",
    };
  }

  const id = placeId.trim();
  if (!id) return { error: "Missing place id" };

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json",
  );
  url.searchParams.set("place_id", id);
  url.searchParams.set("key", key);
  url.searchParams.set(
    "fields",
    [
      "place_id",
      "name",
      "formatted_address",
      "geometry",
      "formatted_phone_number",
      "international_phone_number",
      "website",
      "opening_hours",
    ].join(","),
  );

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    return { error: `Google Place Details HTTP ${res.status}` };
  }

  const body = (await res.json()) as {
    status?: string;
    error_message?: string;
    result?: PlaceDetailsResult;
  };

  if (body.status !== "OK" || !body.result) {
    return {
      error: body.error_message
        ? `${body.status}: ${body.error_message}`
        : body.status ?? "No result",
    };
  }

  const r = body.result;
  const hours = periodsToHoursJson(r.opening_hours?.periods);
  const lat = r.geometry?.location?.lat ?? null;
  const lng = r.geometry?.location?.lng ?? null;

  const fill: GooglePlaceFill = {
    google_place_id: r.place_id ?? id,
    name: r.name ?? null,
    address: r.formatted_address ?? null,
    lat: typeof lat === "number" ? lat : null,
    lng: typeof lng === "number" ? lng : null,
    phone: r.international_phone_number ?? r.formatted_phone_number ?? null,
    website: r.website ?? null,
    hours,
    hoursJson: hours ? JSON.stringify(hours, null, 2) : "",
  };

  return { fill };
}
