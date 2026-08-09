# Eden — Reference

**Slug:** `eden`
**Status:** Migrated from Doc 1 Annex C/D, 2026-08-09. Guarded by `scripts/pre-commit` per Doc 4 #09. Unit-type / facade / unit depth promoted from staging Batch 002 on 2026-08-10 (Doc 4 #12).
**Source:** Relocated from Doc 1 Annex C/D, then Batch 002 (Emaar PDF floor plans + site plan, source `a1000000-0000-4000-8000-000000000001`).

---

## Register

| Field | Value |
|---|---|
| Phase | 1 |
| Product type | townhouse |
| Unit count | 362 |
| Facade styles | May Bell, Iris, Spruce |
| Single row | null |
| Handover actual | 2023-11-01 |
| Handover target | — |
| Confidence | corroborated |

## Positioning

> The only genuinely mature cluster. Delivered 2023, grown-in landscaping, established resident base, direct Golden Beach access. Three facade styles.

## Unit types

Style is layout-determining here (`unit_types.layout` = `{facade_style}-{label}`, e.g. `spruce-a`). Totals: Spruce 190 · Iris 126 · May Bell 46. All rows: `maids_room = true`, `bathrooms` 3.5 (3BR) / 4.0 (4BR), confidence corroborated.

| facade_style | bedrooms | label | layout | bua_min | bua_max | unit_count | bathrooms |
|---|---|---|---|---|---|---|---|
| spruce | 3 | A | spruce-a | 1930 | 1937 | 63 | 3.5 |
| spruce | 3 | B | spruce-b | 1988 | 1997 | 63 | 3.5 |
| spruce | 3 | C | spruce-c | 2039 | 2039 | 11 | 3.5 |
| spruce | 3 | D | spruce-d | 1972 | 1972 | 11 | 3.5 |
| spruce | 4 | A | spruce-a | 2323 | 2323 | 21 | 4.0 |
| spruce | 4 | B | spruce-b | 2325 | 2325 | 21 | 4.0 |
| iris | 3 | A | iris-a | 2050 | 2082 | 50 | 3.5 |
| iris | 3 | B | iris-b | 2058 | 2087 | 44 | 3.5 |
| iris | 4 | A | iris-a | 2335 | 2336 | 16 | 4.0 |
| iris | 4 | B | iris-b | 2335 | 2335 | 5 | 4.0 |
| iris | 4 | C | iris-c | 2337 | 2337 | 11 | 4.0 |
| may_bell | 3 | A | may_bell-a | 2028 | 2066 | 23 | 3.5 |
| may_bell | 3 | B | may_bell-b | 2028 | 2028 | 11 | 3.5 |
| may_bell | 4 | A | may_bell-a | 2311 | 2311 | 6 | 4.0 |
| may_bell | 4 | B | may_bell-b | 2311 | 2311 | 6 | 4.0 |

## Facades

| style_name | confidence |
|---|---|
| Spruce | corroborated |
| Iris | corroborated |
| May Bell | corroborated |

Copy and promo images from Emaar brochure (Batch 002). Floor plans linked per `unit_types` row via `media_links`.

## Units / plexes

362 `units` rows across 43 `plexes` (21×8, 11×10, 6×9, 5×6). Per-unit `bua` / `th_position` / `plex_id` populated. Unit-row confidence: **unverified** (OCR plot numbers + geometrically classified style/type/position — not field-verified). Full CSV: `eden-floorplans/eden-units.csv`.

## Cross-collection comparisons involving Eden

None recorded (Eden is the comparison baseline the other original-Valley clusters are measured against, per Annex D's cross-collection table — see Doc 1 or the relevant other cluster's reference for those comparisons).

## Staging

See [`staging.md`](./staging.md) for any facts pending promotion into this reference. Batch 002 promoted 2026-08-10. Still open from that batch: payments jpeg, plot sizes, amenities, pricing.
