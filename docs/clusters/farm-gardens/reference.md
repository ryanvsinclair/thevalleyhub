# Farm Gardens — Reference

**Slug:** `farm-gardens`
**Status:** Migrated from Doc 1 Annex C/D, 2026-08-09. Guarded by `scripts/pre-commit` per Doc 4 #09. Batch 001 promoted 2026-08-09; bathrooms from Batch 002 (2026-08-13); amenities published Batch 003 (2026-08-13); maids_room Batch 004 (2026-08-13); ground_floor_bedroom Batch 005 (2026-08-13).
**Source:** Relocated from Doc 1 Annex C.1/C.4 and Annex D, then Batches 001–005 (6 official Emaar PDFs + Ray bathroom totals, source `a1000000-0000-4000-8000-000000000001`) promoted into live DB + this file.

---

## Register

| Field | Value |
|---|---|
| Phase | 1 |
| Product type | villa |
| Unit count | 146 |
| Facade styles | Horizon, Earth |
| Single row | null |
| Handover actual | null |
| Handover target | 2026-09-30 |
| Price from (AED) | 5,100,000 (4-bed starting; 5-bed from 6,100,000) |
| Payment plan | 10% Down Payment (Dec 2022) · 10% 1st Instalment (Feb 2023) · 10% 2nd Instalment (Aug 2023) · 10% 3rd Instalment (Feb 2024) · 10% 4th Instalment (Aug 2024, 20% construction) · 10% 5th Instalment (Feb 2025, 40% construction) · 10% 6th Instalment (Jul 2025, 60% construction) · 10% 7th Instalment (Dec 2025, 80% construction) · 20% 8th Instalment (Aug 2026, 100% construction) |
| Confidence | corroborated |

## Positioning

> Top of the original Valley. 146 homes only, farm-style landscaping, hydroponics greenhouse, community gardening.

*(Left unchanged per Ray's explicit instruction — not touched by Batch 001.)*

## Summary

Farm Gardens is the original Valley's standalone villa cluster — 146 four- and five-bedroom homes on 8,000–10,000 sq ft plots, built around a working farm-to-table lifestyle with its own hydroponics greenhouse and community farming plots.

## Body

Farm Gardens sits at the top of the original Valley masterplan, on the Dubai–Al Ain Road. It's a 146-home, gated standalone-villa community built around a farm-style concept: residents can grow and harvest their own food in community garden plots, supported by full-time onsite farmers, a hydroponics greenhouse, and community farming allotments.

Homes come in two styles — Horizon and Earth — as 4-bedroom (4,950 sq ft BUA, ~8,914 sq ft plot) or 5-bedroom (5,657 sq ft BUA, ~10,004 sq ft plot) villas, 79 and 67 units respectively.

On-site amenities include a Grand Lawn, petting zoo and animal farm, desert majlis with bonfire area, stargazing platforms, picnic spots, a mosque, and a private Wellness Centre with gym, spa, restaurant and pool decks overlooking the farmland. Residents also have access to The Valley's shared amenities — Golden Beach, Town Centre, Sports Village and Kids' Dale.

Target handover: 30 September 2026.

## Unit types

| bedrooms | bua_min | bua_max | plot_min | plot_max | suite | garage | balcony | roof | bathrooms | maids_room | ground_floor_bedroom | unit_count | confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 4950 | — | 8914 | — | 3843 | 608 | 500 | 423 | 5.5 | true | true | 79 | corroborated |
| 5 | — | 5657 | — | 10004 | 4520 | 622 | 515 | 441 | 6.5 | true | true | 67 | corroborated |

Batch 001 corrected the 5-bed `bua_max` (was 10004 — that figure is average plot area, now in `plot_max`). Suite + garage + balcony equals published BUA totals. Bathrooms from Batch 002 (Ray, 2026-08-13). `maids_room = true` both types from Batch 004; `ground_floor_bedroom = true` both from Batch 005 (floor plans).

## Facade styles

| style_name | description |
|---|---|
| Horizon | The peace and stability of these luxurious four and five-bedroom villas can be felt in the air. As the developed area merges into its natural surroundings, the smooth horizontal lines serve as a seamless transition. |
| Earth | The Earth villas master indoor-outdoor living. Developed with a unique relationship with the external natural environment, these modern four and five-bedroom residences create a feeling of privilege in this exceptional setting of a luscious desert farming community. |

## Amenities (`places`, cluster-scoped)

19 published `places` rows with `cluster_id` → farm-gardens (Batch 001; `state` flipped in Batch 003). Categories per Annex L (#10). Live on `/clusters/farm-gardens` On-site amenities.

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

## Units

146 individual `units` rows live (plot number, facade style, bedroom type). `confidence = unverified` on classified fields. Split: 79×4-bed / 67×5-bed; 72 Horizon / 74 Earth. Dataset source: `farm-gardens-floorplans/units_style_type.csv`.

## Media

8 files in storage bucket `media` under `farm-gardens/`: floor plans (4/5-bed + mirrored) → `unit_type`; site plan + master plan → cluster; Horizon/Earth exteriors → `facade_style_descriptions`.

## Cross-collection comparisons involving Farm Gardens

| Comparison | Difference |
|---|---|
| Alana 4BR → Farm Grove 4BR | Full detachment, but loses ~400 sq ft of built area |
| Farm Grove 4BR → Farm Gardens 4BR | +1,200 sq ft, scarcity (146 vs 482 units) |

## Staging

See [`staging.md`](./staging.md) — Batches 001–003 are **promoted**.
