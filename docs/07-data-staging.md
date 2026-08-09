# DOC 7 — DATA STAGING

**Version:** 2.0 · 2026-08-09 — *staging moved to per-cluster files (`docs/clusters/<slug>/staging.md`); this doc retained as the format template and historical pointer. See Doc 4 Proposal #04 (original) and its per-cluster extension.*
**Written by:** the agent, per Doc 4 Proposal #04
**Decided by:** Ray only — per-cluster `reference.md` files still accept prose only from Ray, or under `DOCS_GUARD=off`, exactly as Doc 3 §9 already requires

---

## Staging now lives per cluster

Doc 7 was the single staging log for every cluster's intake batches. With 7+ clusters now covered and 15+ more coming over the build-out, one growing file became read-heavy fast (130 lines after a single batch). Staging is now split into `docs/clusters/<slug>/staging.md` — one file per cluster, each following the same rules and entry format below. `docs/clusters/<slug>/reference.md` is the per-cluster equivalent of what this project used to keep in Doc 1's Annex C/D.

Batch 001 (the Farm Gardens PDF export) has been relocated to [`docs/clusters/farm-gardens/staging.md`](clusters/farm-gardens/staging.md) — nothing was lost, only moved. It is still `staged`, not `promoted`.

This file is retained so the rules and entry format have one canonical source every per-cluster `staging.md` copies from, rather than being redefined 20+ times.

---

## RULES

1. Each cluster's `staging.md` is the only place new external-source facts about that cluster get staged before they become part of its `reference.md`. `reference.md` is never edited directly to introduce a new fact — the batch goes there first.
2. One numbered batch per intake (a PDF export, a factsheet, a site visit, an operator call), scoped within that cluster's own file. Never edit a promoted batch — supersede it with a new one if a value turns out wrong.
3. Every fact in a batch carries a `source_id` and a confidence level, exactly as Doc 3 §1 requires everywhere else. Staging skips the propose→approve→implement ceremony of Doc 4 — it does not skip sourcing rigor.
4. A batch is not a fact until it's `promoted` — i.e. until its proposed `reference.md` diff has actually landed via a Ray-run (or Ray-authorized) commit. Until then, nothing in staging overrides what `reference.md` currently says.
5. Schema or structural changes (new columns, new tables) are **not** staged here — those still go through Doc 4 as their own proposal, same as always. A batch can note that a value is blocked on a pending schema proposal.
6. Per Doc 3 §12, a newly staged batch must be raised to Ray directly in the same message, not left for later discovery.

## STATUS VALUES

`staged` · `promoted` · `rejected`

---

## ENTRY FORMAT

```markdown
## Batch NNN — <short description> (YYYY-MM-DD)

**Source:** <files/links, retrieval date>
**Source ID:** <sources.id> (<label>)
**Confidence:** <confidence_level>
**Status:** staged / promoted / rejected

### Proposed reference.md diff
- <exact field-by-field change, in the form it would take in reference.md>

### Notes
<anything blocked on a pending Doc 4 schema proposal, conflicts, things left null>

### Promotion
**Promoted:** [ ]
**Date:**
**By:**
```
