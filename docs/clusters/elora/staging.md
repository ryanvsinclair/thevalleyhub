# Elora — Staging

**Cluster:** `elora`
**Written by:** the agent, per Doc 4 Proposal #04 (extended to per-cluster files — see `docs/07-data-staging.md`)
**Decided by:** Ray only — [`reference.md`](./reference.md) still accepts prose only from Ray, or under `DOCS_GUARD=off`

---

## RULES

1. This file is where new external-source facts about Elora get staged before they become part of [`reference.md`](./reference.md). `reference.md` is never edited directly to introduce a new fact — the batch goes here first.
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

## Batch 001 — Elora layouts, bathrooms, facades, images (2026-08-13)

**Source:** Local `/Users/mehdielghissassi/Desktop/clusters/ELORA/` — `ELORA FLOOR PLAN.pdf` (9 pp, InDesign 18.1 / 2023-01-11), `ELORA.pdf` brochure pp. 22–24 (style intro + Moon / Mysk facade copy), `ELORA CLUSTER MAP.pdf` (style legend colours only for this batch), `ELORA FACTSHEET.pdf` (unit split / starting prices). Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** `corroborated` for layout keys, printed BUA ranges, facade names/copy, bathroom/maid/store counts from labelled rooms on the plans, factsheet unit split (284 / 146). Per-layout `unit_count` and `units`/`plexes` → Batch 004.
**Status:** promoted

### Proposed reference.md diff

- **Unit types, 8 rows** (replaces the current 2-row 3BR/4BR placeholder). `layout` follows the Eden/Nara convention `{facade_style}-{label}`. Facade styles stay Moon / Mysk (matches live `clusters.facade_styles`). BUA rounded to nearest sq ft from printed TOTAL AREA lines.

  | facade_style | bedrooms | label | layout | bua_min | bua_max | bathrooms | maids_room | ground_floor_bedroom |
  |---|---|---|---|---|---|---|---|---|---|
  | moon | 3 | A | moon-a | 2180 | 2180 | 3.5 | true | false |
  | moon | 3 | B | moon-b | 2180 | 2180 | 3.5 | false | false |
  | mysk | 3 | A | mysk-a | 2095 | 2112 | 3.5 | false | false |
  | mysk | 3 | B | mysk-b | 2095 | 2112 | 3.5 | false | false |
  | moon | 4 | A | moon-a | 2608 | 2608 | 4.0 | true | true |
  | moon | 4 | B | moon-b | 2608 | 2608 | 4.0 | true | true |
  | mysk | 4 | A | mysk-a | 2586 | 2586 | 4.0 | true | true |
  | mysk | 4 | B | mysk-b | 2586 | 2586 | 4.0 | true | true |

  Bathroom method (same as Eden/Nara/Talia): every `BATH` / `MASTER BATH` / `MAIDS BATH` label = 1; `PWDR. RM` = 0.5. No printed “n baths” marketing line.

  **Maid vs store (important):** Moon 3BR-A labels `MAIDS ROOM` + `MAIDS BATH`. Moon 3BR-B and both Mysk 3BR label `STORE` + a GF `BATH` instead — `maids_room = false` on those three rows. All 4BR rows have `MAID’S ROOM` + ensuite bath and a GF `GUEST BEDROOM`.

  Source page → layout map (`ELORA FLOOR PLAN.pdf`):

  | page | style | layout | printed SQFT |
  |---|---|---|---|
  | 2 | Moon | 3BR-A | 2179.80 (4 PLEX 1 – TH 02) |
  | 3 | Moon | 3BR-B | 2179.80 mirrored (4 PLEX 1 – TH 03) |
  | 4 | Mysk | 3BR-A | 2094.65–2111.55 (6 TH slots across 4/6/8-plex) |
  | 5 | Mysk | 3BR-B | 2094.76–2111.55 mirrored |
  | 6 | Moon | 4BR-A | 2607.99 (end TH on 4/6/8-plex) |
  | 7 | Moon | 4BR-B | 2607.99 mirrored |
  | 8 | Mysk | 4BR-A | 2586.13 (4 PLEX 2 – TH 01) |
  | 9 | Mysk | 4BR-B | 2586.13 mirrored |

  Matches existing register envelope: smallest 3BR 2095 (Mysk) · largest 3BR 2180 (Moon) · 4BR 2586–2608.

- **Register note from factsheet (not per-layout counts):** 430 total · **284** 3-bedroom · **146** 4-bedroom. Live `clusters.unit_count = 430` already matches. Do not invent per-layout `unit_count` from the split alone.

- **`clusters.price_from_aed`:** `1600000` from factsheet starting price **1.6** (AED Mn) for 3-bedroom. 4-bedroom starting **2.1** Mn noted only (no `price_to` column).

- **New `facade_style_descriptions` rows, `cluster_id = elora` (2 rows):**

  | style_name | description |
  |---|---|
  | Moon | Moon design aesthetic is an alluring interplay of planes and masses accented to highlight a tranquil style of living. |
  | Mysk | Mysk is a collection of townhouses with rich-toned and open corners to capture the enchanting rays of the golden hour and create a sense of calmness and warmth. |

  Each: `confidence = corroborated`, `source_id` as above. Verbatim from `ELORA.pdf` pp. 23 / 24 (line breaks collapsed). Style intro on p. 22 (“two distinct architectural styles: Moon and Mysk”) corroborates names only.

- **Images, 16 files in [`../../../elora-floorplans/`](../../../elora-floorplans/):** 8 floor plans (one per layout above), 2 facade exteriors (`elora-moon-facade.jpeg`, `elora-mysk-facade.jpeg`), 1 cluster map (`elora-cluster-map.jpeg`, 7355×3259 from `ELORA CLUSTER MAP.pdf`), 1 master plan (`elora-master-plan.jpeg`), 1 valley context (`elora-valley-context-map.png` from brochure p.7), 3 interior brochure stills (`elora-interior-a/b/c.jpeg`). Storage upload + `media` / `media_links` at promotion. Intermediate OCR artefacts under `elora-floorplans/_phase0_inventory.json`, `_floorplan_text.json`, `_bath_scan.json`, `_visual_check/`.

### Notes

- **No `units` / `plexes` / per-layout `unit_count` in this batch** — completed in Batch 004 (Doc 10).
- Key plans show 4 / 6 / 8-plex patterns (no 10-plex pages in this PDF).
- `single_row = true` already live and matches positioning (“All 430 units single-row”); factsheet does not restate it — leave as-is.
- Plot / suite / garage / balcony / roof areas: factsheet prints **AVG** plot only (3BR 1,485 · 4BR 2,797 sq ft) — not per-layout min/max. Leave `plot_*` / area breakdown null.
- Amenities → Batch 002. Payment / summary / body → Batch 003.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** Ray (authorized promote); agent applied live + docs

---

## Batch 002 — Elora on-site amenities from cluster-map legend (2026-08-13)

**Source:** `ELORA CLUSTER MAP.pdf` amenities legend (letters A–M). Cross-checked against brochure p. 8 (same legend). Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated for names printed on the legend. Annex L category/subcategory are suggestions.
**Status:** promoted

### Proposed reference.md diff

- **New `places` rows, `cluster_id = elora` (13 rows), `state = draft`.** One row per named on-site legend item (Eden/Nara/Talia pattern).

  | name | category | subcategory | brochure pin |
  |---|---|---|---|
  | Elora Gatehouse | gathering | gatehouse | A |
  | Lawn | gathering | lawn | B |
  | Kids Playground | family | kids-play | C |
  | Community Clubhouse | gathering | community-centre | D |
  | Nature Trail | nature | trails | E |
  | Trampoline Park | family | trampoline | F |
  | Outdoor Living Room | gathering | outdoor-living | G |
  | Running Track | recreation | running-track | H |
  | Community Garden | nature | gardens | I |
  | Table Tennis | recreation | table-tennis | J |
  | Half Basketball Court | recreation | basketball | K |
  | Multi-Use Gaming Court | recreation | multi-use-court | L |
  | Outdoor Communal Table | gathering | communal-table | M |

  Each row: `slug = elora-<kebab-name>`, `in_community = true`, `parent_place_id` null, `google_place_id` null, `confidence = corroborated`, `source_id` as above, `sort_order` = letter order A=1 … M=13.

- **Amenities prose for reference:** Elora’s on-site set is the thirteen named facilities above. Brochure pp. 26–29 (Golden Beach, Town Centre, Sports Village, Kids’ Dale) are Valley-wide — not Elora `cluster_id` rows.

### Notes

- Brochure marketing copy (pp. 11, 13–16) also names swimming pools, gym, tennis/multi-use courts, cycling path, yoga lawn, fitness club. Those names are **not** on the A–M legend. Do not invent extra `places` from marketing blurbs; clubhouse / courts on the legend may cover some of that program (same judgment as Nara Community Centre + pool).
- **Gatehouse (A):** staged because it is lettered on the amenities legend (Talia Gatehouse precedent). Drop if you want parity with Nara’s Entrance decision.
- UTILITIES legend swatch is fabric, not an amenity row.
- Default `state = draft`. Public `/clusters/elora` will not show them until published.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** Ray (authorized promote); agent applied live + docs. Amenities published 2026-08-13 (`draft` → `published`).

---

## Batch 003 — Elora payment plan, summary/body (2026-08-13)

**Source:** `ELORA PAYMENT.pdf` (1 p) and `ELORA.pdf` pp. 6 / 9 / 18 / 22 (cluster intro / product paragraphs). Drive-time claims on brochure p. 3 / factsheet skipped per Doc 9 / Farm Gardens / Nara / Talia. Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated (printed Emaar PDFs). `summary` / `body` are brochure paragraphs collapsed to prose — Ray decides whether they go live; do not replace `positioning`.
**Status:** promoted

### Proposed reference.md diff

- **`clusters.payment_plan`:** `"10% Down Payment (Jan 2023) · 10% 1st Instalment (Mar 2023) · 10% 2nd Instalment (Sep 2023) · 10% 3rd Instalment (upon 20% construction, Mar 2024) · 10% 4th Instalment (upon 40% construction, Sep 2024) · 10% 5th Instalment (Mar 2025) · 10% 6th Instalment (upon 60% construction, Aug 2025) · 10% 7th Instalment (upon 80% construction, Jan 2026) · 20% 8th Instalment (upon 100% construction, estimated Sep 2026)"`

  Source: `ELORA PAYMENT.pdf`. Footnote: `*Estimated Construction Completion Date`. Sums to 100%. Live `handover_target = 2026-09-30` aligns with the Sep 2026 final instalment.

- **`clusters.summary`:** `"Elora consists of 3 and 4-bedroom townhouses ideally located in a tranquil family haven far from the commotion of the city yet conveniently close to all that Dubai has to offer."`

- **`clusters.body`:**
  > A community where you can take in the beauty of each day, Elora is a paradise where residents can seek comfort by engaging with nature in the beautifully designed lush surroundings. Here, you will enjoy sustainable buildings, fully harmonised with the natural environment and surrounded by the stunning beauty of the green earth. It’s the perfect setting to cultivate a tranquil mind and an active body, providing you with the highest quality of life.
  >
  > Elora offers you the choice of three and four-bedroom townhouses in two distinct architectural styles: Moon and Mysk. Every townhouse is characterised by exquisite quality, and each makes a personal statement. Premium materials and attention to detail throughout ensure tasteful and timeless elegance.

- **`clusters.positioning`:** leave unchanged (brochure `summary`/`body` sit beside it; Doc 9).

### Notes

- **Factsheet vs payment PDF:** factsheet maps 4th instalment → 20% construction and 5th → 40%; the dedicated payment PDF maps 3rd → 20% and 4th → 40%, and leaves the 5th without a printed construction-% label. This batch follows **`ELORA PAYMENT.pdf`**.
- Brochure pp. 26–29 Valley-wide destinations not used in `summary`/`body`.
- p.3 / factsheet drive times skipped.
- `elora-payment.png` and `elora-factsheet.png` exported under `elora-floorplans/` for provenance only (not required as public media).

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** Ray (authorized promote); agent applied live + docs

---

## Batch 004 — Elora per-plot units + plexes (Doc 10 extract) (2026-08-13)

**Source:** Local `/Users/mehdielghissassi/Desktop/clusters/ELORA/` — `ELORA FLOOR PLAN.pdf` (master arrays, Batch 001) + `ELORA CLUSTER MAP.pdf` (430 plot labels in raster; EasyOCR + sequential repair; style-fill orientation). Method: [`docs/10-cluster-extraction-playbook.md`](../../10-cluster-extraction-playbook.md). Intermediate artefacts in `elora-floorplans/` (`_phase1`…`_phase5`, `elora-plex-composition.csv`, `elora-plex-orientation.csv`). Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** `unverified` for per-unit style/type/position and exact BUA (derived in `elora-units.csv`; `elora-units-detection.csv` logs orientation_margin / style_vote / array_key). Corroborated where it matches the live register + factsheet: **430** plots, facades Moon/Mysk, BUA envelope 2095–2608 sqft, bedroom split **284×3BR / 146×4BR**.
**Status:** promoted

### Proposed reference.md diff

- **`unit_types.unit_count` filled for all 8 layouts** (Batch 001 left these null):

  | facade_style | bedrooms | label | layout | unit_count |
  |---|---|---|---|---|
  | moon | 3 | A | moon-a | 16 |
  | moon | 3 | B | moon-b | 16 |
  | moon | 4 | A | moon-a | 57 |
  | moon | 4 | B | moon-b | 57 |
  | mysk | 3 | A | mysk-a | 126 |
  | mysk | 3 | B | mysk-b | 126 |
  | mysk | 4 | A | mysk-a | 16 |
  | mysk | 4 | B | mysk-b | 16 |

  Totals: Moon 146 · Mysk 284 = **430**. Bedroom split **284×3BR / 146×4BR** (matches factsheet).

- **New `plexes` rows, `cluster_id = elora` (73 rows).** Sizes from floorplan key plans + site-plan split: **16×4 Moon (4-1) · 16×4 Mysk (4-2) · 13×6 · 28×8**. Full ranges/orientation in [`../../../elora-floorplans/elora-units.csv`](../../../elora-floorplans/elora-units.csv) (`plex_range` / `plex_size` / `street_side`).

- **New `units` rows, `cluster_id = elora` (430 rows).** Same CSV: `unit_number` / `plot_number` (1–430 contiguous), `facade_style`, `layout`, `bua`, `th_position`. `confidence = unverified`. No mirror-pair plex types — every plot resolves from key plans + orientation (4-plex Moon vs Mysk from style-fill chrominance vote).

### Notes

- Phase gates (Doc 10): Phase 1 master arrays complete (4-1 all Moon · 4-2 all Mysk · 6/8 Moon ends + Mysk middles) · Phase 2 430/430 plots (map labels are raster — EasyOCR tiled + neighbor repair; a few positions interpolated) · Phase 3 gap threshold **86.5** → 73 plexes, all legal sizes {4,6,8} · Phase 4 style-fill orientation (fill direction from plot label), min margin **0.624** · Phase 5 layout assign · Phase 6 layout counts exact multiples of plex-type counts; bedroom split matches factsheet 284/146.
- `elora-units-detection.csv` is the detection log, not a promotion table.
- Plot numbers have no PDF text layer on `ELORA CLUSTER MAP.pdf` — OCR-derived coordinates.
- Batches 001–003 promoted with this batch.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** Ray (authorized promote); agent applied live + docs. Storage `media/elora/*` + `media_links` uploaded 2026-08-13 (13 files).
