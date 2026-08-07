# DOC 6 — SYSTEM OF RECORD

**Status:** ⛔ NOT YET WRITTEN — template only
**Written at:** Doc 2 step 7.5, on Ray's instruction, after Gate 7 passes
**Maintained:** permanently, under Doc 3 §11

---

## ⚠️ READ THIS FIRST

This document does not describe what was *planned*. It describes what **exists**.

Every claim in it is verified against the live codebase and the live database at the time of writing. Where the migration file and the actual database disagree, the database wins and the discrepancy is recorded.

### The permanent rule

> **Any change to code or database updates this document in the same working session.**

A stale system-of-record is worse than none. Someone building the map in eight months will read this and trust it. If it describes a column renamed six months ago, they build on a false foundation and the breakage surfaces somewhere unrelated.

If you are changing something and have not updated this file, **the change is not finished.**

### How to write it
- Audit the live system directly. Do not write from memory or from Doc 2.
- Trace every "why" to a Doc 5 entry. If no entry explains it, mark it `UNKNOWN — reason not recorded`.
- **Never guess at reasoning.** `UNKNOWN` is honest and useful. A plausible invented rationale is neither.

---

# TEMPLATE

## 1. PURPOSE AND VISION

- What the site is and who it serves
- The vision, verbatim from Doc 3 §1
- What V1 deliberately does and does not do
- The roadmap, and which parts V1 was shaped to accommodate

## 2. STACK AND CONFIGURATION

- Framework, versions, rendering strategy
- Every dependency and why it is present
- Every environment variable, what it does, where it is consumed
- Deployment: build, deploy, revalidation
- **Anything a fresh clone needs that is not obvious**

## 3. DATABASE — AUTHORITATIVE

The core of this document. Written from the live database.

**3.1 Overview** — table count, relationship map, the design principle behind the shape

**3.2 Tables** — for each: purpose, every column with type and meaning, constraints, defaults, what populates it, what reads it

**3.3 Enums and vocabularies** — every enum, every controlled vocabulary, where enforced

**3.4 Views and functions** — what each does, why it exists, security context

**3.5 Triggers** — what fires, when, what it does

**3.6 Security** — RLS state per table, every policy in plain language, grants, what anon can and cannot reach, service role usage

**3.7 Indexes** — what exists and which query it serves

**3.8 Data provenance** — where seeded content came from, the confidence model, what is deliberately null

## 4. APPLICATION

**4.1 Routes** — every route, what it queries, how it renders, static or dynamic

**4.2 Data layer** — `lib/queries/` structure, the access pattern, why it is isolated

**4.3 Components** — shared components, the CVA pattern, the confidence-gating mechanism

**4.4 Admin** — auth flow, write path, why session client not service role, audit behaviour

**4.5 Conventions** — naming, file organisation, error handling, type derivation. Assembled from Doc 5.

## 5. CONTENT MODEL

- How a fact moves from Doc 1 to a rendered page
- The confidence model and what it gates
- What is published vs draft and why
- The prohibited-content rules and where they are enforced

## 6. HOW TO EXTEND

Written for someone who was not here.

**6.1 Extension points** — from Doc 5, with usage

**6.2 Common tasks** — add a cluster, add a place, add a question, add a route, change the schema safely, add a table

**6.3 Roadmap features** — for each of map, forums, marketplace, events, listings: what already supports it, what is missing, likely approach, what not to break

**6.4 What not to change** — decisions with non-obvious consequences. Each with the reason. This section prevents the most damage.

## 7. GOTCHAS AND CONSTRAINTS

From Doc 5, consolidated. Every known trap, when it surfaces, how to avoid it.

## 8. KNOWN GAPS

- Content gaps carried from Doc 1 Annex K
- Technical debt taken knowingly, and why
- What was deferred out of V1
- What needs Ray's real-world action

## 9. VERIFICATION STATE

- Which gates passed and when
- What was objectively verified vs assumed
- Anything marked `UNKNOWN` and what would resolve it

## 10. CHANGELOG

Append-only. Every material change from V1 onward.

```
### YYYY-MM-DD — <what changed>
**Why:** <reason>
**Affects:** <sections of this document updated>
**Breaking:** yes/no — <what a future build must know>
```

First entry is the V1 baseline:
```
### <date> — V1 baseline
**Why:** Initial release. State at Gate 7.
**Affects:** All sections.
**Breaking:** n/a — baseline.
```

---

## COMPLETENESS CHECK

Before committing, confirm:

- [ ] Every table in the live database appears in §3
- [ ] Every route in `src/app` appears in §4
- [ ] Every dependency in `package.json` appears in §2
- [ ] Every environment variable appears in §2
- [ ] Every gotcha from Doc 5 appears in §7
- [ ] Every extension point from Doc 5 appears in §6.1
- [ ] No template placeholder text remains
- [ ] Nothing is guessed — unknowns are marked `UNKNOWN`
- [ ] Changelog seeded with the V1 baseline
- [ ] Ray told it is complete and ready for review

---

*This template is replaced entirely when Doc 6 is written. Delete these instructions at that point.*
