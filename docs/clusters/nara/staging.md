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
**Status:** promoted

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

Ran 2026-08-13: 16 `unit_types` + 57 `plexes` + 372 `units` + 3 facade name rows applied live. 21 images not yet in Storage (`media/nara/*`) — no service-role key in this environment. `reference.md` updated.

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: promote)

---

## Batch 002 — Nara bathrooms, maid’s rooms, and readable cluster-map amenities (2026-08-13)

**Source:** Existing `nara-floorplans/` intake — all 16 layout PNGs (bathrooms / maid’s / GF guest bedroom) and `nara-cluster-map.jpg` + `nara-cluster-map-fullres.jpg` (amenities legend). No Nara PDF / brochure folder is on disk in this workspace, so facade blurbs, payment plan, starting price, plot sizes, and `summary`/`body` were not available. Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** `corroborated` for `bathrooms` and `maids_room` — counted from the labelled rooms on each of the 16 layout PNGs (any `BATH` label including those printed “MASTER BATH” on the drawing, plus `PWDR. RM` / `MAID'S ROOM`). Stored only as `unit_types.bathrooms` (numeric) and `maids_room` — no master-bath field. Amenity names that OCR actually read off the cluster-map legend also `corroborated`. Does not change Batch 001 unit/plex/layout assignment.
**Status:** promoted

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

  Count method (same as Eden): every bath on the plan counts as 1 toward `unit_types.bathrooms`, including the ensuite labelled “MASTER BATH” on some drawings — that label is not stored. `PWDR. RM` = 0.5. Maid’s bath is one of the baths. OCR of all 16 PNGs:

  | bedrooms | bath labels on plan | `PWDR. RM` | `unit_types.bathrooms` | `MAID'S ROOM` |
  |---|---|---|---|---|
  | 3 | 3 | 1 | 3.5 | 1 on every 3BR PNG |
  | 4 | 4 | 0 | 4.0 | 1 on every 4BR PNG |

  4BR guest bedroom is on the ground floor (`GUEST` on every 4BR PNG).

- **New `places` rows, `cluster_id = nara` (2 rows), `state = draft`:**

  | name | category | subcategory | brochure pin |
  |---|---|---|---|
  | Community Centre | gathering | community-centre | #1 |
  | Picnic Area | gathering | picnic | #6 |

  Each row: `slug = nara-<name>`, `in_community = true`, `parent_place_id` null, `google_place_id` null, `confidence = corroborated`, `source_id` as above, `sort_order` = pin number. Pin #1 sits at the north edge of the Nara boundary (pool pad visible on the plan). Pin #6 is an internal green space.

- **Facade copy:** none in this intake. The three facade JPGs are lifestyle renders (no brochure paragraphs). Leave `facade_style_descriptions.description` null until a Nara brochure PDF is available.

### Notes

- Bathroom counts are the labelled rooms on the floor-plan PNGs, not a marketing “n baths” line. A drawing that says “MASTER BATH” still counts as one bath in `unit_types.bathrooms` — that wording is not stored. Powder is labelled `PWDR. RM`, not `BATH`; it is stored as 0.5 to match Eden. Maid’s bath is a `BATH` and is included in the 3 / 4.
- Charm 3BR-A room dimensions match Aston 3BR-A on the PNGs (same kitchen 5.1×2.2, living 4.3×3.2, etc.). Keep both facade identities and both layout rows; do not collapse styles. Shared-interior finding only.
- Both cluster-map JPGs crop the amenities legend. This batch only captured #1 and #6 from those JPGs. The full 10-item legend is in Batch 003 (brochure p.17 / sharp map). On promote, use Batch 003 for amenities — do not insert these two rows and then the ten.
- The cropped JPG **TYPES** legend only printed **3 BR TOWNHOUSES**. The uncropped PDF also prints **4 BR TOWNHOUSES**.
- No payment plan, `price_from_aed`, plot sizes, suite/garage/balcony/roof areas, or `summary`/`body` in the in-repo JPG folder. Brochure + payment PDF are in Batch 003’s source folder; copy/payment still not staged here.
- Bathroom / maid’s / GF-bedroom columns applied on promote with Batch 001’s 16 layout rows. Amenities from this batch were superseded by Batch 003 — those 2 rows were not inserted.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: promote). Bathrooms 3.5/4.0, `maids_room = true`, 4BR `ground_floor_bedroom = true` on the 16 live `unit_types` rows.

---

## Batch 003 — Nara on-site amenities from brochure / sharp-map legend (2026-08-13)

**Source:** `BROCHURE.pdf` p.17 amenities legend (text layer) and `SHARP CLUSTER MAP.pdf` (same 10 names, titled SINGLE-ROW TOWNHOUSES). Files in `/Users/mehdielghissassi/Desktop/clusters/NARA/`. Not the cropped in-repo JPGs. Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated (printed Emaar legend). Annex L category/subcategory are suggestions, not sourced.
**Status:** promoted

### Proposed reference.md diff

- **New `places` rows, `cluster_id = nara` (8 rows), `state = draft`.** Supersedes Batch 002’s 2-row amenity list. One row per named legend item (Eden pattern), not one row per pin.

  | name | category | subcategory | brochure pin | pins on plan |
  |---|---|---|---|---|
  | Community Centre | gathering | community-centre | #1 | 1 |
  | Green Sikkas | nature | sikkas | #2 | 3 |
  | Community Gardens | nature | gardens | #3 | 1 |
  | Outdoor Fitness | recreation | fitness-station | #4 | 1 |
  | Pocket Parks | nature | pocket-parks | #5 | 2 |
  | Picnic Area | gathering | picnic | #6 | 1 |
  | Lawn Area | gathering | lawn | #7 | 2 |
  | Mosque | mosque | — | #8 | 1 |

  Each row: `slug = nara-<name>`, `in_community = true`, `parent_place_id` null, `google_place_id` null, `confidence = corroborated`, `source_id` as above, `sort_order` = pin number. Community Centre pad on the plan includes a pool; brochure does not name a separate pool facility — leave as one parent row (same as Eden).

- **Amenities prose for reference:** Nara’s on-site set is the eight named facilities above. Legend pins **#9 Entrance** and **#10 Wadi Drive** are fabric/road, not `places` (Ray, 2026-08-13). **Utility / Substation** is on the same legend sheet but is not an amenity. Brochure pp. 18–22 (Town Centre, Sports Village, Kids’ Dale, Pavilion, Golden Beach) are Valley-wide — not Nara `places`.

### Notes

- Green Sikkas are a named legend item (#2), unlike Eden’s unnumbered alley dots. Staged because they are on the amenities list.
- Entrance (#9) and Wadi Drive (#10) dropped from this batch (fabric/road).
- Multiple pins share one name (Green Sikkas ×3, Pocket Parks ×2, Lawn Area ×2). Not split into instance rows unless you ask.
- No new Annex L categories required. Subcategory strings are suggestions for Ray to confirm before publish.
- Default `state = draft`. Public `/clusters/nara` will not show them until published.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: promote). 8 draft `places` live (`nara-community-centre` … `nara-mosque`). Entrance / Wadi Drive not inserted.

---

## Batch 004 — Nara facade brochure copy (2026-08-13)

**Source:** `BROCHURE.pdf` pp. 11 (Aston), 13 (Palma), 15 (Charm). Files in `/Users/mehdielghissassi/Desktop/clusters/NARA/`. Re-read 2026-08-13 to confirm verbatim.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated (printed Emaar style pages)
**Status:** promoted

### Proposed reference.md diff

- **`facade_style_descriptions.description`** — fills the three name-only rows from Batches 001–003. Verbatim body copy from each style page (line breaks collapsed to spaces). `/ GARDEN VIEW` and `/ ACCESS TO PARKS` sit on every style page as bullets, not part of this paragraph; not stored (no dedicated column; `unit_types.notes` only if Ray asks).

  | style_name | description |
  |---|---|
  | Aston | Contemporary architecture and large windows provide an abundance of natural light and wonderful views of pleasant surroundings. ASTON gives you everything you could dream of in a family home. |
  | Palma | The 3 and 4-bedroom townhouses of PALMA are modern with a stylishly minimalist design aesthetic, complemented by a large window that allows light to flood in. If you envision living the good life in a contemporary family villa, then PALMA is your dream home made a reality. |
  | Charm | This limited collection of CHARM townhouses is certainly worthy of its name. The crisp contemporary architectural design and fresh white façades make these townhouses the epitome of charming. The modern design and surroundings of CHARM offer residents the promise of a wonderful lifestyle in the perfect setting. |

### Notes

- Extracted in the Batch 003 source pass and reported in chat, but not written into a staging batch — so the 001–003 promote left `description` null. This batch is that leftover.
- Charm page 15 has a second sentence the earlier chat summary dropped (“The modern design and surroundings of CHARM…”). Stored in full from the PDF.
- Payment plan, `summary`/`body`, and the location/valley maps are still not in a batch.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray asked why descriptions were null). Three live `facade_style_descriptions.description` rows updated.

---

## Batch 005 — Nara payment plan, summary/body, location maps (2026-08-13)

**Source:** `PAYMENT PLANS.pdf` (InDesign 16.3, created 2021-08-02) and `BROCHURE.pdf` pp. 6–8 (intro copy), p.5 (location map), p.10 (Valley context map). Files in `/Users/mehdielghissassi/Desktop/clusters/NARA/`. Map PNGs from the existing export in `NARA-PACKAGE/media/maps/`, copied into `nara-floorplans/`. Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated (printed Emaar PDFs). `summary` / `body` are brochure paragraphs collapsed to prose — Ray decides whether they go live; do not replace `positioning`.
**Status:** staged

### Proposed reference.md diff

- **`clusters.payment_plan`:** `"12% Down Payment (on booking) · 10% 1st Instalment (Nov 2021) · 10% 2nd Instalment (May 2022) · 10% 3rd Instalment (Nov 2022) · 8% 4th Instalment (May 2023) · 50% 5th Instalment (100% construction, estimated Dec 2024)"`

  Source labels: DOWN PAYMENT 12% ON BOOKING; 1ST–4TH INSTALMENT 10% / 10% / 10% / 8%; 5TH INSTALMENT 50% at 100% construction. Footnote: `*ESTIMATED COMPLETION DATE - DEC 2024`. Sums to 100%.

- **`clusters.summary`:** `"THE VALLEY'S second townhouse community. NARA offers 3 and 4-bedroom townhouses in a choice of three contemporary designs, situated around a series of integrated parks."`

- **`clusters.body`:**
  > NARA is The Valley's second townhouse community, designed to capture your imagination. Envisage pleasant pathways, stunning landscaping and green spaces, complemented by an array of amenities.
  >
  > NARA offers 3 and 4-bedroom townhouses in a choice of three contemporary designs. NARA townhouses are situated around a series of integrated parks, which offer ample space for you and your family to enjoy the moments that matter, outdoors.

- **`clusters.positioning`:** leave unchanged (brochure `summary`/`body` sit beside it; Doc 9).

- **Images, 2 files copied into `nara-floorplans/`** for later `media` / `media_links` on the Nara cluster row (`kind = document`): `nara-location-map.png` (brochure p.5), `nara-valley-context-map.png` (brochure p.10). Hub already has the two cropped cluster-map JPGs from Batch 001.

### Notes

- Payment PDF is the 2021 construction schedule. Live Nara already has `handover_actual = 2024-12-01`, so this is historical, not a current instalment plan. Same situation Eden noted for its payments jpeg.
- Brochure p.5 drive-time claims (Burj Khalifa, airport, etc.) skipped per Doc 9 / Farm Gardens.
- Brochure p.10 lifestyle paragraph mixes Valley-wide destinations (Pavilion, Golden Beach, Sports Village, Kids' Dale, Town Centre). Not used in `summary`/`body`.
- Uncropped cluster maps still sit only in the source folder (`NARA/media/maps/brochure_p17_cluster_map.png`, `sharp_cluster_map.png`). Not copied — hub already has cropped `nara-cluster-map.jpg` / `nara-cluster-map-fullres.jpg`.
- `/ GARDEN VIEW` and `/ ACCESS TO PARKS` on every style page still not stored.
- Price, plot sizes, suite/garage/balcony/roof areas: still not in the Emaar PDFs.

### Promotion

**Promoted:** [ ]
**Date:**
**By:**
