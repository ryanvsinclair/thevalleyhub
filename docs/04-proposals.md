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

*None. First real entry is #01.*
