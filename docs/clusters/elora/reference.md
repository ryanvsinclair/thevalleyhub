# Elora — Reference

**Slug:** `elora`
**Status:** Migrated from Doc 1 Annex C/D, 2026-08-09. Guarded by `scripts/pre-commit` per Doc 4 #09. Unit-type / facade / image depth from staging Batch 001 (2026-08-13); amenities from Batch 002 (draft); payment / summary / body / price from Batch 003; units / plexes / unit_count from Batch 004 (2026-08-13).
**Source:** Relocated from Doc 1 Annex C/D, then Batches 001–004 (Emaar floor-plan PDF + brochure + cluster map + factsheet + payment PDF + Doc 10 extract, source `a1000000-0000-4000-8000-000000000001`).

---

## Register

| Field | Value |
|---|---|
| Phase | 1 |
| Product type | townhouse |
| Unit count | 430 |
| Facade styles | Moon, Mysk |
| Single row | true |
| Handover actual | null |
| Handover target | 2026-09-30 |
| Price from (AED) | 1,600,000 (3-bed starting; 4-bed from 2,100,000) |
| Payment plan | 10% Down Payment (Jan 2023) · 10% 1st Instalment (Mar 2023) · 10% 2nd Instalment (Sep 2023) · 10% 3rd Instalment (upon 20% construction, Mar 2024) · 10% 4th Instalment (upon 40% construction, Sep 2024) · 10% 5th Instalment (Mar 2025) · 10% 6th Instalment (upon 60% construction, Aug 2025) · 10% 7th Instalment (upon 80% construction, Jan 2026) · 20% 8th Instalment (upon 100% construction, estimated Sep 2026) |
| Confidence | corroborated |

## Positioning

> Meaningfully larger 3-bed than the earlier clusters; the floor starts where they peak. All 430 units single-row, every home a corner or end unit.

*(Left unchanged — Batch 003 added `summary`/`body` beside it.)*

## Summary

Elora consists of 3 and 4-bedroom townhouses ideally located in a tranquil family haven far from the commotion of the city yet conveniently close to all that Dubai has to offer.

## Body

A community where you can take in the beauty of each day, Elora is a paradise where residents can seek comfort by engaging with nature in the beautifully designed lush surroundings. Here, you will enjoy sustainable buildings, fully harmonised with the natural environment and surrounded by the stunning beauty of the green earth. It’s the perfect setting to cultivate a tranquil mind and an active body, providing you with the highest quality of life.

Elora offers you the choice of three and four-bedroom townhouses in two distinct architectural styles: Moon and Mysk. Every townhouse is characterised by exquisite quality, and each makes a personal statement. Premium materials and attention to detail throughout ensure tasteful and timeless elegance.

## Unit types

Style is layout-determining here (`unit_types.layout` = `{facade_style}-{label}`, e.g. `moon-a`). Totals: Moon 146 · Mysk 284. Bedroom split **284×3BR / 146×4BR**. Bathrooms 3.5 (3BR) / 4.0 (4BR). Only Moon 3BR-A has `maids_room = true` among 3BRs (others store + bath); all 4BR rows have maid’s + `ground_floor_bedroom = true`. Type-row confidence corroborated; per-unit assignment unverified.

| facade_style | bedrooms | label | layout | bua_min | bua_max | unit_count | bathrooms | maids_room |
|---|---|---|---|---|---|---|---|---|
| moon | 3 | A | moon-a | 2180 | 2180 | 16 | 3.5 | true |
| moon | 3 | B | moon-b | 2180 | 2180 | 16 | 3.5 | false |
| mysk | 3 | A | mysk-a | 2095 | 2112 | 126 | 3.5 | false |
| mysk | 3 | B | mysk-b | 2095 | 2112 | 126 | 3.5 | false |
| moon | 4 | A | moon-a | 2608 | 2608 | 57 | 4.0 | true |
| moon | 4 | B | moon-b | 2608 | 2608 | 57 | 4.0 | true |
| mysk | 4 | A | mysk-a | 2586 | 2586 | 16 | 4.0 | true |
| mysk | 4 | B | mysk-b | 2586 | 2586 | 16 | 4.0 | true |

## Facades

Copy from Emaar brochure pp. 23 / 24 (Batch 001). Confidence corroborated. Floor plans / facade photos / maps staged under `elora-floorplans/`; Storage `media/elora/*` + `media_links` still open (service-role upload pending).

| style_name | description |
|---|---|
| Moon | Moon design aesthetic is an alluring interplay of planes and masses accented to highlight a tranquil style of living. |
| Mysk | Mysk is a collection of townhouses with rich-toned and open corners to capture the enchanting rays of the golden hour and create a sense of calmness and warmth. |

## Amenities (`places`, cluster-scoped)

13 **draft** `places` rows with `cluster_id` → elora (Batch 002). From `ELORA CLUSTER MAP.pdf` legend A–M. Categories per Annex L (#10). Not live on `/clusters/elora` until published.

| name | category | subcategory |
|---|---|---|
| Elora Gatehouse | gathering | gatehouse |
| Lawn | gathering | lawn |
| Kids Playground | family | kids-play |
| Community Clubhouse | gathering | community-centre |
| Nature Trail | nature | trails |
| Trampoline Park | family | trampoline |
| Outdoor Living Room | gathering | outdoor-living |
| Running Track | recreation | running-track |
| Community Garden | nature | gardens |
| Table Tennis | recreation | table-tennis |
| Half Basketball Court | recreation | basketball |
| Multi-Use Gaming Court | recreation | multi-use-court |
| Outdoor Communal Table | gathering | communal-table |

Brochure pp. 26–29 (Golden Beach, Town Centre, Sports Village, Kids’ Dale) are Valley-wide — not Elora `cluster_id` rows.

## Units / plexes

Batch 004 promoted: **430** `units` + **73** `plexes` (`32×4 · 13×6 · 28×8` = 16×4 Moon + 16×4 Mysk + 13×6 + 28×8). Dataset in [`../../../elora-floorplans/elora-units.csv`](../../../elora-floorplans/elora-units.csv). Per-unit style/layout/TH position `confidence = unverified` (Doc 10 derived). No mirror-pair plex types.

## Cross-collection comparisons involving Elora

| Comparison | Difference |
|---|---|
| Nara/Talia 4BR → Elora 4BR | ~350 sq ft, single-row guarantee, newer build |
| Elora 4BR → Lillia 4BR | Corner position, ground-floor bedroom, L-shaped garden |

## Staging

See [`staging.md`](./staging.md) for any facts pending promotion into this reference. Batches 001–004 promoted 2026-08-13. Still open: publish Elora amenities; Storage media upload + `media_links`; plot size breakdown.
