# Lillia — Staging

**Cluster:** `lillia`
**Written by:** the agent, per Doc 4 Proposal #04 (extended to per-cluster files — see `docs/07-data-staging.md`)
**Decided by:** Ray only — [`reference.md`](./reference.md) still accepts prose only from Ray, or under `DOCS_GUARD=off`

---

## RULES

1. This file is where new external-source facts about Lillia get staged before they become part of [`reference.md`](./reference.md). `reference.md` is never edited directly to introduce a new fact — the batch goes here first.
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

## Batch 001 — Lillia full deep intake: layouts, map units/plexes, amenities, payment, images (2026-08-13)

**Source:** Local pack `/Users/mehdielghissassi/Desktop/clusters/LILLIA/` — `LILLIA .pdf` brochure (18 pp), `LILLIA FLOOR PLAN.pdf` (8 pp), `LILLIA PAYMENT.png`, plus high-res cluster map replacing the pack’s 0.42 MB map: Petkovic broker mirror `Emaar-Lillia-The-Valley-Cluster-Map.pdf` (12.7 MB, embedded map **3308×1436**; saved as `floorplans/lillia-cluster-map.pdf` / `.jpeg`). Facade exteriors from the same Petkovic listing (Jade/Pearl JPGs). Read 2026-08-13 / 2026-08-14.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer) — broker map/facade images noted as mirrors in Notes.
**Confidence:** `corroborated` for layout keys, printed BUA ranges, facade names/copy, maid’s + GF bedroom from labelled rooms, payment schedule from pack PNG, amenity names on brochure/map legend. Per-unit style / TH / street_side / exact BUA → `unverified` (Doc 10 colour + orientation pipeline). Bathroom totals inferred from room labels → `unverified` (Valley townhouse 3.5 / 4.0 pattern).
**Status:** promoted

### Proposed reference.md diff

- **`clusters.unit_count`:** `406` (was null). Contiguous plots **1–406** on cluster map text layer.
- **`clusters.facade_styles`:** `["Jade","Pearl"]` (matches live / reference).
- **`clusters.single_row`:** `true` (confirm; already on reference).
- **`clusters.handover_target`:** flag conflict — pack payment plan’s final instalment is **Jan 2027** (100% construction); reference currently `2027-03-31`. Leave live date until Ray picks.
- **`clusters.payment_plan`:** `"10% Down Payment (On Booking) · 10% 1st Instalment (May 2024) · 10% 2nd Instalment (Sep 2024) · 10% 3rd Instalment (Jan 2025) · 10% 4th Instalment (May 2025, 30% construction) · 10% 5th Instalment (Oct 2025, 50% construction) · 15% 6th Instalment (Mar 2026, 70% construction) · 15% 7th Instalment (Aug 2026, 90% construction) · 10% 8th Instalment (Jan 2027, 100% construction)"`
- **`clusters.price_from_aed`:** leave null (not in pack PDFs; Ray previously deprioritised prices).
- **`clusters.plex_config`:** propose `"64 · 4/6/8"` (21×4 · 11×6 · 32×8).
- **Summary / body (proposed; positioning left unchanged):**
  - **summary:** Lillia is a gated single-row townhouse cluster in The Valley — 406 Jade and Pearl homes (3- and 4-bedroom) arranged in 4-, 6- and 8-plexes beside The Valley Park and Golden Beach.
  - **body:** From brochure pp. 6–8 / 13 / 16 — gated community emphasising landscaping and on-site amenities; 3BR middle units and 4BR corner units with larger gardens; access to Valley Park / Golden Beach and Valley-wide facilities.
- **`facade_style_descriptions` (2 rows):**
  - **Jade:** “Graceful Elegance in Curves: Harmoniously blending linear forms with elegant curves, this design style embodies both warmth and fluidity, echoing the natural rhythms of nature’s ebb and flow.”
  - **Pearl:** “The Linear Marvel: This design is a tribute to modern artistry, with its precise, straight lines. Its edgy and sleek design embodies both strength and contemporary elegance.”
- **Unit types — replace 2-row placeholder with 4 rows** (style is layout-determining; each style has one 3BR letter and one 4BR letter). `layout = '{style}-{label}'`.

  | facade_style | bedrooms | label | layout | bua_min | bua_max | unit_count | bathrooms | maids_room | ground_floor_bedroom |
  |---|---|---|---|---|---|---|---|---|---|
  | jade | 3 | A | jade-a | 2132 | 2158 | 142 | 3.5 | true | false |
  | pearl | 3 | B | pearl-b | 2182 | 2190 | 136 | 3.5 | true | false |
  | jade | 4 | A | jade-a | 2973 | 2988 | 64 | 4.0 | true | true |
  | pearl | 4 | B | pearl-b | 2777 | 2792 | 64 | 4.0 | true | true |

  Bedroom split **278×3BR / 128×4BR** (every plex has exactly two corner 4BRs). BUA rounded from printed TOTAL AREA lines (exact per-plot in CSV).

- **New `plexes` rows (64)** + **`units` rows (406)** — full dataset in [`floorplans/lillia-units.csv`](floorplans/lillia-units.csv) / [`lillia-plexes.csv`](floorplans/lillia-plexes.csv). Sizes **21×4 · 11×6 · 32×8**. Style mix: Jade 10×4 / 5×6 / 17×8 · Pearl 11×4 / 6×6 / 15×8. `street_side` page-relative `up|down|left|right`. Per-unit confidence `unverified`.

- **New `places` rows (`state = draft`, cluster-scoped)** — pins A–S on the cluster map / brochure legend. **Include on-site:** Entry Feature, Flexible Lawn, Shaded Playground – Toddlers, Picnic Tables, Community Centre, Picnic Lawn, Guard House, Informal Half Basketball, Multi-Use Games Court, Outdoor Fitness, Splash Pad, Kids Play Area, BBQ / Picnic Area, Dog Park. **Exclude (do not insert):** Golden Hub/Retail Centre, Bounce Play, Golden Beach, Pop Golf — same central beach/leisure strip Lillia shares with Talia (Lillia west / Talia east on the Valley master plan). Those amenities already exist as Valley-wide `places` from Talia Batch 004 (`golden-beach` + children); **do not duplicate** under `cluster_id = lillia`.

- **Images in `floorplans/`** (for later `media` / `media_links`):
  - Floor plans: `lillia-jade-3br-a.png`, `lillia-pearl-3br-b.png`, `lillia-jade-4br-a.png`, `lillia-pearl-4br-b.png` (+ `-mirrored` secondaries)
  - Facades: `lillia-jade-facade.jpg`, `lillia-pearl-facade.jpg`
  - Cluster map: `lillia-cluster-map.jpeg` / `.pdf`
  - Payment: `lillia-payment.png`

### Notes

- **Map provenance:** Pack’s original `LILLIA CLUSTER MAP.pdf` was only 0.42 MB (map raster ~1751×675). Ray authorized replacing with the Petkovic high-res Emaar sheet. High-res lives in `floorplans/`; overwriting the pack file outside the repo was blocked by the environment — copy `lillia-cluster-map.pdf` over the pack path locally if you want the folders to match.
- **Doc 10 gates:** Phase 1 master arrays complete for Jade/Pearl × 4/6/8 (corners = 4BR, middles = 3BR; mirrors are secondary media, not extra types) · Phase 2 **406/406** plots via MyriadPro char clustering (raw word layer had legend collisions on 1/3/4) · Phase 3 gap threshold **10.5–16.5** → **64** plexes, all legal {4,6,8} · Phase 4–5 style-fill vote **min 1.0**, orientation margin **min 0.188**; bedroom split exact **278/128**.
- **Style ≠ bedroom:** Brochure legend columns list Jade | 3 BR and Pearl | 4 BR side-by-side, but floor plans clearly give **Jade 3BR-A + Jade 4BR-A** and **Pearl 3BR-B + Pearl 4BR-B**. Modelled as Eden-style layout-determining façades.
- **Bathrooms:** 3BR plans show maid bath + powder + master bath + upstairs bath → **3.5**; 4BR show G.bath + maid-area bath + master + upstairs → **4.0**. No printed “n baths” line.
- **Plot / suite / garage areas:** not extracted this batch (null).
- Facade JPGs are broker web exports (smaller than brochure heroes); swap for brochure crops at promote if preferred.
- **Shared strip with Talia (Ray, 2026-08-14):** confirmed on Valley master plan — Lillia and Talia face each other across the central Golden Beach corridor. Excluded legend items stay Valley-wide only; promote must not create a second set of beach-strip `places` for Lillia.

### Promotion

**Promoted:** [x]
**Date:** 2026-08-14
**By:** agent (Ray said promote)

Amenities published 2026-08-14 (Ray said publish): 14 Lillia `places.state = published`.

