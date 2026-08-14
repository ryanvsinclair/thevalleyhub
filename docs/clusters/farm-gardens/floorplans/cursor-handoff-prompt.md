I'm picking up work from a previous Claude Code session that did a full data deep-dive on the Farm Gardens cluster and a docs restructure. Everything is committed on the branch `claude/farmgardens1-data-export-5a3113`, not yet merged into `main`. Here's what happened and where to start.

## What was done, and why

**1. Extracted and reconciled Farm Gardens data from 6 official Emaar PDFs.** Found the live database had a real error (`unit_types.bua_max = 10004` for the 5-bed — that's actually the plot area, not BUA; real BUA is 5,657 sq ft) plus missing price, payment plan, and unit specs. All of this is staged, sourced, and confidence-rated in `docs/clusters/farm-gardens/staging.md` (Batch 001) — nothing has been promoted into the live database yet.

**2. Designed a schema extension** — `docs/schema-current.sql` (renamed from `docs/0001_init.sql`, Doc 4 #16) documents the full target schema; the actual delta to push live is `supabase/migrations/0002_farm_gardens_units_places.sql` (a proper new migration — `0001_init.sql` in `supabase/migrations/` is untouched, already applied to the live project, do not re-run it). Four approved Doc 4 proposals, read these for the full reasoning, not just the diff:
- **#05** — `unit_types.unit_count` (units of a specific bedroom count within a cluster)
- **#06** — floor-plan breakdown columns on `unit_types` (`suite_area`, `garage_area`, `balcony_area`, `roof_terrace_area`); `places.cluster_id` + `parent_place_id` + `google_place_id` (cluster-scoped amenities become their own `places` rows — NOT a shared catalog, each cluster's pool/gym/etc. is its own row with its own photos, because a shared-row design can't hold per-instance photos); a new `units` table (individual physical units — `unit_number`, `plot_number`, `facade_style`, `lat`/`lng` for a planned interactive map)
- **#07** — `facade_style_descriptions` table (per-cluster, since style names like "Horizon"/"Earth" aren't shared vocabulary across clusters)
- **#08** — `media_links.subject_type` gains `'unit_type'` and `'facade_style_description'`, so floor-plan/style images link to the shared template they depict instead of being duplicated across every matching individual unit
- **#10** — extends Doc 1 Annex L's `places.category` controlled vocabulary with `recreation, nature, family, farming, wellness, gathering` (cluster-internal amenities are a different kind of place than Annex L's existing third-party-business list) — needed because the Batch 001 promotion SQL originally used unvetted category values; fixed and formalized after Cursor's review caught it

**None of this schema has been pushed to the live Supabase project yet.** No credentials were available in that session's worktree. Also fixed after Cursor's review: `#05`'s `clusters.amenities text[]` half is now marked `SUPERSEDED BY #06` in `docs/04-proposals.md` (was left stale), and `docs/06-system-of-record.md` has a Changelog entry + a "pending, not yet live" note in §3 for this whole batch of work, per Doc 3 §11's same-session requirement.

**3. Extracted 8 images** from the PDFs (4 floor plans, site plan, master plan, Horizon/Earth exteriors) — sitting in `docs/clusters/farm-gardens/floorplans/`, not yet uploaded to Supabase storage.

**4. Classified all 146 individual Farm Gardens units** (plot number, facade style, bedroom type) directly from the site-plan PDF — plot numbers read reliably from the PDF text layer; facade style and unit type classified by pixel analysis, validated (unit-type split matches the published 79/67 exactly; three hardest cases individually confirmed by Ray). Full dataset: `docs/clusters/farm-gardens/floorplans/units_style_type.csv`, `confidence = unverified` on the classified fields.

**5. Wrote one consolidated, ready-to-run SQL script**: `docs/clusters/farm-gardens/floorplans/farm-gardens-batch-001-promotion.sql`. Applies everything — cluster fields, `unit_types` corrections, `facade_style_descriptions`, 19 amenities as `places` rows, all 146 `units`, and `media`/`media_links` for the 8 images. Requires the schema pushed first; the media section specifically needs `psql` (it uses `\gset` to chain `returning id` into the next insert).

**6. Restructured the docs.** Doc 1 was a single growing file covering every cluster; Doc 7 was a single growing staging log. Both would've gotten unworkable across 15+ more clusters over the build-out, so: each cluster now gets `docs/clusters/<slug>/reference.md` (published facts, guarded — same protection as Doc 1) and `docs/clusters/<slug>/staging.md` (facts pending promotion, agent-writable — same as Doc 7 was). Doc 1's Annex C is now a slim 7-field overview per cluster pointing to `reference.md`. **Proposal #09** extended the pre-commit guard (`scripts/pre-commit`) to protect the new `reference.md` files — already applied and tested. 7 clusters migrated: Eden, Nara, Talia, Orania, Elora, Lillia, Farm Gardens. Read `docs/04-proposals.md` (#09) and `docs/03-agent-operating-rules.md` §2/§9 for the exact rules.

## Where to start

1. `git merge claude/farmgardens1-data-export-5a3113` into `main`.
2. Push the schema: apply `supabase/migrations/0002_farm_gardens_units_places.sql` to the live project (you have the credentials this session didn't). Verify the `media_links_subject_type_check` constraint name matches the live database first (`\d media_links` in psql) — it's commented in the migration.
3. Regenerate `src/types/database.ts`.
4. Upload the 8 images in `docs/clusters/farm-gardens/floorplans/` to the `media` storage bucket — exact paths and a suggested convention are documented at the bottom of `farm-gardens-batch-001-promotion.sql`.
5. Run `farm-gardens-batch-001-promotion.sql` via `psql` against the live database.
6. Run the sanity-check queries at the bottom of that same file (146 units, 79/67 bedroom split, 72/74 style split) to confirm it landed correctly.
7. Mark Batch 001 `Promoted` in `docs/clusters/farm-gardens/staging.md` (date + who ran it).

## What's NOT done — this is where the actual coding starts

Nothing in `src/` has been touched. Schema and data only. Before any of this is visible on the site:
- `lib/queries/` needs new/updated functions for the new columns/tables (`unit_types` breakdown fields, `places` filtered by `cluster_id`, `facade_style_descriptions`, `units`)
- UI components/pages need to actually render the floor-plan breakdown, the amenities-as-places list, facade style descriptions + exterior images, and unit-type floor plan images — none of this exists yet
- `/admin` forms were built against the old schema — managing `units`/`facade_style_descriptions`/`places.cluster_id` through the UI (rather than raw SQL) needs admin UI work if you want to keep editing without scripts going forward
- The interactive map / per-unit drive times are further out still — `units.lat`/`lng` aren't populated (only `plot_number` is), and there's no mapping/routing integration yet

Start with `lib/queries/` once the data is live, since nothing else can render without it.
