import { confidenceValues } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export const UNIT_PAGE_SIZE = 50;

export const unitSortValues = [
  "cluster",
  "plot_number",
  "unit_number",
  "bua",
] as const;

export type UnitSort = (typeof unitSortValues)[number];

export type UnitListParams = {
  q: string | null;
  clusterSlug: string | null;
  bedrooms: number | null;
  facade: string | null;
  confidence: (typeof confidenceValues)[number] | null;
  sort: UnitSort;
  page: number;
};

export type AdminUnitRow = {
  id: string;
  unit_number: string;
  plot_number: number | null;
  facade_style: string | null;
  bua: number | null;
  th_position: string | null;
  confidence: Database["public"]["Enums"]["confidence_level"];
  cluster_id: string;
  clusters: { id: string; name: string; slug: string } | null;
  unit_types: {
    bedrooms: number;
    label: string | null;
    layout: string | null;
  } | null;
  plexes: {
    plex_size: number;
    range_start: number | null;
    range_end: number | null;
  } | null;
};

const SLUG_RE = /^[a-z0-9-]+$/;
const SEARCH_RE = /^[A-Za-z0-9 .#-]+$/;
const FACADE_RE = /^[A-Za-z0-9 _-]+$/;

function first<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function parsePage(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

export function parseUnitListParams(
  searchParams: Record<string, string | string[] | undefined>,
): UnitListParams {
  const one = (key: string) => {
    const v = searchParams[key];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  const qRaw = one("q")?.trim() ?? "";
  const q = qRaw && SEARCH_RE.test(qRaw) ? qRaw.slice(0, 40) : null;

  const clusterRaw = one("cluster")?.trim() ?? "";
  const clusterSlug =
    clusterRaw && SLUG_RE.test(clusterRaw) ? clusterRaw : null;

  const bedroomsRaw = Number.parseInt(one("bedrooms") ?? "", 10);
  const bedrooms =
    Number.isInteger(bedroomsRaw) && bedroomsRaw >= 1 && bedroomsRaw <= 10
      ? bedroomsRaw
      : null;

  const facadeRaw = one("facade")?.trim() ?? "";
  const facade =
    facadeRaw && FACADE_RE.test(facadeRaw) ? facadeRaw.slice(0, 80) : null;

  const confidenceRaw = one("confidence") ?? "";
  const confidence = confidenceValues.includes(
    confidenceRaw as (typeof confidenceValues)[number],
  )
    ? (confidenceRaw as (typeof confidenceValues)[number])
    : null;

  const sortRaw = one("sort") ?? "";
  const sort = unitSortValues.includes(sortRaw as UnitSort)
    ? (sortRaw as UnitSort)
    : "cluster";

  return {
    q,
    clusterSlug,
    bedrooms,
    facade,
    confidence,
    sort,
    page: parsePage(one("page")),
  };
}

export function unitListHref(
  params: UnitListParams,
  overrides: Partial<UnitListParams> = {},
): string {
  const next = { ...params, ...overrides };
  const sp = new URLSearchParams();
  if (next.q) sp.set("q", next.q);
  if (next.clusterSlug) sp.set("cluster", next.clusterSlug);
  if (next.bedrooms != null) sp.set("bedrooms", String(next.bedrooms));
  if (next.facade) sp.set("facade", next.facade);
  if (next.confidence) sp.set("confidence", next.confidence);
  if (next.sort !== "cluster") sp.set("sort", next.sort);
  if (next.page > 1) sp.set("page", String(next.page));
  const qs = sp.toString();
  return qs ? `/admin/units?${qs}` : "/admin/units";
}

export async function loadUnitFilterOptions(clusterSlug: string | null) {
  const supabase = await createClient();

  const [clusters, unitTypes, facades] = await Promise.all([
    supabase
      .from("clusters")
      .select("id, name, slug")
      .is("deleted_at", null)
      .order("sort_order")
      .order("name"),
    supabase.from("unit_types").select("bedrooms"),
    supabase
      .from("facade_style_descriptions")
      .select("style_name, cluster_id")
      .order("style_name"),
  ]);

  const bedrooms = [
    ...new Set((unitTypes.data ?? []).map((row) => row.bedrooms)),
  ].sort((a, b) => a - b);

  const clusterId = clusterSlug
    ? (clusters.data ?? []).find((row) => row.slug === clusterSlug)?.id
    : null;
  const facadeNames = [
    ...new Set(
      (facades.data ?? [])
        .filter((row) => !clusterId || row.cluster_id === clusterId)
        .map((row) => row.style_name),
    ),
  ].sort((a, b) => a.localeCompare(b));

  return {
    clusters: clusters.data ?? [],
    bedrooms,
    facades: facadeNames,
    error:
      clusters.error?.message ??
      unitTypes.error?.message ??
      facades.error?.message ??
      null,
  };
}

export async function listAdminUnits(params: UnitListParams): Promise<{
  rows: AdminUnitRow[];
  count: number;
  error: string | null;
}> {
  const supabase = await createClient();

  let query = supabase.from("units").select(
    `
      id,
      unit_number,
      plot_number,
      facade_style,
      bua,
      th_position,
      confidence,
      cluster_id,
      clusters!inner ( id, name, slug, sort_order ),
      unit_types!inner ( bedrooms, label, layout ),
      plexes ( plex_size, range_start, range_end )
    `,
    { count: "exact" },
  );

  query = query.is("clusters.deleted_at", null);
  if (params.clusterSlug) {
    query = query.eq("clusters.slug", params.clusterSlug);
  }
  if (params.bedrooms != null) {
    query = query.eq("unit_types.bedrooms", params.bedrooms);
  }
  if (params.facade) {
    query = query.eq("facade_style", params.facade);
  }
  if (params.confidence) {
    query = query.eq("confidence", params.confidence);
  }
  if (params.q) {
    const asInt = Number.parseInt(params.q, 10);
    if (Number.isFinite(asInt) && String(asInt) === params.q) {
      query = query.or(
        `unit_number.ilike.%${params.q}%,plot_number.eq.${asInt}`,
      );
    } else {
      query = query.ilike("unit_number", `%${params.q}%`);
    }
  }

  switch (params.sort) {
    case "unit_number":
      query = query.order("unit_number", { ascending: true });
      break;
    case "bua":
      query = query.order("bua", { ascending: true, nullsFirst: false });
      break;
    case "plot_number":
      query = query.order("plot_number", {
        ascending: true,
        nullsFirst: false,
      });
      break;
    case "cluster":
    default:
      query = query
        .order("sort_order", { referencedTable: "clusters", ascending: true })
        .order("plot_number", { ascending: true, nullsFirst: false });
      break;
  }

  const from = (params.page - 1) * UNIT_PAGE_SIZE;
  const to = from + UNIT_PAGE_SIZE - 1;
  const { data, count, error } = await query.range(from, to);

  if (error) {
    return { rows: [], count: 0, error: error.message };
  }

  const rows: AdminUnitRow[] = (data ?? []).map((row) => {
    const item = row as {
      id: string;
      unit_number: string;
      plot_number: number | null;
      facade_style: string | null;
      bua: number | null;
      th_position: string | null;
      confidence: AdminUnitRow["confidence"];
      cluster_id: string;
      clusters: AdminUnitRow["clusters"] | AdminUnitRow["clusters"][];
      unit_types: AdminUnitRow["unit_types"] | AdminUnitRow["unit_types"][];
      plexes: AdminUnitRow["plexes"] | AdminUnitRow["plexes"][];
    };
    return {
      id: item.id,
      unit_number: item.unit_number,
      plot_number: item.plot_number,
      facade_style: item.facade_style,
      bua: item.bua,
      th_position: item.th_position,
      confidence: item.confidence,
      cluster_id: item.cluster_id,
      clusters: first(item.clusters),
      unit_types: first(item.unit_types),
      plexes: first(item.plexes),
    };
  });

  return { rows, count: count ?? 0, error: null };
}
