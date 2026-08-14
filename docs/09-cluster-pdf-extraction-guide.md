# DOC 9 — CLUSTER PDF EXTRACTION GUIDE

**Version:** 1.0 · 11 August 2026  
**Written by:** the agent, for agents doing per-cluster deep-dives from a local PDF folder  
**Decided by:** Ray — this guide describes extraction and staging only; promotion into `reference.md` / the live DB is Ray-authorized  
**Read first:** Doc 3 (hard rules) · Doc 7 (staging format) · this cluster’s `docs/clusters/<slug>/reference.md` and `staging.md` · Doc 6 §3 if you need the live schema map

---

## 1. PURPOSE

You are given a **folder of PDFs (and related images)** about **one cluster** (e.g. Nara, Talia, Eden). Your job is to:

1. Extract the facts, figures, and media that this project can store.
2. Stage them in that cluster’s `staging.md` for Ray to review.
3. Leave images and machine-readable tables in a local folder ready for a later promotion step.

You do **not** promote into `reference.md`, write migrations, or invent schema. Staging is reviewable intake — not live truth.

---

## 2. DOC SYSTEM (WHERE YOUR WORK LIVES)

| Artifact | Path | Who writes | Role |
|---|---|---|---|
| Valley-wide facts | `docs/01-information-reference.md` | Ray only | Overview table for migrated clusters (7 fields). Do not dump depth here. |
| Per-cluster facts | `docs/clusters/<slug>/reference.md` | Ray / `DOCS_GUARD=off` | Authoritative published facts for the cluster. **Never edit to introduce new facts.** |
| Staging (your output) | `docs/clusters/<slug>/staging.md` | Agent | Pending batches awaiting Ray review / promotion. |
| Staging format rules | `docs/07-data-staging.md` | — | Canonical batch template. Copy it; do not invent a format. |
| Schema / live system | `docs/06-system-of-record.md` + `src/types/database.ts` | — | What columns and tables exist. If a value has no home, leave it in Notes or raise Doc 4 — do not invent columns. |
| Proposals | `docs/04-proposals.md` | Agent writes, Ray decides | **Only** for schema/structure changes. Not for ordinary fact intake. |

**Flow (always):**

```
PDF folder → extract → stage batch in staging.md → tell Ray → wait
         ↘ export images + CSV alongside (not into reference.md)
```

A batch is not a fact until status is `promoted`. Until then, `reference.md` wins.

---

## 3. HARD RULES

1. **One cluster per run.** Do not pull facts from other clusters’ folders or pages to “fill gaps.”
2. **Never invent.** If a figure is not in the folder (or an explicitly allowed corroboration Ray asked for), it is `null`. No estimates, no “approximately,” no carrying over from a similar cluster.
3. **Web search is not a source of truth** (Doc 3 §2). You may use it only if Ray asks, and any web-sourced figure must be tagged `unverified` and called out in Notes.
4. **Confidence enum only:** `official` · `corroborated` · `unverified`. There is no `derived` tag — map geometric/OCR/colour classifications to `unverified` unless independently corroborated.
5. **Do not edit `reference.md`** to add facts. Stage first.
6. **Do not propose schema** inside a staging batch as if it were approved. If something truly has no column, note it and (if it passes Doc 3 §4) open a Doc 4 proposal — then stop on dependent work.
7. **Raise the batch to Ray in the same message** you finish staging (Doc 3 §12 / Doc 7 rule 6).
8. **Broker mirrors** of Emaar artwork: usable, but note provenance. Prefer InDesign/Emaar originals in the folder when both exist.

---

## 4. BEFORE YOU EXTRACT

1. Confirm the cluster **slug** (e.g. `nara`, `farm-gardens`) and open:
   - `docs/clusters/<slug>/reference.md` — what is already known
   - `docs/clusters/<slug>/staging.md` — prior batches (do not rewrite promoted ones)
2. Inventory the folder: list every PDF/image, page counts, which look like brochure / floor plans / site plan / payment plan / factsheet.
3. Identify the **source** label for staging (usually Emaar Properties). Use the existing `sources.id` from the cluster row when known; otherwise note “source row TBD” and still tag confidence.
4. Skim Farm Gardens + Eden staging for shape examples:
   - `docs/clusters/farm-gardens/staging.md` (villa / cosmetic façades)
   - `docs/clusters/eden/staging.md` (townhouse / layout-determining façades + plexes)

---

## 5. WHAT TO LOOK FOR (PRIORITY ORDER)

Extract in this order. Stop and stage what you have if a later tier is blocked — do not guess to unblock it.

### P0 — Core product data (always attempt)

| # | Look for | Capture as | Notes |
|---|---|---|---|
| 1 | **Facade / collection names** | `clusters.facade_styles` list + verbatim brochure blurbs | Keep each named style separate (e.g. Aston ≠ Charm) even if interiors match. |
| 2 | **Distinct floor-plan layouts** | One row per brochure layout: style × bedrooms × label (A/B/C…) | Prefer Eden naming: `unit_types.layout = '{style}-{label}'` (e.g. `palma-a`). |
| 3 | **BUA figures** | Per layout: `bua_min` / `bua_max` from the layout’s position table; per plot later → `units.bua` | BUA often varies by plex position inside the same layout letter. Never force one scalar on the type if the PDF shows a range. |
| 4 | **Bedrooms, bathrooms, maid’s room** | `bedrooms`, `bathrooms`, `maids_room` | Bathroom *counts* are often inferred from labelled rooms — mark `unverified` if not printed as a count. |
| 5 | **Unit counts** | Cluster total; per-layout `unit_count` when derivable | Cluster total must be homes, not “plots including substations,” unless every plot is residential. |
| 6 | **Numbered site / cluster plan** | Plot inventory → CSV (see §7) | Without this, **skip `units` / `plexes`** rather than inventing. |
| 7 | **Plex / row structure** (townhouses) | Plex size, TH positions, style sequence, `street_side` | `street_side` is **page-relative**: `up` \| `down` \| `left` \| `right` only — not compass N/S/E/W. |
| 8 | **Facade copy** | `facade_style_descriptions.description` | Verbatim from brochure. |
| 9 | **Floor-plan + facade images** | Files on disk for later `media` / `media_links` | See §8. |

### P1 — Cluster page depth

| # | Look for | Capture as | Notes |
|---|---|---|---|
| 10 | **On-site amenities** (pins inside *this* cluster’s boundary) | Cluster-scoped `places` rows | Name + suggested Annex L `category` / `subcategory`. Do **not** attribute Valley-wide destinations (Golden Beach, Town Centre, Sports Village, Kids’ Dale, Pavilion, etc.) to the cluster. |
| 11 | **Register fields** | `unit_count`, `single_row`, handover dates, phase, product type | Flag conflicts with current `reference.md`. Stale estimated handovers → note “needs current source.” |
| 12 | **Payment plan** | `clusters.payment_plan` text | Keep instalment schedule as sourced; mark estimated construction dates. |
| 13 | **Starting prices** | `clusters.price_from_aed` | Only if in the folder (or Ray-approved source). Third-party web → `unverified` + Notes. |

### P2 — Useful if present, null if absent

| # | Look for | Capture as |
|---|---|---|
| 14 | Plot / land sizes | `unit_types.plot_min` / `plot_max` |
| 15 | Suite / garage / balcony / roof terrace **areas** | `suite_area`, `garage_area`, `balcony_area`, `roof_terrace_area` |
| 16 | Brochure positioning paragraphs usable as `summary` / `body` | Proposed copy in staging (Ray decides whether to replace existing positioning) |
| 17 | Master plan / location / context maps | Image exports for cluster `media` |

### Do **not** prioritize (usually skip for storage)

| Item | Why |
|---|---|
| Per-room dimensions (living 4.1×4.0, etc.) | Not stored. Floor-plan images carry that detail. Optional one-line Notes if it proves two brochure “styles” share an interior. |
| Drive-time marketing claims | Often excluded (Farm Gardens precedent). |
| DLD / Oqood / admin fee schedules | Only if Ray asks and a real source exists. |
| True-north compass bearings | We store page-relative `street_side`, not bearings. |
| Third-party “N clusters” wording that conflicts with our `plexes` count | We store **plexes**, not a second “cluster group” entity. Do not invent a grouping table to match broker copy. |
| Schema inventions (`style_source` column, `derived` confidence, mirror-of FKs) | Use existing `confidence` / CSV notes / second media link for mirrors (see §6). |

---

## 6. HOW TO MODEL INTO OUR SHAPE

You are staging **proposed rows**, not redesigning the database.

### Facades vs layouts

- **Facades** always stay distinct named styles: `clusters.facade_styles` + one `facade_style_descriptions` row each + later `units.facade_style`.
- **Layouts** are `unit_types` rows. Use separate rows when the brochure names separate layouts (including when two façade names share identical interiors — keep both layout rows if both names appear on plans; mention the shared-interior finding in Notes).
- Do **not** collapse two façade names into one style because interiors match.

### Cosmetic vs layout-determining styles

- If each façade has its own floor plans → Eden pattern: many `unit_types`, `layout = '{style}-{label}'`.
- If façades share one interior per bedroom count → Farm Gardens pattern: fewer `unit_types`; style lives on `units.facade_style` + facade description rows.
- Hybrids (some styles shared, one distinct) are fine: follow the brochure’s named layouts; keep façade identities separate.

### BUA

- Type level: `bua_min` / `bua_max` for that layout’s published range.
- Unit level: exact `units.bua` when the site plan + key plans resolve a plot.
- Do not invent a new BUA child table.

### Mirrors / handings

- Same template, flipped drawing → **one** `unit_types` row; second floor-plan `media` with caption “(mirrored)”, `is_primary = false`.
- Brochure gives two labels that are mirrors (e.g. A vs D) → **two** `unit_types` rows. No `is_mirror_of` column.

### Plexes & units (townhouses)

Only when a numbered site plan exists and styles/layouts can be resolved without guessing:

- `plexes`: `plex_size`, `street_side` (`up`/`down`/`left`/`right`), optional plot `range_start`/`range_end`, confidence.
- `units`: `unit_number` / `plot_number`, `unit_type_id` (via layout key), `facade_style`, `bua`, `plex_id`, `th_position`, confidence.
- Colour-/geometry-classified fields → row `confidence = unverified` (Eden / Farm Gardens precedent).
- Standalone villas (Farm Gardens): leave plex columns null.

### Amenities → `places`

- One row per on-site amenity instance; `cluster_id` = this cluster.
- Categories from Doc 1 Annex L only. Cluster-internal set includes: `recreation`, `nature`, `family`, `farming`, `wellness`, `gathering`, plus existing `mosque`, etc.
- Suggest category/subcategory in staging; Ray confirms before publish.
- Default new amenity rows to `state = draft` unless Ray says otherwise.
- Parent/child (e.g. Wellness Centre → gym) only when the source itemizes them separately.

### Register / copy

- Propose field-level diffs against current `reference.md`.
- Leave `positioning` unchanged unless Ray asks — brochure `summary`/`body` can still be proposed beside it.

---

## 7. MACHINE-READABLE DELIVERABLES

Put working files under the cluster docs folder (create if needed), e.g. `docs/clusters/<slug>/floorplans/` (beside `staging.md` / `reference.md`):

| File | When | Contents |
|---|---|---|
| `<slug>-units.csv` | Site plan resolved | Prefer columns aligned with Eden: `unit_number`, `plot_number`, `facade_style`, `bedrooms`, `layout`, `bua`, `plex_range` or plex id key, `plex_size`, `street_side`, `th_position`. Optional extra columns for *your* provenance (e.g. `style_source`) are fine in the CSV; they are **not** DB columns — summarize provenance in the staging Notes. |
| Image exports | Always attempt P0 images | See §8. |
| Optional extraction notebook / notes file | If helpful | Not a substitute for `staging.md`. |

---

## 8. IMAGES TO EXPORT

Minimum set for a depth batch:

1. **One clean floor-plan image per `unit_types` layout** (GF+FF composed or paired; crop out key-plan chrome / legal boilerplate when practical).
2. **One primary exterior render per façade style.**
3. **Cluster site / plot map** (the numbered plan you used).
4. Optional: location map, Valley context map, mirrored floor plans as secondary media.

Link targets at promotion time (you only prepare files + describe links in staging):

| Media | `media_links.subject_type` |
|---|---|
| Floor plans | `unit_type` |
| Facade exteriors | `facade_style_description` |
| Site / master maps | `cluster` |

No per-physical-unit photos.

---

## 9. STAGING PROCESS (YOUR OUTPUT)

### 9.1 Open / create the cluster staging file

`docs/clusters/<slug>/staging.md` — follow Doc 7 rules and entry format exactly.

If the file does not exist yet, create it with the same header/rules block used by `docs/clusters/nara/staging.md` (cluster name + pointer to Doc 7), then add the batch.

### 9.2 Add one batch per intake

```markdown
## Batch NNN — <short description> (YYYY-MM-DD)

**Source:** <files in the folder, retrieval date>
**Source ID:** <sources.id> (<label>)
**Confidence:** <overall; call out exceptions in Notes>
**Status:** staged

### Proposed reference.md diff
- Register / unit_types / facades / amenities / payment / prices / … as field-level bullets or tables
- Point to CSV / image folder paths for bulk unit/plex data

### Notes
- Provenance caveats (broker mirror, colour classification, stale handover, …)
- What was left null and why
- Anything that would need a Doc 4 schema change (should be rare)

### Promotion
**Promoted:** [ ]
**Date:**
**By:**
```

Use the next free batch number for that cluster. Never edit a `promoted` batch — supersede with a new number.

### 9.3 Confidence discipline inside the batch

| Situation | Tag |
|---|---|
| Emaar PDF text / official brochure figures | `corroborated` or `official` as appropriate |
| Two independent extractions sources agree (e.g. two PDFs, same plot list) | `corroborated` |
| Inferred bathroom counts, colour-classified styles, OCR geometry | `unverified` |
| Third-party websites | `unverified` + explicit Notes (or omit if Ray did not ask) |

### 9.4 Tell Ray

Same message as the finished batch: batch number, cluster slug, what is solid vs blocked, path to CSV/images, and any decisions needed (amenity publish, handover, prices).

**Stop.** Do not promote, do not edit `reference.md`, do not run SQL against production unless Ray explicitly authorizes that as a separate step.

---

## 10. DONE CHECKLIST

- [ ] Folder inventoried; sources named
- [ ] Compared against current `reference.md` (what changes vs what confirms)
- [ ] P0 layouts + façade copy extracted (or explicitly blocked with reason)
- [ ] BUA captured as ranges and/or per-plot — not a misleading single number
- [ ] Site plan either fully resolved to CSV **or** units/plexes explicitly skipped
- [ ] Amenities listed only if inside the cluster boundary
- [ ] Images exported (or listed as located-but-not-exported with page references)
- [ ] Batch written to `docs/clusters/<slug>/staging.md` in Doc 7 format
- [ ] No `reference.md` fact edits; no undocumented schema
- [ ] Ray notified in the same turn

---

## 11. QUICK REFERENCE — TARGET FIELDS

```
clusters:        facade_styles, unit_count, single_row, handover_*, price_from_aed,
                 payment_plan, summary, body, confidence, source_id
unit_types:      bedrooms, label, layout, bua_min, bua_max, plot_min, plot_max,
                 unit_count, bathrooms, maids_room, ground_floor_bedroom,
                 suite_area, garage_area, balcony_area, roof_terrace_area,
                 corner_unit, private_pool, notes, confidence, source_id
facade_style_descriptions: style_name, description, confidence, source_id
places:          name, category, subcategory, cluster_id, state, confidence, source_id
plexes:          plex_size, street_side, range_start, range_end, confidence, source_id
units:           unit_number, plot_number, unit_type_id, facade_style, bua,
                 plex_id, th_position, confidence, source_id
media + media_links: floorplan/photo/document → unit_type | facade_style_description | cluster
```

Column names are absolute in `src/types/database.ts`. If a name above disagrees with that file, **the generated types win**.

---

## 12. EXAMPLES IN-REPO

| Pattern | Read |
|---|---|
| Villa, cosmetic façades, amenities, payment, units CSV | `docs/clusters/farm-gardens/staging.md` + `docs/clusters/farm-gardens/floorplans/` |
| Townhouse, layout-determining styles, plexes, units CSV | `docs/clusters/eden/staging.md` + `docs/clusters/eden/floorplans/` |
| Per-plot units pipeline (master arrays, orientation, colour) | [`docs/10-cluster-extraction-playbook.md`](10-cluster-extraction-playbook.md) |
| Empty staging shell | `docs/clusters/nara/staging.md` (until a batch lands) |
| Format rules | `docs/07-data-staging.md` |

---

*End of Doc 9. Update when schema conventions for cluster depth change (Doc 4) or when Ray amends intake policy.*
