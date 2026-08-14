# Lillia — Reference

**Slug:** `lillia`
**Status:** Migrated from Doc 1 Annex C/D, 2026-08-09. Guarded by `scripts/pre-commit` per Doc 4 #09. Full deep intake from staging Batch 001 promoted 2026-08-14 (unit types, facades, payment / summary / body, 64 plexes, 406 units, 14 draft places, 11 media).
**Source:** Relocated from Doc 1 Annex C/D, then Batch 001 (Emaar brochure + floor plans + payment PNG + high-res cluster map + Doc 10 extract, source `a1000000-0000-4000-8000-000000000001`).

---

## Register

| Field | Value |
|---|---|
| Phase | 1 |
| Product type | townhouse |
| Unit count | 406 |
| Facade styles | Jade, Pearl |
| Single row | true |
| Handover actual | null |
| Handover target | 2027-03-31 |
| Payment plan | 10% Down Payment (On Booking) · 10% 1st Instalment (May 2024) · 10% 2nd Instalment (Sep 2024) · 10% 3rd Instalment (Jan 2025) · 10% 4th Instalment (May 2025, 30% construction) · 10% 5th Instalment (Oct 2025, 50% construction) · 15% 6th Instalment (Mar 2026, 70% construction) · 15% 7th Instalment (Aug 2026, 90% construction) · 10% 8th Instalment (Jan 2027, 100% construction) |
| Plex config | 64 · 4/6/8 |
| Confidence | corroborated (register / types); per-unit map extract unverified |

## Positioning

> Largest 3-bed in the original Valley. 3-beds are middle units, 4-beds are corners with a ground-floor bedroom and larger L-shaped garden.

*(Left unchanged — Batch 001 added `summary`/`body` beside it.)*

## Summary

Lillia is a gated single-row townhouse cluster in The Valley — 406 Jade and Pearl homes (3- and 4-bedroom) arranged in 4-, 6- and 8-plexes beside The Valley Park and Golden Beach.

## Body

Located in The Valley, Lillia is a gated community that goes beyond being a simple commitment to sustainability and an ode to nature’s inspiration. A harmonious blend of opulence and serenity, brought to life by verdant landscaping and impeccable amenities.

Lillia offers a selection tailored to different preferences, featuring both 3-bedroom and 4-bedroom townhouses in two architectural styles — Jade and Pearl. Three-bedroom homes sit as middle units; four-bedroom homes are the corners, with a ground-floor bedroom and a larger L-shaped garden. Residents also enjoy access to The Valley Park, Golden Beach, and The Valley’s shared amenities.

## Unit types

Style is layout-determining (`unit_types.layout` = `{facade_style}-{label}`). Bedroom split **278×3BR / 128×4BR**. Bathrooms 3.5 (3BR) / 4.0 (4BR). All rows `maids_room = true`; `ground_floor_bedroom` only on 4BR. Type-row confidence corroborated; per-unit assignment unverified.

| facade_style | bedrooms | label | layout | bua_min | bua_max | unit_count | bathrooms | maids_room | ground_floor_bedroom |
|---|---|---|---|---|---|---|---|---|---|
| jade | 3 | A | jade-a | 2132 | 2158 | 142 | 3.5 | true | false |
| pearl | 3 | B | pearl-b | 2182 | 2190 | 136 | 3.5 | true | false |
| jade | 4 | A | jade-a | 2973 | 2988 | 64 | 4.0 | true | true |
| pearl | 4 | B | pearl-b | 2777 | 2792 | 64 | 4.0 | true | true |

## Facades

Copy from Emaar brochure (Batch 001). Confidence corroborated. Floor plans, facade photos, and cluster map in Storage under `media/lillia/*` (11 files + links).

| style_name | description |
|---|---|
| Jade | Graceful Elegance in Curves: Harmoniously blending linear forms with elegant curves, this design style embodies both warmth and fluidity, echoing the natural rhythms of nature’s ebb and flow. |
| Pearl | The Linear Marvel: This design is a tribute to modern artistry, with its precise, straight lines. Its edgy and sleek design embodies both strength and contemporary elegance. |

## Amenities (`places`, cluster-scoped)

14 published `places` rows with `cluster_id` → lillia (Batch 001; published 2026-08-14). On-site pins only. Golden Beach / Hub / Pop Golf / Bounce Play excluded — already Valley-wide from Talia Batch 004 (shared strip; Lillia west / Talia east). Live on `/clusters/lillia` On-site amenities.

| name | category | subcategory |
|---|---|---|
| BBQ / Picnic Area | gathering | bbq |
| Community Centre | gathering | community-centre |
| Dog Park | family | dog-park |
| Entry Feature | gathering | entry |
| Flexible Lawn | gathering | lawn |
| Guard House | gathering | gatehouse |
| Informal Half Basketball | recreation | basketball |
| Kids Play Area | family | kids-play |
| Multi-Use Games Court | recreation | multi-use-court |
| Outdoor Fitness | recreation | fitness-station |
| Picnic Lawn | gathering | picnic |
| Picnic Tables | gathering | picnic |
| Shaded Playground – Toddlers | family | playground |
| Splash Pad | family | splash-pad |

## Units / plexes

Batch 001 promoted: **406** `units` + **64** `plexes` (`21×4 · 11×6 · 32×8`). Dataset in [`../../../lillia-floorplans/lillia-units.csv`](../../../lillia-floorplans/lillia-units.csv). Per-unit style/layout/TH position `confidence = unverified` (Doc 10 derived).

## Cross-collection comparisons involving Lillia

| Comparison | Difference |
|---|---|
| Elora 4BR → Lillia 4BR | Corner position, ground-floor bedroom, L-shaped garden |
| Lillia 4BR → Elva 4BR | ~3,000 sq ft plot, but 2028 delivery |

## Staging

See [`staging.md`](./staging.md) for any facts pending promotion into this reference. Batch 001 promoted 2026-08-14; amenities published 2026-08-14. Still open: handover_target vs payment final (Jan 2027) if Ray wants a change; plot/suite/garage areas; pricing.
