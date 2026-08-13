# Nara — Staging

**Cluster:** `nara`
**Written by:** the agent, per Doc 4 Proposal #04 (extended to per-cluster files — see `docs/07-data-staging.md`)
**Decided by:** Ray only — [`reference.md`](./reference.md) still accepts prose only from Ray, or under `DOCS_GUARD=off`

---

## RULES

1. This file is where new external-source facts about Nara get staged before they become part of [`reference.md`](./reference.md). `reference.md` is never edited directly to introduce a new fact — the batch goes here first.
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

## Batch 001 — Nara full unit derivation: 372 units, 16 layouts, 57 plexes, images (2026-08-11)

**Source:** Local `nara-floorplans/` intake (floor-plan PNGs, facade JPGs, cluster maps, `nara-units.csv`). Originally landed on the local-only `nara-cluster-deep-dive` branch without a staging batch; restaged here so Doc 7 is the record. Not independently field-verified.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** unverified for per-unit style/type/position and exact BUA (derived dataset in `nara-units.csv`; `nara-units-detection.csv` records plot-level style_source/orientation_margin/bua_sqm). Corroborated only where it matches the existing `reference.md` register: 372 units, facades Aston/Palma/Charm, 3BR starting size 1866, 4BR upper 2249.
**Status:** staged

### Proposed reference.md diff

- **Unit types, 16 rows** (replaces the current 2-row 3BR/4BR placeholder). `layout` follows the Eden convention `{facade_style}-{label}`. `bathrooms` not in this intake — leave null.

  | facade_style | bedrooms | label | layout | bua_min | bua_max | unit_count |
  |---|---|---|---|---|---|---|
  | aston | 3 | A | aston-a | 2023 | 2089 | 22 |
  | aston | 3 | B | aston-b | 2023 | 2063 | 30 |
  | aston | 3 | C | aston-c | 2046 | 2049 | 14 |
  | aston | 4 | A | aston-a | 2169 | 2186 | 29 |
  | aston | 4 | B | aston-b | 2141 | 2141 | 10 |
  | aston | 4 | C | aston-c | 2140 | 2140 | 4 |
  | aston | 4 | D | aston-d | 2169 | 2186 | 16 |
  | aston | 4 | E | aston-e | 2188 | 2188 | 7 |
  | palma | 3 | A | palma-a | 1866 | 1897 | 83 |
  | palma | 3 | B | palma-b | 1865 | 1922 | 83 |
  | palma | 4 | A | palma-a | 2212 | 2212 | 11 |
  | palma | 4 | B | palma-b | 2213 | 2213 | 11 |
  | charm | 3 | A | charm-a | 2098 | 2098 | 13 |
  | charm | 3 | B | charm-b | 2100 | 2100 | 13 |
  | charm | 4 | A | charm-a | 2218 | 2218 | 13 |
  | charm | 4 | B | charm-b | 2250 | 2250 | 13 |

  Totals: Palma 188 (22×4BR, 166×3BR), Aston 132 (66×4BR, 66×3BR), Charm 52 (26×4BR, 26×3BR) = 372. Bedroom split 258×3BR / 114×4BR.

- **New `plexes` rows, `cluster_id = nara` (57 rows).** Full dataset in [`../../../nara-floorplans/nara-units.csv`](../../../nara-floorplans/nara-units.csv) (`plex_range` / `plex_size` / `street_side`).

- **New `units` rows, `cluster_id = nara` (372 rows).** Same CSV: `unit_number` / `plot_number`, `facade_style`, `bua`, `plex` range, `th_position`. `confidence = unverified`.

- **Images, 21 files in `nara-floorplans/`** — 16 floor plans (one per layout above), 3 facade photos (`nara-aston-facade.jpg`, `nara-palma-facade.jpg`, `nara-charm-facade.jpg`), 2 cluster maps (`nara-cluster-map.jpg`, `nara-cluster-map-fullres.jpg`). Runtime copies still need uploading to Supabase Storage on promotion; git holds LFS pointers only.

### Notes

- No promotion SQL in this batch. Do not apply to the live DB or edit `reference.md` until Ray authorizes.
- Bathroom counts, facade brochure copy, amenities, plot sizes, pricing, and payment plan were not in this CSV intake.
- `nara-units-detection.csv` is the plot-level detection log (style_source, orientation_margin, bua_sqm), not a promotion table.
- Method write-up from the original extract was never staged; this batch is the dataset plus the counts that can be recomputed from the CSV. Treat layout/style assignment as unverified until Ray reviews.

### Promotion

**Promoted:** [ ]
**Date:**
**By:**

---

## Batch 002 — Nara bathrooms, maid’s rooms, and readable cluster-map amenities (2026-08-13)

**Source:** Existing `nara-floorplans/` intake — all 16 layout PNGs (bathrooms / maid’s / GF guest bedroom) and `nara-cluster-map.jpg` + `nara-cluster-map-fullres.jpg` (amenities legend). No Nara PDF / brochure folder is on disk in this workspace, so facade blurbs, payment plan, starting price, plot sizes, and `summary`/`body` were not available. Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** `unverified` for bathroom counts (inferred from labelled rooms; no printed “n baths” figure). `corroborated` for `maids_room` (every layout PNG labels **MAID'S ROOM**) and for amenity names that OCR actually read off the cluster-map legend. Does not change Batch 001 unit/plex/layout assignment.
**Status:** staged

### Proposed reference.md diff

- **`unit_types` bathrooms / maid’s / GF bedroom** — fills the columns Batch 001 left null. Same 16 layout keys as Batch 001; do not rewrite that batch.

  | facade_style | bedrooms | label | layout | bathrooms | maids_room | ground_floor_bedroom |
  |---|---|---|---|---|---|---|
  | aston | 3 | A | aston-a | 3.5 | true | false |
  | aston | 3 | B | aston-b | 3.5 | true | false |
  | aston | 3 | C | aston-c | 3.5 | true | false |
  | aston | 4 | A | aston-a | 4.0 | true | true |
  | aston | 4 | B | aston-b | 4.0 | true | true |
  | aston | 4 | C | aston-c | 4.0 | true | true |
  | aston | 4 | D | aston-d | 4.0 | true | true |
  | aston | 4 | E | aston-e | 4.0 | true | true |
  | palma | 3 | A | palma-a | 3.5 | true | false |
  | palma | 3 | B | palma-b | 3.5 | true | false |
  | palma | 4 | A | palma-a | 4.0 | true | true |
  | palma | 4 | B | palma-b | 4.0 | true | true |
  | charm | 3 | A | charm-a | 3.5 | true | false |
  | charm | 3 | B | charm-b | 3.5 | true | false |
  | charm | 4 | A | charm-a | 4.0 | true | true |
  | charm | 4 | B | charm-b | 4.0 | true | true |

  Count method (same as Eden): a labelled powder room = 0.5; maid’s bath counts as a full bath. Every 3BR PNG has Master Bath + shared first-floor Bath + Maid’s Bath + **PWDR. RM**. Every 4BR PNG has Master Bath + shared first-floor Bath + ground-floor guest Bath (with shower) + Maid’s Bath — no powder room. 4BR guest bedroom is on the ground floor.

- **New `places` rows, `cluster_id = nara` (2 rows), `state = draft`:**

  | name | category | subcategory | brochure pin |
  |---|---|---|---|
  | Community Centre | gathering | community-centre | #1 |
  | Picnic Area | gathering | picnic | #6 |

  Each row: `slug = nara-<name>`, `in_community = true`, `parent_place_id` null, `google_place_id` null, `confidence = corroborated`, `source_id` as above, `sort_order` = pin number. Pin #1 sits at the north edge of the Nara boundary (pool pad visible on the plan). Pin #6 is an internal green space.

- **Facade copy:** none in this intake. The three facade JPGs are lifestyle renders (no brochure paragraphs). Leave `facade_style_descriptions.description` null until a Nara brochure PDF is available.

### Notes

- Bathroom counts were not printed as a figure on the PNGs. Tag stays `unverified` per Doc 9 §9.3.
- Charm 3BR-A room dimensions match Aston 3BR-A on the PNGs (same kitchen 5.1×2.2, living 4.3×3.2, etc.). Keep both facade identities and both layout rows; do not collapse styles. Shared-interior finding only.
- Both cluster-map JPGs crop the amenities legend. OCR of the full files only reads **1. COMMUNITY CENTRE** and **6. PICNIC AREA**. Pins **#2–#5** and **#7–#10** are drawn on the plan; their labels are not in the image. Names were not invented. Re-export a fuller legend page if those pins should become `places` rows.
- The map **TYPES** legend only prints **3 BR TOWNHOUSES**. 4BR layouts still come from the floor-plan PNG set in Batch 001, not from this map’s type key.
- No payment plan, `price_from_aed`, plot sizes, suite/garage/balcony/roof areas, or `summary`/`body` in this folder. Still null.
- Green pedestrian corridors between rows are visible on the plan (Eden’s unnumbered “Alley” equivalent). Without a readable legend line they are not staged as `places`.
- Do not promote this batch or Batch 001 until Ray authorizes. Live Nara is still the 2-row placeholder.

### Promotion

**Promoted:** [ ]
**Date:**
**By:**
