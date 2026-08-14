# Eden — Staging

**Cluster:** `eden`
**Written by:** the agent, per Doc 4 Proposal #04 (extended to per-cluster files — see `docs/07-data-staging.md`)
**Decided by:** Ray only — [`reference.md`](./reference.md) still accepts prose only from Ray, or under `DOCS_GUARD=off`

---

## RULES

1. This file is where new external-source facts about Eden get staged before they become part of [`reference.md`](./reference.md). `reference.md` is never edited directly to introduce a new fact — the batch goes here first.
2. One numbered batch per intake (a PDF export, a factsheet, a site visit, an operator call). Never edit a promoted batch — supersede it with a new one if a value turns out wrong.
3. Every fact in a batch carries a `source_id` and a confidence level. Staging skips the propose→approve→implement ceremony of Doc 4 — it does not skip sourcing rigor.
4. A batch is not a fact until it's `promoted` — until then, nothing here overrides what `reference.md` currently says.
5. Schema or structural changes (new columns, new tables) are **not** staged here — those go through Doc 4 as their own proposal.
6. Per Doc 3 §12, a newly staged batch must be raised to Ray directly in the same message, not left for later discovery.

## STATUS VALUES

`staged` · `promoted` · `rejected`

## ENTRY FORMAT

```markdown
## Batch NNN — <short description> (YYYY-MM-DD)

**Source:** <files/links, retrieval date>
**Source ID:** <sources.id> (<label>)
**Confidence:** <confidence_level>
**Status:** staged / promoted / rejected

### Proposed reference.md diff
- <exact field-by-field change>

### Notes
<anything blocked on a pending Doc 4 schema proposal, conflicts, things left null>

### Promotion
**Promoted:** [ ]
**Date:**
**By:**
```

---

# LIVE BATCHES

## Batch 001 — Eden PDF export, design notes (2026-08-09)

**Source:** 3 files from `/Users/ryansinclair/Downloads/EDEN/` — `EDEN .pdf` (27-page brochure), `EDEN FLOOR PLAN.pdf` (20 pages), `EDEN CLUSTER PAYMENTS.jpeg`. No numbered site plan / cluster map in this folder (unlike Farm Gardens) — still needed before `units` can be populated.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated (structural findings below), not yet extracted as exact field values
**Status:** superseded by Batch 002

### Findings so far

- Eden = 3 facade styles (Spruce, May Bell, Iris — matches `clusters.facade_styles` already live), each offered as 3-bed and 4-bed townhouses. Unlike Farm Gardens, **style is layout-determining here, not cosmetic** — each style has its own distinct set of floor-plan layouts, not a shared interior with two exterior skins.
- 15 distinct floor-plan layouts total, confirmed from all 20 floor-plan-PDF pages: Spruce 3BR (A/B/C/D — 4), Spruce 4BR (A/B — 2), Iris 3BR (A/B — 2), Iris 4BR (A/B/C — 3), May Bell 3BR (A/B — 2), May Bell 4BR (A/B — 2).
- Each layout has its own small table of exact areas per generic plex-position (e.g. Spruce 3BR-A: 8-Plex TH02 = 1937.39 sqft, TH04 = TH06 = 1929.75 sqft) — these are schematic plex-row templates, not tied to Eden's actual real unit addresses.
- No `suite_area`/`garage_area`/`balcony_area`/`roof_terrace_area` breakdown exists in Eden's floor plans (confirmed on 2 separate layout pages) — Eden is a 2-story townhouse (no roof floor at all, unlike Farm Gardens' 3-story villas), so `roof_terrace_area` doesn't apply as a concept, and the others simply aren't published as rolled-up figures. These 4 columns stay `null` for all Eden `unit_types` rows.

### Proposed design (not yet built — schema + Doc 4 proposal pending)

- **`unit_types`**: 15 rows (not the current 2), one per (bedrooms, facade_style, layout). Needs a new column, `unit_types.facade_style` (text, nullable) — separate from `label` (which holds the layout letter) so style stays independently filterable/queryable. `bua_min`/`bua_max` per row set from that specific layout's own plex-position range, not a cluster-wide rollup.
- **Floor plan images**: one or more per `unit_types` row via existing `media_links` (`subject_type='unit_type'`) — no schema change needed, same mechanism as Farm Gardens.
- **`facade_style_descriptions`**: 3 rows (Spruce, May Bell, Iris) from the brochure's descriptive copy per style.
- **`units`**: **blocked** — no numbered site plan in this source folder, so there's no way to know which of Eden's real 362 homes maps to which layout/style without one. Not populating rather than guessing. Revisit once/if a cluster-map-equivalent document is found.

### Notes

Exact dimensions, style description copy, and plex-position tables for all 15 layouts have not been transcribed yet — this batch is the structural design only, confirmed against the source PDFs but not yet turned into field-level data. Full extraction paused pending the cluster-map question above.

### Promotion

**Promoted:** [ ] — superseded; do not promote
**Date:**
**By:**

---

## Batch 002 — Eden full unit derivation: 362 units, 15 unit_types, 43 plexes, images (2026-08-10)

**Source:** Same 3 files as Batch 001 (`EDEN .pdf`, `EDEN FLOOR PLAN.pdf`, `EDEN CLUSTER PAYMENTS.jpeg` — the payments jpeg still not examined), plus `EDEN .pdf` pages 17–22 (facade style copy + promo photography) newly used in this batch.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** unverified for per-unit style/type/position (visually and geometrically classified from the developer's own site plan and floor-plan PDFs, not independently field-verified); corroborated for the structural facts that were externally cross-checked (see Notes)
**Status:** promoted

### Method summary

Eden's site plan (`EDEN FLOOR PLAN.pdf` pages 2/3/10/16 — one all-3-styles master plus one single-style highlight page per style) and its 15 floor-plan pages (4–9 Spruce, 11–15 Iris, 17–20 May Bell) were cross-derived as follows, without ever color-sampling an individual unit:

1. **Plot number inventory** — Apple Vision-framework OCR (native macOS, no third-party install) tiled across the site plan at 2x render scale, 322 → 347 raw hits after widening tile overlap, deduped to a clean position table for all 362 plot numbers.
2. **Whole-plex style identification** — for plexes where every unit is visibly one color, confirmed against the three single-style highlight pages (binary colored/white per page, not fine hue discrimination). Result: **8-plex rows are always pure Spruce, 6-plex rows are always pure Iris** — no exception found across the site. Neither appears in the other's floor-plan area tables either (cross-checked against the PDF text), which is independent confirmation of the same fact.
3. **Key-plan TH-position arrays** — every layout page's "UNIT TOTAL AREA" table (`N PLEX - TH NN`) was combined across all pages per style to build the complete TH01→THn array for each plex size. 9-plex and 10-plex arrays are each split across multiple styles (no single style's pages cover a full 9- or 10-plex on their own) — this was the mechanism that made mixed plexes resolvable by position alone, with no color-reading needed there either.
4. **Orientation** — for each of the 43 physical plexes, the street-facing side was read directly off the site plan (the edge with individual closed-square garage tabs + street trees is the street side; the edge showing a continuous style-color band the full length of the row is the opposite/garden side — confirmed as a reliable, non-ambiguous signal across every orientation encountered: up/down/left/right all occurred, no single fixed rule held site-wide). TH01 anchors to the correct physical end from that reading, then the row is read in the corresponding direction.
5. **Exact per-unit area** — each unit's TH position was joined against the exact (not layout-range) `sqft`/`sqm` figure from that specific TH slot in the area tables, since the same layout letter varies slightly by which slot it occupies in a row (e.g. Spruce 3BR-A ranges 1929.75–1937.39 sqft depending on TH02/TH04/TH06).
6. **Bathroom count** — read directly off 13 of 15 floor-plan pages' room lists (2 pages, Iris 3BR-A/B, have a text-extraction corruption bug in the source PDF — verified visually against the rendered floor-plan image instead). Consistent, no-exception rule: **3BR = 3.5 baths** (Master Bath + Bath + Maid's Bath + Powder Room), **4BR = 4.0 baths** (Master Bath + Bath + Bath + Maid's Bath, no powder room), regardless of style.

### Corroboration against external sources

- **362 total units, 43 clusters** — confirmed via web search against 2 independent third-party brokerage listings (not Emaar's own site, which doesn't state a total). Exact match to this batch's derived plex count (26 single-style + 17 mixed = 43) and unit count.
- **4BR starting size 2,311 sqft** — confirmed against a third-party listing's "starting at" figure; matches this batch's smallest 4BR (May Bell 4BR-A, 2,310.68–2,311.11 sqft) almost exactly.
- No third-party source publishes a per-style or per-bedroom-type unit count breakdown, so the exact 190/126/46 style split and 86/276 bedroom split remain internally-derived only, not externally corroborated.

### Proposed reference.md diff

- **Unit types, 15 rows** (replaces the current 2-row placeholder table, which only had a 3BR/4BR-wide `bua_min`/`bua_max` range) — *depends on Doc 4 #12*

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

  Totals: Spruce 190 (42×4BR, 148×3BR), Iris 126 (32×4BR, 94×3BR), May Bell 46 (12×4BR, 34×3BR) = 362. `maids_room = true` for all 15 rows (every layout's room list includes one). `ground_floor_bedroom` and `private_pool` not yet checked against the floor-plan room layouts — left null, not assumed false.

- **New `plexes` rows, `cluster_id = eden` (43 rows)** — *depends on Doc 4 #12*. Full dataset in [`floorplans/eden-units.csv`](floorplans/eden-units.csv) (`plex_range`/`plex_size`/`street_side` columns, one row per unit — the promotion SQL dedupes to the 43 distinct plexes). Sizes: 21× 8-plex, 11× 10-plex, 6× 9-plex, 5× 6-plex.

- **New `units` rows, `cluster_id = eden` (362 rows)** — *depends on Doc 4 #12 (`units.bua`/`plex_id`/`th_position`)*. Full dataset in [`floorplans/eden-units.csv`](floorplans/eden-units.csv). Per row: `unit_number`/`plot_number` = printed plot number (OCR'd, reliable), `facade_style` = spruce/iris/may_bell, `bua` = exact per-TH-slot sqft, `plex_id`/`th_position` = derived per the method above. `confidence = unverified` for the whole row, same reasoning as Farm Gardens' units batch — reliably read plot numbers, but visually/geometrically classified style, type, and position, not independently field-verified.

- **New `facade_style_descriptions` rows, `cluster_id = eden` (3 rows):**

  | style_name | description |
  |---|---|
  | Spruce | "Whether you're arriving on foot or by car, the sight of SPRUCE is truly special. As its warm and earthy tones welcome you, you will feel grounded in the magic of home." |
  | Iris | "Picture this — you, parking your car in front of this stunning masterpiece at sunset. The IRIS collection is sleek, light and simply what dreams are made of." |
  | May Bell | "Imagine waking up at MAY BELL and heading downstairs to your loved ones having breakfast in a sun-soaked sanctuary. Purist and minimal, MAY BELL focuses on what truly matters – family." |

  All three: `confidence = corroborated`, `source_id = a1000000-0000-4000-8000-000000000001`.

- **Images, 22 files in `floorplans/`** — 15 floor plans (one per `unit_types` row, ground + first floor combined, cropped clean of area table/key plan/legal boilerplate — spot-checked against a 3BR page, a 4BR page, and a page with corrupted text extraction, no cutoff in any), 1 cluster map (`eden-cluster-map.jpg`, all-3-styles site plan with legend), 6 style promo photos (facade + interior per style, from `EDEN .pdf` pages 17–22). All linked via the existing `media_links` mechanism — floor plans and cluster map to their `unit_types`/cluster subject, promo photos to their `facade_style_descriptions` row — no new mechanism needed (Doc 4 #08 already covers both subject types).

### Notes

- Two source-data quirks worth flagging, not corrected: (1) the small ensuite bath on May Bell's 3BR ground floor is labeled "MASTER BATH" in Emaar's own PDF despite sitting next to the Maid's Room, far from the actual Master Bedroom upstairs — almost certainly a copy-paste labeling error in the source file (the equivalent room is correctly labeled "MAID'S BATH" on the Spruce/Iris pages). Doesn't change the bathroom count. (2) Two floor-plan pages (Iris 3BR-A/B, pages 11–12) have a text-extraction corruption bug in the source PDF (character-doubling); bathroom counts for those two were confirmed by rendering and visually reading the floor plan image instead of trusting the extracted text.
- `EDEN CLUSTER PAYMENTS.jpeg` still not examined — Eden's `handover_actual` is already 2023-11-01 (delivered), so a construction-linked payment plan may not even apply the way it did for Farm Gardens; needs checking before assuming the field applies at all.
- Plot/land size (`plot_min`/`plot_max`), `summary`/`body`/`positioning` copy beyond what's already in `reference.md`, and pricing are still not collected — brochure pages beyond 17–22 not yet reviewed for those. Amenities moved to Batch 003.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-10
**By:** agent (Ray authorized: #12 APPROVED + promote Batch 002). Migration `0003` applied; 22 images uploaded to `media/eden/*`; promotion SQL run; `reference.md` updated. Live sanity: 15 unit_types (sum 362), 43 plexes, 362 units, 3 facades, 22 media + links; style split spruce/iris/may_bell = 190/126/46.

---

## Batch 003 — Eden cluster amenities from site-plan legend (2026-08-10)

**Source:** `EDEN .pdf` page 15 (combined Eden + Pavilion site-plan legend); cross-checked against local `floorplans/eden-cluster-map.jpg`. Retrieval via brochure text extract 2026-08-10.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar PDF)
**Confidence:** corroborated
**Status:** promoted

### Proposed reference.md diff

- **New `places` rows, `cluster_id = eden` (4 rows), `state = published`:**

  | name | category | subcategory | brochure pin |
  |---|---|---|---|
  | Community Centre | gathering | community-centre | #11 |
  | Central Gardens | nature | gardens | #12 |
  | Food Trucks | gathering | food-trucks | #13 |
  | Kiosks | gathering | kiosks | #14 |

  Each row: `slug = eden-<name>`, `in_community = true`, `parent_place_id` null, `google_place_id` null, `confidence = corroborated`, `source_id` as above, `sort_order` = pin number.

- **Amenities prose for reference:** Eden’s private amenity set is light — the four named facilities above, plus an unnumbered internal **Alley** walkway system between townhouse rows (shown as dots on the site plan; matches “Opens to alley” on style pages). Not staged as a `places` row (fabric, not a named facility). Residents also rely on Valley-wide amenities (Golden Beach, Town Centre, Sports Village, Kids’ Dale) and the adjacent **Pavilion** park.

### Notes

- Page 15 legend covers two boundaries: peach = EDEN, white = The Pavilion. Pins **#1–10** (Bicycle track, Basketball courts, Kids’ play area, Amphitheatre, Edu-scape playground, Multi-purpose lawn, Beach & splash pad, Hammock zone, Zen garden, Observation tower) sit inside the Pavilion boundary — Valley-wide / adjacent, **not** Eden `places`. Zen garden + Observation tower match The Pavilion’s dedicated brochure page almost word-for-word.
- Community Centre has **no brochure itemization** of interiors (no gym/pool/spa/conference list under pin #11). Site plan shows pool water adjacent to the amenity pad, but that is not staged as a child place until corroborated as a named facility. Leave as one parent row.
- No new Annex L categories required — `gathering` / `nature` already live from Doc 4 #10.
- Pavilion itself is still not a Valley-wide `places` row; out of scope for this Eden batch.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-10
**By:** agent (Ray authorized: finalize amenities go-live). Promotion SQL `floorplans/eden-batch-003-amenities.sql`; `reference.md` + Doc 6 updated.

---

## Batch 004 — Ground-floor bedroom from floor plans (2026-08-13)

**Source:** Live Eden floor-plan images in `floorplans/` (15 layouts) — visual read of ground-floor room labels.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated
**Status:** promoted

### Proposed reference.md diff

- **`unit_types.ground_floor_bedroom`:** all 8× 3BR → `false`; all 7× 4BR → `true` (were null).

### Notes

- 4BR plans label Guest Bedroom on GF; 3BR plans have living/kitchen/maid only on GF (maid does not count).

### Promotion

Ran 2026-08-13: 15 Eden `unit_types` rows updated as above.

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: yes — set from floorplan check)
