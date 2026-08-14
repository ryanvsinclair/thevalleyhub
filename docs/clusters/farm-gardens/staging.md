# Farm Gardens — Staging

**Cluster:** `farm-gardens`
**Written by:** the agent, per Doc 4 Proposal #04 (extended to per-cluster files — see `docs/07-data-staging.md`)
**Decided by:** Ray only — [`reference.md`](./reference.md) still accepts prose only from Ray, or under `DOCS_GUARD=off`

---

## RULES

1. This file is where new external-source facts about Farm Gardens get staged before they become part of [`reference.md`](./reference.md). `reference.md` is never edited directly to introduce a new fact — the batch goes here first.
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

## Batch 001 — Farm Gardens PDF export (2026-08-08)

**Source:** 6 official Emaar PDFs (brochure, factsheet, floor plan, payment plan, master plan, cluster map), originally `/Users/ryansinclair/Downloads/FarmGardens1`, retrieved 2026-08-08. Two files in that folder were exact duplicates (master-plan, factsheet) and were not treated as separate sources.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer) — same source already on the `farm-gardens` cluster row
**Confidence:** corroborated
**Status:** promoted

### Proposed reference.md diff

- **Register, `price_from_aed`:** add `5100000` (4-bed starting price per factsheet; 5-bed starts at 6,100,000, factsheet does not label either as "the" starting price — 4-bed used as the lower figure)
- **`payment_plan`:** `"10% Down Payment (Dec 2022) · 10% 1st Instalment (Feb 2023) · 10% 2nd Instalment (Aug 2023) · 10% 3rd Instalment (Feb 2024) · 10% 4th Instalment (Aug 2024, 20% construction) · 10% 5th Instalment (Feb 2025, 40% construction) · 10% 6th Instalment (Jul 2025, 60% construction) · 10% 7th Instalment (Dec 2025, 80% construction) · 20% 8th Instalment (Aug 2026, 100% construction)"` — construction-linked dates marked "Estimated" on the source PDF
- **Unit types, 5-bed:** correct `bua_max` from `10004` to `5657` (5,656.86 sq ft per floor plan total area) — the existing `10004` is the average plot area, not BUA, and appears to have been entered in the wrong column
- **Unit types, 5-bed:** add `plot_max = 10004` (avg plot area per factsheet)
- **Unit types, 4-bed:** add `plot_min = 8914` (avg plot area per factsheet)
- **Unit types, 4-bed:** add `unit_count = 79` — *depends on Doc 4 #05 (`unit_types.unit_count`), approved 2026-08-08, not yet migrated onto the live schema*
- **Unit types, 5-bed:** add `unit_count = 67` — *same dependency*
- **Unit types, 4-bed:** add `suite_area = 3843`, `garage_area = 608`, `balcony_area = 500`, `roof_terrace_area = 423` (3,842.50 / 607.95 / 499.98 / 423.02 sq ft per floor plan, rounded to nearest sq ft; suite + garage + balcony = 4,950.43 = published total area) — *depends on Doc 4 #06, approved 2026-08-09, not yet migrated onto the live schema*
- **Unit types, 5-bed:** add `suite_area = 4520`, `garage_area = 622`, `balcony_area = 515`, `roof_terrace_area = 441` (4,520.30 / 621.51 / 515.05 / 440.67 sq ft per floor plan, rounded to nearest sq ft; suite + garage + balcony = 5,656.86 = published total area) — *same dependency*
- **New `places` rows, `cluster_id = farm-gardens`:** 19 cluster-specific amenities, each its own row (not a shared catalog) — *depends on Doc 4 #06 (`places.cluster_id`), approved 2026-08-09, not yet migrated onto the live schema*

  | name | category | subcategory |
  |---|---|---|
  | Grand Lawn | gathering | lawn |
  | Petting Zoo & Animal Farm | family | petting-zoo |
  | Kids Play Area | family | play-area |
  | Hydroponics Greenhouse | farming | greenhouse |
  | Community Farming Allotments | farming | allotments |
  | Desert Majlis & Bonfire | gathering | majlis |
  | Stargazing Platforms | gathering | stargazing |
  | Picnic Spots | gathering | picnic |
  | Outdoor Fitness Station | recreation | fitness-station |
  | Yoga/Events Lawn | recreation | yoga-lawn |
  | Xeriscape Botanical Garden | nature | botanical-garden |
  | Events Plaza | gathering | events-plaza |
  | Pool Deck | recreation | pool |
  | Padel Court | recreation | padel-court |
  | Volleyball Court | recreation | volleyball |
  | Ghaf Forest | nature | ghaf-forest |
  | Mosque | mosque | — |
  | Wellness Centre | wellness | wellness-centre |
  | Arrival Plaza | gathering | arrival-plaza |

  Categories (`recreation, nature, family, farming, wellness, gathering`) extended into Doc 1 Annex L for this batch — see the pending Doc 1 update. `mosque` uses the existing Annex L category directly, no subcategory, matching how Annex L already treats it.

  Wellness Centre's constituent sub-features (gym, adult & kids pool decks, restaurant, male & female spa, plunge pools, treatment rooms) are individually decomposable as child `places` rows (`parent_place_id` → Wellness Centre) if/when you want those separately filterable — not staged as separate rows yet since the brochure describes them as one facility, not itemized the way the 19 amenities above are. Each row: `confidence = corroborated`, `source_id = a1000000-0000-4000-8000-000000000001`, `cluster_id` → farm-gardens, `parent_place_id` null, `google_place_id` null (none of these are public Google listings).
- **New `facade_style_descriptions` rows, `cluster_id = farm-gardens`:** — *depends on Doc 4 #07, approved 2026-08-09, not yet migrated onto the live schema*

  | style_name | description |
  |---|---|
  | Horizon | "The peace and stability of these luxurious four and five-bedroom villas can be felt in the air. As the developed area merges into its natural surroundings, the smooth horizontal lines serve as a seamless transition." |
  | Earth | "The Earth villas master indoor-outdoor living. Developed with a unique relationship with the external natural environment, these modern four and five-bedroom residences create a feeling of privilege in this exceptional setting of a luscious desert farming community." |

  Both: `confidence = corroborated`, `source_id = a1000000-0000-4000-8000-000000000001`.
- **New `units` rows, `cluster_id = farm-gardens` (146 rows):** — *depends on Doc 4 #06 (`units` table), not yet migrated onto the live schema*

  Full dataset (plot number, facade style, unit type) staged in `farm-gardens-floorplans/units_style_type.csv`. Per row: `unit_number`/`plot_number` = the printed plot number (read from the PDF text layer, reliable), `unit_type_id` → the farm-gardens 4BR or 5BR `unit_types` row (79 / 67 split, exact match to the factsheet), `facade_style` = Horizon or Earth (classified via mode roof-color against the legend swatches, validated with wide margins — min 69.9 — across all 146, with zero ambiguous cases). `lat`/`lng` left null pending future geocoding. `confidence = unverified` for the whole row — `unit_number`/`plot_number` are reliably read as printed text, but `unit_type_id` and `facade_style` are visually classified from a marketing render, not independently sourced, so the row takes the more conservative tier. Three borderline cases (plots 45, 50, 92) were individually confirmed by Ray against the source map and match the classifier exactly.
- **`summary`:** `"Farm Gardens is the original Valley's standalone villa cluster — 146 four- and five-bedroom homes on 8,000–10,000 sq ft plots, built around a working farm-to-table lifestyle with its own hydroponics greenhouse and community farming plots."`
- **`body`:**
  > Farm Gardens sits at the top of the original Valley masterplan, on the Dubai–Al Ain Road. It's a 146-home, gated standalone-villa community built around a farm-style concept: residents can grow and harvest their own food in community garden plots, supported by full-time onsite farmers, a hydroponics greenhouse, and community farming allotments.
  >
  > Homes come in two styles — Horizon and Earth — as 4-bedroom (4,950 sq ft BUA, ~8,914 sq ft plot) or 5-bedroom (5,657 sq ft BUA, ~10,004 sq ft plot) villas, 79 and 67 units respectively.
  >
  > On-site amenities include a Grand Lawn, petting zoo and animal farm, desert majlis with bonfire area, stargazing platforms, picnic spots, a mosque, and a private Wellness Centre with gym, spa, restaurant and pool decks overlooking the farmland. Residents also have access to The Valley's shared amenities — Golden Beach, Town Centre, Sports Village and Kids' Dale.
  >
  > Target handover: 30 September 2026.

### Notes

- Schema dependencies (#05–#08) were applied live as migration `0002` / `20260809155601` before this promotion.
- Annex L categories for cluster amenities landed via Doc 4 #10 before promotion.
- Drive-time distances from the factsheet intentionally left out per Ray's instruction.
- `positioning` intentionally left unchanged per Ray's instruction.
- 19 amenity `places` rows are **`state = draft`** until Ray reviews taxonomy and publishes them.
- Local PNG copies remain in `farm-gardens-floorplans/`; canonical files are in the `media` storage bucket.

### Promotion

Ran 2026-08-09: uploaded 8 images to `media`/`farm-gardens/*`, applied promotion SQL (cluster + unit_types + facade_style_descriptions + 19 places + 146 units + media/media_links). Sanity checks: 146 units, 79/67 beds, 72/74 Horizon/Earth, 5-bed `bua_max=5657` / `plot_max=10004`, price `5100000`.

**Promoted:** [x]
**Date:** 2026-08-09
**By:** Cursor agent (authorized by Ray — “do the rest”) · `reference.md` updated in the same session under `DOCS_GUARD=off`

---

## Batch 002 — Farm Gardens bathrooms (2026-08-13)

**Source:** Ray (operator), 2026-08-13.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer) — bathroom totals stated by Ray for the live register.
**Confidence:** corroborated
**Status:** promoted

### Proposed reference.md diff

- **`unit_types.bathrooms`:** 4BR → `5.5`; 5BR → `6.5` (were null).

### Notes

- Batch 001 left bathrooms null (not in that intake). No PDF recount in this batch — values as given by Ray.

### Promotion

Ran 2026-08-13: both Farm Gardens `unit_types` rows updated.

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: update)

---

## Batch 003 — Publish Farm Gardens on-site amenities (2026-08-13)

**Source:** No new extract. Ray authorized publishing all leftover draft places, including the 19 Batch 001 Farm Gardens amenity rows.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated (same as Batch 001 amenities)
**Status:** promoted

### Proposed reference.md diff

- **`places.state`:** `draft` → `published` on all 19 Farm Gardens cluster-scoped amenity rows.

### Notes

- Places trigger revalidates `/`, `/places`, `/living` — not `/clusters/farm-gardens`.
- `farm-gardens-mosque` also matches `/living/services`.

### Promotion

Ran 2026-08-13: 19 Farm Gardens `places.state = published`. SQL: `scripts/publish-leftover-draft-places.sql`.

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: publish leftover draft places)

---

## Batch 004 — Maid’s room on both villa types (2026-08-13)

**Source:** Farm Gardens floor-plan PDFs (Batch 001 pack) — both 4BR and 5BR plans label a Maid’s Room.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated
**Status:** promoted

### Proposed reference.md diff

- **`unit_types.maids_room`:** both 4BR and 5BR → `true` (were null).

### Notes

- `ground_floor_bedroom` left null pending Ray — floor plans show a ground-floor guest bedroom on both types; column exists on all clusters.

### Promotion

Ran 2026-08-13: both Farm Gardens `unit_types` rows `maids_room = true`.

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: set maids room)

---

## Batch 005 — Ground-floor bedroom on both villa types (2026-08-13)

**Source:** Farm Gardens floor-plan images (`farm-gardens-4bed-floorplan.png`, `farm-gardens-5bed-floorplan.png`) — 4BR labels Guest Bedroom on GF; 5BR labels Guest Room on GF.
**Source ID:** `a1000000-0000-4000-8000-000000000001` (Emaar Properties, developer)
**Confidence:** corroborated
**Status:** promoted

### Proposed reference.md diff

- **`unit_types.ground_floor_bedroom`:** both 4BR and 5BR → `true` (were null).

### Notes

- Maid’s room is separate and already `true` from Batch 004; does not count as `ground_floor_bedroom`.

### Promotion

Ran 2026-08-13: both Farm Gardens `unit_types` rows `ground_floor_bedroom = true`.

**Promoted:** [x]
**Date:** 2026-08-13
**By:** agent (Ray authorized: yes — set from floorplan check)
