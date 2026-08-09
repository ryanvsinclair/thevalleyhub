# Farm Gardens — Reference

**Slug:** `farm-gardens`
**Status:** Migrated from Doc 1 Annex C/D, 2026-08-09. Guarded by `scripts/pre-commit` per Doc 4 #09.
**Source:** Relocated verbatim from Doc 1 Annex C.1/C.4 and Annex D, 2026-08-09. No values changed in the move — this still reflects Doc 1 as it stood *before* today's PDF deep-dive. Batch 001's corrections and additions (price, payment plan, corrected 5-bed BUA, amenities, units, images) are staged separately and have **not** been promoted into this file yet.

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
| Confidence | corroborated |

## Positioning

> Top of the original Valley. 146 homes only, farm-style landscaping, hydroponics greenhouse, community gardening.

*(Left unchanged per Ray's explicit instruction during today's session — not touched by Batch 001 either.)*

## Unit types

| bedrooms | bua_min | bua_max | plot_min | plot_max | layout | notes | confidence |
|---|---|---|---|---|---|---|---|
| 4 | 4950 | — | — | — | — | — | corroborated |
| 5 | — | 10004 | — | — | — | — | corroborated |

⚠️ **Known error, not yet corrected here:** the 5-bed `bua_max = 10004` is actually the average *plot* area, not BUA — confirmed against the floor plan PDF during today's deep-dive (real 5-bed BUA is 5,657 sq ft). Fix is staged in Batch 001, pending promotion.

## Cross-collection comparisons involving Farm Gardens

| Comparison | Difference |
|---|---|
| Alana 4BR → Farm Grove 4BR | Full detachment, but loses ~400 sq ft of built area |
| Farm Grove 4BR → Farm Gardens 4BR | +1,200 sq ft, scarcity (146 vs 482 units) |

## Staging

See [`staging.md`](./staging.md) — this cluster has an active batch (Batch 001) with substantial pending facts: price, payment plan, corrected/added unit_types columns, 19 amenities, `facade_style_descriptions`, all 146 individual units, and 8 images. None of it is reflected above yet.
