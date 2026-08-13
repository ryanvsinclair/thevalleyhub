# Talia — Reference

**Slug:** `talia`
**Status:** Migrated from Doc 1 Annex C/D, 2026-08-09. Guarded by `scripts/pre-commit` per Doc 4 #09. Unit-type / facade / image depth from staging Batch 001 (2026-08-13); amenities from Batch 002 (2026-08-13); payment / summary / body from Batch 003 (2026-08-13); Golden Beach strip Valley-wide places from Batch 004 (2026-08-13); units / plexes / unit_count from Batch 005 (2026-08-13).
**Source:** Relocated from Doc 1 Annex C/D, then Batches 001–005 (Emaar floor-plan PDF + brochure + cluster map + payment PDF + Doc 10 extract, source `a1000000-0000-4000-8000-000000000001`).

---

## Register

| Field | Value |
|---|---|
| Phase | 1 |
| Product type | townhouse |
| Unit count | 330 |
| Facade styles | Pharo, Cyrus, Elio |
| Single row | null |
| Handover actual | 2025-03-01 |
| Handover target | — |
| Payment plan | 10% Down Payment (on booking) · 10% 1st Instalment (Mar 2022) · 5% 2nd Instalment (Sep 2022) · 10% 3rd Instalment (Mar 2023) · 10% 4th Instalment (Sep 2023) · 5% 5th Instalment (Mar 2024) · 10% 6th Instalment (Sep 2024) · 40% 7th Instalment (100% construction, estimated Mar 2025) |
| Confidence | corroborated |

## Positioning

> Same footprint as Nara; the difference is location. Closest of the early clusters to Golden Beach, Town Centre and Sports Village. Best walkability.

*(Left unchanged — Batch 003 added `summary`/`body` beside it.)*

## Summary

The Valley's third neighbourhood of elegant townhouses – TALIA comprises stylish, family-friendly homes connected to nature and situated just footsteps away from Golden Beach.

## Body

From verdant open spaces and green pocket parks, to pristine lawns and lush sikkas, TALIA is a suburban utopia for families who seek an active, healthy and fulfilling lifestyle, with everything they need within easy reach.

TALIA's three and four-bedroom townhouses come in a choice of three contemporary designs. Adjoining communal pocket parks seamlessly connect your dream home to nature and provide beautiful green spaces for your suburban lifestyle to bloom.

## Unit types

Style is layout-determining here (`unit_types.layout` = `{facade_style}-{label}`, e.g. `cyrus-a`). Per-layout `unit_count` from Batch 005 (Doc 10 extract). All rows except as noted: `maids_room = true`, `bathrooms` 3.5 (3BR) / 4.0 (4BR), confidence corroborated for type rows; per-unit assignment unverified. 4BR rows have `ground_floor_bedroom = true`. Pharo has no 4BR-B/C pages in the source PDF. Bedroom split **224×3BR / 106×4BR**.

| facade_style | bedrooms | label | layout | bua_min | bua_max | unit_count | bathrooms |
|---|---|---|---|---|---|---|---|
| cyrus | 3 | A | cyrus-a | 2097 | 2097 | 18 | 3.5 |
| cyrus | 3 | B | cyrus-b | 2100 | 2100 | 18 | 3.5 |
| cyrus | 4 | A | cyrus-a | 2217 | 2217 | 18 | 4.0 |
| cyrus | 4 | B | cyrus-b | 2248 | 2248 | 18 | 4.0 |
| elio | 3 | A | elio-a | 1864 | 1897 | 45 | 3.5 |
| elio | 3 | B | elio-b | 1862 | 1921 | 45 | 3.5 |
| elio | 4 | A | elio-a | 2210 | 2210 | 6 | 4.0 |
| elio | 4 | B | elio-b | 2210 | 2210 | 6 | 4.0 |
| pharo | 3 | A | pharo-a | 2090 | 2090 | 9 | 3.5 |
| pharo | 3 | B | pharo-b | 2035 | 2064 | 49 | 3.5 |
| pharo | 3 | C | pharo-c | 2036 | 2040 | 40 | 3.5 |
| pharo | 4 | A | pharo-a | 2187 | 2187 | 29 | 4.0 |
| pharo | 4 | D | pharo-d | 2189 | 2189 | 9 | 4.0 |
| pharo | 4 | E | pharo-e | 2189 | 2189 | 20 | 4.0 |

## Facades

Copy from Emaar brochure pp. 15 / 16 / 17 (Batch 001). Confidence corroborated. Floor plans, facade photos, and maps are in Storage under `media/talia/*`.

| style_name | description |
|---|---|
| Pharo | A contemporary blend of bold, rich tones, beautiful accents and sleek lines are complemented by sophisticated wooden fixtures and large windows, which welcome natural light in – making these stylish townhouses homes to fall in love with. |
| Cyrus | The secret is in the details – and every architectural detail of these pristine townhouses has been meticulously crafted with elegance to the fore. Minimalism and luxury coalesce and contrast beautifully with the lush green surroundings, making Cyrus homes to be truly proud of. |
| Elio | Elio's timeless design is effortless yet elegant and simple yet sophisticated. Large windows allow natural light to pour in, while contemporary accents and intricate touches make this the ideal space to call home. |

## Amenities (`places`, cluster-scoped)

7 draft `places` rows with `cluster_id` → talia (Batch 002). From `TALIA CLUSTER MAP.pdf` legend. Categories per Annex L (#10). Not published on `/clusters/talia` until Ray flips `state`.

| name | category | subcategory |
|---|---|---|
| Talia Gatehouse | gathering | gatehouse |
| Outdoor Games Area and Lawn | recreation | outdoor-games |
| Pocket Park | nature | pocket-parks |
| Kids Play Area and Lawn | family | kids-play |
| Community Clubhouse | gathering | community-centre |
| Green Sikkas | nature | sikkas |
| Picnic Lawn | gathering | picnic |

Legend letters **G–I, K–O** are Valley-wide Golden Beach strip places (Batch 004), not Talia `cluster_id` rows.

## Units / plexes

Batch 005 promoted: **330** `units` + **53** `plexes` (`18×4 · 20×6 · 6×8 · 9×10`). Dataset in [`../../../talia-floorplans/talia-units.csv`](../../../talia-floorplans/talia-units.csv). Per-unit style/layout/TH position `confidence = unverified` (Doc 10 derived). No mirror-pair plex types.

## Cross-collection comparisons involving Talia

| Comparison | Difference |
|---|---|
| Nara/Talia 4BR → Elora 4BR | ~350 sq ft, single-row guarantee, newer build |

## Staging

See [`staging.md`](./staging.md) for any facts pending promotion into this reference. Batches 001–005 promoted 2026-08-13. Still open: publish Talia amenities; `single_row`; plot sizes; pricing.
