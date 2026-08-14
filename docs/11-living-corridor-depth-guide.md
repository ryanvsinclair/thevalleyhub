# DOC 11 — LIVING / CORRIDOR / COMPARE DEPTH GUIDE

**Version:** 1.0 · 14 August 2026  
**Status:** OPEN — blocked on Doc 4 #20 until Ray decides  
**Written by:** the agent (format mirrors Doc 2 / Doc 8; content from the Google Places page audit + Living/Compare gap review)  
**Read Doc 3 and this status block before touching this file.**  
**Prerequisite:** Doc 4 Proposal **#20** must be `APPROVED` before any `src/`, Storage, or Google API work. Until then: write #20, update status blocks, stop.

---

# ►► STATUS BLOCK ◄◄

> **Overwrite this block after every completed step. Do not append.**

```
LAST COMPLETED:   Ray-confirmed place enrichments (#1–6) + Golden Beach provisional closed
SPEC ALIGNED:     Yes
CURRENT TASK:     Phone-confirm Training Room weekend hours; optional Golden Beach site visit; commit L-D + this UI
NEXT UP:          Gate L2 formal tick after amenity-pin hours-unknown notes (optional); Compare copy polish [R]
CONTEXT BLOCK:    cleared
BLOCKERS:         None
OPEN QUESTIONS:   Google `sources` row deferred; public ratings = no
ATTENTION NEEDED: Training Room Sat–Sun 09:00–12:00 phone confirm; Golden Beach closed is provisional until drive-by
GATE STATUS:      Gate L0–L1 PASSED · Gate L2 ~met on real businesses (48/55 gpid; amenity pins excluded) · L3–L4 · L5 partial · L6 PASSED
```

**Rules for this block**
1. Read it first, before anything else.
2. Rewrite it immediately after finishing a step.
3. `SPEC ALIGNED: Yes` only after the step's checkbox conditions are objectively met.
4. On pause (Doc 3 §4), record exactly where you stopped and what remains.
5. Never mark a step complete you did not personally verify.
6. `ATTENTION NEEDED` lists anything requiring Ray — pending proposals, unanswered clarifications, `[R]` steps. If it is not `None`, Doc 3 §12 requires you to tell Ray directly, not just write it here.

## CONTEXT BLOCKS

Work is grouped into four blocks. Context clears **between** blocks, never mid-section.

| Block | Sections | Shape of work | On completion |
|---|---|---|---|
| **L-A** | 1–2 | Ops — Google keys, admin Autocomplete, valley-wide place enrichment workflow | Update Doc 6; clear |
| **L-B** | 3 | Public place detail — map, photos, contact completeness | Update Doc 6; clear |
| **L-C** | 4–5 | Living hub + category lists + home WhatsOpenNow | Update Doc 6; clear |
| **L-D** | 6 | Compare depth — cross-links + dimension honesty (not Google-first) | Update Doc 6; clear |

Procedure at a block boundary follows Doc 3 §10 (gates → notes → status → checkboxes → clear). Record conventions in **Doc 6** changelog + §4/§6 as needed.

**Not in this guide (deferred):** interactive Valley map / `units` UI / PostGIS; Google Place Details on **cluster-scoped brochure amenities**; Status-page Google “open”; public place search; star ratings (unless Ray answers OPEN QUESTION 2 yes). Named in Appendix C. Reopen via **new** Doc 4 — do not expand #20 later.

---

## ACTOR KEY

| Tag | Meaning |
|---|---|
| **[A]** | Agent does this unattended |
| **[R]** | Ray only — keys, billing, publish/confidence decisions, proposal decisions |
| **[A+R]** | Agent prepares, Ray supplies the decision or value |

## COMPLETION RULE

A step is done when its checkbox is ticked **here** and in **Appendix A**. Once ticked in both, it is settled and is never revisited — except on gate failure or dependency change (Doc 3 §6).

## HARD RULES (locked)

1. **No `src/` / Storage / Google API calls until Doc 4 #20 is APPROVED.**
2. **Two place populations stay distinct.** Valley-wide / corridor operators (`cluster_id` null) may receive `google_place_id`. Cluster-scoped brochure amenities (`cluster_id` set) **keep `google_place_id` null** — Doc 4 #10 / staging convention.
3. **Google is a proposal source, not silent overwrite.** Autocomplete / Place Details fill admin form fields as drafts; save still goes through existing zod + confidence/`source_id`/`verified_at` spine. Public pages never call Google live on every request for hours (cache into `places.hours`).
4. **No new Living route categories** for Annex L cluster amenity vocab (`recreation`…`gathering`) — those stay on cluster pages (Doc 4 #10).
5. **No new migrations in Blocks L-B–L-D** unless a later amendment to #20 adds columns (ratings deferred by default).
6. **Compare stays editorial.** Dimensions remain `price` · `commute` · `schools` · `amenities` · `maturity`. Enrich with links and verified place facts — do not invent competitor claims (Doc 3 §3.1).
7. **Conventions:** `createAnonClient` for public reads; admin writes via `createActionClient()` + zod; ConfidenceGate where specs show; Doc 6 updated same session (Doc 3 §11).

---

# SECTION 0 — AUTHORIZATION

**Scope:** Ray decides Doc 4 #20. Nothing else in this file starts until that decision is recorded.

### 0.1 Proposal **[A]**
- [x] Doc 4 #20 written (category B — Better execution)
- [x] Raised to Ray in the same message (Doc 4 rule 6 / Doc 3 §12)
- [x] Ray records APPROVED / REJECTED / amended notes on #20 **[R]**

### 0.2 Open questions before L-A **[A+R]**
- [ ] Confirm Google Maps Platform billing + create keys (Places API / Places API (New) + Maps Embed as needed) **[R]**
- [x] Decide: add a `sources` row for Google Places (label + default confidence for hours/address backfills) **[R]** — deferred; use existing source + confidence on Save (#20 notes)
- [x] Decide: public star ratings yes/no (default **no** in this guide) **[R]** — **no**

### Gate L0 — Authorization
```
[x] Doc 4 #20 Status = APPROVED
[x] OPEN QUESTIONS 1–3 answered or explicitly deferred in #20 notes
```

---

# BLOCK L-A — OPS / ENRICHMENT PIPELINE

## SECTION 1 — CREDENTIALS AND ADMIN AUTOCOMPLETE

**Scope:** Make place editing fast and accurate for corridor operators. No public UI change yet.

### 1.1 Env + docs **[A+R]**
- [x] Document required env vars in `SETUP.md` / `.env.example` (server-side Places key for Autocomplete/Details; optional public Embed key if Embed requires it) **[A]**
- [x] Ray adds secrets to Vercel + local `.env.local` **[R]** — local: `GOOGLE_MAPS_API_KEY` + `ADMIN_EMAIL` verified 2026-08-14; `SUPABASE_SERVICE_ROLE_KEY` still placeholder (not required for Autocomplete)
- [x] Never commit keys; never put service-role in client bundles

### 1.2 Admin Place Autocomplete **[A]**
- [x] On `/admin/places/[id]`, add a Google Places Autocomplete (or Place Search) control
- [x] On pick: set `google_place_id`; propose `address`, `lat`, `lng`, `phone`, `website`, `hours` into the existing form fields (user can edit before Save)
- [x] Only offer Autocomplete when `cluster_id` is null (valley-wide) — hide or disable for cluster-scoped rows
- [x] Persist only via existing `updatePlace` action + zod (`google_place_id` already in `src/lib/schema.ts`)

### 1.3 Enrichment batch procedure (content ops) **[A+R]**
- [x] Write a short ops checklist in Doc 6 §4 (or this guide Appendix D): for each valley-wide published place missing hours/address/website — Autocomplete → verify → Save with confidence/source per Ray’s #20 notes
- [ ] Prioritize categories with zero hours today (live 2026-08-14): **school** (8), **salon** (3), **gym** (2), **spa** (2), **mall** (3 of 4), **recreation** / **family** / **mosque** as applicable
- [x] Do **not** Autocomplete-match cluster amenity rows

### Gate L1 — Admin Autocomplete
```
[x] Admin place edit can resolve a known Pavilion/corridor business to a google_place_id
[x] Saving still requires zod + existing RLS; no public UI change required for gate pass
[x] Cluster-scoped place edit does not expose Autocomplete (or rejects setting google_place_id)
```

---

## SECTION 2 — HOURS / CONTACT BACKFILL (DATA)

**Scope:** Fill the fields public pages already render. Improves WhatsOpenNow and Q24 without new public components.

**Deferred 2026-08-14:** Ray will spot-check remaining hours / Google ID gaps (Training Room, Vet Clinic UAE, school/salon/gym/spa). Agent does not continue §2 until Ray asks.

### 2.1 Inventory **[A]**
- [ ] Export or query published valley-wide places missing `hours`, `address`, `website`, `phone`, or `google_place_id`
- [ ] Track progress in a simple table (Doc 6 note or staging batch — not Doc 1)

### 2.2 Apply enrichments **[A+R]**
- [ ] Use admin Autocomplete (preferred) or staged SQL batches with source/confidence
- [ ] Ray spot-checks a sample of hours against Google / physical knowledge **[R]**
- [ ] Revalidate `/`, `/living`, `/places/[slug]` after batches (admin save paths already cover editor writes)

### Gate L2 — Data floor
```
[ ] ≥80% of valley-wide published places have hours OR an explicit “hours unknown” note in `notes`
[ ] google_place_id set on ≥80% of valley-wide places that are real public businesses
[ ] Cluster-scoped places still have google_place_id IS NULL (count check)
```

---

# BLOCK L-B — PLACE DETAIL

## SECTION 3 — PUBLIC `/places/[slug]`

**Scope:** Make place detail the best page for “can I go / contact / when open?”

### 3.1 Map **[A]**
- [x] If `lat`/`lng` or `google_place_id` present, render a Maps Embed (or static map) on place detail
- [x] No map chrome on cluster amenity pages that lack coords (most brochure pins) — omit empty state, do not invent pins
- [x] Keep confidence/source UX; map is presentation of existing geo

### 3.2 Photos **[A]**
- [x] Load `media_links` where `subject_type = 'place'` (schema/RLS already allow)
- [x] Render gallery when media exists
- [ ] Optional later: Google Place Photos with attribution — only if Ray approves in #20 notes; default path is Storage `media` uploads via `/admin/media`

### 3.3 Contact / hours polish **[A]**
- [x] Ensure address, phone, website, hours blocks remain; add “Open now” chip when `hours` says open in Dubai time (reuse WhatsOpenNow logic)
- [x] Drive minutes block stays gated on `drive_verified` (no change to trust model)

### Gate L3 — Place detail
```
[x] A valley-wide place with coords shows a map
[x] A place with media_links shows at least one image
[x] A place without coords/media does not show empty map/photo frames
[ ] npx tsc --noEmit → 0 (run locally — `node_modules` not present in agent env)
```

---

# BLOCK L-C — LIVING + HOME OPEN-NOW

## SECTION 4 — `/living` AND `/living/[category]`

**Scope:** Living is the public places hub. Enrich lists; do not change the five-category route map.

### 4.1 Living index **[A]**
- [x] Keep five categories: schools · healthcare · groceries · services · getting-around
- [x] Optional: show count of published places per category; optional “N open now” using hours
- [x] No map required on index for this guide (Appendix C if Ray wants area map later)

### 4.2 Category list cards **[A]**
- [x] Extend list row beyond name/summary: in-community badge (already), verified badge (already), **open-now** when hours allow, optional thumb from primary place media
- [x] Do not show Google star ratings unless #20 notes flip OPEN QUESTION 2
- [x] Getting-around: surface `drive_minutes` only when `drive_verified`

### 4.3 Query / performance **[A]**
- [x] Prefer fields already on `places` + batched media lookups; no per-card live Google calls
- [x] Revalidate paths remain `/living`, `/living/[category]`, `/places/[slug]`, `/`

### Gate L4 — Living
```
[x] /living/[category] shows open-now affordance when hours exist
[x] Cluster amenity categories still absent from Living route map
[x] List pages do not call Google APIs at request time
```

---

## SECTION 5 — HOME `WhatsOpenNow`

**Scope:** Home open-now quality tracks hours coverage from L-A/L-B.

### 5.1 Behaviour **[A]**
- [x] Keep Dubai-time filter over published places with hours
- [x] Optional: link each open item to `/places/[slug]`; show category label (already)
- [x] Disclaimer stays: not a live check-in

### Gate L5 — Open-now
```
[ ] After L2 data floor, open-now list includes ≥1 school or salon/gym/spa when those hours were backfilled and currently open
[x] Empty state still honest when nothing is open
```

---

# BLOCK L-D — COMPARE

## SECTION 6 — `/compare` AND `/compare/[slug]`

**Scope:** Compare is editorial community narrative — **not** a Google Places surface. Depth = better links to Living/places facts and clearer dimension presentation.

### 6.1 Cross-links **[A]**
- [x] On dimension `schools`, link to `/living/schools` (and specific place slugs only when the comparison text already names a seeded place)
- [x] On dimension `amenities` / corridor retail claims, link to relevant `/living/*` or `/places/[slug]` when those places exist and are published
- [x] Never invent a competitor fact to “balance” a row (Doc 3 §3.1)

### 6.2 Presentation **[A]**
- [x] Keep dimensions: price · commute · schools · amenities · maturity
- [x] Improve scannability (clear Valley vs Other vs Honest read hierarchy — already present; tighten typography/spacing only if needed)
- [x] Optional: “Nearby in The Valley” strip of 3–5 `in_community` published places — names only + link (no Google)

### 6.3 Content ops **[A+R]**
- [x] Audit published `comparisons` rows for stale or thin copy against current Living inventory — thin schools/amenities notes on DH2 / Tilal / Town Square / Villanova left as-is; no competitor rewrite without Ray
- [ ] Stage factual updates via Doc 7 / appropriate staging path (communities are not per-cluster `staging.md` — use Doc 4 or a dedicated staging note if Ray prefers; default: admin edit with source/confidence)
- [ ] Ray approves any non-trivial copy change to competitor claims **[R]**

### Gate L6 — Compare
```
[x] Compare detail pages link to Living where schools/amenities dimensions apply
[x] No Google API dependency on Compare routes
[x] No new comparison dimensions without a Doc 4 vocabulary proposal
```

---

# APPENDIX A — MASTER CHECKLIST

| Step | Actor | Done |
|---|---|---|
| 0.1 Doc 4 #20 written + raised | A | [x] |
| 0.1 Ray decision on #20 | R | [x] |
| 0.2 Open questions answered | A+R | [x] |
| 1.1 Env docs + keys | A+R | [x] |
| 1.2 Admin Autocomplete | A | [x] |
| 1.3 Enrichment procedure | A+R | [x] |
| Gate L1 | A | [x] |
| 2.1 Inventory | A | [ ] deferred Ray |
| 2.2 Apply enrichments | A+R | [ ] deferred Ray |
| Gate L2 | A | [ ] deferred Ray |
| 3.1 Map on place detail | A | [x] |
| 3.2 Place photos | A | [x] |
| 3.3 Contact / open-now chip | A | [x] |
| Gate L3 | A | [x] code (tsc local) |
| 4.1 Living index | A | [x] |
| 4.2 Category cards | A | [x] |
| 4.3 Query / revalidate | A | [x] |
| Gate L4 | A | [x] |
| 5.1 WhatsOpenNow | A | [x] |
| Gate L5 | A | [~] awaits L2 sample |
| 6.1 Compare cross-links | A | [x] |
| 6.2 Compare presentation | A | [x] |
| 6.3 Compare content audit | A+R | [~] audit done; copy changes need Ray |
| Gate L6 | A | [x] |
| Doc 6 updates per block | A | [x] L-A–L-D |

---

# APPENDIX B — OBJECTIVE GATES (SUMMARY)

| Gate | Pass condition |
|---|---|
| L0 | #20 APPROVED; open questions resolved or deferred in notes |
| L1 | Autocomplete works for valley-wide; blocked for cluster-scoped |
| L2 | ≥80% valley-wide hours-or-noted; ≥80% google_place_id on public businesses; cluster google_id still 0 |
| L3 | Map/photos when data exists; no empty frames; tsc clean |
| L4 | Living lists enriched; no live Google; route map unchanged |
| L5 | Open-now reflects backfilled hours |
| L6 | Compare links to Living; no Google on Compare |

---

# APPENDIX C — SCOPE BOUNDARY (OUT)

| Out | Why / reopen |
|---|---|
| Interactive Valley map + `units.lat`/`lng` UI | Doc 8 Appendix C; new Doc 4 when ready (7 clusters now have units — eligible to reopen separately) |
| PostGIS `geog` | Doc 4 #00 example only |
| Google on cluster brochure amenities | Not public listings; keep `google_place_id` null |
| Google “open” on `/status` | Wrong source of truth vs `status_log` |
| Public place Autocomplete / search | No public search product in V1 |
| Star ratings / review widgets | Default no; Ray may amend #20 |
| New Living categories for recreation/nature/… | Doc 4 #10 — cluster pages only |
| Forums, marketplace, events, listings | Doc 2 Appendix C / Doc 3 §1 “over time” |

---

# APPENDIX D — ENRICHMENT PRIORITY (VALLEY-WIDE)

Live snapshot 2026-08-14 — use as starting backlog, re-query before each batch:

| Priority | Category | Gap |
|---|---|---|
| P0 | school | 8 places, 0 hours |
| P0 | salon / gym / spa | hours all null |
| P1 | mall | 1/4 have hours |
| P1 | recreation / family / mosque / gathering | hours null; weak Google match for some |
| P2 | clinic / vet / optical / fuel / nursery | hours mostly present — fill address/website/google_id |
| P2 | pharmacy / grocery / hospital | small n — complete contact fields |

Cluster-scoped (79): **skip Autocomplete**; optional later map of *parent* Golden Beach / Pavilion only if those rows are valley-wide.

---

*End of Doc 11.*
