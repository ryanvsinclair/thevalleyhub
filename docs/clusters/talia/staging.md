# Talia — Staging

**Cluster:** `talia`
**Written by:** the agent, per Doc 4 Proposal #04 (extended to per-cluster files — see `docs/07-data-staging.md`)
**Decided by:** Ray only — [`reference.md`](./reference.md) still accepts prose only from Ray, or under `DOCS_GUARD=off`

---

## RULES

1. This file is where new external-source facts about Talia get staged before they become part of [`reference.md`](./reference.md). `reference.md` is never edited directly to introduce a new fact — the batch goes here first.
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

## Batch 001 — Talia layouts, bathrooms, facades, images (2026-08-13)

**Source:** Local `/Users/mehdielghissassi/Desktop/clusters/TALIA/` — `TALIA FLOOR PLAN.pdf` (16 pp), `TALIA.pdf` brochure pp. 15–17 (facade renders + copy), `TALIA CLUSTER MAP.pdf` (style legend only for this batch). Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** `corroborated` for layout keys, printed BUA ranges, facade names/copy, bathroom/maid counts from labelled rooms on the plans. Per-layout `unit_count` and `units`/`plexes` **not** in this batch (need colour classification of the numbered site plan — Batch TBD).
**Status:** promoted

### Proposed reference.md diff

- **Unit types, 14 rows** (replaces the current 2-row 3BR/4BR placeholder). `layout` follows the Eden/Nara convention `{facade_style}-{label}`. Facade styles stay Pharo / Cyrus / Elio (matches live `clusters.facade_styles`). BUA rounded to nearest sq ft from printed TOTAL AREA lines.

  | facade_style | bedrooms | label | layout | bua_min | bua_max | bathrooms | maids_room | ground_floor_bedroom |
  |---|---|---|---|---|---|---|---|---|---|
  | cyrus | 3 | A | cyrus-a | 2097 | 2097 | 3.5 | true | false |
  | cyrus | 3 | B | cyrus-b | 2100 | 2100 | 3.5 | true | false |
  | cyrus | 4 | A | cyrus-a | 2217 | 2217 | 4.0 | true | true |
  | cyrus | 4 | B | cyrus-b | 2248 | 2248 | 4.0 | true | true |
  | elio | 3 | A | elio-a | 1864 | 1897 | 3.5 | true | false |
  | elio | 3 | B | elio-b | 1862 | 1921 | 3.5 | true | false |
  | elio | 4 | A | elio-a | 2210 | 2210 | 4.0 | true | true |
  | elio | 4 | B | elio-b | 2210 | 2210 | 4.0 | true | true |
  | pharo | 3 | A | pharo-a | 2090 | 2090 | 3.5 | true | false |
  | pharo | 3 | B | pharo-b | 2035 | 2064 | 3.5 | true | false |
  | pharo | 3 | C | pharo-c | 2036 | 2040 | 3.5 | true | false |
  | pharo | 4 | A | pharo-a | 2187 | 2187 | 4.0 | true | true |
  | pharo | 4 | D | pharo-d | 2189 | 2189 | 4.0 | true | true |
  | pharo | 4 | E | pharo-e | 2189 | 2189 | 4.0 | true | true |

  Bathroom method (same as Eden/Nara): every `BATH` / `MASTER BATH` / `MAID BATH` label = 1; `PWDR. RM` = 0.5. No printed “n baths” marketing line. 4BR rows have a ground-floor `GUEST` bedroom.

  Source page → layout map (`TALIA FLOOR PLAN.pdf`):

  | page | style | layout | printed SQFT |
  |---|---|---|---|
  | 2 | Cyrus | 3BR-A | 2097.03 |
  | 3 | Cyrus | 3BR-B | 2099.61 |
  | 4 | Cyrus | 4BR-A | 2217.37 |
  | 5 | Cyrus | 4BR-B | 2247.72 |
  | 6 | Elio | 3BR-A | 1864.20–1897.03 (6 TH slots) |
  | 7 | Elio | 3BR-B | 1862.37–1920.82 (6 TH slots) |
  | 8 | Elio | 4BR-A | 2210.05 |
  | 9 | Elio | 4BR-B | 2209.83 |
  | 10 | Pharo | 3BR-A | 2089.71 |
  | 11–12 | Pharo | 3BR-B | 2063.76 and 2035.24–2039.22 (merged one row) |
  | 13 | Pharo | 3BR-C | 2036.42–2040.19 |
  | 14 | Pharo | 4BR-A | 2186.58–2187.23 |
  | 15 | Pharo | 4BR-D | 2189.06 |
  | 16 | Pharo | 4BR-E | 2188.95 |

  Matches existing register envelope: smallest 3BR 1862 (Elio 3BR-B) · largest 4BR 2248 (Cyrus 4BR-B).

- **New `facade_style_descriptions` rows, `cluster_id = talia` (3 rows):**

  | style_name | description |
  |---|---|
  | Pharo | A contemporary blend of bold, rich tones, beautiful accents and sleek lines are complemented by sophisticated wooden fixtures and large windows, which welcome natural light in – making these stylish townhouses homes to fall in love with. |
  | Cyrus | The secret is in the details – and every architectural detail of these pristine townhouses has been meticulously crafted with elegance to the fore. Minimalism and luxury coalesce and contrast beautifully with the lush green surroundings, making Cyrus homes to be truly proud of. |
  | Elio | Elio's timeless design is effortless yet elegant and simple yet sophisticated. Large windows allow natural light to pour in, while contemporary accents and intricate touches make this the ideal space to call home. |

  Each: `confidence = corroborated`, `source_id` as above. Verbatim from `TALIA.pdf` pp. 15 / 16 / 17 (line breaks collapsed). “Garden View” / “Pocket Parks” sit as bullets on every style page — not stored (no dedicated column; `unit_types.notes` only if Ray asks).

- **Images, 18 files in [`../../../talia-floorplans/`](../../../talia-floorplans/):** 14 floor plans (one per layout above), 3 facade exteriors (`talia-pharo-facade.jpg`, `talia-cyrus-facade.jpg`, `talia-elio-facade.jpg`), 1 cluster map (`talia-cluster-map.jpg`). Plus optional `talia-valley-context-map.png` (brochure p.7) for later cluster media. Storage upload + `media` / `media_links` at promotion.

### Notes

- **No `units` / `plexes` / per-layout `unit_count` in this batch.** The numbered site plan exists (`TALIA CLUSTER MAP.pdf`, plots ~1–330, colour-coded Cyrus/Pharo/Elio + 3BR/4BR symbols), but resolving style × layout × TH position needs a colour/geometry pass like Eden/Nara. Doc 9: skip rather than invent. Cluster total 330 already live and matches the plan’s residential numbering.
- **Pharo has no 4BR-B or 4BR-C pages** in `TALIA FLOOR PLAN.pdf` — only 4BR-A / D / E. Do not invent B/C.
- **Pharo 3BR-C maid’s room:** PDF text extract missed the maid labels; Ray visually confirmed 3 bed + maid with ensuite (2026-08-13). Drawing has maid ensuite on GF behind the kitchen, plus powder, master bath, and shared upstairs bath → `maids_room = true`, `bathrooms = 3.5` (same as other 3BR rows).
- Cyrus 3BR room dimensions match Pharo 3BR-A closely (same kitchen 5.1×2.2, living 4.3×3.2, etc.). Keep both facade identities and both layout rows; do not collapse. Shared-interior finding only.
- Key plans show 4 / 6 / 8 / 10-plex patterns (same vocabulary as Eden). Full plex inventory waits on the site-plan pass.
- `single_row` left null — brochure does not state it; map has facing rows across streets; do not infer from Nara.
- Plot / suite / garage / balcony / roof areas and pricing: not in these PDFs.
- Amenities → Batch 002. Payment / summary / body → Batch 003.

### Promotion

Ran 2026-08-13: 14 `unit_types` + 3 facade descriptions + 19 Storage files + `media`/`media_links`. No units/plexes. SQL: `talia-floorplans/talia-batches-001-003-promotion.sql`.

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: promote)

---

## Batch 002 — Talia on-site amenities from cluster-map legend (2026-08-13)

**Source:** `TALIA CLUSTER MAP.pdf` amenities legend (letters A–O). Cross-checked against the rendered plan. Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated for names printed on the legend. Annex L category/subcategory are suggestions. Beach-strip vs on-site boundary judgment called out in Notes.
**Status:** promoted

### Proposed reference.md diff

- **New `places` rows, `cluster_id = talia` (7 rows), `state = draft`.** One row per named on-site legend item (Eden/Nara pattern).

  | name | category | subcategory | brochure pin |
  |---|---|---|---|
  | Talia Gatehouse | gathering | gatehouse | A |
  | Outdoor Games Area and Lawn | recreation | outdoor-games | B |
  | Pocket Park | nature | pocket-parks | C |
  | Kids Play Area and Lawn | family | kids-play | D |
  | Community Clubhouse | gathering | community-centre | E |
  | Green Sikkas | nature | sikkas | F |
  | Picnic Lawn | gathering | picnic | J |

  Each row: `slug = talia-<name>`, `in_community = true`, `parent_place_id` null, `google_place_id` null, `confidence = corroborated`, `source_id` as above, `sort_order` = letter order A=1…J=7 for the staged set.

- **Amenities prose for reference:** Talia’s on-site set is the seven named facilities above. Legend letters **G–I, K–O** sit in the western Golden Beach / leisure strip — not Talia `cluster_id` rows; seeded Valley-wide in Batch 004.

### Notes

- Full legend printed on the map: A Gatehouse · B Outdoor Games Area and Lawn · C Pocket Park · D Kids Play Area and Lawn · E Community Clubhouse · F Green Sikka · G Golden Beach · H Wave Pool · I Splash Pad · J Picnic Lawn · K Retail / Outdoor Dining Plaza · L Mini Golf · M Jogging Track · N Kids Play Area · O Multi-Purpose Courts.
- **G–I, K–O** moved to Batch 004 as Valley-wide `places` (`cluster_id` null, notes record adjacency to Talia).
- **Gatehouse (A):** staged because it is lettered on the amenities legend (unlike Nara Entrance #9, which Ray dropped as fabric). Drop it the same way if you want parity with Nara’s Entrance decision.
- Multiple C / F / J markers on the plan share one name — one row per name, not per pin instance (Nara Green Sikkas precedent).
- Default `state = draft`. Public `/clusters/talia` will not show them until published.
- No mosque on the Talia legend (unlike Nara).

### Promotion

Ran 2026-08-13: 7 draft Talia `places` inserted with Batches 001–003 promote.

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: promote)

---

## Batch 003 — Talia payment plan, summary/body, context map (2026-08-13)

**Source:** `TALIA PAYMENT.pdf` (1 p) and `TALIA.pdf` pp. 5–6 (intro), p. 7 (Valley context), p. 13 (product paragraph). Drive-time claims on p. 4 skipped per Doc 9 / Farm Gardens / Nara. Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated (printed Emaar PDFs). `summary` / `body` are brochure paragraphs collapsed to prose — Ray decides whether they go live; do not replace `positioning`.
**Status:** promoted

### Proposed reference.md diff

- **`clusters.payment_plan`:** `"10% Down Payment (on booking) · 10% 1st Instalment (Mar 2022) · 5% 2nd Instalment (Sep 2022) · 10% 3rd Instalment (Mar 2023) · 10% 4th Instalment (Sep 2023) · 5% 5th Instalment (Mar 2024) · 10% 6th Instalment (Sep 2024) · 40% 7th Instalment (100% construction, estimated Mar 2025)"`

  Source labels: DOWN PAYMENT 10% ON BOOKING; 1ST–6TH INSTALMENT 10% / 5% / 10% / 10% / 5% / 10%; 7TH INSTALMENT 40% at 100% construction. Footnote: `*ESTIMATED COMPLETION DATE - MAR 2025`. Sums to 100%.

- **`clusters.summary`:** `"The Valley's third neighbourhood of elegant townhouses – TALIA comprises stylish, family-friendly homes connected to nature and situated just footsteps away from Golden Beach."`

- **`clusters.body`:**
  > From verdant open spaces and green pocket parks, to pristine lawns and lush sikkas, TALIA is a suburban utopia for families who seek an active, healthy and fulfilling lifestyle, with everything they need within easy reach.
  >
  > TALIA's three and four-bedroom townhouses come in a choice of three contemporary designs. Adjoining communal pocket parks seamlessly connect your dream home to nature and provide beautiful green spaces for your suburban lifestyle to bloom.

- **`clusters.positioning`:** leave unchanged (brochure `summary`/`body` sit beside it; Doc 9).

- **Image:** `talia-valley-context-map.png` already exported under `talia-floorplans/` (brochure p.7) for later cluster `media`.

### Notes

- Live `handover_actual = 2025-03-01` already matches the payment PDF’s estimated Mar 2025 completion — this is the construction schedule, not a current post-handover instalment plan (same class of caveat as Nara Batch 005).
- Brochure pp. 8–12 (Golden Beach, Town Centre, Sports Village, Kids’ Dale, Pavilion) are Valley-wide — not used in `summary`/`body` beyond the p.5 “footsteps from Golden Beach” line, which is the brochure’s own Talia framing.
- p.4 drive times (Rugby Sevens, Outlet Mall, Burj Khalifa, airport) skipped.
- Price / plot sizes still absent from the folder.

### Promotion

Ran 2026-08-13: `payment_plan`, `summary`, and `body` written on live Talia `clusters` row. `positioning` not touched. Context map uploaded with Batch 001 media.

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: promote)

---

## Batch 004 — Valley-wide Golden Beach strip places (from Talia map) (2026-08-13)

**Source:** `TALIA CLUSTER MAP.pdf` legend letters G–I, K–O (western leisure strip). Golden Beach also named in Doc 1 Annex B. Read / authorized 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated (printed Emaar legend; Annex B for Golden Beach as a Valley amenity)
**Status:** promoted

### Proposed reference.md diff

- **No change to Talia `reference.md` amenities table** — these are not `cluster_id = talia` rows.
- **New Valley-wide `places` rows (`cluster_id` null), `state = draft`:**

  | slug | name | category | subcategory | parent | legend |
  |---|---|---|---|---|---|
  | golden-beach | Golden Beach | recreation | beach | — | G |
  | golden-beach-wave-pool | Wave Pool | recreation | wave-pool | golden-beach | H |
  | golden-beach-splash-pad | Splash Pad | family | splash-pad | golden-beach | I |
  | golden-beach-retail-outdoor-dining-plaza | Retail / Outdoor Dining Plaza | gathering | retail-dining | golden-beach | K |
  | golden-beach-mini-golf | Mini Golf | recreation | mini-golf | golden-beach | L |
  | golden-beach-jogging-track | Jogging Track | recreation | jogging-track | golden-beach | M |
  | golden-beach-kids-play-area | Kids Play Area | family | kids-play | golden-beach | N |
  | golden-beach-multi-purpose-courts | Multi-Purpose Courts | recreation | multi-purpose-courts | golden-beach | O |

  Each child: `parent_place_id` → Golden Beach. All: `in_community = true`, `confidence = corroborated`, `source_id` as above.
  **`notes` (all rows):** that they sit directly next to Talia (Talia cluster map western Golden Beach / leisure strip); not Talia cluster-scoped places.

### Notes

- Ray asked to seed the strip items left out of Batch 002 as their own places with the Talia-adjacency note (2026-08-13).
- Left `draft` — not published on `/living` or place pages until Ray flips `state`.
- Categories/subcategories are Annex L suggestions.
- Distinct from Farm Gardens’ own draft `farm-gardens-kids-play-area` / court rows.
- Doc 1 Annex B size for Golden Beach (47,000 sqm) is not copied into `places` (no size column); brochure Talia page says 30,000 sqm — conflict left in Doc 1 / not resolved here.

### Promotion

Ran 2026-08-13: 8 draft Valley-wide `places` inserted. SQL: `talia-floorplans/talia-batch-004-golden-beach-places.sql`.

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: put them in as their own places with Talia-adjacency notes)

---

## Batch 005 — Talia per-plot units + plexes (Doc 10 extract) (2026-08-13)

**Source:** Local `/Users/mehdielghissassi/Desktop/clusters/TALIA/` — `TALIA FLOOR PLAN.pdf` (master arrays, Batch 001) + `TALIA CLUSTER MAP.pdf` (330 plot labels, style-fill orientation). Method: [`docs/10-cluster-extraction-playbook.md`](../../10-cluster-extraction-playbook.md). Intermediate artefacts in `talia-floorplans/` (`_phase1`…`_phase5`, `talia-plex-composition.csv`, `talia-plex-orientation.csv`). Read 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** `unverified` for per-unit style/type/position and exact BUA (derived in `talia-units.csv`; `talia-units-detection.csv` logs orientation_margin / style_source=`key_plan`). Corroborated where it matches the live register: **330** plots, facades Pharo/Cyrus/Elio, BUA envelope 1862–2248 sqft. No published 3BR/4BR marketing split in the brochure to cross-check (only “3 & 4-Bedroom Townhouses”).
**Status:** staged

### Proposed reference.md diff

- **`unit_types.unit_count` filled for all 14 layouts** (Batch 001 left these null):

  | facade_style | bedrooms | label | layout | unit_count |
  |---|---|---|---|---|
  | cyrus | 3 | A | cyrus-a | 18 |
  | cyrus | 3 | B | cyrus-b | 18 |
  | cyrus | 4 | A | cyrus-a | 18 |
  | cyrus | 4 | B | cyrus-b | 18 |
  | elio | 3 | A | elio-a | 45 |
  | elio | 3 | B | elio-b | 45 |
  | elio | 4 | A | elio-a | 6 |
  | elio | 4 | B | elio-b | 6 |
  | pharo | 3 | A | pharo-a | 9 |
  | pharo | 3 | B | pharo-b | 49 |
  | pharo | 3 | C | pharo-c | 40 |
  | pharo | 4 | A | pharo-a | 29 |
  | pharo | 4 | D | pharo-d | 9 |
  | pharo | 4 | E | pharo-e | 20 |

  Totals: Cyrus 72 · Elio 102 · Pharo 156 = **330**. Bedroom split **224×3BR / 106×4BR**.

- **New `plexes` rows, `cluster_id = talia` (53 rows).** Sizes from floorplan key plans only: **18×4 · 20×6 · 6×8 · 9×10**. Full ranges/orientation in [`../../../talia-floorplans/talia-units.csv`](../../../talia-floorplans/talia-units.csv) (`plex_range` / `plex_size` / `street_side`).

- **New `units` rows, `cluster_id = talia` (330 rows).** Same CSV: `unit_number` / `plot_number` (1–330 contiguous), `facade_style`, `layout`, `bua`, `th_position`. `confidence = unverified`. No mirror-pair plex types on Talia — every plot resolves from key plans + orientation (no per-unit colour classifier needed).

### Notes

- **Do not promote until Ray authorizes.** No promotion SQL in this batch yet.
- Phase gates (Doc 10): Phase 1 master arrays (4/6/8/10) · Phase 2 330/330 plots · Phase 3 gap threshold plateau 52.4–68.0 → 53 plexes, all legal sizes · Phase 4 style-fill orientation, legend+map refs, min margin **0.455** (NARA floor was 0.451) · Phase 5 layout assign · Phase 6 layout counts exact multiples of plex-type counts (all 14 OK).
- `talia-units-detection.csv` is the detection log, not a promotion table.
- `single_row`, price, plot size still unknown — not in this batch.
- Amenities remain draft (Batches 002/004) unless Ray says publish.

### Promotion

**Promoted:** [ ]
**Date:**
**By:**

