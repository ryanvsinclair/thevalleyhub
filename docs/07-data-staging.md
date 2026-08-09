# DOC 7 — DATA STAGING

**Version:** 1.0 · 2026-08-08
**Written by:** the agent, per Doc 4 Proposal #04
**Decided by:** Ray only — Doc 1 still accepts prose only from Ray, or under `DOCS_GUARD=off`, exactly as Doc 3 §9 already requires

---

## RULES

1. This doc is the only place new external-source facts get staged before they become Doc 1 prose. Doc 1 itself is never edited directly to introduce a new fact — the batch goes here first.
2. One numbered batch per intake (a PDF export, a factsheet, a site visit, an operator call). Never edit a promoted batch — supersede it with a new one if a value turns out wrong.
3. Every fact in a batch carries a `source_id` and a confidence level, exactly as Doc 3 §1 requires everywhere else. Staging skips the propose→approve→implement ceremony of Doc 4 — it does not skip sourcing rigor.
4. A batch is not a fact until it's `promoted` — i.e. until its proposed Doc 1 diff has actually landed in Doc 1 via a Ray-run (or Ray-authorized) commit. Until then, nothing here overrides what Doc 1 currently says.
5. Schema or structural changes (new columns, new tables) are **not** staged here — those still go through Doc 4 as their own proposal, same as always. A batch can note that a value is blocked on a pending schema proposal.
6. Per Doc 3 §12, a newly staged batch must be raised to Ray directly in the same message, not left for later discovery.

## STATUS VALUES

`staged` · `promoted` · `rejected`

---

## ENTRY FORMAT

```markdown
## Batch NNN — <short description> (YYYY-MM-DD)

**Source:** <files/links, retrieval date>
**Source ID:** <sources.id> (<label>)
**Confidence:** <confidence_level>
**Status:** staged / promoted / rejected

### Proposed Doc 1 diff
- <exact field-by-field change, in the form it would take in Doc 1>

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
**Status:** staged

### Proposed Doc 1 diff

- **Annex C.1, `farm-gardens` row:** add `price_from_aed = 5100000` (4-bed starting price per factsheet; 5-bed starts at 6,100,000, factsheet does not label either as "the" starting price — 4-bed used as the lower figure)
- **`clusters.payment_plan` (farm-gardens):** `"10% Down Payment (Dec 2022) · 10% 1st Instalment (Feb 2023) · 10% 2nd Instalment (Aug 2023) · 10% 3rd Instalment (Feb 2024) · 10% 4th Instalment (Aug 2024, 20% construction) · 10% 5th Instalment (Feb 2025, 40% construction) · 10% 6th Instalment (Jul 2025, 60% construction) · 10% 7th Instalment (Dec 2025, 80% construction) · 20% 8th Instalment (Aug 2026, 100% construction)"` — construction-linked dates marked "Estimated" on the source PDF
- **Annex C unit_types table, `farm-gardens | 5`:** correct `bua_max` from `10004` to `5657` (5,656.86 sq ft per floor plan total area) — the existing `10004` is the average plot area, not BUA, and appears to have been entered in the wrong column
- **Annex C unit_types table, `farm-gardens | 5`:** add `plot_max = 10004` (avg plot area per factsheet)
- **Annex C unit_types table, `farm-gardens | 4`:** add `plot_min = 8914` (avg plot area per factsheet)
- **Annex C unit_types table, `farm-gardens | 4`:** add `unit_count = 79` — *depends on Doc 4 #05 (`unit_types.unit_count`), approved 2026-08-08, not yet migrated onto the live schema*
- **Annex C unit_types table, `farm-gardens | 5`:** add `unit_count = 67` — *same dependency*
- **Annex C unit_types table, `farm-gardens | 4`:** add `suite_area = 3843`, `garage_area = 608`, `balcony_area = 500`, `roof_terrace_area = 423` (3,842.50 / 607.95 / 499.98 / 423.02 sq ft per floor plan, rounded to nearest sq ft; suite + garage + balcony = 4,950.43 = published total area) — *depends on Doc 4 #06, approved 2026-08-09, not yet migrated onto the live schema*
- **Annex C unit_types table, `farm-gardens | 5`:** add `suite_area = 4520`, `garage_area = 622`, `balcony_area = 515`, `roof_terrace_area = 441` (4,520.30 / 621.51 / 515.05 / 440.67 sq ft per floor plan, rounded to nearest sq ft; suite + garage + balcony = 5,656.86 = published total area) — *same dependency*
- **New `places` rows, `cluster_id = farm-gardens`:** 19 cluster-specific amenities, each its own row (not a shared catalog) — *depends on Doc 4 #06 (`places.cluster_id`), approved 2026-08-09, not yet migrated onto the live schema*

  | name | category | subcategory |
  |---|---|---|
  | Grand Lawn | outdoor | lawn |
  | Petting Zoo & Animal Farm | family | petting-zoo |
  | Kids Play Area | family | play-area |
  | Hydroponics Greenhouse | farming | greenhouse |
  | Community Farming Allotments | farming | allotments |
  | Desert Majlis & Bonfire | outdoor | majlis |
  | Stargazing Platforms | outdoor | stargazing |
  | Picnic Spots | outdoor | picnic |
  | Outdoor Fitness Station | sports | fitness-station |
  | Yoga/Events Lawn | sports | yoga-lawn |
  | Xeriscape Botanical Garden | nature | botanical-garden |
  | Events Plaza | community | events-plaza |
  | Pool Deck | sports | pool |
  | Padel Court | sports | padel-court |
  | Volleyball Court | sports | volleyball |
  | Ghaf Forest | nature | ghaf-forest |
  | Mosque | community | mosque |
  | Wellness Centre | wellness | wellness-centre |
  | Arrival Plaza | community | arrival-plaza |

  Wellness Centre's constituent sub-features (gym, adult & kids pool decks, restaurant, male & female spa, plunge pools, treatment rooms) are individually decomposable as child `places` rows (`parent_place_id` → Wellness Centre) if/when you want those separately filterable — not staged as separate rows yet since the brochure describes them as one facility, not itemized the way the 19 amenities above are. Each row: `confidence = corroborated`, `source_id = a1000000-0000-4000-8000-000000000001`, `cluster_id` → farm-gardens, `parent_place_id` null, `google_place_id` null (none of these are public Google listings).
- **`clusters.summary` (farm-gardens):** `"Farm Gardens is the original Valley's standalone villa cluster — 146 four- and five-bedroom homes on 8,000–10,000 sq ft plots, built around a working farm-to-table lifestyle with its own hydroponics greenhouse and community farming plots."`
- **`clusters.body` (farm-gardens):**
  > Farm Gardens sits at the top of the original Valley masterplan, on the Dubai–Al Ain Road. It's a 146-home, gated standalone-villa community built around a farm-style concept: residents can grow and harvest their own food in community garden plots, supported by full-time onsite farmers, a hydroponics greenhouse, and community farming allotments.
  >
  > Homes come in two styles — Horizon and Earth — as 4-bedroom (4,950 sq ft BUA, ~8,914 sq ft plot) or 5-bedroom (5,657 sq ft BUA, ~10,004 sq ft plot) villas, 79 and 67 units respectively.
  >
  > On-site amenities include a Grand Lawn, petting zoo and animal farm, desert majlis with bonfire area, stargazing platforms, picnic spots, a mosque, and a private Wellness Centre with gym, spa, restaurant and pool decks overlooking the farmland. Residents also have access to The Valley's shared amenities — Golden Beach, Town Centre, Sports Village and Kids' Dale.
  >
  > Target handover: 30 September 2026.

### Notes

- Unit-split, floor-plan breakdown, and amenities lines above are staged with real values but **cannot be promoted until Doc 4 #05 and #06's columns/tables actually exist on the live schema** — both approved, migration text is written into `docs/0001_init.sql` / `supabase/migrations/0001_init.sql`, but nothing has been pushed to the live Supabase project yet (no credentials in this session; `supabase db push` is a separate, explicitly-authorized step).
- `places.category`/`subcategory` values above are my own taxonomy for filter grouping, same caveat as before — not sourced from Emaar material, worth a review pass before treated as final.
- Drive-time distances from the factsheet (5 min Rugby Sevens Stadium, 8 min Dubai Outlet Mall, 25 min Burj Khalifa/Downtown, 25 min DXB) intentionally left out of this batch per Ray's instruction.
- `clusters.positioning` intentionally left unchanged per Ray's instruction.
- The 6 source PDFs themselves (for visitor-facing download) go through `media` / `media_links` — that's a separate, already-existing pipeline, not a Doc 1 fact and not staged here.

### Promotion

**Promoted:** [ ]
**Date:**
**By:**
