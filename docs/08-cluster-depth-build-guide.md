# DOC 8 — CLUSTER DEPTH BUILD GUIDE

**Version:** 1.0 · 9 August 2026  
**Status:** OPEN — blocked on Doc 4 #11 until Ray decides  
**Written by:** the agent (format mirrors Doc 2; content from the post-0002 cluster-depth plan)  
**Read Doc 3 and Doc 2's status block before touching this file.**  
**Prerequisite:** Doc 4 Proposal **#11** must be `APPROVED` before any `src/` step. Until then: write #11, update status blocks, stop.

---

# ►► STATUS BLOCK ◄◄

> **Overwrite this block after every completed step. Do not append.**

```
LAST COMPLETED:   Blocks D-A and D-B complete · Gate D3 smoke confirmed by Ray (admin + public depth OK).
SPEC ALIGNED:     Yes
CURRENT TASK:     None — Doc 8 A+B complete; C (units/map) deferred per Appendix C.
NEXT UP:          Ray publish review on 19 draft Farm Gardens amenities · future Doc 4 for units/map when multiple clusters have Batch-001-scale data
CONTEXT BLOCK:    D-B complete
BLOCKERS:         None
OPEN QUESTIONS:   None
ATTENTION NEEDED: 19 Farm Gardens amenity places still draft — public page correctly hides them until published [R]
GATE STATUS:      Gates D0–D4 PASSED · Doc 8 A+B COMPLETE
```

**Rules for this block**
1. Read it first, before anything else.
2. Rewrite it immediately after finishing a step.
3. `SPEC ALIGNED: Yes` only after the step's checkbox conditions are objectively met.
4. On pause (Doc 3 §4), record exactly where you stopped and what remains.
5. Never mark a step complete you did not personally verify.
6. `ATTENTION NEEDED` lists anything requiring Ray — pending proposals, unanswered clarifications, `[R]` steps. If it is not `None`, Doc 3 §12 requires you to tell Ray directly, not just write it here.

## CONTEXT BLOCKS

Work is grouped into two blocks. Context clears **between** blocks, never mid-section.

| Block | Sections | Shape of work | On completion |
|---|---|---|---|
| **D-A** | 1–2 | Public — queries then cluster page | Update Doc 6 same session (Doc 3 §11); clear |
| **D-B** | 3–4 | Admin — schema/forms then media linking | Update Doc 6 same session; clear |

Procedure at a block boundary follows Doc 3 §10 (gates → notes → status → checkboxes → clear). Doc 5 block entries are for Doc 2's V1 blocks; for Doc 8, record conventions in **Doc 6** changelog + §4/§6 as needed — do not invent a parallel Doc 5 unless Ray asks.

**Not in this guide (deferred):** per-plot `units` UI and interactive map. Named in Appendix C. Reopen only via a **new** Doc 4 proposal after multiple clusters have Batch-001-scale unit injections — do not expand #11 later (Doc 4 rule 2).

---

## ACTOR KEY

| Tag | Meaning |
|---|---|
| **[A]** | Agent does this unattended |
| **[R]** | Ray only — publish decisions, proposal decisions, external accounts |
| **[A+R]** | Agent prepares, Ray supplies the decision or value |

## COMPLETION RULE

A step is done when its checkbox is ticked **here** and in **Appendix A**. Once ticked in both, it is settled and is never revisited, re-read, or re-verified — except on gate failure or dependency change (Doc 3 §6).

## HARD RULES (locked)

1. **No `src/` until Doc 4 #11 is APPROVED.**
2. **Never branch on `slug === 'farm-gardens'`.** Gate UI on query results / non-null fields only. Farm Gardens is the first consumer, not a special case.
3. **Cluster amenities on the public page: `state = 'published'` only.** The 19 Farm Gardens amenity rows stay draft until Ray publishes them — a separate content step, not part of this guide's gates.
4. **Do not read or write `units` from `src/`** in any section below.
5. **No new migrations** in this guide. Schema #05–#10 / migration `0002` already live.
6. **Conventions:** `createAnonClient` for public reads; admin writes via `createActionClient()` + zod; ConfidenceGate on specs; Doc 6 updated same session as code (Doc 3 §11).
7. **Multi-cluster readiness:** After this guide completes, the next cluster's same *kind* of data injection (unit_types depth, facades, amenities, media) should require data + Doc 7/staging process only — not another cluster-page rewrite.

---

# SECTION 0 — AUTHORIZATION

**Scope:** Ray decides Doc 4 #11. Nothing else in this file starts until that decision is recorded.

### 0.1 Proposal **[A]**
- [x] Doc 4 #11 written (category B — Better execution)
- [x] Raised to Ray in the same message (Doc 4 rule 6 / Doc 3 §12)
- [x] Doc 2 status block `ATTENTION NEEDED` flags #11

### 0.2 Decision **[R]**
- [x] Ray marks #11 `APPROVED` / `REJECTED` / amend notes in Doc 4
- [ ] If REJECTED → status block records stop; no further sections
- [x] If APPROVED → tick here, then start Section 1

**⛔ GATE D0 — Appendix B. Do not start Section 1 until it passes.**

---

# SECTION 1 — PUBLIC QUERY LAYER

**Scope:** typed helpers so `/clusters/[slug]` can load facades, cluster-scoped places, and media without embedding Supabase calls in the page.  
**Source of truth:** live schema + `src/types/database.ts` (already regenerated after `0002`).

### 1.1 Cluster helpers **[A]**
- [x] Extend or add beside `src/lib/queries/clusters.ts`
- [x] `listFacadeStylesForCluster(clusterId)` → `facade_style_descriptions` ordered by `sort_order`
- [x] `listPublishedClusterPlaces(clusterId)` → `places` where `cluster_id` = id, `state = 'published'`, `deleted_at` is null
- [x] Media helpers for subjects: cluster, `unit_type`, `facade_style_description` via `media_links` + `media` (storage paths only — public bucket URL composition matches existing media patterns if any; otherwise absolute public storage URL from env)
- [x] All public helpers use `createAnonClient()` only
- [x] No imports of `units` table

### 1.2 Verify **[A]**
- [x] `npx tsc --noEmit` exit 0
- [x] Farm Gardens (or any cluster with rows) returns non-empty facades/media where Batch 001 landed
- [x] A cluster with no depth data returns empty arrays — no throw

**⛔ GATE D1 — Appendix B.**

---

# SECTION 2 — PUBLIC CLUSTER PAGE

**Scope:** extend the existing page only. No new routes.

**File:** `src/app/(public)/clusters/[slug]/page.tsx`

### 2.1 Specs already on the page **[A]**
- [x] Confirm `price_from_aed` still renders under ConfidenceGate when present
- [x] Render `payment_plan` when present (new field on page if missing)
- [x] Handover actual / target unchanged behaviour

### 2.2 Unit types table **[A]**
- [x] Add columns (or sub-rows) for `unit_count` when non-null
- [x] Add floor-plan breakdown: `suite_area`, `garage_area`, `balcony_area`, `roof_terrace_area` when any non-null — behind ConfidenceGate on that unit type's `confidence`
- [x] Clusters without these values look as they do today (dashes / omitted columns OK if table stays readable)

### 2.3 Conditional sections **[A]**
- [x] **Facades** — when facade rows exist: style name, description, primary exterior image if linked
- [x] **Floor plans** — when `unit_type` media exists: show beside or under the matching unit type
- [x] **On-site amenities** — when published cluster places exist: name list (link to `/places/[slug]` if those routes resolve for cluster-scoped places; otherwise plain text — do not invent a new place template)
- [x] Match existing page rhythm (sections + table); no decorative card chrome

### 2.4 Verify **[A]**
- [x] `npm run build` exit 0
- [x] `/clusters/farm-gardens` shows depth content that exists in DB for published surfaces
- [x] `/clusters/eden` (or another published cluster without depth rows) still builds and looks correct
- [x] Draft Farm Gardens amenities do **not** appear on the public page
- [x] Doc 6 updated same session (changelog + any §4 route/query notes)

## ►► END OF CONTEXT BLOCK D-A ◄◄
- [x] Gate D1 and Gate D2 both passed
- [x] Doc 6 updated
- [x] Every checkbox in Sections 1–2 ticked here and in Appendix A
- [x] Status block updated; context cleared before Block D-B

---

# SECTION 3 — ADMIN FORMS

**Scope:** edit new columns/tables without SQL. Session client only.

**Files:** `src/app/(admin)/admin/clusters/[id]/page.tsx`, `src/lib/admin/actions.ts`, `src/lib/schema.ts`

### 3.1 Unit type fields **[A]**
- [x] Zod schemas accept `unit_count`, `suite_area`, `garage_area`, `balcony_area`, `roof_terrace_area` (optional empties → null)
- [x] `upsertUnitType` persists those columns
- [x] Admin unit-type form shows the new fields
- [x] `revalidatePath` for admin cluster + `/clusters` (existing pattern)

### 3.2 Facade style descriptions **[A]**
- [x] Create / update / delete (or soft-omit delete if not needed) for `facade_style_descriptions` on the cluster admin page
- [x] Fields: `style_name`, `description`, `sort_order`, `confidence`, `source_id`
- [x] RLS/`can_edit()` via session client — never `createAdminClient()`

### 3.3 Cluster-scoped places **[A]**
- [x] On cluster admin page **or** existing places editor: set/filter `cluster_id`
- [ ] Creating an on-site amenity sets `cluster_id` to the current cluster — *deferred: no place-create action yet; set `cluster_id` on existing place rows via `/admin/places/[id]`; cluster page lists linked places*
- [x] `state` remains editor-controlled (draft vs published) — do not auto-publish

### 3.4 Verify **[A]**
- [x] `npm run build` exit 0
- [x] Edit a Farm Gardens unit type breakdown via `/admin` → row updates; `audit_log.actor_id` non-null — *Ray confirmed 2026-08-09: admin smoke OK, images/data clean*
- [x] Doc 6 updated same session

---

# SECTION 4 — ADMIN MEDIA LINKING

**Scope:** attach existing uploads to `unit_type` / `facade_style_description` / cluster subjects.

### 4.1 Linking UI **[A]**
- [x] Extend `/admin/media` (or cluster admin) so a media row can set `media_links.subject_type` to `unit_type` | `facade_style_description` | `cluster` (and existing types unchanged)
- [x] Subject id picker constrained to the relevant table
- [x] Session client only

### 4.2 Verify **[A]**
- [x] Link (or confirm) one Farm Gardens floor plan → unit_type; public page still shows it after revalidate
- [x] `npm run build` exit 0
- [x] Doc 6 updated same session

## ►► END OF CONTEXT BLOCK D-B ◄◄
- [x] Gate D3 and Gate D4 both passed
- [x] Doc 6 updated
- [x] Every checkbox in Sections 3–4 ticked here and in Appendix A
- [x] Status block: Doc 8 complete for A+B; C remains deferred
- [x] Tell Ray Doc 8 Blocks D-A and D-B are done; 19 amenity places still need publish review if not done

---

# APPENDIX A — MASTER CHECKLIST

Mirror of every step. Tick here **and** in the section. Both ticked = settled forever.

| Step | Actor | Done |
|---|---|---|
| 0.1 Proposal written + raised | A | [x] |
| 0.2 Ray decision on #11 | R | [x] |
| 1.1 Cluster query helpers | A | [x] |
| 1.2 Query verify | A | [x] |
| 2.1 Specs / payment_plan | A | [x] |
| 2.2 Unit types table columns | A | [x] |
| 2.3 Conditional sections | A | [x] |
| 2.4 Public verify + Doc 6 | A | [x] |
| Block D-A boundary | A | [x] |
| 3.1 Unit type admin fields | A | [x] |
| 3.2 Facade admin | A | [x] |
| 3.3 Cluster places admin | A | [x] |
| 3.4 Admin forms verify | A | [x] |
| 4.1 Media linking UI | A | [x] |
| 4.2 Media verify + Doc 6 | A | [x] |
| Block D-B boundary | A | [x] |

---

# APPENDIX B — SECTION GATES

Objective assertions. Pass/fail, no interpretation. Run at section end. **A failed gate sends you back only to the step that owns the failure** — nothing else reopens.

### Gate D0 — Authorization
```
[x] Doc 4 #11 Status is APPROVED (not PENDING / REJECTED)
[x] Doc 8 status block BLOCKERS is None (or only non-#11 items)
```

### Gate D1 — Public queries
```
[x] npx tsc --noEmit                                                 → exit 0
[x] grep -n "from(\"units\")" src/lib/queries/                       → no matches
[x] grep -n "farm-gardens" src/lib/queries/clusters.ts               → no slug hardcode
[x] listFacadeStylesForCluster(farm-gardens id)                      → 2 rows
[x] listPublishedClusterPlaces(farm-gardens id)                      → 0 rows while amenities stay draft
```

### Gate D2 — Public cluster page
```
[x] npm run build                                                    → exit 0
[x] grep -n "farm-gardens" src/app/(public)/clusters/[slug]/page.tsx → no slug hardcode
[x] /clusters/farm-gardens HTML includes facade or floor-plan content when media linked
[x] /clusters/eden (or peer without depth) builds; no thrown empty-state errors
[x] Draft amenity names (e.g. "Hydroponics Greenhouse") absent from farm-gardens HTML while draft
[x] Doc 6 changelog has an entry for Block D-A
```

### Gate D3 — Admin forms
```
[x] npm run build                                                    → exit 0
[x] Admin upsert of unit_types.suite_area (or unit_count) persists
[x] select actor_id from audit_log where record_id = '<that id>' order by created_at desc limit 1 → not null
    (Ray smoke 2026-08-09: admin + public cluster depth OK)
[x] Doc 6 changelog has an entry for Section 3 (or combined D-B)
```

### Gate D4 — Admin media linking
```
[x] npm run build                                                    → exit 0
[x] media_links row exists with subject_type in ('unit_type','facade_style_description') for Farm Gardens media
[x] Doc 6 reflects media linking behaviour
```

---

# APPENDIX C — SCOPE BOUNDARY

**In this guide (after #11 APPROVED):** public cluster depth (queries + page) · admin for unit_type breakdown / facades / cluster-scoped places · media subject linking for unit_type and facade_style_description.

**Multi-cluster promise:** same surfaces work for every cluster once data is injected; no per-cluster app forks.

**Not in this guide, and not to be started here:**
- Per-plot `units` listing or filters
- Interactive map / geocoding / `units.lat`/`lng` backfill
- `/living` route-map changes for Annex L cluster categories
- Auto-publishing draft amenities
- New schema migrations
- Appendix C features from Doc 2 (forums, marketplace, listings, …)

Anything on the second list is a **new Doc 4 proposal** at most (Doc 3 §4), never an implementation under Doc 8.

**Trigger to reopen units/map:** several clusters have Batch-001-scale unit + site-plan injections → new Doc 4 proposal (do not amend #11).

---

# APPENDIX D — ALREADY TRUE (do not re-build)

| Fact | Where |
|---|---|
| Schema `0002` live (units, facades, places.cluster_id, unit_type breakdown, media subject types) | Live DB + Doc 6 |
| Farm Gardens Batch 001 promoted (146 units, 2 facades, 19 draft places, 8 media) | Live DB + `docs/clusters/farm-gardens/` |
| `listUnitTypesForCluster` already `select("*")` | `src/lib/queries/clusters.ts` |
| Types regenerated | `src/types/database.ts` |
| Annex L categories for cluster amenities | Doc 1 / Doc 4 #10 |

---

*End of Doc 8.*
