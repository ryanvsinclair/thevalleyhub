# DOC 3 — AGENT OPERATING RULES

**Version:** 1.2 · 7 August 2026 — *amended: §4 build-pressure trigger and independent-work definition; §9 extended to document edits; document ownership stated*
**Read this file at the start of every session, before Doc 2's status block.**

---

## §1 — THE VISION

*Referenced whenever evaluating whether an idea belongs. Not a to-do list.*

> This site is being built to become the definitive independent information hub for The Valley by Emaar in Dubai — the place both residents and prospective residents go for answers nobody else publishes. Its competitive advantage is not breadth but accuracy: every fact carries a source, a confidence level and a verification date, and the site publishes honest negatives ("there is no school in the community", "you cannot live here without a car") where commercial sites deflect. It does not compete with property portals on listings or with Emaar on brand. It competes on being right, and on knowing things that can only be learned by physically walking the community.
>
> Over time it grows from a content site into a community platform: an offline-capable map for navigating between clusters and nearby services, resident forums, a community marketplace, live updates on handovers and amenity openings, an events and activities calendar, property listings within The Valley, and an ongoing blog. Every one of those features attaches to the same data spine — clusters, places, questions, status records — which is why the schema matters more than any individual page. The site should feel like it was built by someone who lives there, because the information in it could only have come from someone who does.

**V1 builds the spine and the content layer only.** Everything after "over time" is out of scope. See Doc 2 Appendix C.

---

## §2 — SOURCE HIERARCHY

Conflicts resolve downward. Higher wins, always.

| Rank | Source | Governs |
|---|---|---|
| 1 | `src/types/database.ts` (generated) | Column names and types. Absolute. |
| 2 | `supabase/migrations/0001_init.sql` | Schema structure |
| 3 | **Doc 1 — Information Reference** | Valley-wide facts and the cluster overview table. Per-cluster facts, once migrated, live in `docs/clusters/<slug>/reference.md` at this same rank. |
| 4 | **Doc 2 — Master Build Guide** | What to build and in what order |
| 5 | **Doc 3 — this file** | How to behave |
| 6 | Ray, in conversation | Overrides anything above — but must be written into the relevant doc |

**Not sources, ever:** your training knowledge about The Valley · web search · the superseded documents (`valley-master-reference.md`, `valley-site-spec.md`, `valley-portal-addendum.md`) · another AI's output · plausible inference.

---

## §3 — THE FIVE HARD RULES

### 3.1 Never invent a fact about The Valley

If a value is not in Doc 1, it is `null`. Not estimated, not inferred, not "approximately", not carried over from a similar cluster.

**The specific trap:** you will be seeding cluster pages and hit Nima, which has no published specifications. Writing "approximately 2,400 sq ft" is plausible, looks correct, and is fabrication. The entire premise of this site is the difference between verified and plausible. Leave it null and flag it.

Doc 1 Annex J lists content that must never appear. Check it before writing any factual copy.

### 3.2 Never invent a column, table, or field name

Read `src/types/database.ts`. The column is `hours`, not `opening_hours`. It is `bua_min`, not `size_min`. If a column you expect does not exist, that is not a bug to fix with a migration — it is a question for Ray.

**Never write a migration that was not specified in Doc 2.**

### 3.3 Check for duplication before creating anything

Before creating any file, table, column, component, route, function, or type:

```
1. Does it already exist?           → search the codebase by name and by purpose
2. Is it in Doc 2's scope?          → if not listed, it is not in scope
3. Does something similar exist
   under a different name?          → extend it rather than duplicating
4. Is it on the Appendix C
   exclusion list?                  → stop, it is out of V1
```

All four must clear. If any fails, stop and ask.

### 3.4 Never weaken security

Prohibited without exception:
- Using the service role key for admin writes (breaks `auth.uid()` and the audit trail)
- Importing `lib/supabase/admin.ts` anywhere reachable by the client
- Disabling or dropping an RLS policy, including "temporarily, to debug"
- Creating a view over an RLS-protected table without `security_invoker = on`
- Committing `.env.local` or any real key
- Loosening a policy to make a query work — the query is wrong, not the policy

RLS returning `[]` is correct behaviour, not a failure.

### 3.5 Stay inside the confirmed section

Implement only the section marked current in the status block. Do not build ahead. If Section 4's spec looks obvious while you are seeding, it is not — you would be guessing at a spec that has not been written, and it may be written differently.

---

## §4 — PAUSE PROTOCOL

**Trigger:** at any point you conclude a different approach would be better than what Doc 2 specifies, or that something additional should be built.

**The trigger you will miss:** a step that will not build or a gate that will not pass. In that moment finishing feels like progress and stopping feels like failing the step — so the fix gets applied and the pause never happens. It is the reverse. A blocked step correctly raised is a completed obligation. `npm run build` failing on something Doc 2 does not describe is a §4 trigger, not a bug to clear.

Follow exactly. Do not skip to step 5.

### Step 1 — Stop
Do not implement. Do not prototype. Do not "just try it."

### Step 2 — Record position
Update Doc 2's status block:
```
LAST COMPLETED:  <last fully verified step>
SPEC ALIGNED:    Yes
CURRENT TASK:    PAUSED at step X.Y — <exactly what is done, what remains>
NEXT UP:         Awaiting Ray's decision on Proposal #NN
BLOCKERS:        Proposal pending
```
Anyone must be able to resume from this alone.

### Step 3 — Test against the vision (§1)
Does the idea serve what the site is setting out to become?
**No → discard silently.** Do not raise it. Resume.

### Step 4 — Test against the scope gate
Only two categories qualify:

**(A) Future-proofing.** Makes V1 accommodate a roadmap feature without building it. A nullable column, a naming choice, an isolation boundary. Costs near-zero now, saves a migration later.

**(B) Better execution of an existing V1 step.** Same outcome, materially better method. Requires strong reasoning — not preference, not convention, not "this is how it's usually done."

**Neither → discard silently.** Resume.

Explicitly disqualified: any new feature · anything on Doc 2 Appendix C · new dependencies · alternative stacks · schema redesign · "while we're here" improvements.

### Step 5 — Write the proposal
Append to `04-proposals.md` in the documented format. One entry, numbered.

### Step 6 — Tell Ray, then wait
State the proposal number, the category, and the reasoning in one short message. **Do not implement.** Do not proceed to dependent work. If independent work remains in the current step, continue with that and note it in the status block.

**"Independent" means it does not sit on top of the pending change.** If the proposed change would be underneath what you would build next — a client, a query layer, a schema object, a shared component — there is no independent work. Wait.

---

## §5 — CLARIFICATION PROTOCOL

**Never guess. Never proceed on an assumption.** Every question must name its exact step.

### What triggers a question

| Trigger | Example |
|---|---|
| Missing data in Doc 1 | Nima specs, Rivana plots, Lillia unit count |
| Conflict inside Doc 1 | Farm Gardens 2 handover, Elva handover, Rivera price |
| Contradiction between docs | A column in one and not another |
| Ambiguous scope | "Do comparison pages count as questions?" |
| Undefined format | A value not in Annex L |
| Environment mismatch | Guide says a table exists, database disagrees |
| Needs a credential or real-world action | Anything tagged **[R]** |
| Genuine novelty | Anything not covered above |

### Blocking vs non-blocking

**Non-blocking** — one field, one row, rest of the step can proceed. Set null, log it, **continue**, present as a batch at step end. Do not interrupt eight times in one seed run.

**Blocking** — cannot proceed correctly. Stop immediately, update the status block, ask.

### Required format

```
STEP:       3.4 — seed places
BLOCKER:    hours for masabih-masjid
DOC 1 SAYS: Location and existence confirmed. No hours published.
I NEED:     The value, or confirmation to leave null and set state='draft'
STATUS:     45 of 47 places seeded. This and one other pending.
BLOCKING:   No — continuing with remaining rows
```

`STATUS` and `BLOCKING` are mandatory. They tell Ray whether to drop everything or answer later.

---

## §6 — VERIFICATION AND RE-READING

### No scheduled re-reads
Do not re-read completed sections on a schedule. Completed and gate-passed work is settled. Re-reading invites re-litigation of decisions already made, and burns context you need for current work.

### Read at session start
Doc 3 (this file) and Doc 2's status block. Nothing else by default.

### Gates, not re-reads
At each section boundary run the Doc 2 Appendix B gate. Objective assertions only.

### Only three things reopen settled work
1. **Gate failure** → return to the specific step that owns the failure. Nothing else reopens.
2. **Dependency change** → if a later step modifies something an earlier step created, re-run that earlier gate.
3. **Ray says so.**

---

## §7 — STACK GOTCHAS

Your training data likely predates these. Getting them wrong wastes a cycle.

| Area | Correct | Wrong |
|---|---|---|
| Tailwind v4 | CSS-first `@theme` in globals.css | `tailwind.config.js` — does not exist here |
| Next.js 15 | `params` and `searchParams` are **async**, must be awaited | Sync destructuring |
| Supabase SSR | `@supabase/ssr` | `@supabase/auth-helpers-nextjs` — deprecated |
| Mutations | Server Actions | API routes |
| Data fetching | Direct Supabase in Server Components | `useEffect` + client fetch |
| Views over RLS tables | `with (security_invoker = on)` | Default — silently bypasses RLS |
| Table exposure | Explicit `grant` required | Auto-expose is OFF in this project |
| Types | Generated via CLI, committed | Hand-written interfaces |
| Storage schema | `create policy` on `storage.objects` is permitted; on failure use the Doc 2 step 2.2 dashboard fallback | Any `alter table` on `storage.*` or `auth.*` — managed schemas, blocked since Apr 2025 |

---

## §8 — SESSION CHECKLIST

**Start**
- [ ] Read this file
- [ ] Read Doc 2 status block
- [ ] Read Doc 5 entries for completed blocks — CONVENTIONS especially
- [ ] If Doc 6 exists, read it before touching anything
- [ ] Confirm current task; if unclear, ask
- [ ] Confirm no unresolved proposal blocks it

**Before creating anything**
- [ ] §3.3 duplication check, all four questions
- [ ] Confirm it is in the current section's scope

**Before writing any fact about The Valley**
- [ ] Value exists in Doc 1
- [ ] Confidence marker carried through
- [ ] Not in Annex J

**End of step**
- [ ] Step's conditions objectively met
- [ ] Ticked in both the section and Appendix A
- [ ] Status block rewritten
- [ ] Clarification batch presented, if any

**End of section**
- [ ] Appendix B gate run and passed
- [ ] Status block shows gate result
- [ ] `ATTENTION NEEDED` current, and raised with Ray if not None

**End of context block** (§10)
- [ ] Both gates in the block passed
- [ ] Doc 5 entry written — full template, no empty fields
- [ ] Every checkbox ticked in both the section and Appendix A
- [ ] Status block updated to the next block
- [ ] Context cleared

**After Doc 6 exists** (§11)
- [ ] Did this session change code or database? → Doc 6 updated in this session
- [ ] Changelog entry appended

---

## §9 — WHEN YOU THINK CLAUDE'S SPEC IS WRONG

It sometimes is. Two errors were found and corrected during the drafting of these documents.

**Do not silently correct.** Raise it as a proposal (§4) or a clarification (§5). A silent fix means the codebase and the spec diverge and neither Ray nor anyone else knows which is authoritative.

Saying "this appears wrong, here is why" is always the correct move. Fixing it quietly never is.

### This runs in both directions

Changing the **document** to match the code is also a silent correction, and a worse one. Correcting code leaves the spec intact as a record of intent; rewriting the spec destroys that record and makes every later gate self-certifying — the work is checked against a description the agent wrote to fit it.

**Docs 1, 2 and 3 are Ray's**, and so is `docs/clusters/<slug>/reference.md` (Doc 4 #09) — same weight as Doc 1, just relocated per-cluster once a cluster migrates. The agent's only permitted writes to any of them are:
- Doc 2's status block fields
- toggling `[ ]` to `[x]` where the surrounding text is otherwise unchanged

Everything else — prose, step descriptions, gate assertions, tables, headings, rules — is Ray's alone, including obvious errors and stale wording. Docs 4, 5 and 6, Doc 7 (staging format template), and `docs/clusters/<slug>/staging.md` (per-cluster staging, same rules as Doc 7) are the agent's to write under their own rules.

**Doc 1 / `reference.md` sync:** Doc 1's per-cluster overview table (Annex C) carries exactly 7 fields per migrated cluster — `slug, name, phase, product_type, unit_count, state, confidence`. Nothing else about a cluster is ever duplicated into Doc 1; depth lives only in `reference.md`. Whenever a cluster's `reference.md` changes, check whether any of those 7 fields changed; if so, flag it to Ray so Doc 1's overview row can be updated too (§12). This keeps the check mechanical rather than an open-ended re-read of the whole reference file.

This is enforced by a pre-commit hook. If it rejects a commit, the hook is right. Never use `--no-verify`; never make a document writable to get around it.

---


## §10 — CONTEXT BLOCKS AND CLEARING

Work is grouped into three blocks (Doc 2). Context clears **between** blocks only.

| Block | Sections | Shape |
|---|---|---|
| A | 2–3 | Database — schema then seed |
| B | 4–5 | Application — public then admin |
| C | 6–7 | Ship — SEO then launch |

### Why blocks, not sections
Sections inside a block are tightly coupled — the seed needs the schema fresh, the admin needs the public data layer fresh. Clearing between them costs continuity for no benefit. Clearing between blocks avoids long-context degradation without losing coupling.

### Never clear mid-section
Half a section's working state is the worst case: continuity lost, no gate to verify against. Finish the section, run the gate, then decide.

### Boundary procedure — in order
1. Run both gates for the block. Both must pass.
2. Write the Doc 5 entry for the block. Full template, no empty fields.
3. Update the status block: new `CONTEXT BLOCK`, `NEXT UP`, `ATTENTION NEEDED`.
4. Confirm every checkbox in the block is ticked in **both** the section and Appendix A.
5. Clear context.

### What survives a clear
Only: Doc 3, Doc 2's status block, Doc 5, `src/types/database.ts`, and the codebase itself.

**Does not survive, and must not be carried:** the previous block's working files, conversation history, draft SQL, superseded assumptions.

### After clearing
Read Doc 3, then Doc 2's status block, then the Doc 5 entries for completed blocks — particularly `CONVENTIONS`, which is what keeps the codebase in one dialect. Then start.

### If you notice drift
If the new block's natural approach conflicts with a convention recorded in Doc 5, **follow Doc 5.** Consistency beats preference. If you believe the recorded convention is genuinely wrong, that is a proposal (§4), not a unilateral change.

---

## §11 — DOC 6 MAINTENANCE (permanent, from the moment it exists)

Doc 6 is the system of record — a truthful description of what exists, written after V1 and maintained forever.

### The rule
> **Any change to the codebase or database updates Doc 6 in the same working session as the change.**

Not later. Not batched. Not "I'll note it." Same session, or the change is incomplete.

### Why this is non-negotiable
A stale system-of-record is more dangerous than none. A future agent reads Doc 6, sees a column that was renamed months ago, writes code against it, and either breaks something or "helpfully" recreates what it thinks is missing. Doc 6 must be true at all times or it must not be trusted at all.

### What triggers an update
| Change | Update |
|---|---|
| Migration — any schema change | §3 Database + changelog |
| New or changed RLS policy | §3 Security |
| New route or page | §4 Application |
| New or changed component pattern | §4 Conventions |
| New dependency | §2 Stack |
| Changed env var | §2 Configuration |
| New feature of any size | Relevant section + changelog |
| Deprecating anything | Remove it and log the removal — never leave it described |

### Changelog format
Every material change appends:
```
### YYYY-MM-DD — <what changed>
**Why:** <reason>
**Affects:** <sections updated>
**Breaking:** yes/no — <what a future build must know>
```

### The specific failure to prevent
Later phases — map, forums, marketplace, listings — will be built by reading Doc 6. If it describes deprecated logic, that phase is built on a false foundation and the breakage surfaces somewhere unrelated. Keeping Doc 6 true is the cheapest possible insurance against that.

---

## §12 — FLAGGING RAY'S ATTENTION

Anything requiring Ray's review, decision, or knowledge must be **actively raised**, not left in a file to be discovered.

### What must be raised
- A pending proposal in Doc 4
- An unanswered clarification (§5)
- Any step tagged **[R]**
- A gap in Doc 1 only Ray's legwork can fill
- A failed gate that cannot be self-resolved
- Any conflict between documents

### How
1. Add it to the status block's `ATTENTION NEEDED` line
2. **Tell Ray directly in the same message** — document, section, what is needed, whether it blocks
3. Do not assume a written note has been seen

### Format
```
⚠️ ATTENTION NEEDED
Where:     Doc 4 — Proposal #03
What:      Approve, reject or amend
Blocking:  Yes — step 4.3 cannot proceed
```

Never let a decision sit silently. If it has been raised and not answered, raise it again at the next natural break — once, not repeatedly.

---


---

*End of Doc 3.*
