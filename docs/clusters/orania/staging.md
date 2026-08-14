# Orania — Staging

**Cluster:** `orania`
**Written by:** the agent, per Doc 4 Proposal #04 (extended to per-cluster files — see `docs/07-data-staging.md`)
**Decided by:** Ray only — [`reference.md`](./reference.md) still accepts prose only from Ray, or under `DOCS_GUARD=off`

---

## RULES

1. This file is where new external-source facts about Orania get staged before they become part of [`reference.md`](./reference.md). `reference.md` is never edited directly to introduce a new fact — the batch goes here first.
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

## Batch 001 — Orania layouts, bathrooms, facades, images (2026-08-13)

**Source:** Local `/Users/mehdielghissassi/Desktop/clusters/ORANIA/` — `ORANIA FLOOR PLAN.pdf` (17 pp, Adobe PDF Library 16.0.7), `ORANIA.pdf` brochure pp. 16–18 (two styles + Bold / Sleek facade copy), `ORANIA CLUSTER MAP.pdf` (style legend colours only for this batch), `ORANIA FACTSHEET.pdf` (unit split / starting prices / area envelope). Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** `corroborated` for layout keys, printed BUA ranges, facade names/copy, bathroom/maid counts from labelled rooms on the plans, factsheet unit split (236 / 72). Per-layout `unit_count` and `units`/`plexes` → Batch 004.
**Status:** promoted

### Proposed reference.md diff

- **`clusters.facade_styles`:** `["Bold","Sleek"]` (currently empty/null live). Brochure p. 16: “two distinct architectural styles: Bold and Sleek.”

- **Unit types, 16 rows** (replaces the current 2-row 3BR/4BR placeholder). `layout` follows the Eden/Nara convention `{facade_style}-{label}`. BUA rounded to nearest sq ft from printed TOTAL AREA lines.

  | facade_style | bedrooms | label | layout | bua_min | bua_max | bathrooms | maids_room | ground_floor_bedroom |
  |---|---|---|---|---|---|---|---|---|---|
  | bold | 3 | A | bold-a | 1960 | 1992 | 3.5 | true | false |
  | bold | 3 | B | bold-b | 1959 | 1960 | 3.5 | true | false |
  | bold | 3 | C | bold-c | 1896 | 1899 | 3.5 | true | false |
  | bold | 3 | D | bold-d | 1896 | 1929 | 3.5 | true | false |
  | bold | 4 | A | bold-a | 2284 | 2284 | 4.0 | true | true |
  | bold | 4 | B | bold-b | 2284 | 2284 | 4.0 | true | true |
  | bold | 4 | C | bold-c | 2346 | 2346 | 4.0 | true | true |
  | bold | 4 | D | bold-d | 2346 | 2346 | 4.0 | true | true |
  | sleek | 3 | A | sleek-a | 2009 | 2044 | 3.5 | true | false |
  | sleek | 3 | B | sleek-b | 2009 | 2011 | 3.5 | true | false |
  | sleek | 3 | C | sleek-c | 1903 | 1906 | 3.5 | true | false |
  | sleek | 3 | D | sleek-d | 1903 | 1938 | 3.5 | true | false |
  | sleek | 4 | A | sleek-a | 2264 | 2265 | 4.0 | true | true |
  | sleek | 4 | B | sleek-b | 2265 | 2265 | 4.0 | true | true |
  | sleek | 4 | C | sleek-c | 2345 | 2345 | 4.0 | true | true |
  | sleek | 4 | D | sleek-d | 2346 | 2346 | 4.0 | true | true |

  Bathroom method (same as Eden/Nara/Talia/Elora): every `BATH` / `MASTER BATH` / maid bath label = 1; `PWDR. RM` = 0.5. No printed “n baths” marketing line.

  **Maid:** All 16 layouts label `MAID’S ROOM` (3BR-A/B also have a small `STORE`). All 4BR rows have a GF `GUEST BEDROOM`.

  Source page → layout map (`ORANIA FLOOR PLAN.pdf`):

  | page | style | layout | printed SQFT range |
  |---|---|---|---|
  | 2 | Bold | 3BR-A | 1959.5–1992.4 (6/10-plex middles) |
  | 3 | Bold | 3BR-B | 1959.0–1959.8 mirrored |
  | 4 | Bold | 3BR-C | 1896.0–1899.3 (8/10-plex) |
  | 5 | Bold | 3BR-D | 1895.6–1928.9 mirrored |
  | 6 | Bold | 4BR-A | 2284.3–2284.4 (6/10 ends) |
  | 7 | Bold | 4BR-B | 2284.3–2284.4 mirrored |
  | 8 | Bold | 4BR-C | 2346.3 (8-plex TH01) |
  | 9 | Bold | 4BR-D | 2346.3 mirrored |
  | 10 | Sleek | 3BR-A | 2009.2–2043.8 |
  | 11 | Sleek | 3BR-B | 2009.2–2011.1 mirrored |
  | 12 | Sleek | 3BR-C | 1903.2–1906.4 |
  | 13 | Sleek | 3BR-D | 1903.0–1938.2 mirrored |
  | 14 | Sleek | 4BR-A | 2264.5–2264.6 |
  | 15 | Sleek | 4BR-B | 2264.6–2265.1 mirrored |
  | 16 | Sleek | 4BR-C | 2344.7 |
  | 17 | Sleek | 4BR-D | 2345.7 mirrored |

  Matches factsheet envelope: 3BR **1896–2044** · 4BR **2265–2346**. Existing register 3BR min 1898 / 4BR max 2345 is the same envelope, slightly rounded.

  **Master arrays complete (Doc 10 Phase 1):** Bold and Sleek each fill 6-/8-/10-plex TH01→THn with no gaps. **No 4-plex pages** in this floor-plan PDF (live `plex_config` text mentioning 4-plex should be revisited after Batch 004).

- **Register note from factsheet:** 308 total · **236** 3-bedroom · **72** 4-bedroom. Live `clusters.unit_count = 308` already matches. Do not invent per-layout `unit_count` from the split alone.

- **`clusters.price_from_aed`:** `1528888` from factsheet starting price **1,528,888** AED for 3-bedroom. 4-bedroom starting **1,944,888** noted only (no `price_to` column).

- **New `facade_style_descriptions` rows, `cluster_id = orania` (2 rows):**

  | style_name | description |
  |---|---|
  | Bold | Come home to a bold architectural aesthetic that harmoniously blends pure solids and voids for a design that exudes sophistication and beautifully complements its natural surroundings. |
  | Sleek | Wake up to an elegant and inviting architectural design, boasting iconic frames that stand out in a sleek exterior composition, creating a sense of calmness and modernity. |

  Each: `confidence = corroborated`, `source_id` as above. Verbatim from `ORANIA.pdf` pp. 17 / 18 (line breaks collapsed).

- **Images in [`floorplans/`](floorplans/):** 16 floor plans (one per layout above), 2 facade exteriors (`orania-bold-facade.jpeg`, `orania-sleek-facade.jpeg`), 1 cluster map (`orania-cluster-map.jpeg`, 2822×1646 embedded raster — note resolution), 1 page render (`orania-cluster-map-page.png`), 1 master plan (`orania-master-plan.jpeg`), 1 valley context (`orania-valley-context-map.png` from brochure p.8). Storage upload + `media` / `media_links` at promotion. Intermediate artefacts under `_phase0_inventory.json`, `_floorplan_text.json`, `_phase1_layouts.json`, `_visual_check/`.

### Notes

- **No `units` / `plexes` / per-layout `unit_count` in this batch** — completed in Batch 004 (Doc 10).
- Key plans show **6 / 8 / 10-plex only** (no 4-plex). Register `plex_config` “4-plex / 43 clusters” superseded by Batch 004 (36 plexes · 6/8/10).
- `single_row = true` already live; factsheet does not restate it — leave as-is.
- Plot / suite / garage / balcony / roof areas: not printed as per-layout min/max on these pages. Leave null.
- Amenities → Batch 002. Payment / summary / body → Batch 003.
- Cluster map raster is **2822×1646** (weaker than Nara/Talia sharp maps). Doc 10 orientation may need a sharper export if margins are thin — ask early if OCR stalls.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** Ray (authorized promote + publish); agent applied live + docs

---

## Batch 002 — Orania on-site amenities from cluster-map legend (2026-08-13)

**Source:** `ORANIA CLUSTER MAP.pdf` amenities legend (letters A–O). Cross-checked against brochure amenity marketing (Valley-wide destinations called out separately). Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated for names printed on the legend. Annex L category/subcategory are suggestions.
**Status:** promoted

### Proposed reference.md diff

- **New `places` rows, `cluster_id = orania` (14 rows), `state = draft`.** On-site legend items only (exclude Valley Pavilion).

  | name | category | subcategory | brochure pin |
  |---|---|---|---|
  | Orania Gatehouse | gathering | gatehouse | A |
  | Pocket Park | nature | pocket-parks | B |
  | Kids Play Area and Lawn | family | kids-play | C |
  | Community Clubhouse | gathering | community-centre | D |
  | Green Sikka | nature | sikkas | E |
  | Splash Pad | family | splash-pad | F |
  | Picnic Lawn | gathering | picnic | G |
  | Jogging Track | recreation | running-track | H |
  | Outdoor Living Room | gathering | outdoor-living | I |
  | Palm Grove | nature | gardens | J |
  | Yoga Deck | wellness | yoga | K |
  | Events Lawn | gathering | lawn | L |
  | Sports Court | recreation | multi-use-court | N |
  | Skate Park | recreation | skate | O |

  Each row: `slug = orania-<kebab-name>`, `in_community = true`, `parent_place_id` null, `google_place_id` null, `confidence = corroborated`, `source_id` as above, `sort_order` = letter order skipping M (A=1 … O=14 with M omitted).

- **Legend letter M — The Valley Pavilion:** Valley-wide destination on the legend, **not** an Orania `cluster_id` row (same judgment as Talia Golden Beach strip / Elora brochure destinations). Stage separately only if Ray wants a Valley-wide place note.

### Notes

- Brochure p. 10 also names Golden Beach, Town Centre, retail & dining — Valley-wide; not Orania `places`.
- Default `state = draft`. Public `/clusters/orania` will not show them until published.
- Subcategory `skate` / `splash-pad` are suggestions — remap if Annex L prefers another token.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** Ray (authorized promote + publish); agent applied live + docs

---

## Batch 003 — Orania payment plan, summary/body (2026-08-13)

**Source:** `ORANIA PAYMENT.pdf` (1 p) and `ORANIA.pdf` pp. 2–3 / 8 / 16 (cluster intro / product paragraphs). Drive-time claims on factsheet skipped per Doc 9 / Farm Gardens / Nara / Talia / Elora. Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated (printed Emaar PDFs). `summary` / `body` are brochure paragraphs collapsed to prose — Ray decides whether they go live; do not replace `positioning`.
**Status:** promoted

### Proposed reference.md diff

- **`clusters.payment_plan`:** `"10% Down Payment (10 Jun 2022) · 10% 1st Instalment (8 Aug 2022) · 10% 2nd Instalment (8 Feb 2023) · 10% 3rd Instalment (upon 10% construction, 12 Sep 2023) · 10% 4th Instalment (upon 30% construction, 27 Apr 2024) · 10% 5th Instalment (upon 50% construction, 1 Oct 2024) · 15% 6th Instalment (upon 70% construction, 10 Feb 2025) · 25% 7th Instalment (upon 100% construction, estimated 31 Dec 2025)"`

  Source: `ORANIA PAYMENT.pdf`. Footnote: `*Estimated Construction Completion Date`. Sums to 100%. Live `handover_target = 2025-12-31` aligns with the final instalment date; `handover_actual` stays null (completion unconfirmed).

- **`clusters.summary`:** `"The Valley’s fourth neighbourhood of modern townhouses, ORANIA brings balance to your lifestyle, in a community you can feel proud to call home."`

- **`clusters.body`:**
  > With a wide array of indoor and outdoor retail options, The Valley's Golden Beach, lush linear parks, a local farmers’ market, and gourmet dining options just footsteps away, your family can embrace a true sense of community amidst the serenity of nature.
  >
  > ORANIA offers you the choice of three and four-bedroom townhouses in two distinct architectural styles: Bold and Sleek. Choose the ideal home to match your lifestyle and enjoy direct access to linear parks and lush green open spaces in a setting of absolute tranquillity.

- **`clusters.positioning`:** leave unchanged (brochure `summary`/`body` sit beside it; Doc 9).

### Notes

- Factsheet payment table matches the dedicated payment PDF dates/percentages.
- Factsheet drive times skipped.
- `orania-payment.png` and `orania-factsheet.png` exported under `floorplans/` for provenance only.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** Ray (authorized promote + publish); agent applied live + docs

---

## Batch 004 — Orania per-plot units + plexes (Doc 10 extract) (2026-08-13)

**Source:** Local `/Users/mehdielghissassi/Desktop/clusters/ORANIA/` — `ORANIA FLOOR PLAN.pdf` (master arrays, Batch 001) + `ORANIA CLUSTER MAP.pdf` (plot labels: PDF CenturyGothic text + tiled OCR for gaps; style-fill orientation). Method: [`docs/10-cluster-extraction-playbook.md`](../../10-cluster-extraction-playbook.md). Artefacts in [`floorplans/`](floorplans/) (`orania-units.csv`, `orania-plexes.csv`, `orania-plex-composition.csv`, `orania-units-detection.csv`, `_phase1`…`_phase5`). Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** `unverified` for per-unit style/type/position and exact BUA (derived in `orania-units.csv`; detection log in `orania-units-detection.csv`). Corroborated where it matches the register + factsheet: **308** plots, facades Bold/Sleek, BUA envelope 1896–2346 sqft, bedroom split **236×3BR / 72×4BR**.
**Status:** promoted

### Proposed reference.md diff

- **`unit_types.unit_count` filled for all 16 layouts** (Batch 001 left these null):

  | facade_style | bedrooms | label | layout | unit_count |
  |---|---|---|---|---|
  | bold | 3 | A | bold-a | 24 |
  | bold | 3 | B | bold-b | 24 |
  | bold | 3 | C | bold-c | 36 |
  | bold | 3 | D | bold-d | 36 |
  | bold | 4 | A | bold-a | 12 |
  | bold | 4 | B | bold-b | 12 |
  | bold | 4 | C | bold-c | 6 |
  | bold | 4 | D | bold-d | 6 |
  | sleek | 3 | A | sleek-a | 24 |
  | sleek | 3 | B | sleek-b | 24 |
  | sleek | 3 | C | sleek-c | 34 |
  | sleek | 3 | D | sleek-d | 34 |
  | sleek | 4 | A | sleek-a | 12 |
  | sleek | 4 | B | sleek-b | 12 |
  | sleek | 4 | C | sleek-c | 6 |
  | sleek | 4 | D | sleek-d | 6 |

  Totals: Bold **156** · Sleek **152** = **308**. Bedroom split **236×3BR / 72×4BR** (matches factsheet).

- **New `plexes` rows, `cluster_id = orania` (36 rows).** Sizes from floorplan key plans + site-plan gap split: **17×10 · 12×8 · 7×6** (no 4-plex). Style mix: Bold 9×10 / 6×8 / 3×6 · Sleek 8×10 / 6×8 / 4×6. Full ranges / `street_side` in [`floorplans/orania-plexes.csv`](floorplans/orania-plexes.csv).

- **New `units` rows, `cluster_id = orania` (308 rows).** Same family of CSVs: `unit_number` / `plot_number` (1–308 contiguous), `facade_style`, `layout`, `bua`, `th_position`. `confidence = unverified`. No mirror-pair plex types — TH01→THn follows ascending plot number within each plex after style-fill orientation.

- **`clusters.plex_config` (register prose):** supersede “43 clusters in 4, 6, 8 and 10-plex rows” with **36 plexes in 6, 8 and 10-plex rows** (key plans have no 4-plex; site-plan split has none). Positioning line that repeats “43 clusters / four plex configurations” should be revisited on promote (Ray wording).

### Notes

- Phase gates (Doc 10): Phase 1 master arrays complete (Bold/Sleek × 6/8/10, no gaps) · Phase 2 308/308 plots (222 PDF text + 82 OCR + 4 interp; plots 3–4 were legend collisions, repaired to CenturyGothic map labels) · Phase 3 threshold search → **36** plexes, all legal sizes {6,8,10} · Phase 4 style-fill (tan Bold vs pink Sleek map refs), min orientation margin **0.208**, min style vote **0.80**; `street_side` stored as page-relative up/down/left/right (schema check) · Phase 5 array laydown · Phase 6 layout counts exact multiples of plex-type counts; bedroom split matches factsheet 236/72.
- Resolves Batch 001 note: live/register `plex_config` mentioning 4-plex is **wrong for this extract** — floor plans and map agree on 6/8/10 only.
- `orania-units-detection.csv` is the detection log, not a promotion table.
- Cluster map page render is 5760×4286; embedded raster alone was 2822×1646.
- Promoted 2026-08-13 with amenities published and media uploaded.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** Ray (authorized promote + publish); agent applied live + docs
