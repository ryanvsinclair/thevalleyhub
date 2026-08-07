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

# BLOCK A — Sections 2–3
**Completed:** 2026-08-07
**Gates passed:** Gate 2 ✅ · Gate 3 ✅

## DECISIONS MADE
- **Migration applied via MCP `apply_migration`, not CLI `db push`** — because the agent shell cannot read `.env.local` (ignored) for `SUPABASE_ACCESS_TOKEN`. SQL body identical to `docs/0001_init.sql`. Rejected: inventing a second migration path or rewriting SQL.
- **Fixed UUIDs for `sources` rows** — so seed FKs are stable across re-runs without lookup gymnastics. Rejected: inserting sources without ids and joining by label (fragile).
- **One `sources` row per kind referenced in Doc 1 (7 kinds)** — matches Doc 2 “one row per source kind”, not one row per operator brand.
- **Conflicting Doc 1 fields left null** — Elva/Farm Gardens 2/Elea handover, Rivera price. Notes record the conflict. Rejected: picking a “best” value.
- **`masabih-masjid` seeded `draft`** — hours missing (Annex K / Doc 2 §3.4). Not invented.
- **Comparisons: 5 dimensions × 5 communities (25 rows)** — Doc 1 Annex H dimensions list; honest reads kept from Doc 1 even when blunt (e.g. DH2 gym rating).

## CONVENTIONS ESTABLISHED
- Naming: seed files `supabase/seed/0N_entity.sql`, executed in numeric order; cluster/place/question identity is `slug`.
- File organisation: authoritative SQL schema lives at `docs/0001_init.sql` and is copied verbatim to `supabase/migrations/0001_init.sql`; project docs live under `docs/`.
- Query shape (for Block B): data access will go through `lib/queries/` — one file per entity; pages must not invent ad-hoc selects.
- Types: only generated `src/types/database.ts`; never hand-written table interfaces.
- Confidence vs state: `state` follows Doc 2 seed rules; `confidence` may be `unverified` on published rows; UI (Block B) must hide unverified raw specs via ConfidenceGate.
- Nulls: absence in Doc 1 → SQL `null` + optional `notes` flag; never estimate.
- Security: admin writes use session client (`can_edit()`), not service role; `lib/supabase/admin.ts` stays `server-only`.
- Seeds reference `source_id` UUIDs from `01_sources.sql` (`a1000000-0000-4000-8000-00000000000N`).

## DEVIATIONS FROM DOC 2
- Step 2.2: MCP `apply_migration` instead of `npx supabase link` + `db push` (CLI auth unavailable to agent). Same SQL. Ray proceeded after verification pass.
- Step 2.3: types via MCP `generate_typescript_types` instead of `--linked` CLI. Same project.

## GOTCHAS
- Agent shell cannot read `.env.local` (cursorignore/gitignore). Use MCP for remote SQL, or have Ray export tokens in the parent shell.
- MCP `execute_sql` returns only the last result set when multiple statements are batched — run Gate queries one at a time.
- `public.rls_auto_enable()` exists on the project and is not in `0001_init.sql` (platform helper). Do not drop it; do not re-create it in migrations.
- Unique-constraint indexes (`*_slug_key`) appear in `pg_indexes` without matching explicit `create index` lines — expected.
- SQL-editor / MCP inserts produce `audit_log.actor_id = null` (no `auth.uid()`). Non-null actor is a Gate 5 assertion via `/admin`.
- Cluster slug check rejects underscores (`gate2-test` ok, `__gate2_test__` fails).
- Storage policies applied cleanly; if they ever fail with `must be owner of table objects`, use Doc 2 step 2.2 dashboard fallback — never `alter table storage.*`.

## EXTENSION POINTS
- `places.lat`/`lng` populated at seed for map phase.
- `status_log` append-only; amenity keys reserved in Annex L but no amenity rows until site visit.
- `questions.is_generated` used for Q24 (`whats-open-late-in-the-valley`) so Block B computes from `places.hours`.
- `media` / `media_links` empty but schema-ready for photos/floorplans.
- `profiles.role` owner bootstrapped; adding an editor is an insert.

## VERIFIED STATE
- Gate 2: 14 tables, 57 public policies, `current_status` with `security_invoker=on`, owner profile, anon `clusters` → `[]`, types 959 lines, `tsc` exit 0.
- Gate 3: clusters 25 / published 12; unit_types 29; places 47 / in_community 7 / drive_verified 1; questions published 52; communities 5; status_log 3; Annex J greps clean; Q24 `is_generated=true`; `masabih-masjid` draft.

## OPEN ITEMS CARRIED FORWARD
- None blocking. Optional: rotate `SUPABASE_ACCESS_TOKEN` if the value that entered agent context is still active.
- Context clear required before Block B (Doc 3 §10).
