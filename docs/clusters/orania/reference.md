# Orania — Reference

**Slug:** `orania`
**Status:** Migrated from Doc 1 Annex C/D, 2026-08-09. Guarded by `scripts/pre-commit` per Doc 4 #09. Unit-type / facade / image depth from staging Batch 001 (2026-08-13); amenities from Batch 002, published 2026-08-13; payment / summary / body / price from Batch 003; units / plexes / unit_count / plex_config from Batch 004 (2026-08-13).
**Source:** Relocated from Doc 1 Annex C/D, then Batches 001–004 (Emaar floor-plan PDF + brochure + cluster map + factsheet + payment PDF + Doc 10 extract, source `a1000000-0000-4000-8000-000000000001`).

---

## Register

| Field | Value |
|---|---|
| Phase | 1 |
| Product type | townhouse |
| Unit count | 308 |
| Facade styles | Bold, Sleek |
| Single row | true |
| Handover actual | null |
| Handover target | 2025-12-31 |
| Price from (AED) | 1,528,888 (3-bed starting; 4-bed from 1,944,888) |
| Payment plan | 10% Down Payment (10 Jun 2022) · 10% 1st Instalment (8 Aug 2022) · 10% 2nd Instalment (8 Feb 2023) · 10% 3rd Instalment (upon 10% construction, 12 Sep 2023) · 10% 4th Instalment (upon 30% construction, 27 Apr 2024) · 10% 5th Instalment (upon 50% construction, 1 Oct 2024) · 15% 6th Instalment (upon 70% construction, 10 Feb 2025) · 25% 7th Instalment (upon 100% construction, estimated 31 Dec 2025) |
| `plex_config` | 36 plexes in 6, 8 and 10-plex rows |
| Confidence | corroborated |

**Note:** target was Q4 2025 and is now past. Completion unconfirmed — `handover_actual` stays null, not inferred.

## Positioning

> The layout-choice cluster. 36 plexes across 6, 8 and 10-plex configurations, widest variety of orientation and plot shape. No back-to-back units.

*(Updated on Batch 004 promote — supersedes prior “43 clusters / four plex configurations” wording.)*

## Summary

The Valley’s fourth neighbourhood of modern townhouses, ORANIA brings balance to your lifestyle, in a community you can feel proud to call home.

## Body

With a wide array of indoor and outdoor retail options, The Valley's Golden Beach, lush linear parks, a local farmers’ market, and gourmet dining options just footsteps away, your family can embrace a true sense of community amidst the serenity of nature.

ORANIA offers you the choice of three and four-bedroom townhouses in two distinct architectural styles: Bold and Sleek. Choose the ideal home to match your lifestyle and enjoy direct access to linear parks and lush green open spaces in a setting of absolute tranquillity.

## Unit types

Style is layout-determining here (`unit_types.layout` = `{facade_style}-{label}`, e.g. `bold-a`). Totals: Bold 156 · Sleek 152. Bedroom split **236×3BR / 72×4BR**. All 16 layouts: `maids_room = true`, bathrooms 3.5 (3BR) / 4.0 (4BR); all 4BR rows have `ground_floor_bedroom = true`. Type-row confidence corroborated; per-unit assignment unverified.

| facade_style | bedrooms | label | layout | bua_min | bua_max | unit_count | bathrooms | maids_room |
|---|---|---|---|---|---|---|---|---|
| bold | 3 | A | bold-a | 1960 | 1992 | 24 | 3.5 | true |
| bold | 3 | B | bold-b | 1959 | 1960 | 24 | 3.5 | true |
| bold | 3 | C | bold-c | 1896 | 1899 | 36 | 3.5 | true |
| bold | 3 | D | bold-d | 1896 | 1929 | 36 | 3.5 | true |
| bold | 4 | A | bold-a | 2284 | 2284 | 12 | 4.0 | true |
| bold | 4 | B | bold-b | 2284 | 2284 | 12 | 4.0 | true |
| bold | 4 | C | bold-c | 2346 | 2346 | 6 | 4.0 | true |
| bold | 4 | D | bold-d | 2346 | 2346 | 6 | 4.0 | true |
| sleek | 3 | A | sleek-a | 2009 | 2044 | 24 | 3.5 | true |
| sleek | 3 | B | sleek-b | 2009 | 2011 | 24 | 3.5 | true |
| sleek | 3 | C | sleek-c | 1903 | 1906 | 34 | 3.5 | true |
| sleek | 3 | D | sleek-d | 1903 | 1938 | 34 | 3.5 | true |
| sleek | 4 | A | sleek-a | 2264 | 2265 | 12 | 4.0 | true |
| sleek | 4 | B | sleek-b | 2265 | 2265 | 12 | 4.0 | true |
| sleek | 4 | C | sleek-c | 2345 | 2345 | 6 | 4.0 | true |
| sleek | 4 | D | sleek-d | 2346 | 2346 | 6 | 4.0 | true |

## Facades

Copy from Emaar brochure pp. 17 / 18 (Batch 001). Confidence corroborated. Floor plans, facade photos, and maps in Storage under `media/orania/*` (21 files + links).

| style_name | description |
|---|---|
| Bold | Come home to a bold architectural aesthetic that harmoniously blends pure solids and voids for a design that exudes sophistication and beautifully complements its natural surroundings. |
| Sleek | Wake up to an elegant and inviting architectural design, boasting iconic frames that stand out in a sleek exterior composition, creating a sense of calmness and modernity. |

## Amenities (`places`, cluster-scoped)

14 published `places` rows with `cluster_id` → orania (Batch 002; published 2026-08-13). From `ORANIA CLUSTER MAP.pdf` legend A–O excluding M. Categories per Annex L (#10). Live on `/clusters/orania` On-site amenities.

| name | category | subcategory |
|---|---|---|
| Orania Gatehouse | gathering | gatehouse |
| Pocket Park | nature | pocket-parks |
| Kids Play Area and Lawn | family | kids-play |
| Community Clubhouse | gathering | community-centre |
| Green Sikka | nature | sikkas |
| Splash Pad | family | splash-pad |
| Picnic Lawn | gathering | picnic |
| Jogging Track | recreation | running-track |
| Outdoor Living Room | gathering | outdoor-living |
| Palm Grove | nature | gardens |
| Yoga Deck | wellness | yoga |
| Events Lawn | gathering | lawn |
| Sports Court | recreation | multi-use-court |
| Skate Park | recreation | skate |

Legend letter **M — The Valley Pavilion** is Valley-wide — not an Orania `cluster_id` row. Brochure Golden Beach / Town Centre / retail are also Valley-wide.

## Units / plexes

Batch 004 promoted: **308** `units` + **36** `plexes` (`17×10 · 12×8 · 7×6`). Dataset in [`../../../orania-floorplans/orania-units.csv`](../../../orania-floorplans/orania-units.csv). Per-unit style/layout/TH position `confidence = unverified` (Doc 10 derived). `street_side` is page-relative (`up`/`down`/`left`/`right`). No 4-plex; no mirror-pair plex types.

## Cross-collection comparisons involving Orania

None recorded.

## Staging

See [`staging.md`](./staging.md) for any facts pending promotion into this reference. Batches 001–004 promoted 2026-08-13; media uploaded and amenities published 2026-08-13. Still open: plot size breakdown.
