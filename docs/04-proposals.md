# DOC 4 — PROPOSALS LOG

**Version:** 1.0 · 7 August 2026
**Written by:** the agent, following Doc 3 §4
**Decided by:** Ray only

---

## RULES

1. Nothing here is implemented until Ray marks it **APPROVED**.
2. One numbered entry per proposal. Never edit a decided entry — supersede it with a new one.
3. Every entry must pass the vision test (Doc 3 §1) and the scope gate (Doc 3 §4 step 4) before being written. If it fails either, it is discarded silently and never reaches this file.
4. Only two categories are admissible:
   - **(A) Future-proofing** — makes V1 accommodate a roadmap feature without building it
   - **(B) Better execution** — same V1 outcome, materially better method
5. While a proposal is pending, dependent work stops. Independent work in the same step may continue.
6. **Writing a proposal here is not raising it.** Per Doc 3 §12, tell Ray directly in the same message — number, category, whether it blocks. Never leave a proposal sitting in this file assuming it will be found.
7. If a proposal has been pending across a context block boundary, re-raise it once at the start of the next block. Once, not repeatedly.

## STATUS VALUES

`PENDING` · `APPROVED` · `REJECTED` · `SUPERSEDED BY #NN`

---

## ENTRY FORMAT

```markdown
## #NN — <short title>

**Status:** PENDING
**Raised:** YYYY-MM-DD
**Category:** A — Future-proofing  |  B — Better execution
**Affects step:** X.Y
**Blocking:** Yes / No

### What Doc 2 currently specifies
<the existing instruction, quoted>

### What I propose instead
<the change, concretely>

### Why
<reasoning — evidence, not preference>

### Vision test
<which part of Doc 3 §1 this serves>

### Cost if approved
<time, complexity, new dependencies>

### Cost if rejected
<what it costs later to not do this now — for category A, this is the whole argument>

### Risk
<what could go wrong>

---
**RAY'S DECISION:**
**Date:**
**Notes:**
```

---

## WORKED EXAMPLE — DO NOT IMPLEMENT

*Illustrates the standard. It is not a live proposal.*

## #00 — Example: add `geog` column to places

**Status:** EXAMPLE — NOT A REAL PROPOSAL
**Raised:** 2026-08-07
**Category:** A — Future-proofing
**Affects step:** 2.1
**Blocking:** No

### What Doc 2 currently specifies
`places` stores `lat` and `lng` as `numeric(9,6)`.

### What I propose instead
Also add a PostGIS `geography(Point,4326)` column, populated from lat/lng by trigger.

### Why
The roadmap includes an offline map with inter-community navigation. Proximity queries ("nearest vet to Elora") on raw lat/lng require full table scans with Haversine maths in application code. A geography column with a GiST index makes them one indexed query. Adding it now costs one extension and one trigger; adding it to a populated table later means a migration, a backfill, and rewriting every query already written against lat/lng.

### Vision test
Doc 3 §1: "an offline-capable map for navigating between clusters and nearby services." Directly enabling.

### Cost if approved
One extension, one column, one trigger, one index. Roughly 15 lines in the migration. No new dependency, no change to any V1 query.

### Cost if rejected
A migration plus backfill later, and any V1 proximity logic written against lat/lng would need rewriting.

### Risk
Low. PostGIS is available on Supabase. The column is additive and unused by V1 — if the map is never built, it is 15 unused lines.

---
**RAY'S DECISION:** — (example only)
**Date:** —
**Notes:** Demonstrates the required standard: concrete change, evidence-based reasoning, honest cost on both sides.

---

# LIVE PROPOSALS

## #01 — Cookie-less `createAnonClient` for public reads / SSG

**Status:** APPROVED
**Raised:** 2026-08-07
**Category:** B — Better execution
**Affects step:** 4.1
**Blocking:** Yes

### What Doc 2 currently specifies
Step 4.1: `lib/supabase/server.ts` — RSC client, anon key. Public data access via `lib/queries/` typed from `database.ts`. Doc 2 does not distinguish a cookie-aware vs cookie-less server client; the natural reading is one RSC `createClient()` that uses `cookies()` for all server reads, including those called from `generateStaticParams`.

### What I propose instead
Keep two exports in `lib/supabase/server.ts`:

1. **`createClient()`** — cookie-aware `@supabase/ssr` client (anon key). For request-scoped RSC work that needs session context (auth gates, admin UI). Must not be called from `generateStaticParams`.
2. **`createAnonClient()`** — cookie-less `@supabase/supabase-js` client (anon key only). For all public `lib/queries/*` reads, including paths used by `generateStaticParams` / static generation.

All six public query modules (`clusters`, `places`, `questions`, `communities`, `status`, `posts`) use `createAnonClient()` only. Session writes and Section 5 admin paths continue to use `createActionClient()` / cookie `createClient()` per Doc 3 §3.4 — never this helper.

### Why
`generateStaticParams` runs at build time with no request context. Calling `cookies()` there fails the Next.js build. A cookie-less anon client is the correct shape for public SSG reads: same anon key, same RLS as an unauthenticated visitor, no session cookies required. Reverting to a single cookie-based client would re-break the production build on every static path that lists slugs.

### Vision test
Doc 3 §1 / operating rules: ship a correct, buildable public site without inventing content or weakening trust. This is execution hygiene — same public data, same RLS — so SSG and public pages work without fighting the framework.

### Cost if approved
Already implemented (small addition to `server.ts` + query imports). No new dependencies. Ongoing cost is remembering the client rule (documented in Doc 5 Block B conventions).

### Cost if rejected
Either (a) the build stays broken on `generateStaticParams` paths, or (b) every static-params / public-query call site needs an ad-hoc workaround (dynamic-only routes, duplicated clients, or suppressing cookies incorrectly). Later agents would re-discover the failure and likely re-apply the same fix without a proposal trail.

### Risk
**Misuse of the cookie-less client where auth context is required.** `createAnonClient()` has no cookies and no `auth.uid()` — it always acts as the anonymous role. If it were used in an admin route, Server Action, or authenticated `/api` handler, RLS would evaluate as anon: drafts stay hidden (good for leakage), but `can_edit()` / authenticated writes would fail or silently no-op, and any logic that assumes “current user” would be wrong. Mitigations: never import `createAnonClient` outside `lib/queries/` public reads; Section 5 writes use the session client only; service role stays in `admin.ts` and is not this client.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-08
**Notes:** Keep `createAnonClient` for public reads / SSG. Cookie-less anon client is the correct shape; reversing would re-break the build. Carry out as proposed.

---

## #02 — Scope the Gate 5 `audit_log` assertion to the write it is testing

**Status:** APPROVED
**Raised:** 2026-08-08
**Category:** B — Better execution
**Affects step:** Appendix B, Gate 5 (mirrors §5.4)
**Blocking:** No — Gate 5 passed on 2026-08-07 and the pass is still evidenced.

### What Doc 2 currently specifies

Appendix B, Gate 5:

```
[x] Create a test question via /admin
[x] select actor_id from audit_log order by created_at desc limit 1 → not null
[x] Delete the test row
```

### What I propose instead

Scope the query to the row the preceding step just created:

```
[ ] Create a test question via /admin — note the new question id
[ ] select actor_id from audit_log where record_id = '<that id>' order by created_at desc limit 1 → not null
[ ] Delete the test row
```

### Why

`order by created_at desc limit 1` reads whatever landed in `audit_log` most recently, not the admin write the gate is about. That was the same row on 7 August; it is not today.

Evidence from the live database:

- `audit_log` id 196 (`questions` / `insert`) and id 197 (`questions` / `delete`), 2026-08-07 22:37 and 22:38, both carry `actor_id = 32e61677-dad6-4050-994c-f65eff3d2552`. That is the gate's create-then-delete pair, and it is the only pair in the table with an actor at all. **The tick is correct.**
- Six later rows (ids 199–204, `clusters` / `update` on `eden`, 2026-08-08 09:25–09:44) have `actor_id` null. Their `diff` shows `before` and `after` identical except `updated_at` — no-op touches made outside `/admin`, consistent with revalidation-webhook testing from the SQL editor. Per §2.5 and Doc 6 §3.8, null is correct for those.

So the assertion as written now returns null, on a gate that genuinely passed. An external reviewer re-running it would read that as a false tick. The proposed form stays true whenever it is re-run, because it names the row under test.

This also removes an incentive the current wording creates: the cheapest way to make the line reproduce again is to perform a fresh admin write purely to sit on top of the log, which is theatre rather than verification.

### Vision test

Doc 3 §1: the site "competes on being right", and Doc 3 §9 exists so gates cannot become self-certifying. A gate assertion whose truth depends on unrelated later activity cannot audit anything. This restores the check to what it was meant to prove.

### Cost if approved

Three lines in Appendix B and, if you want them to match, the corresponding §5.4 line. No code, no schema, no re-run of Gate 5 — the existing pass stands on rows 196/197.

### Cost if rejected

The line stays un-reproducible and every future reviewer re-raises it as a suspected false tick, exactly as happened in the 2026-08-08 review. Each round costs a live database audit to clear.

### Risk

Very low, and it is documentation-only. The one real consideration is that this edits a gate assertion after that gate passed — the thing Doc 3 §9 warns about. Which is why it is here rather than applied: the underlying claim ("admin writes record a non-null actor") is unchanged and independently true, and only the query that tests it is being made durable.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-08
**Notes:** `record_id` confirmed as a real column on `audit_log`; scoping the query to the row under test is the right fix and does not re-litigate the 7 Aug pass. Carry out as proposed. Retroactive commit-by-commit walk of Docs 1–3 across the unguarded window (`c9647d6`, `3dd5006`, `2ee5ea9`) found F1 as the only prose divergence and no edit-then-revert — that thread is closed.

**Implementation note:** the edit lands in Doc 2 Appendix B, which Doc 3 §9 reserves to Ray and `scripts/pre-commit` rejects for any author. Applied by Ray, or by the agent under an explicit in-conversation instruction (Doc 3 §2, row 6). See #03.

---

## #03 — Give the docs guard an owner bypass before installing it

**Status:** APPROVED
**Raised:** 2026-08-08
**Category:** B — Better execution
**Affects step:** Doc 3 §9 enforcement · `scripts/pre-commit` · SETUP.md "Docs guard"
**Blocking:** Yes, for #02 — and for any future edit Ray makes to his own documents.

### What Doc 2 currently specifies

Not Doc 2 — Doc 3 §9: *"This is enforced by a pre-commit hook. If it rejects a commit, the hook is right. Never use `--no-verify`; never make a document writable to get around it."* `scripts/pre-commit` implements it.

### What I propose instead

Add an explicit owner bypass at the top of `scripts/pre-commit`, so the guard can be satisfied without disabling every hook in the repo:

```bash
if [ "${DOCS_GUARD:-}" = "off" ]; then
  echo "docs guard: bypassed (DOCS_GUARD=off) — owner edit"
  exit 0
fi
```

Ray then edits his documents with `DOCS_GUARD=off git commit -m "..."`. The agent never sets it, and `--no-verify` remains forbidden exactly as §9 says.

### Why

The guard filters on file path only. Reading the script end to end, there is no author, committer or identity check anywhere in it — I grepped for `author`, `committer`, `GIT_AUTHOR`, `whoami` and `USER` and got no matches. It rejects the commit, not the committer.

Right now that costs nothing, because the hook is not installed. The moment `core.hooksPath` is set, **Ray can no longer edit Doc 1, 2 or 3 either.** §9 tells him the hook is right and forbids `--no-verify`, so the documented state of the repo becomes one where the owner cannot change his own specification through any sanctioned route. #02 is the immediate casualty: it is approved, it must be written into Doc 2 Appendix B, and installing the hook first makes that commit impossible for both of us.

This is the same class of problem as F1, inverted. F1 happened because enforcement was absent. This would happen because enforcement is indiscriminate.

### Vision test

Doc 3 §9's purpose is that the spec stays a record of intent rather than something an agent rewrites to fit its work. An owner bypass preserves that purpose exactly — the asymmetry between Ray and the agent *is* the rule — while removing a lockout that serves nobody.

### Cost if approved

Five lines in `scripts/pre-commit`, one line in SETUP.md's "Docs guard" section, and a §9 wording change that is Ray's to make. No dependencies.

### Cost if rejected

Either the hook stays uninstalled and Doc 1–3 stay unprotected, or it gets installed and every owner edit needs `--no-verify`, which normalises the one bypass §9 most wants to keep unavailable to the agent.

### Risk

Honest limitation: an env var is a speed bump, not a wall. An agent that wanted to bypass the guard could set `DOCS_GUARD=off` itself. This does not make the guard tamper-proof and should not be described as if it does — the actual enforcement is the rule in §9 plus review, and the hook is a reminder that catches accidents. What the bypass buys is that the reminder no longer misfires on the one person entitled to edit. If you want it harder to reach, the alternative is checking `git config user.email` against a known owner address, which is stronger in practice but still trivially forgeable and adds a config dependency for a fresh clone.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-08
**Notes:** Env var over the git-email check — both are forgeable by anyone with shell access, and the email check adds a fresh-clone dependency for no real security gain. Enforcement was always `--no-verify` staying forbidden plus review, not a technical wall.

**Sequencing set by Ray:** land #03 and install the hook together first (`scripts/pre-commit` is not under `docs/0[123]-*.md`, so that commit is unblocked either way). Then `DOCS_GUARD=off` exactly once, for the commit writing #02 into Appendix B. Everything after goes through the guard normally.

---

## #04 — Add Doc 7 (Data Staging) as the only route new facts take into Doc 1

**Status:** APPROVED
**Raised:** 2026-08-08
**Category:** B — Better execution
**Affects step:** Doc 3 §2 (source hierarchy) · §9 (document ownership) · README Docs table · new `docs/07-data-staging.md`
**Blocking:** Yes — for staging the Farm Gardens PDF export currently in hand

### What Doc 3 currently specifies

§9: Docs 1, 2 and 3 are Ray's; the agent's only permitted writes to them are Doc 2's status block and checkbox toggles. `scripts/pre-commit` enforces this — any other prose diff to `docs/0[123]-*.md` is rejected unless `DOCS_GUARD=off`, which the hook's own comment says the agent never sets. Docs 4, 5, 6 are "the agent's to write under their own rules." §2 row 6 says Ray, in conversation, overrides the hierarchy "but must be written into the relevant doc" — but for Doc 1 specifically, there is currently no doc the agent can write that leads there; the only real route is Ray hand-editing Doc 1 or personally running the bypass commit.

### What I propose instead

A new unguarded document, **`docs/07-data-staging.md`** (not matched by the guard's `^docs/0[123]-.*\.md$` pattern, so it needs no bypass to write). One dated, numbered batch entry per intake — a source document, a factsheet, a PDF export, a site visit — each listing:

- **Source**: files/links, retrieval date, `source_id`, `kind`
- **Confidence**: per Doc 3's normal scale — staging does not relax this, only the approval ceremony
- **Proposed Doc 1 diff**: the exact field-by-field change, concretely, in the form it would take in Doc 1 (table row, annex line, prose)
- **Status**: `staged` / `promoted` / `rejected`
- **Promoted**: date + who ran the commit, once it lands in Doc 1

Doc 1 continues to accept prose changes only from Ray or under `DOCS_GUARD=off`, exactly as §9 already requires — nothing about the guard changes. What changes is that the content going in should always trace back to an already-committed Doc 7 batch, so there is a written record of what was proposed and why before it becomes a fact. This is a documentation convention, not a hook change: the guard does not verify a Doc 1 diff against Doc 7's content (a content-matching check would be brittle against reformatting and isn't worth the complexity for what's effectively a review discipline, the same way "never invent a fact" isn't code-enforced either).

### Why

Right now, getting a verified fact from an external source (an Emaar brochure, a factsheet, a site visit) into Doc 1 has no agent-writable staging point — the agent either asks Ray to draft the prose himself, or produces it ad hoc in chat with no durable record of the source material, the proposed mapping, or what was rejected versus accepted. Doc 4 already solves this problem for process/schema changes (durable, numbered, decision-tracked); Doc 1 fact intake had no equivalent. Today's task — reconciling six Farm Gardens PDFs against the live `farm-gardens` cluster row — is the concrete case: several real values (price, payment plan, corrected BUA/plot figures) need to land in Doc 1, and there was no file to put them in before this proposal.

### Vision test

Doc 3 §1: "every fact carries a source, a confidence level and a verification date." Doc 7 makes that traceable at the point of intake, not just in the final Doc 1 row — the batch entry preserves which PDF said what, before it gets compressed into a table cell.

### Cost if approved

One new file, one README table row. No schema change, no hook change, no migration. Ongoing cost is one staging entry per intake batch instead of drafting Doc 1 prose directly in chat.

### Cost if rejected

Every future data intake (PDFs, factsheets, site visits) either waits on Ray to draft Doc 1 prose personally, or gets proposed ad hoc in conversation with no durable trail of source vs. proposed value — indistinguishable later from an uncited claim.

### Risk

Low. The staging doc is descriptive, not authoritative — Doc 1 remains rank 3 in the hierarchy and Doc 7 is not itself a source anyone should cite. The one real risk is drift if a Doc 1 promotion is made without a corresponding staged entry; since that's not hook-enforced, it relies on the same review discipline the rest of Doc 3 already relies on.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-08
**Notes:** Staging doc gets Doc 1 write access unblocked for the agent without touching the guard. Promotion enforcement stays discipline/review-based, not hook-automated — consistent with how the rest of Doc 3 works. Name confirmed: `docs/07-data-staging.md`. Source/confidence rigor stays mandatory on every staged entry; only the propose→approve→implement ceremony is what's being skipped for pure data.

---

## #05 — Add `clusters.amenities` and `unit_types.unit_count` columns

**Status:** APPROVED
**Raised:** 2026-08-08
**Category:** B — Better execution
**Affects step:** `docs/0001_init.sql` / `supabase/migrations/0001_init.sql` schema · `src/types/database.ts` regen · Doc 1 Annex C
**Blocking:** Yes — for two facts in Doc 7 Batch 001 (Farm Gardens amenity list and 79/67 unit split)

### What Doc 2 currently specifies

`clusters` has no field for a structured amenity list — only free-text `positioning`, `summary`, `body`, `notes`. `unit_types` has no per-row unit count — `clusters.unit_count` holds the cluster total, but nothing records how that total splits across bedroom counts.

### What I propose instead

Two additive, nullable columns:

- `clusters.amenities text[]` — same pattern as the existing `clusters.facade_styles text[]`. A flat list of on-site amenity names (e.g. `{'Grand Lawn','Petting Zoo & Animal Farm','Hydroponics Greenhouse', ...}`), not a richer structure with descriptions — matches how `facade_styles` already stores comparable enumerable lists.
- `unit_types.unit_count int` — the count of units of that specific bedroom type within the cluster (e.g. Farm Gardens 4-bed = 79, 5-bed = 67), independent of and summing to `clusters.unit_count`.

Both are nullable, additive, and require no backfill — existing rows simply stay null until populated, same posture as every other optional column in these tables.

### Why

Doc 7 Batch 001 (Farm Gardens PDF export) has real, sourced values for both — the brochure/cluster-map amenity list and the 79×4-bed / 67×5-bed split from the factsheet — with nowhere in the schema to put them. Without these columns the facts either get force-fit into free-text `positioning` (which Ray has asked to leave unchanged) or `notes` (loses structure, can't be queried or rendered as a list on cluster pages), or simply stay unrecorded despite being verified and sourced.

### Vision test

Doc 3 §1: "every fact carries a source, a confidence level." An amenity list and a unit-type split are exactly the kind of concrete, verifiable facts the site exists to publish accurately — currently there's no structured place for either.

### Cost if approved

Two columns in `docs/0001_init.sql`, mirrored to `supabase/migrations/0001_init.sql`, a `database.ts` regen, and one small seed/Doc 1 update per cluster that has the data. No new tables, no new dependency, no change to existing rows.

### Cost if rejected

Farm Gardens' amenity list and unit split stay unrecorded or get force-fit into a free-text field where they can't be queried, rendered as a structured list, or compared across clusters the way `facade_styles` already is.

### Risk

Low — both columns are additive and nullable, same shape as `facade_styles`. Main risk is scope creep if `amenities` becomes a place for content that should really live in the `places` table (shared, addressable amenities like Golden Beach); this proposal is scoped to cluster-internal, non-addressable amenities only (petting zoo, hydroponics greenhouse, desert majlis, etc.), not a replacement for `places`.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-08
**Notes:** Both columns approved as proposed — plain `text[]` for amenities (no richer structure), `unit_count` on `unit_types` independent of `clusters.unit_count`. Migration execution against the live schema (docs/0001_init.sql, supabase/migrations, database.ts regen, `supabase db push`) is a separate step requiring its own go-ahead before touching the live database — not yet authorized to run.

**Amendment 2026-08-09:** the `clusters.amenities text[]` half of this proposal is **SUPERSEDED BY #06** (cluster-specific amenities become `places` rows instead — see #06's reasoning: a shared array can't hold per-instance photos, and each cluster's amenity, e.g. a pool, is a physically distinct thing from another cluster's). `unit_types.unit_count` is unaffected and stands as approved here. Not applied in `supabase/migrations/0002_farm_gardens_units_places.sql`.

---

## #06 — Places unification (cluster-scoped amenities), unit floor-plan breakdown, and individual units

**Status:** APPROVED
**Raised:** 2026-08-09
**Category:** A — Future-proofing
**Affects step:** `docs/0001_init.sql` / `supabase/migrations/0001_init.sql` schema · `src/types/database.ts` regen
**Blocking:** No — schema only, no data promotion bundled in

### What Doc 2 currently specifies

`unit_types` has no per-bedroom-type unit count and no floor-plan sub-area breakdown. `places` is Valley-wide only — no way to scope a place to one cluster or express that one place contains others. There is no table for individual physical units, no way to record which facade style a specific unit has, and no way to link a resident's profile to their own unit.

### What I propose instead

**`unit_types` — 4 new nullable columns** (`unit_count` already covered by approved #05, not repeated here):
- `suite_area int`, `garage_area int`, `balcony_area int`, `roof_terrace_area int` — the floor-plan breakdown; suite + garage + balcony sums to the existing `bua_min`/`bua_max` total.

**`places` — 3 new nullable columns + one RLS fix:**
- `cluster_id uuid references clusters(id)` — scopes a place to one cluster; null = Valley-wide (Golden Beach, the Pavilion, Dubai Outlet Mall unchanged)
- `parent_place_id uuid references places(id)` (self-referencing) — containment: the Pavilion → Monoprix, a cluster's Wellness Centre → its Gym/Spa/Restaurant
- `google_place_id text` — links to Google's Places API where a public listing exists
- RLS: `pub_places` policy updated so a place tied to a `cluster_id` also requires that cluster's own `state = 'published'` — closes the gap where a cluster-scoped place could otherwise leak before its parent cluster does (mirrors how `pub_unit_types` already works)

This is also where the earlier `amenities`/`cluster_amenities` catalog+join idea is formally dropped — cluster-specific amenities become `places` rows (`cluster_id` set) instead, each cluster's instance its own row with its own photos (e.g. Farm Gardens' pool and Eden's pool are separate rows, not one shared "Pool" row), sharing only a `category`/`subcategory` value for cross-cluster filtering.

**New table `units`** — individual physical units, distinct from `unit_types` (which stays a floor-plan template):

```sql
create table units (
  id             uuid primary key default gen_random_uuid(),
  cluster_id     uuid not null references clusters(id),
  unit_type_id   uuid not null references unit_types(id),
  unit_number    text not null,        -- "403"
  plot_number    int,                  -- ties to the numbered site plan
  facade_style   text,                 -- which of the cluster's facade_styles this unit has
  lat            numeric(9,6),
  lng            numeric(9,6),
  notes          text,
  sort_order     int not null default 0,
  confidence     confidence_level not null default 'unverified',
  source_id      uuid references sources(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
```
Plus the full standard treatment every other table gets: RLS enabled, a `pub_units` public-read policy (same open pattern as everything else — coordinates aren't sensitive), registered in both the `updated_at` and audit trigger arrays, and an index on `(cluster_id, unit_type_id)`. `facade_style` isn't database-validated against the parent cluster's `facade_styles` array — kept as free text, consistent with everything else in this schema relying on review discipline rather than a hard constraint.

**`profiles` — 1 new nullable column:**
- `unit_id uuid references units(id)` — a resident's own unit, protected automatically by the existing `own_profile` RLS policy (`id = auth.uid()`), so only a user can see their own unit link.

### Why

Floor-plan breakdown figures (suite/garage/balcony/roof terrace) have no columns to live in today. Cluster-specific amenities need per-instance photos and containment (a Wellness Centre containing a Gym, Spa, Restaurant) that a shared catalog+join table can't give cleanly — `places` already solves both, since it's already wired to `media_links` for photos. Individual units are the foundation for the planned interactive map and personalized, per-address drive times. `facade_style` per unit records which specific style was actually built where, since the cluster-level `facade_styles` list can't express that.

### Vision test

Doc 3 §1: "an offline-capable map for navigating between clusters and nearby services," and the site's broader goal of being the definitive source for concrete development detail — individual units with coordinates and facade styles is a direct, structural step toward both.

### Cost if approved

Four columns on `unit_types`, three columns + one policy edit on `places`, one new table with the standard five-piece scaffolding (RLS, policy, two triggers, index), one column on `profiles`. All additive, all nullable, no backfill required, no existing row changes shape. `database.ts` regen required after push.

### Cost if rejected

Floor-plan breakdown, cluster-specific amenity photos/containment, individual unit tracking, and the future interactive map all stay unbuildable on the current schema.

### Risk

Low, additive throughout. The one correctness risk (not a breaking one) is the `places` RLS gap if the cluster-state check is left out — flagged and included in this proposal specifically so it doesn't get missed.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-09
**Notes:** Approved as proposed, including `google_place_id` and `profiles.unit_id`. Confirmed: cluster-specific amenities in `places` are one row per cluster instance (Farm Gardens' pool ≠ Eden's pool), never a shared row. Migration execution against the live schema is a separate step — not yet authorized to run.

---

## #07 — Add `facade_style_descriptions` table

**Status:** APPROVED
**Raised:** 2026-08-09
**Category:** A — Future-proofing
**Affects step:** `docs/0001_init.sql` / `supabase/migrations/0001_init.sql` schema · `src/types/database.ts` regen
**Blocking:** No — schema only, no data promotion bundled in

### What Doc 2 currently specifies

`clusters.facade_styles` is a flat `text[]` of style names per cluster (e.g. Farm Gardens: `['Horizon','Earth']`). There is nowhere to attach the descriptive copy for what each named style actually is — the brochure text ("The Earth villas master indoor-outdoor living...") currently has no field to live in.

### What I propose instead

A new, additive table, scoped per cluster rather than as a Valley-wide catalog — styles aren't shared vocabulary across clusters (Eden's May Bell/Iris/Spruce have nothing to do with Farm Gardens' Horizon/Earth):

```sql
create table facade_style_descriptions (
  id           uuid primary key default gen_random_uuid(),
  cluster_id   uuid not null references clusters(id) on delete cascade,
  style_name   text not null,
  description  text,
  sort_order   int not null default 0,
  confidence   confidence_level not null default 'unverified',
  source_id    uuid references sources(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (cluster_id, style_name)
);
```

Full standard treatment: RLS enabled, a `pub_fsd` policy mirroring `pub_unit_types`/`pub_units` (visible only once the parent cluster is published), registered in both trigger arrays, an index on `cluster_id`, and included in both grant statements.

Deliberately a new table rather than restructuring `clusters.facade_styles` into something like `jsonb`. That column is already populated for six clusters (Eden, Nara, Talia, Orania, Elora, Lillia) plus Farm Gardens — changing its type now is a real migration against live data, not an empty-column addition. This proposal doesn't touch it at all.

### Why

Ray's stated plan: the Farm Gardens deep-dive (PDF extraction, schema, staged facts) is the template for every cluster, not a one-off. Every cluster with named facade styles will eventually have its own descriptive copy the same way Farm Gardens does now — building the table while it's genuinely empty (zero rows, zero clusters using it yet) is the cheap moment. Waiting until several more clusters are deep-dived under the current flat-array-only approach means retrofitting descriptions onto data that already exists everywhere, instead of just populating a table as each cluster gets done.

### Vision test

Doc 3 §1: "every fact carries a source, a confidence level." Style descriptions are real, sourced content (developer brochure copy) that currently has no structured home — same accuracy differentiator as everything else added today, just one level of detail deeper than the style name itself.

### Cost if approved

One table, five pieces of standard scaffolding (RLS, policy, two triggers, index, grants) — same shape as every other addition today. No backfill, no change to `clusters.facade_styles`.

### Cost if rejected

Style description copy stays unrecorded across every cluster indefinitely, or gets force-fit into `clusters.body` prose where it can't be attributed to a specific style name once a cluster has more than one.

### Risk

Low — additive, empty table, no interaction with populated data.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-09
**Notes:** Approved specifically because this repeats per-cluster going forward — building it now while empty avoids retrofitting later. Scoped per-cluster, not a Valley-wide style catalog. `clusters.facade_styles` left untouched.

---

## #08 — Add `unit_type` and `facade_style_description` to `media_links.subject_type`

**Status:** APPROVED
**Raised:** 2026-08-09
**Category:** B — Better execution
**Affects step:** `docs/0001_init.sql` / `supabase/migrations/0001_init.sql` schema · `src/types/database.ts` regen
**Blocking:** No — schema only

### What Doc 2 currently specifies

`media_links.subject_type` allows `('cluster','place','question','status_log','community','post')`. There is no way to link an image to a `unit_types` row or a `facade_style_descriptions` row.

### What I propose instead

Add `'unit_type'` and `'facade_style_description'` to the check constraint. Floor-plan images link to the `unit_types` row they depict (the shared template — e.g. Farm Gardens' 4-bed row), not to every individual `units` row that happens to be that type. Facade-style exterior renders link to the `facade_style_descriptions` row (e.g. Farm Gardens' Horizon row), not to every unit built in that style. `'unit'` (individual physical units) deliberately not added — Ray confirmed no per-physical-unit photos are planned.

### Why

Ray's requirement: every image should be tied to exactly what it depicts. A floor plan is identical across every unit of that type (confirmed on a second cluster, Avelia, which has multiple distinct unit types sharing the same bedroom count — 5BR Medium vs 5BR Premium — each still needs exactly one linked floor plan, at the `unit_types` level, distinguished by `label`). Linking at the `units` level instead would mean the same image duplicated across 79 rows for Farm Gardens alone, worse on every other cluster.

### Vision test

Doc 3 §1: accuracy and specificity — this makes "the image for what the visitor is looking at" a real, non-redundant data relationship instead of an approximation at the cluster level.

### Cost if approved

Two values added to one check constraint. No new table, no backfill, no interaction with existing `media_links` rows (all currently `subject_type = 'cluster'` or similar, unaffected).

### Cost if rejected

Floor-plan and facade-style images can only link at the cluster level — visitors can't see which specific floor plan or style an image belongs to without guessing, and any UI built to show "this unit's floor plan" has no correct query to make.

### Risk

Very low — a check constraint value addition, fully additive.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-09
**Notes:** Approved as proposed. `'unit'` intentionally excluded — no per-physical-unit photos planned currently.

---

## #09 — Extend the docs guard to cover `docs/clusters/*/reference.md`

**Status:** APPROVED
**Raised:** 2026-08-09
**Category:** B — Better execution
**Affects step:** `scripts/pre-commit` (`GUARDED_RE`), Doc 3 §9 enforcement
**Blocking:** Yes — for committing any of the 7 new `docs/clusters/*/reference.md` files (Eden, Nara, Talia, Orania, Elora, Lillia, Farm Gardens)

### What Doc 2/Doc 3 currently specifies

`scripts/pre-commit` guards `GUARDED_RE='^docs/0[123]-.*\.md$'` — only `docs/01-*.md`, `docs/02-*.md`, `docs/03-*.md` at the top level of `docs/`. Doc 3 §9: "Docs 1, 2 and 3 are Ray's... Docs 4, 5 and 6 are the agent's to write under their own rules," with Doc 7 later added as agent-writable too (#04).

### What I propose instead

Per Ray's decision to migrate Doc 1's Annex C/D into per-cluster files (`docs/clusters/<slug>/reference.md` for facts, `docs/clusters/<slug>/staging.md` for pending facts), the guard needs to protect `reference.md` the same way it protects Doc 1 today — it carries the same weight, just relocated. `staging.md` stays unguarded, mirroring Doc 7.

```bash
GUARDED_RE='^(docs/0[123]-.*\.md|docs/clusters/[^/]+/reference\.md)$'
```

No other logic changes — the existing "new or deleted guarded doc is always a violation" rule already does the right thing here: it means the 7 `reference.md` files I've drafted this session need Ray to actually commit them (or explicit `DOCS_GUARD=off`), exactly like every other Doc 1 content change this session has required.

### Why

Without this, `docs/clusters/*/reference.md` would be silently unprotected — I could commit changes to per-cluster facts with no bypass required, defeating the entire point of the guard the moment cluster content moves out of Doc 1's literal filename.

### Vision test

Doc 3 §9's purpose — the spec stays a record of intent the agent doesn't silently rewrite — applies identically regardless of which file cluster facts happen to live in. This preserves that guarantee through the restructure instead of accidentally dropping it.

### Cost if approved

One line changed in `scripts/pre-commit`. No behavior change for any existing guarded or unguarded file — `docs/0[123]-*.md` matches exactly as before, `staging.md` files were never matched and still aren't.

### Cost if rejected

Every future `reference.md` edit — for any of the 7 migrated clusters, or any of the 15+ still to come — ships without the protection Doc 1 has always had, and nobody would notice until it's already happened.

### Risk

Low — same category and same author-tested pattern as proposal #03, which added the `DOCS_GUARD=off` bypass to this same script.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-09
**Notes:** Approved as proposed.

---

## #10 — Extend Annex L's `places.category` controlled vocabulary

**Status:** APPROVED
**Raised:** 2026-08-09
**Category:** B — Better execution
**Affects step:** `docs/01-information-reference.md` Annex L
**Blocking:** Yes — for promoting the 19 Farm Gardens amenity `places` rows in Batch 001

### What Doc 1 currently specifies

Annex L's `places.category` controlled vocabulary is exactly: `pharmacy · clinic · hospital · dental · optical · nursery · school · vet · grocery · mall · salon · spa · gym · fuel · mosque`. Rule: "No value outside these lists without a proposal." Every existing value describes a third-party business a visitor would drive to.

### What I propose instead

Extend the list with six new values: `recreation, nature, family, farming, wellness, gathering`. These describe cluster-internal amenities — a real, different kind of "place" than Annex L's existing business-directory list, needed now that cluster-specific amenities are `places` rows (Doc 4 #06) rather than a separate structure. `mosque` amenities use the existing `mosque` category directly — that one was never a vocabulary gap, just a mistake in the original promotion SQL (had been filed as `community`/`mosque`).

These six do not slot into the existing `living/[category]` route map (`schools, healthcare, groceries, services, getting-around`) — that route structure is for the external, third-party services directory. Cluster-internal amenities surface on a cluster's own page instead, a separate consumption path. No route-map change needed.

### Why

Caught during Cursor's pre-merge review: the Batch 001 promotion SQL used six category values (`outdoor, family, farming, sports, nature, community, wellness`) never checked against Annex L, violating the controlled-vocabulary rule outright. Verified by trying to force these 19 amenities into the *existing* 15 terms instead (Option B considered and rejected): 10 of 19 have no reasonable existing fit at all (Grand Lawn, Hydroponics Greenhouse, Petting Zoo, Desert Majlis, Stargazing Platforms, Picnic Spots, Ghaf Forest, Xeriscape Garden, Events Plaza, Arrival Plaza) — reconciliation doesn't work on real data, only extension does.

### Vision test

Doc 3 §1: "every fact carries a source, a confidence level" — Annex L's whole purpose is preventing vocabulary drift on a field the site's routing already depends on. Extending it properly (named, proposed, decided) rather than silently introducing new strings is that same discipline applied to this specific gap.

### Cost if approved

Six words added to one line in Doc 1, plus the corresponding category values already corrected in `docs/clusters/farm-gardens/staging.md` and `docs/clusters/farm-gardens/floorplans/farm-gardens-batch-001-promotion.sql`. This is the first cluster to need these categories — every future cluster's deep-dive reuses them rather than re-deriving a taxonomy.

### Cost if rejected

The 19 Farm Gardens amenity rows can't promote with a compliant category value. Either they stay unpromoted indefinitely, or get force-fit into misleading existing terms (Padel Court as `gym`? Grand Lawn as `mall`?) that break filtering later.

### Risk

Low — additive to a text list, no schema or code dependency on the current 15 values being exhaustive.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-09
**Notes:** Extend as proposed. Confirmed this doesn't affect the per-cluster-instance `places` row design (a pool in Eden and a pool in Farm Gardens remain separate rows with separate photos regardless of category vocabulary — orthogonal concerns).

---

## #11 — Adopt Doc 8 (cluster depth build guide) and ship public + admin surfaces

**Status:** APPROVED
**Raised:** 2026-08-09
**Category:** B — Better execution
**Affects step:** Post-V1 product work after Doc 2 Gate 8 / Doc 6 live; schema already landed via #05–#10 / migration `0002`
**Blocking:** Yes — for any `src/` work that surfaces facades, cluster-scoped places, media links, or new `unit_types` columns

### What Doc 2 currently specifies

Doc 2 Appendix C and the V1 build are complete. Doc 2 does not specify app queries or UI for post-`0002` cluster-depth tables (`facade_style_descriptions`, `places.cluster_id`, `media_links` subject types `unit_type` / `facade_style_description`, unit-type area breakdown columns). Doc 2's remaining attention items only note that those surfaces are missing. Units/map remain explicitly out of V1 (Doc 2 Appendix C: offline map · property listings).

### What I propose instead

1. **Adopt `docs/08-cluster-depth-build-guide.md` as the execution vehicle** for this work — same shape as Doc 2 (status block, context blocks D-A / D-B, actor tags, dual checkboxes, Appendix A checklist, Appendix B objective gates, Appendix C scope boundary). Name reflects the work: cluster depth app surfaces, not another "master plan."
2. **Execute Doc 8 Sections 1–4 only after this proposal is APPROVED:**
   - **Block D-A:** public query helpers + extend `/clusters/[slug]` (price/payment already partly there; unit-type breakdown; facades; published cluster amenities; media via `media_links`).
   - **Block D-B:** admin forms for new unit-type fields, facade editors, cluster-scoped places, media subject linking.
3. **Hard locks in Doc 8:** no `slug === 'farm-gardens'` branching; public amenities `state = 'published'` only; **no `units` reads/writes in `src/`**; no new migrations; Doc 6 updated same session (Doc 3 §11).
4. **Defer entirely** per-plot units UI and interactive map until multiple clusters have Batch-001-scale injections — reopen with a **new** Doc 4 proposal later (do not expand this entry).

### Why

Schema and Farm Gardens Batch 001 are live; the public/admin app still only partially reflects that depth. Without a Doc-2-shaped guide, agents either freestyle `src/` changes or treat a Cursor plan file as process — neither matches Doc 3. Doc 8 makes gates and scope auditable the same way V1 was. Deferring units/map avoids building inventory UI before enough clusters have injectable unit data.

### Vision test

Doc 3 §1 spine: clusters as first-class pages with sourced, confidence-gated facts. Surfacing facades, floor-plan breakdown, and on-site amenities on the existing cluster page is better execution of that spine — not a new product surface. Keeping units/map out preserves Doc 2 Appendix C discipline.

### Cost if approved

Two context blocks of app work (queries → page → admin forms → media linking), Doc 6 updates each block, no schema cost. Doc 8 becomes the checklist Ray and agents follow for this iteration.

### Cost if rejected

Depth data stays SQL/admin-invisible on the public site; each future agent reinvents whether/how to surface it. Or ad-hoc `src/` lands without gates.

### Risk

Low–medium — UI scope creep into units/map or Farm Gardens hardcoding. Mitigated by Doc 8 Appendix C + Gate D1/D2 greps forbidding `units` queries and slug hardcodes. Draft amenities accidentally published is a content risk, not a code one — public query filters `published` only.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-09
**Notes:** Approved as proposed.

---

## #12 — Plex structure (`plexes` table, `units.plex_id`/`th_position`/`bua`), `unit_types.bathrooms`, and the `unit_types.layout` convention

**Status:** APPROVED
**Raised:** 2026-08-10
**Category:** A — Future-proofing
**Affects step:** `docs/0001_init.sql` (reference) · `supabase/migrations/0003_eden_plexes_units.sql` · `src/types/database.ts` regen
**Blocking:** Yes — for Eden Batch 002 (`docs/clusters/eden/staging.md`), all 362 units and 15 `unit_types` rows depend on these columns existing

### What Doc 2 currently specifies

`unit_types` has `label` (a bare layout letter, e.g. `'A'`) and an existing-but-never-populated `layout` column, with no way to represent bathroom count. `units` (added by #06) has no way to record a unit's position within a physical building row, or its exact per-unit floor area — only `unit_types.bua_min`/`bua_max`, a range across the whole layout. There is no table representing a physical plex/building row at all.

### What I propose instead

**`unit_types.layout` — no schema change, just a populated-data convention.** Eden has 15 distinct floor-plan templates because style is layout-determining there (Spruce/Iris/May Bell each have their own square footage per bedroom count, unlike Farm Gardens' Horizon/Earth which share one interior). `bedrooms` + `label` alone can't disambiguate "Spruce 3BR-A" from "Iris 3BR-A" — both would be `(3, 'A')`. Rather than add a second column that duplicates `units.facade_style`'s name and meaning (which would require a coalescing view to reconcile), the existing unused `layout` column is repurposed to hold the compound key: `'{facade_style}-{label}'`, e.g. `'spruce-a'`. `units.facade_style` stays the single, consistently-populated field for a unit's style across every cluster — Farm Gardens already works this way; Eden now does too, with no exception.

**`unit_types.bathrooms numeric(3,1)`** — new nullable column. Supports halves (`3.5`, `4.0`) the way the market actually lists these ("3BR+M", counting the maid's room separately — `unit_types.maids_room` already handles that half, no change needed there).

**New table `plexes`:**

```sql
create table plexes (
  id            uuid primary key default gen_random_uuid(),
  cluster_id    uuid not null references clusters(id) on delete cascade,
  plex_size     smallint not null,
  street_side   text check (street_side in ('up','down','left','right')),
  range_start   int,
  range_end     int,
  notes         text,
  confidence    confidence_level not null default 'unverified',
  source_id     uuid references sources(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
```

Plus the standard scaffolding every table in this schema gets: RLS enabled, `pub_plexes` (published-cluster-gated, same pattern as `pub_units`/`pub_fsd`), staff CRUD policies, both triggers, a `cluster_id` index. This generalizes across every plex-organized cluster, not just Eden — the same 6/8/9/10-plex structure has since been confirmed present in other clusters' floor plans.

**`units` — 3 new nullable columns:** `bua numeric` (exact per-unit floor area — plex position affects this even within one layout letter, e.g. two "Spruce 3BR-A" units 7.6 sqft apart depending on which slot in the row they sit in; `unit_types.bua_min`/`bua_max` only captures the layout-wide range), `plex_id uuid references plexes(id)` (nullable — null for standalone-villa clusters like Farm Gardens), `th_position text` (e.g. `'TH01'`, the unit's slot within its plex).

### Why

Eden's 362 units are organized into 43 physical plex rows (6/8/9/10-plex), each with real per-unit variation in floor area that the current schema has nowhere to record, and no way to represent the plex/row structure itself. Bathroom count is currently unrecorded anywhere despite being a standard listing figure. Without these, Eden's floor-plan and per-unit data either can't be promoted with full fidelity or gets force-fit into free-text `notes`.

### Vision test

Doc 3 §1: "every fact carries a source, a confidence level." Per-unit floor area, bathroom count, and physical plex membership are concrete, verifiable facts sourced directly from the developer's own floor-plan PDFs — exactly the kind of detail the site exists to publish accurately, and currently has no structured home.

### Cost if approved

One new table with the standard five-piece scaffolding (RLS, 4 policies, 2 triggers, 1 index), four new nullable columns across `unit_types` and `units`, no backfill required anywhere (Farm Gardens' existing rows stay null on all of them — its standalone villas have no plex structure and no per-unit area variation to record). `database.ts` regen required after push.

### Cost if rejected

Eden's per-unit floor area, bathroom count, and plex/row structure stay unrecorded or get force-fit into `notes`, where none of it is queryable, filterable, or sortable — the exact problem this session's design conversation was trying to solve.

### Risk

Low — entirely additive, nullable, no existing row changes shape. The `unit_types.layout` convention (reusing an existing unused column rather than adding a new one) is a naming/data decision, not a schema risk, but it does mean any future reader of that column needs to know the `'{style}-{letter}'` convention — documented here and in `docs/clusters/eden/staging.md` for that reason.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-10
**Notes:** Approved as proposed. Mixed 10-plex key-plan template accepted after review; Farm Gardens leaves plex columns null. Proceed with 0003 + Eden Batch 002 promotion.

---

## #13 — Cache middleware `redirects` lookup

**Status:** APPROVED
**Raised:** 2026-08-12
**Category:** B — Better execution
**Affects step:** Post-V1 / Doc 6 §4.1 Middleware (`src/middleware.ts`)
**Blocking:** No — `redirects` currently has 0 rows; pattern cost only

### What Doc 2 currently specifies

Doc 2 §6 and Doc 5 Block C: middleware reads the `redirects` table with `createAnonClient()` on Edge and issues redirects. No caching requirement was stated.

### What I propose instead

Cache the redirect map (or the per-path lookup) so Edge does not round-trip to Supabase on every non-static request. Preferred shape: load published `from_path → {to_path, status_code}` with a short TTL / `unstable_cache` (or equivalent Next 16 cache primitive), invalidate via existing `/api/revalidate` or a dedicated tag when `redirects` changes. Alternative if caching on Edge is awkward: narrow the `matcher` to paths that can plausibly have redirects once we know the slug vocabulary.

### Why

`src/middleware.ts` currently `.from('redirects').eq('from_path', …).maybeSingle()` on every matched request. Latency scales with traffic, not content. Table is empty today, so this is preventive, not a live outage.

### Vision test

Doc 3 §1: the site must stay fast and honest as traffic grows; paying a DB hop for a monthly-changing table works against that.

### Cost if approved

Small change to `src/middleware.ts` (+ possibly a tiny `lib/redirects` helper). Doc 6 §4 update same session. No schema change.

### Cost if rejected

Every crawl/bot/page view keeps an unnecessary Supabase round-trip once redirects are in use; easy to forget until traffic hurts.

### Risk

Stale redirects for up to the cache TTL after an admin/SQL edit — mitigated by tying invalidation to the existing revalidate path or keeping TTL short (e.g. 60–300s).

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-12
**Notes:** Approved as proposed. Prefer short TTL cache (60–300s) with invalidation via existing revalidate path when practical.

---

## #14 — Add a time-based revalidation floor on public routes

**Status:** APPROVED
**Raised:** 2026-08-12
**Category:** B — Better execution
**Affects step:** Post-V1 public App Router pages / Doc 6 §2 Deploy
**Blocking:** No — but SQL promotions are soft-broken if the webhook is down

### What Doc 2 currently specifies

Freshness via Server Action `revalidatePath` plus `POST /api/revalidate` (Doc 2 §5.3 / §7.2). No `export const revalidate` ISR interval.

### What I propose instead

Add a conservative time-based floor (suggested **3600s**) on public segment layouts or key public pages so content cannot stay invisible indefinitely when promotions happen via SQL seeds rather than admin actions. Keep on-demand revalidation as the primary path.

### Why

External review correctly noted: seed/SQL promotions fire no Server Action. Doc 6 already describes `notify_site_revalidate()` triggers — those must still be confirmed live `[R]`. A time floor is a safety net if the webhook URL/secret drifts after domain cutover.

### Vision test

Accuracy includes *showing* verified facts once promoted; a silent stale cache works against Doc 3 §1.

### Cost if approved

One (or few) `export const revalidate = 3600` lines; Doc 6 §2/§4 + changelog. Slightly more background regenerations on Vercel.

### Cost if rejected

Continued full dependence on webhook + deploy for SQL-side promotions; SETUP.md §7 domain cutover remains a footgun.

### Risk

Low. Worst case: pages refresh hourly even when unchanged. Do not set so low that it defeats SSG cost benefits.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-12
**Notes:** Approved at 3600s on public routes. Webhook remains primary; floor is safety net.

---

## #15 — Configure `next/image` for Supabase Storage media

**Status:** APPROVED
**Raised:** 2026-08-12
**Category:** B — Better execution
**Affects step:** Post-V1 cluster depth media rendering (Doc 8 surfaces)
**Blocking:** No

### What Doc 2 currently specifies

No image-optimization requirement. Doc 8 shipped cluster media with a documented raw `<img>` because `remotePatterns` was unset (`clusters/[slug]/page.tsx`).

### What I propose instead

1. Set `images.remotePatterns` in `next.config.ts` for the Supabase Storage host (`NEXT_PUBLIC_SUPABASE_URL` hostname / `*.supabase.co` storage path).
2. Switch public media renders (at least cluster page floor plans / façades / maps) from raw `<img>` to `next/image` with sensible `sizes` and lazy loading.

### Why

Floor plans are the content. Shipping multi-hundred-KB–5MB PNGs/JPGs at full size to mobile is the largest UX cost called out in the review, and the comment in the page already names the missing config.

### Vision test

Doc 3 §1: a resident-facing information hub should feel built by someone who lives there — including usable media on a phone.

### Cost if approved

`next.config.ts` + component updates wherever Storage URLs render; Doc 6 §2/§4. Verify build still passes without local Supabase.

### Cost if rejected

Mobile continues to download full-resolution floor plans; problem worsens as more clusters promote media.

### Risk

Misconfigured `remotePatterns` breaks images in prod — mitigate by matching the exact Storage URL shape used by `mediaPublicUrl`. Some very wide floor plans may need `width`/`height` or fill layout care.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-12
**Notes:** Approved as proposed.

---

## #16 — Rename docs schema snapshot away from `0001_init.sql`

**Status:** APPROVED
**Raised:** 2026-08-12
**Category:** B — Better execution
**Affects step:** Doc 2 §2.1 path reference · `docs/0001_init.sql` · agent onboarding
**Blocking:** Yes for the rename itself — Doc 2 prose names the path and Doc 3 §9 forbids the agent editing that prose

### What Doc 2 currently specifies

§2.1: copy `docs/0001_init.sql` verbatim to `supabase/migrations/0001_init.sql`.

### What I propose instead

Rename the docs copy to a non-migration name (e.g. `docs/schema-current.sql`) reflecting that it is now a **consolidated live snapshot** (625 lines, includes post-0002/0003 objects), not the applyable 501-line `0001_init` migration. Ray (or `DOCS_GUARD=off`) updates Doc 2 §2.1 / any other prose that cites the old path. `supabase/migrations/0001_init.sql` stays untouched.

### Why

Same basename, different content, one applyable and one not — a real footgun for future agents.

### Vision test

Doc 3 §2 source hierarchy and §3.2 “never invent a migration” rely on knowing which SQL file is authoritative to apply.

### Cost if approved

One git rename + Doc 2 prose edit by Ray + README/SETUP/Doc 6 path fixes where they cite the docs file.

### Cost if rejected

Ongoing risk of someone re-applying or diffing the wrong file.

### Risk

Broken links in docs until prose is updated in the same session as the rename.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-12
**Notes:** Rename to docs/schema-current.sql. Doc 2 prose path update authorized with this approval.

---

## #17 — Floorplan binary storage policy (Git LFS or out-of-band)

**Status:** APPROVED
**Raised:** 2026-08-12
**Category:** A — Future-proofing
**Affects step:** Per-cluster deep-dive archives (`docs/clusters/<slug>/floorplans/`) · promotion workflow
**Blocking:** No for current code — **Yes** before committing more cluster image packs

### What Doc 2 currently specifies

No binary-storage policy. Practice so far: commit extracted PNGs/JPGs under `docs/clusters/eden/floorplans/` and `docs/clusters/farm-gardens/floorplans/`; runtime serves from Supabase Storage.

### What I propose instead

Pick one before Nara (and later clusters) land more binaries:

**(A) Git LFS** for `docs/clusters/<slug>/floorplans/**/*.{png,jpg,jpeg,webp}` — keeps paths stable for agents, stops fat blobs in normal git history going forward (existing history still heavy unless rewritten).

**(B) Out-of-band archive** (private bucket / Drive) — repo keeps CSV + promotion SQL only; Doc 9 / staging points at the archive. Cleanest git, slightly worse agent locality.

**(C) Status quo** — accept ~35MB+ pack growth per few clusters.

Measured now (this clone): Eden ~21MB, Farm Gardens ~16MB on disk; largest tracked blob ~5.0MB (`farm-gardens-site-plan.png`); pack ~35MB. Runtime does not need these paths (`mediaPublicUrl` → Storage).

### Why

Git stores every re-export forever. Three clusters in, seven+ planned — this is the cheap moment to decide. History rewrite later implies force-push over anything published.

### Vision test

Keeps the data spine maintainable so future map/listings phases are not blocked by an unclonable repo.

### Cost if approved

One-time tooling (LFS or archive convention) + Doc 6 / Doc 9 note. Optional history rewrite is Ray-only and disruptive.

### Cost if rejected / defer (C)

Repo weight climbs with every deep-dive; clones and CI get slower.

### Risk

LFS needs every clone/CI to have LFS smudge; out-of-band needs discipline so promotion images are not “lost.” Do **not** rewrite history without an explicit Ray decision.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-12
**Notes:** Option A — Git LFS going forward. Do NOT rewrite history. New tip may move current `docs/clusters/<slug>/floorplans/` images to LFS pointers in a normal commit.

---

## #18 — Tighten anon `using (true)` read policies on media-related tables

**Status:** APPROVED
**Raised:** 2026-08-12
**Category:** A — Future-proofing
**Affects step:** RLS policies in live schema / new migration
**Blocking:** No — V1 scale is fine; lowest priority in this bundle

### What Doc 2 currently specifies

`pub_sources`, `pub_status`, `pub_media`, `pub_media_links`, `pub_redirects` use `using (true)` for anon/authenticated select (see `0001_init.sql`).

### What I propose instead

Narrow `pub_media` / `pub_media_links` so only media linked to published subjects (or explicitly marked public) is listable — preventing anon enumeration of `uploaded_by` and uploaded-but-unlinked draft files. Leave `status_log` / `redirects` / `sources` as-is unless Ray wants those tightened too.

### Why

Review finding is real but low urgency. Worth a migration before media volume grows.

### Vision test

Accuracy and trust include not leaking draft assets.

### Cost if approved

New migration + policy rewrite + Doc 6 §3.6 + types unchanged. Careful QA that published cluster floor plans still render.

### Cost if rejected

Draft/unlinked media remains publicly selectable via anon key.

### Risk

Over-tight policies break admin previews or public pages that join media differently — needs a query audit before apply.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-12
**Notes:** Approved for media/media_links only. Add staff_read policies so admin can still see drafts.

---

## #19 — Minimal CI: `tsc --noEmit` + `eslint` on push

**Status:** APPROVED
**Raised:** 2026-08-12
**Category:** B — Better execution
**Affects step:** Repo tooling / GitHub Actions (new)
**Blocking:** No

### What Doc 2 currently specifies

Local `npm run build` / gate checks. No CI workflow required in V1.

### What I propose instead

One GitHub Action on push/PR: `npm ci`, `npx tsc --noEmit`, `npm run lint`. Goal: catch `database.ts` drift and type errors before merge. Not a full Playwright suite.

### Why

No automated check today that migrations and generated types stay aligned with `src/`. Solo project tradeoff was defensible at V1; cheap insurance now.

### Vision test

Protects the data spine from silent breakage as more agents touch the repo.

### Cost if approved

One workflow file; Doc 6 §2 note. Needs Node version pin matching local/Vercel.

### Cost if rejected

Continued reliance on human `npm run build` before merge.

### Risk

Low. Flaky only if lockfile/CI Node mismatch — pin versions.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-12
**Notes:** Approved as proposed — tsc --noEmit + eslint on push/PR.

---

## #20 — Adopt Doc 11 (Living / corridor / Compare depth) and Google Places enrichment for valley-wide places

**Status:** APPROVED
**Raised:** 2026-08-14
**Category:** B — Better execution
**Affects step:** Post-V1 product work after Doc 2 Gate 8 / Doc 8 A+B complete; uses existing `places.google_place_id` (Doc 4 #06) and Living/Compare/place routes already in V1
**Blocking:** Yes — for any Google Maps Platform integration, admin Autocomplete, place-detail map/photos work, Living list enrichment, or Compare cross-link work described in Doc 11

### What Doc 2 currently specifies

Doc 2 V1 shipped Living (`/living`, `/living/[category]`), place detail (`/places/[slug]`), Compare (`/compare`, `/compare/[slug]`), and home WhatsOpenNow. Doc 2 Appendix C defers the offline-capable map and other platform features. Doc 4 #06 added `google_place_id` but no Places API client. Doc 8 Appendix C defers interactive map / units UI. Doc 4 #10 keeps cluster amenity categories off the Living route map.

### What I propose instead

1. **Adopt `docs/11-living-corridor-depth-guide.md` as the execution vehicle** — same shape as Doc 2 / Doc 8 (status block, blocks L-A…L-D, actor tags, dual checkboxes, Appendix A/B gates, Appendix C scope boundary).
2. **Execute Doc 11 only after this proposal is APPROVED**, in order:
   - **L-A:** Maps Platform keys **[R]**; admin Autocomplete on `/admin/places/[id]` for valley-wide places only; hours/address/website/`google_place_id` backfill workflow.
   - **L-B:** Public place detail — Maps Embed when coords exist; place photos via existing `media_links`; open-now chip.
   - **L-C:** Living index/category list enrichment (open-now, optional thumbs); WhatsOpenNow quality follows hours data.
   - **L-D:** Compare depth — cross-links to Living/places; optional in-community strip; content audit. **No Google API on Compare.**
3. **Hard locks in Doc 11:** Google only for `cluster_id` null places; no live Google on public list/detail request paths for hours (cache into DB); no new Living categories; no star ratings unless Ray flips that in decision notes; no units/interactive Valley map in this guide (separate Doc 4 later).
4. **Open questions for Ray’s decision notes:** (1) Google as a `sources` row + default confidence for backfills; (2) public ratings yes/no (guide default **no**); (3) billing/keys.

### Why

Live audit 2026-08-14: 134 published places, **0** `google_place_id`, **28** with hours, **0** websites; 79 cluster-scoped brochure pins correctly have no Google fields. Living and place detail are the public places product but thin; WhatsOpenNow is gated by hours holes (all 8 schools, salon/gym/spa, most malls). Schema and admin already expose `google_place_id` with no API. Compare is a separate editorial surface that benefits from Living cross-links, not Place Details. Without a Doc-2-shaped guide, enrichment freestyles past confidence/source rules or paints Google onto brochure amenities.

### Vision test

Doc 3 §1: accuracy with source + confidence; honest local knowledge; roadmap includes navigating nearby services. Enriching corridor Living/places with verified contact/hours (Google as assist, not silent overwrite) is better execution of the V1 Living spine — not listings, not Emaar brand, not Status handover truth.

### Cost if approved

Four context blocks: admin Autocomplete + data ops, place detail map/photos, Living/open-now UI, Compare links/content. New dependency: Google Maps Platform (billing **[R]**). No migration required for the default path. Doc 11 becomes the checklist.

### Cost if rejected

Living/place detail stay thin; open-now stays limited to the 28 places with hours; `google_place_id` remains dead schema; each agent re-litigates Google vs brochure amenities.

### Risk

Medium — API cost/quota; stale Google hours vs on-the-ground truth; temptation to Autocomplete cluster pools. Mitigated by Doc 11 hard rules (valley-wide only, DB-cached hours, Gate L2 null check on cluster `google_place_id`), ConfidenceGate/source spine, and Ray spot-check on enrichment batches.

---
**RAY'S DECISION:** APPROVED
**Date:** 2026-08-14
**Notes:** Ray said begin the work. Defaults until amended: no public star ratings; Google backfills go through admin Save with existing confidence/source spine (dedicated Google `sources` row optional later). Maps Platform keys still required from Ray before Autocomplete/Embed go live. **Status header corrected to APPROVED 2026-08-14** after agent shipped Doc 11 blocks while this line still said PENDING — process failure; do not ship `src/` again until Status + RAY'S DECISION are both recorded.

---
