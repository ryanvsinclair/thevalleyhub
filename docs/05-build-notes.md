# DOC 5 — BUILD NOTES

**Version:** 1.1 · 7 August 2026 — *amended: illustrative example now references the real schema*
**Written by:** the agent, at each context block boundary (Doc 3 §10)
**Purpose:** carry reasoning across context clears, and supply the raw material for Doc 6

---

## WHY THIS FILE EXISTS

Context clears between blocks. Structures survive that — they are in the code. **Reasoning does not.**

At Gate 8 the agent can read the migration and describe what the schema *is*. It cannot recover why `security_invoker` is on that view, why the Annex L vocabularies carry no database check constraints, or why admin writes use the session client. That knowledge lived in a context that no longer exists.

This file is the handoff artefact between cleared contexts. Without it, every block boundary leaks the decisions made inside it, and Doc 6 becomes a description without an explanation.

---

## RULES

1. Written at the **end of each block**, before clearing. Three entries total.
2. Every field filled. `None` is a valid answer; blank is not.
3. Record reasoning, not narration. Not "created the clusters table" — that is in the migration. Record *why it is shaped that way*, and what was rejected.
4. `CONVENTIONS` is the most important field. It is what stops the next block inventing a second dialect.
5. Never edit a completed entry. If something later proves wrong, note it in the next entry.
6. On resuming after a clear, read every completed entry — `CONVENTIONS` first.

---

## ENTRY TEMPLATE

```markdown
# BLOCK <A|B|C> — <Sections N–M>
**Completed:** YYYY-MM-DD
**Gates passed:** Gate N ✅ · Gate M ✅

## DECISIONS MADE
For each non-obvious choice:
- **<decision>** — because <reason>. Rejected: <alternative> because <why>.

## CONVENTIONS ESTABLISHED
Patterns the next block must follow. Be specific enough to copy.
- Naming: <files, functions, columns, components>
- File organisation: <what goes where>
- Query shape: <how data access is structured>
- Error handling: <the pattern>
- Types: <how derived and used>

## DEVIATIONS FROM DOC 2
- <what differed, why, whether Ray approved> — or `None`

## GOTCHAS
Things that will bite a future developer.
- <what, when it surfaces, how to avoid it>

## EXTENSION POINTS
Deliberately left open for later phases.
- <what, for which roadmap feature, how to use it>

## VERIFIED STATE
What the gate objectively confirmed. Facts, not claims.
- <assertion → actual result>

## OPEN ITEMS CARRIED FORWARD
- <unresolved question, pending proposal, known gap> — or `None`
```

---

## WHAT BELONGS IN `GOTCHAS`

The highest-value field and the easiest to under-fill. Examples of the kind of thing that matters:

- A Supabase behaviour that differs from the docs
- A workaround whose reason is not obvious from the code
- An ordering dependency between migrations or seeds
- A silent failure mode — RLS returning `[]` rather than erroring
- A place where the obvious approach is wrong and the reason is not visible
- A library version constraint

**Test:** if a competent developer could hit this and lose an hour, it belongs here.

---

## WHAT BELONGS IN `EXTENSION POINTS`

Where V1 was deliberately shaped to accommodate something later. This is what makes the next phase cheap.

- `lib/queries/` isolates data access, so the map can reuse it without touching pages
- `places.lat/lng` populated at seed, so the map has coordinates on day one
- `media_links` is polymorphic, so future entities attach without a schema change
- `status_log` is append-only, so the live updates feed is a query not a rebuild
- `profiles.role` exists with one row, so adding an editor is an insert not a migration

State what it is, which roadmap feature it serves, and how to use it.

---

# ENTRIES

*None yet. First entry is written at the end of Block A — Sections 2 and 3.*
