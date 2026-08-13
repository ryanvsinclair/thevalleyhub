# Nara — Reference

**Slug:** `nara`
**Status:** Migrated from Doc 1 Annex C/D, 2026-08-09. Guarded by `scripts/pre-commit` per Doc 4 #09. Unit-type / facade / unit depth from staging Batches 001–002 (2026-08-13); amenities from Batch 003 (2026-08-13); facade copy from Batch 004 (2026-08-13); payment / summary / body from Batch 005 (2026-08-13).
**Source:** Relocated from Doc 1 Annex C/D, then Batches 001–005 (Emaar floor-plan PNGs + `nara-units.csv` + brochure / sharp-map legend + payment PDF, source `a1000000-0000-4000-8000-000000000001`).

---

## Register

| Field | Value |
|---|---|
| Phase | 1 |
| Product type | townhouse |
| Unit count | 372 |
| Facade styles | Aston, Palma, Charm |
| Single row | true |
| Handover actual | 2024-12-01 |
| Handover target | — |
| Payment plan | 12% Down Payment (on booking) · 10% 1st Instalment (Nov 2021) · 10% 2nd Instalment (May 2022) · 10% 3rd Instalment (Nov 2022) · 8% 4th Instalment (May 2023) · 50% 5th Instalment (100% construction, estimated Dec 2024) |
| Confidence | corroborated |

## Positioning

> The value entry point. Smallest footprints, lowest price, every home single-row with no back-to-back neighbours.

*(Left unchanged — Batch 005 added `summary`/`body` beside it.)*

## Summary

THE VALLEY'S second townhouse community. NARA offers 3 and 4-bedroom townhouses in a choice of three contemporary designs, situated around a series of integrated parks.

## Body

NARA is The Valley's second townhouse community, designed to capture your imagination. Envisage pleasant pathways, stunning landscaping and green spaces, complemented by an array of amenities.

NARA offers 3 and 4-bedroom townhouses in a choice of three contemporary designs. NARA townhouses are situated around a series of integrated parks, which offer ample space for you and your family to enjoy the moments that matter, outdoors.

## Unit types

Style is layout-determining here (`unit_types.layout` = `{facade_style}-{label}`, e.g. `aston-a`). Totals: Palma 188 · Aston 132 · Charm 52. Bedroom split 258×3BR / 114×4BR. All rows: `maids_room = true`, `bathrooms` 3.5 (3BR) / 4.0 (4BR), confidence corroborated. 4BR rows have `ground_floor_bedroom = true`.

| facade_style | bedrooms | label | layout | bua_min | bua_max | unit_count | bathrooms |
|---|---|---|---|---|---|---|---|
| aston | 3 | A | aston-a | 2023 | 2089 | 22 | 3.5 |
| aston | 3 | B | aston-b | 2023 | 2063 | 30 | 3.5 |
| aston | 3 | C | aston-c | 2046 | 2049 | 14 | 3.5 |
| aston | 4 | A | aston-a | 2169 | 2186 | 29 | 4.0 |
| aston | 4 | B | aston-b | 2141 | 2141 | 10 | 4.0 |
| aston | 4 | C | aston-c | 2140 | 2140 | 4 | 4.0 |
| aston | 4 | D | aston-d | 2169 | 2186 | 16 | 4.0 |
| aston | 4 | E | aston-e | 2188 | 2188 | 7 | 4.0 |
| palma | 3 | A | palma-a | 1866 | 1897 | 83 | 3.5 |
| palma | 3 | B | palma-b | 1865 | 1922 | 83 | 3.5 |
| palma | 4 | A | palma-a | 2212 | 2212 | 11 | 4.0 |
| palma | 4 | B | palma-b | 2213 | 2213 | 11 | 4.0 |
| charm | 3 | A | charm-a | 2098 | 2098 | 13 | 3.5 |
| charm | 3 | B | charm-b | 2100 | 2100 | 13 | 3.5 |
| charm | 4 | A | charm-a | 2218 | 2218 | 13 | 4.0 |
| charm | 4 | B | charm-b | 2250 | 2250 | 13 | 4.0 |

## Facades

Copy from Emaar brochure pp. 11 / 13 / 15 (Batch 004). Confidence corroborated. Promo images and floor plans are in `nara-floorplans/`; Storage copies under `media/nara/*` still need uploading before they show on `/clusters/nara`.

| style_name | description |
|---|---|
| Aston | Contemporary architecture and large windows provide an abundance of natural light and wonderful views of pleasant surroundings. ASTON gives you everything you could dream of in a family home. |
| Palma | The 3 and 4-bedroom townhouses of PALMA are modern with a stylishly minimalist design aesthetic, complemented by a large window that allows light to flood in. If you envision living the good life in a contemporary family villa, then PALMA is your dream home made a reality. |
| Charm | This limited collection of CHARM townhouses is certainly worthy of its name. The crisp contemporary architectural design and fresh white façades make these townhouses the epitome of charming. The modern design and surroundings of CHARM offer residents the promise of a wonderful lifestyle in the perfect setting. |

## Amenities (`places`, cluster-scoped)

8 draft `places` rows with `cluster_id` → nara (Batch 003). From `BROCHURE.pdf` p.17 / `SHARP CLUSTER MAP.pdf` legend. Categories per Annex L (#10). Not published on `/clusters/nara` until Ray flips `state`.

| name | category | subcategory |
|---|---|---|
| Community Centre | gathering | community-centre |
| Green Sikkas | nature | sikkas |
| Community Gardens | nature | gardens |
| Outdoor Fitness | recreation | fitness-station |
| Pocket Parks | nature | pocket-parks |
| Picnic Area | gathering | picnic |
| Lawn Area | gathering | lawn |
| Mosque | mosque | — |

Legend pins **#9 Entrance** and **#10 Wadi Drive** are fabric/road, not `places`. **Utility / Substation** is on the same legend sheet but is not an amenity. Brochure pp. 18–22 (Town Centre, Sports Village, Kids’ Dale, Pavilion, Golden Beach) are Valley-wide — not Nara `places`. Community Centre pad on the plan includes a pool; brochure does not name a separate pool facility — one parent row only.

## Units / plexes

372 `units` rows across 57 `plexes`. Per-unit `bua` / `th_position` / `plex_id` populated. Unit-row confidence: **unverified** (derived dataset in `nara-units.csv` — not field-verified). Style split Palma/Aston/Charm = 188/132/52. Full CSV: `nara-floorplans/nara-units.csv`.

## Cross-collection comparisons involving Nara

| Comparison | Difference |
|---|---|
| Nara/Talia 4BR → Elora 4BR | ~350 sq ft, single-row guarantee, newer build |

## Staging

See [`staging.md`](./staging.md) for any facts pending promotion into this reference. Batches 001–005 promoted 2026-08-13. Still open: Storage upload of 23 images (21 from Batch 001 + 2 maps from Batch 005); plot sizes; pricing.
