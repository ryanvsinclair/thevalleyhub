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

---

# BLOCK B — Sections 4–5
**Completed:** 2026-08-08
**Gates passed:** Gate 4 ✅ · Gate 5 ✅

## DECISIONS MADE
- **`createAnonClient()` for all public `lib/queries/*` reads** — because `generateStaticParams` / SSG has no request/`cookies()` context. Same anon key and RLS as an unauthenticated visitor. Rejected: cookie `createClient()` everywhere (breaks build); rejected: forcing all routes dynamic. Proposal #01 APPROVED 2026-08-08.
- **Cookie `createClient()` (RSC) vs `createActionClient()` (Server Actions)** — both anon-key `@supabase/ssr`; Action client must be able to write cookies (no swallowed `setAll` errors). Admin layout uses RSC client + `getUser()`; mutations use Action client so `auth.uid()` / audit work.
- **Admin allowlist = `ADMIN_EMAIL` env** — magic link + layout + actions all check it. `shouldCreateUser: false` on OTP (owner already bootstrapped). Rejected: open signup or role-only checks without email allowlist.
- **Admin writes only via `createActionClient()`** — never `createAdminClient()` for content. Service role remains roadmap-only (`admin.ts` + `server-only`).
- **§5.3 Supabase webhook deferred to §7.2** — needs a live public URL; Ray reminder added at launch. On-save `revalidatePath` in admin actions covers editor-driven publishes for V1 until then.

## CONVENTIONS ESTABLISHED
- **Supabase clients by layer:**
  - `createAnonClient()` — public `lib/queries/*` only (SSG-safe).
  - `createClient()` — request-scoped RSC session (admin layout gate).
  - `createActionClient()` — Server Actions / cookie writes / session mutations.
  - `createAdminClient()` — service role, never content writes.
- **Public data:** pages call `lib/queries/*` only; no inline Supabase in public pages.
- **Admin data:** dashboard/lists may use cookie `createClient()`; all inserts/updates/deletes go through `src/lib/admin/actions.ts` + zod in `src/lib/schema.ts`.
- **Auth routes:** `/login`, `/auth/callback`; unauthenticated `/admin/*` → `/login`.
- **Optional form fields:** treat missing/`""` as `null` in zod preprocessors (`emptyToNull`) — FormData omits unused fields.
- **ConfidenceGate** still owns unverified spec hiding on public pages; admin can edit raw values.

## DEVIATIONS FROM DOC 2
- Step 4.1: `createAnonClient` — Proposal #01 APPROVED.
- Step 5.3 webhook: not configured yet; deferred to §7.2 / Block C end by Ray (reminders in Doc 2). Agent-built `/api/revalidate` + on-save revalidation are in place.
- Installed Next is **16.3.0** while locked decisions / Doc 3 §7 still say Next.js 15 — behaviour (async params) followed; version string not amended in this block.
- Empty `ADMIN_EMAIL=` in parent shell env blocks `.env.local` (Next does not override existing env). Start dev with `env -u ADMIN_EMAIL` or unset it.

## GOTCHAS
- `cookies()` / cookie client inside `generateStaticParams` fails the build — use `createAnonClient`.
- Parent env `ADMIN_EMAIL=` (empty) shadows `.env.local` — looks “not configured.”
- Magic-link `emailRedirectTo` uses `NEXT_PUBLIC_SITE_URL`; if another app owns that port, the link hits the wrong project.
- RLS returns `[]` / `null`, not errors, for drafts via anon.
- Gate 5 create-question UI was missing initially (list/edit only); `/admin/questions/new` + delete added to satisfy the gate literally.
- `createAdminClient` must never be imported from client components; Gate 5 greps `SERVICE_ROLE` in `*.ts` and `*.tsx` — only `admin.ts` permitted.

## EXTENSION POINTS
- `createAdminClient` ready for non-session system tasks (none in V1).
- `/api/revalidate` accepts `path` or `paths[]` for webhook or external tools.
- Admin nav/entity editors cover Doc 2 §5.2 surface; media upload uses session storage policies.
- Public query layer reusable for Section 6 metadata/JSON-LD without new fetch patterns.

## VERIFIED STATE
- Gate 4: `npm run build` exit 0; public SSG routes; footer disclaimer; no placeholder copy greps.
- Gate 5: build exit 0; `SERVICE_ROLE` only in `admin.ts`; `import "server-only"` first line; test question create via `/admin` → `audit_log.actor_id` non-null; test row deleted (insert + delete both audited with actor).
- RLS: anon cannot read draft clusters; published readable.

## OPEN ITEMS CARRIED FORWARD
- **§5.3 Supabase revalidate webhook [R]** — do at §7.2 after deploy (`SETUP.md` §6; Doc 2 §7.2 + Block C reminders).
- Next.js 15 vs 16 doc mismatch — Ray to pin docs or package later.
- Optional: remove empty `ADMIN_EMAIL` from shell/Cursor env so plain `npm run dev` works.

---

# BLOCK C — Sections 6–7
**Completed:** 2026-08-08
**Gates passed:** Gate 6 ✅ · Gate 7 ✅ (temp production URL; custom domain parked)

## DECISIONS MADE
- **SEO on App Router metadata + JSON-LD components** — `src/lib/seo/*` + per-route `generateMetadata`; FAQ/Place/Residence/Article/BreadcrumbList. Rejected: stuffing JSON-LD only in layout.
- **Redirects via `src/middleware.ts` reading `redirects` with `createAnonClient()`** — Edge-safe, RLS anon select. Next 16 deprecates middleware→proxy; kept filename per Doc 2 until Ray amends.
- **Production deploy on `thevalleyhub.vercel.app`** — GitHub `thevalleyhub` → Vercel. First deploys had `framework: null` / platform NOT_FOUND; fixed by `vercel.json` `"framework":"nextjs"` + git push. Rejected: relying on dashboard redeploy alone (did not create a new build).
- **§5.3 revalidate via `pg_net` + `notify_site_revalidate()` triggers** — Dashboard Database Webhook payload shape does not match `/api/revalidate` (`path`/`paths`). Triggers on `clusters`, `places`, `questions`, `comparisons`, `posts`, `status_log`. Secret lives in function body (V1); rotate with Vercel env together.
- **Launch domain + Search Console deferred** — Ray: product work continues; custom domain / GSC / Bing / analytics parked in `SETUP.md` §7 until Ray confirms ready to launch. Status: `V1 COMPLETE — LAUNCH CHECKLIST OPEN`.

## CONVENTIONS ESTABLISHED
- **Naming map (URL ≠ table):** `/blog` → `posts` (never `blog_posts`); `/compare` → `communities`+`comparisons`; `/living/*` → `places` category groups; `/status` → `status_log` / `current_status`. Documented in `SETUP.md`.
- **Public SEO:** metadata helpers + `JsonLd` only; sitemap published-only; robots allow public, disallow `/admin`.
- **Revalidate:** admin actions call `revalidatePath`; DB-side changes hit `POST /api/revalidate` with `x-revalidate-secret`.
- **Vercel:** keep `vercel.json` framework `nextjs`; Production env must match `.env.local` exactly (no trailing spaces in secrets).

## DEVIATIONS FROM DOC 2
- Next.js **16.3.0** vs docs saying 15 — unchanged from Block B.
- Gate 7 custom domain + §7.3 post-launch not done at V1 complete — Ray deferred to `SETUP.md` §7 launch checklist.
- Doc 2 prose/structure not rewritten for the park (Doc 3 §9); only status + checkbox toggles + SETUP/Doc 5.

## GOTCHAS
- Vercel `framework: null` → platform `404 NOT_FOUND` on `*.vercel.app` apex even when build READY; `live: false` can linger in API.
- `REVALIDATE_SECRET` typos (appended `curl`, trailing space, truncated hex) cause 401 while “curl works” with the mangled value — probe with `net.http_post` variants.
- SSO protection on all `.vercel.app` except custom domains — unique deployment URLs may require Vercel login.
- Empty shell `ADMIN_EMAIL=` still shadows `.env.local` for local dev.

## EXTENSION POINTS
- Custom domain cutover: Auth URLs, `NEXT_PUBLIC_SITE_URL`, `notify_site_revalidate` URL, then SETUP §7 SEO tools.
- Doc 6 (7.5) when Ray instructs — template at `docs/06-system-of-record.md`.
- Optional admin editor for `posts` (table + public `/blog` exist; 0 rows).

## VERIFIED STATE
- Gate 6: metadata, JSON-LD, sitemap/robots, redirects middleware; local `/sitemap.xml` + `/robots.txt` 200.
- Production: `https://thevalleyhub.vercel.app/` 200; `/sitemap.xml` 200; Auth smoke + admin OK per Ray.
- Webhook: cluster update → `net._http_response` status 200 with clean secret.
- Naming audit: live DB ↔ `database.ts` ↔ `.from()` — 14 tables + `current_status`; no `blog_posts`.

## OPEN ITEMS CARRIED FORWARD
- **SETUP.md §7 launch checklist [R]** — custom domain, Auth/`SITE_URL`/trigger URL updates, Search Console, Bing, analytics — only when Ray confirms ready to launch.
- Doc 6 / Gate 8 — only on Ray's instruction.
- Next.js 15 vs 16 doc pin — still open.
- Optional: `posts` admin UI; `docs-baseline` tag for Gate 0.
