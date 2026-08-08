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

**Status:** PENDING
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
**RAY'S DECISION:**
**Date:**
**Notes:**

---
