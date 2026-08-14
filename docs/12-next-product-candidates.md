# DOC 12 — NEXT PRODUCT CANDIDATES (LOOK LATER)

**Version:** 1.0 · 14 August 2026  
**Status:** PARKED — Ray review backlog; not an execution guide  
**Purpose:** Capture high-value product ideas that need a Doc 4 proposal (or explicit Ray go-ahead) before `src/` work. Not ordered as a build sequence until Ray picks one.

**Read Doc 3 before promoting any item.** Each candidate below should become a **new** Doc 4 proposal if it needs schema, new public surfaces, or Google/product-scope changes. Do not expand Doc 11 #20 to cover these.

---

## How to use this file

1. Ray picks an item (or rejects it).
2. Agent writes a Doc 4 proposal (category A or B as fits).
3. Only after **Status: APPROVED** + **RAY'S DECISION** recorded → open a Doc 2/8/11-shaped guide or a scoped PR plan and implement.
4. Tick or strike items here when proposed / shipped / rejected.

---

## CANDIDATES

### C1 — Interactive Valley / cluster map + plot `units` UI

**What:** Public (and/or admin) map of The Valley with cluster footprints and optional per-plot pins from `units.lat` / `units.lng`. Cluster pages show unit inventory beyond unit-type cards.

**Why it helps:** Seven clusters already have unit-scale data. The brochure → record leap is spatial (“where is my plot / amenity”) more than another text block. Doc 8 Appendix C deferred this until multiple clusters had Batch-001-scale data — that bar is now met.

**Needs:** New Doc 4 (do not reopen #11). Likely map library choice, privacy of plot pins, mobile performance, and whether Prospect vs Resident audiences differ.

**Status:** Admin browse shipped 2026-08-14 (Doc 4 #21, `/admin/units`). Public map / cluster inventory not proposed yet.

---

### C2 — Surface place operational status beyond place detail

**What:** Show `current_status` / `status_log` (e.g. Closed) on Living list cards, Compare Nearby strip, and optionally home WhatsOpenNow — not only on `/places/[slug]`.

**Why it helps:** Golden Beach is already `closed` in `status_log` with a pill on place detail. Visitors scanning Living never see that signal unless they open the place page.

**Needs:** Doc 4 if Living card chrome becomes a new product rule; otherwise a thin Doc 11-style amendment may suffice if Ray treats it as execution of existing status spine.

**Status:** Not proposed yet. Place detail Closed pill already shipped 2026-08-14.

---

### C3 — Status page for masterplan amenities

**What:** Expand `/status` beyond cluster delivery to list place-level amenity operational status (Golden Beach, Pavilion tenants, Sports Village, etc.) from `status_log`.

**Why it helps:** Status is the trust spine for “is it open / delivered?”. Masterplan amenity truth currently lives in place notes + one Closed pill; the Status route copy still says amenities are unknown.

**Needs:** Doc 4 — product shape (which places, how often updated, confidence display). Must not use Google “open now” as Status truth (Doc 11 Appendix C).

**Status:** Not proposed yet.

---

### C4 — Living field display toggles in admin

**What:** Move `src/lib/places/living-display.ts` flags into an admin-editable setting (DB row or config table) so thumbs / open-now / summary / verified can be flipped without a deploy.

**Why it helps:** Ray can hide noisy fields during content ops without waiting on a PR.

**Needs:** Doc 4 if new table/settings surface; or accept code-config as permanent and close this candidate.

**Status:** Not proposed yet. Code toggles exist today.

---

### C5 — Public place search

**What:** Public search or filter across published valley-wide places (name / category / in-community).

**Why it helps:** Living’s five categories do not scale if inventory keeps growing; search is the natural next nav affordance.

**Needs:** Doc 4 — V1 explicitly had no public place search (Doc 11 Appendix C). Scope carefully (no Google Autocomplete on the public site).

**Status:** Not proposed yet.

---

### C6 — Google Place Photos at scale (batch)

**What:** Batch-import primary Google Place Photos for all valley-wide places with `google_place_id`, into Storage + `media_links`, with attribution credit.

**Why it helps:** Living thumbs and place galleries stay empty until photos exist. Manual admin import (per place) is the control path; batch is the scale path.

**Needs:** Ray billing/quota awareness; attribution UX; skip list for places without photos. Per-place admin import started 2026-08-14 — batch is optional follow-on, still Doc 4 if it becomes a standing system job.

**Status:** Per-place admin import in progress. Batch not proposed.

---

### C7 — Living categories for recreation / nature / family (Annex L cluster vocab)

**What:** Optionally expose recreation/nature/family/etc. on Living for valley-wide hubs (e.g. Golden Beach), not only on cluster amenity lists.

**Why it helps:** Golden Beach and leisure pins are valley-wide but sit outside the five Living buckets today.

**Needs:** Doc 4 — Doc 4 #10 and Doc 11 hard rule keep Annex L cluster amenity categories off Living unless Ray reopens.

**Status:** Not proposed yet. Explicitly out of Doc 11 scope.

---

## EXPLICITLY OUT (do not sneak in)

| Item | Why |
|---|---|
| Star ratings / review widgets | Doc 11 / #20 default **no** |
| Forums, marketplace, events | Doc 2 Appendix C |
| Live Google hours on every public request | Cache into DB only |
| Google on cluster brochure amenity pins | Keep `google_place_id` null |
| Google “open” as `/status` truth | `status_log` is SoR |

---

## PARKING LOT NOTES (Ray 2026-08-14)

- Training Room weekend hours: phone-confirm later; leave unverified until then.
- Golden Beach: leave `closed` until a site visit.
- Compare copy polish: Ray later.
- Hours unknown = leave `hours` null; UI must not invent or display empty hours frames.

---

*End of Doc 12.*
