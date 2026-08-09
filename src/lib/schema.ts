import { z } from "zod";

/** Zod schemas for admin forms — Annex L vocabs + migration checks. */

export const adminEmailSchema = z.email();

export const topicValues = [
  "basics",
  "amenities",
  "services",
  "connectivity",
  "clusters",
  "market",
  "comparison",
] as const;

export const placeCategoryValues = [
  "pharmacy",
  "clinic",
  "hospital",
  "dental",
  "optical",
  "nursery",
  "school",
  "vet",
  "grocery",
  "mall",
  "salon",
  "spa",
  "gym",
  "fuel",
  "mosque",
  // Cluster-internal amenities (Doc 4 #10)
  "recreation",
  "nature",
  "family",
  "farming",
  "wellness",
  "gathering",
] as const;

export const mediaSubjectTypeValues = [
  "cluster",
  "place",
  "question",
  "status_log",
  "community",
  "post",
  "unit_type",
  "facade_style_description",
] as const;

export const amenityKeyValues = [
  "town-centre",
  "golden-beach",
  "sports-village",
  "kids-dale",
  "pocket-parks",
  "pavilion",
  "pet-park",
  "jogging-trails",
  "cycling-tracks",
] as const;

export const comparisonDimensionValues = [
  "price",
  "commute",
  "schools",
  "amenities",
  "maturity",
] as const;

export const publishStateValues = ["draft", "published", "archived"] as const;

export const confidenceValues = [
  "official",
  "corroborated",
  "unverified",
] as const;

export const statusSubjectTypeValues = [
  "cluster",
  "amenity",
  "place",
  "community",
] as const;

export const statusValues = [
  "planned",
  "under_construction",
  "partially_open",
  "open",
  "delivered",
  "closed",
] as const;

export const audienceValues = ["prospect", "resident", "both"] as const;

export const productTypeValues = ["townhouse", "twin_villa", "villa"] as const;

export const mediaKindValues = [
  "photo",
  "floorplan",
  "document",
  "brochure",
] as const;

export const dayKeyValues = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

/** Missing form fields arrive as undefined; empty inputs as "". Both → null. */
const emptyToNull = (v: unknown) =>
  v === undefined ||
  v === null ||
  (typeof v === "string" && v.trim() === "")
    ? null
    : v;

const optionalUuid = z.preprocess(emptyToNull, z.uuid().nullable());
const optionalString = z.preprocess(emptyToNull, z.string().nullable());
const optionalInt = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : v;
}, z.number().int().nullable());
const optionalDate = z.preprocess(emptyToNull, z.iso.date().nullable());

/** Form select "true"/"false" — do not use z.coerce.boolean (Boolean("false") === true). */
const formBool = z.preprocess(
  (v) => v === true || v === "true" || v === "on" || v === 1 || v === "1",
  z.boolean(),
);

const optionalFormBool = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return null;
  return v === true || v === "true" || v === "on" || v === 1 || v === "1";
}, z.boolean().nullable());

const dayHoursSchema = z
  .object({
    open: z.string().min(1),
    close: z.string().min(1),
  })
  .nullable();

export const hoursJsonSchema = z.partialRecord(
  z.enum(dayKeyValues),
  dayHoursSchema,
);

export const statusLogCreate = z.object({
  subject_type: z.enum(statusSubjectTypeValues),
  subject_id: optionalUuid,
  amenity_key: z.preprocess(
    emptyToNull,
    z.enum(amenityKeyValues).nullable(),
  ),
  status: z.enum(statusValues),
  observed_on: z.iso.date(),
  note: optionalString,
  confidence: z.enum(confidenceValues),
  source_id: optionalUuid,
});

export const questionCreate = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  question: z.string().min(1),
  answer_short: optionalString,
  answer_long: optionalString,
  audience: z.enum(audienceValues),
  topic: z.enum(topicValues),
  cluster_id: optionalUuid,
  place_id: optionalUuid,
  ask_count: z.coerce.number().int().nonnegative().default(0),
  is_generated: formBool,
  meta_title: optionalString,
  meta_description: optionalString,
  sort_order: z.coerce.number().int().default(0),
  confidence: z.enum(confidenceValues),
  source_id: optionalUuid,
  verified_at: optionalDate,
  state: z.enum(publishStateValues),
});

export const questionUpdate = questionCreate;

export const placeUpdate = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  name: z.string().min(1),
  category: z.enum(placeCategoryValues),
  subcategory: optionalString,
  cluster_id: optionalUuid,
  parent_place_id: optionalUuid,
  google_place_id: optionalString,
  in_community: formBool,
  operator: optionalString,
  address: optionalString,
  lat: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : v;
  }, z.number().nullable()),
  lng: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : v;
  }, z.number().nullable()),
  phone: optionalString,
  website: optionalString,
  hours: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return null;
    if (typeof v !== "string") return v;
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }, hoursJsonSchema.nullable()),
  drive_minutes: optionalInt,
  drive_verified: formBool,
  summary: optionalString,
  notes: optionalString,
  meta_title: optionalString,
  meta_description: optionalString,
  sort_order: z.coerce.number().int().default(0),
  confidence: z.enum(confidenceValues),
  source_id: optionalUuid,
  verified_at: optionalDate,
  state: z.enum(publishStateValues),
});

export const unitTypeFields = z.object({
  bedrooms: z.coerce.number().int().nonnegative(),
  label: optionalString,
  unit_count: optionalInt,
  bua_min: optionalInt,
  bua_max: optionalInt,
  plot_min: optionalInt,
  plot_max: optionalInt,
  suite_area: optionalInt,
  garage_area: optionalInt,
  balcony_area: optionalInt,
  roof_terrace_area: optionalInt,
  layout: optionalString,
  maids_room: optionalFormBool,
  ground_floor_bedroom: optionalFormBool,
  private_pool: optionalFormBool,
  corner_unit: optionalFormBool,
  notes: optionalString,
  sort_order: z.coerce.number().int().default(0),
  confidence: z.enum(confidenceValues),
  source_id: optionalUuid,
  verified_at: optionalDate,
});

export const facadeStyleFields = z.object({
  style_name: z.string().min(1),
  description: optionalString,
  sort_order: z.coerce.number().int().default(0),
  confidence: z.enum(confidenceValues),
  source_id: optionalUuid,
});

export const mediaLinkFields = z.object({
  media_id: z.uuid(),
  subject_type: z.enum(mediaSubjectTypeValues),
  subject_id: z.uuid(),
  sort_order: z.coerce.number().int().default(0),
  is_primary: formBool,
});

export const clusterUpdate = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  name: z.string().min(1),
  phase: optionalInt,
  product_type: z.preprocess(
    emptyToNull,
    z.enum(productTypeValues).nullable(),
  ),
  unit_count: optionalInt,
  facade_styles: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return null;
    if (typeof v !== "string") return v;
    const parts = v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length ? parts : null;
  }, z.array(z.string()).nullable()),
  single_row: optionalFormBool,
  plex_config: optionalString,
  launch_date: optionalDate,
  handover_target: optionalDate,
  handover_actual: optionalDate,
  price_from_aed: optionalInt,
  payment_plan: optionalString,
  summary: optionalString,
  positioning: optionalString,
  body: optionalString,
  notes: optionalString,
  meta_title: optionalString,
  meta_description: optionalString,
  sort_order: z.coerce.number().int().default(0),
  confidence: z.enum(confidenceValues),
  source_id: optionalUuid,
  verified_at: optionalDate,
  state: z.enum(publishStateValues),
});

export const mediaUpload = z.object({
  alt_text: z.string().min(1, "Alt text is required"),
  kind: z.enum(mediaKindValues).default("photo"),
  caption: optionalString,
  credit: optionalString,
  captured_on: optionalDate,
});

export const comparisonUpdate = z.object({
  community_id: z.uuid(),
  dimension: z.enum(comparisonDimensionValues),
  valley_advantage: optionalString,
  other_advantage: optionalString,
  honest_read: optionalString,
  sort_order: z.coerce.number().int().default(0),
  confidence: z.enum(confidenceValues),
  source_id: optionalUuid,
});

export const sourceUpdate = z.object({
  kind: z.string().min(1),
  label: z.string().min(1),
  url: optionalString,
  retrieved_at: z.iso.date(),
  notes: optionalString,
});

export type StatusLogCreate = z.infer<typeof statusLogCreate>;
export type QuestionUpdate = z.infer<typeof questionUpdate>;
export type PlaceUpdate = z.infer<typeof placeUpdate>;
export type ClusterUpdate = z.infer<typeof clusterUpdate>;
export type UnitTypeFields = z.infer<typeof unitTypeFields>;
export type FacadeStyleFields = z.infer<typeof facadeStyleFields>;
export type MediaLinkFields = z.infer<typeof mediaLinkFields>;
export type MediaUpload = z.infer<typeof mediaUpload>;
export type ComparisonUpdate = z.infer<typeof comparisonUpdate>;
export type SourceUpdate = z.infer<typeof sourceUpdate>;
