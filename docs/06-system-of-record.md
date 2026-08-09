# DOC 6 — SYSTEM OF RECORD

**Status:** LIVE — written 2026-08-08 after Gate 7 (temp production URL)  
**Verified against:** live Supabase project `pyowmcabddaxzsoeoyhx` + repo at that date  
**Maintained:** permanently, under Doc 3 §11

---

## ⚠️ READ THIS FIRST

This document describes what **exists**. Where the migration file and the live database disagree, the database wins.

> **Any change to code or database updates this document in the same working session.**

---

## 1. PURPOSE AND VISION

**What it is:** Independent community information hub for The Valley (Emaar), Dubai — for residents and prospective residents. Not affiliated with Emaar Properties.

**Vision (Doc 3 §1, verbatim):**

> This site is being built to become the definitive independent information hub for The Valley by Emaar in Dubai — the place both residents and prospective residents go for answers nobody else publishes. Its competitive advantage is not breadth but accuracy: every fact carries a source, a confidence level and a verification date, and the site publishes honest negatives ("there is no school in the community", "you cannot live here without a car") where commercial sites deflect. It does not compete with property portals on listings or with Emaar on brand. It competes on being right, and on knowing things that can only be learned by physically walking the community.
>
> Over time it grows from a content site into a community platform: an offline-capable map for navigating between clusters and nearby services, resident forums, a community marketplace, live updates on handovers and amenity openings, an events and activities calendar, property listings within The Valley, and an ongoing blog. Every one of those features attaches to the same data spine — clusters, places, questions, status records — which is why the schema matters more than any individual page. The site should feel like it was built by someone who lives there, because the information in it could only have come from someone who does.

**V1 does:** content pages, questions, cluster/place directories, status tracker, comparisons, blog routes, admin portal, SEO, on-demand revalidation.

**V1 does not:** offline map, forums, marketplace, events, property listings, resident verification, multi-editor accounts, comments, newsletter, payments (Doc 2 Appendix C).

**Roadmap accommodation:** schema and `lib/queries/` shaped so map/forums/listings can attach later without rewriting the spine (Doc 5 Blocks A–C extension points).

---

## 2. STACK AND CONFIGURATION

| Item | Actual |
|---|---|
| Package name | `valley` `0.1.0` |
| Framework | **Next.js 16.3.0** (App Router). Docs still say Next 15 — Doc 5 Block B/C. |
| UI | React 19.2.8 / React DOM 19.2.8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Data | Supabase Postgres + `@supabase/ssr` / `@supabase/supabase-js` |
| Validation | Zod 4 |
| Markdown | `react-markdown` + `remark-gfm` |
| Components | CVA + `clsx` + `tailwind-merge` |
| Deploy | Vercel project `thevalleyhub`; `vercel.json` locks `"framework": "nextjs"` |
| Production URL (current) | `https://thevalleyhub.vercel.app` |
| GitHub | `ryanvsinclair/thevalleyhub` |

### Dependencies (why)

| Package | Why |
|---|---|
| `next`, `react`, `react-dom` | App framework |
| `@supabase/ssr`, `@supabase/supabase-js` | Auth cookies + DB client |
| `zod` | Admin form schemas (`src/lib/schema.ts`) |
| `server-only` | Guard `createAdminClient` |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Button/CVA pattern |
| `react-markdown`, `remark-gfm` | Long-form answers / posts |
| `supabase` (dev) | CLI / types tooling |
| `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `eslint*` | Build/tooling |

### Environment variables

| Variable | Role | Consumed |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin; magic-link redirect base | SEO helpers, login actions, sitemap/robots |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | All Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (RLS applies) | Anon / session / action clients |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypasses RLS; server-only | `src/lib/supabase/admin.ts` only — **never content writes** |
| `REVALIDATE_SECRET` | Guards `POST /api/revalidate` | Route handler + DB trigger headers |
| `ADMIN_EMAIL` | Single allowlisted editor | `src/lib/auth/admin.ts`, login, admin layout/actions |
| `SUPABASE_ACCESS_TOKEN` | Optional CLI token | Local only; never Vercel |

### Deploy / revalidation

- Build: `npm run build` → Next output on Vercel.
- Admin saves call `revalidatePath` in Server Actions.
- DB changes on key tables fire `notify_site_revalidate()` → `POST /api/revalidate` with `x-revalidate-secret` (Doc 5 Block C).

### Fresh clone needs

1. `cp .env.example .env.local` and fill keys (see SETUP.md).
2. `npm install` · `npm run dev` (use `env -u ADMIN_EMAIL` if empty shell var shadows).
3. Linked Supabase project + seeds already applied remotely for production content.
4. Install the docs guard: `git config core.hooksPath scripts` (SETUP.md "Docs guard"). Doc 3 §9 states this hook enforces Doc 1–3 ownership, but git never clones hooks, so it is inert in a fresh working copy until wired up. Found unset on 2026-08-08 — which is how an edit to Doc 2's version line reached `c9647d6`. Required **per clone**, not once per project. The guard filters on file path with no author check, so it blocks Ray too; owner edits use `DOCS_GUARD=off git commit` (Doc 4 #03). The agent never sets that variable and `--no-verify` stays forbidden.

---

## 3. DATABASE — AUTHORITATIVE

**Live audit 2026-08-10:** 17 base tables, 1 view (`current_status`), 72 RLS policies in `public`, 3 enums. Migrations `0002` + `0003_eden_plexes_units` (`eden_plexes_units`) applied. Doc 4 #12 APPROVED.

**Earlier baselines:** 2026-08-09 — 16 tables / 67 policies (`0002`); 2026-08-08 — 14 tables / 57 policies.

### 3.1 Overview

**Design principle:** one content spine (clusters, places, questions, status, communities/comparisons, posts, media) with provenance (`sources`, `confidence`, `verified_at`) and soft publish (`state`, `deleted_at`). Append-only `status_log` + `audit_log`. (Doc 5 Block A; Doc 3 vision.)

**Relationship sketch:**

```
sources ←── clusters ──→ unit_types ──→ units ──→ plexes
   ↑         ↓              ↓              ↑
   │      questions ←→ places        units.plex_id
   │         ↓
   └── status_log
clusters ──→ facade_style_descriptions
communities ──→ comparisons
clusters ──→ posts (optional)
media ←→ media_links (polymorphic subject, incl. unit_type / facade_style_description)
auth.users ──→ profiles (optional unit_id → units)
```

**Row counts (live):** clusters 25 · unit_types 42 · units 508 · plexes 43 · facade_style_descriptions 5 · places 70 (47 Valley-wide + 19 Farm Gardens draft amenities + 4 Eden published amenities) · questions 52 · communities 5 · comparisons 25 · status_log 3 · sources 7 · posts 0 · media 30 · media_links 30 · profiles 1 · redirects 0 · audit_log growing. Farm Gardens Batch 001 + Eden Batch 002 + Eden Batch 003 promoted. Live schema: **17** base tables / **72** RLS policies (after Doc 4 #12 / migration `0003`).

### 3.2 Tables

Column lists verified against `information_schema` / generated `src/types/database.ts` (match).

#### `profiles`
- **Purpose:** App role for auth users.
- **Columns:** `id` (uuid PK = `auth.users.id`), `email` (citext), `display_name`, `role` (`app_role`, default `viewer`), `unit_id` (nullable FK → `units`, Doc 4 #06), `created_at`.
- **Populated by:** `handle_new_user` on signup / owner bootstrap (Doc 2 §2.4).
- **Read by:** admin gate indirectly via auth; RLS `own_profile`.

#### `sources`
- **Purpose:** Provenance for content rows.
- **Columns:** `id`, `label`, `url`, `kind` (check: developer|government|operator|portal|site_visit|broker|resident), `retrieved_at`, `notes`, `created_at`.
- **Seed:** 7 rows, fixed UUIDs `a1000000-…000N` (Doc 5 Block A).
- **Read:** admin + public (pub policy).

#### `clusters`
- **Purpose:** Valley communities / product lines.
- **Key columns:** `slug` (unique, `^[a-z0-9-]+$`), `name`, `phase`, `product_type` (townhouse|twin_villa|villa), unit/facade/handover/price fields, `summary`/`positioning`/`body`/`notes`, SEO meta, `sort_order`, `confidence`, `source_id`, `verified_at`, `state`, `deleted_at`, timestamps.
- **Populated:** seed `02_clusters.sql` + admin.
- **Read:** `lib/queries/clusters.ts` (includes facades, published cluster places, media_links helpers — Doc 8), admin editors.

#### `unit_types`
- **Purpose:** Bedroom/layout specs per cluster (Annex D / per-cluster `reference.md`).
- **Key columns:** `cluster_id`, `bedrooms`, size fields (`bua_*`, `plot_*`), floor-plan breakdown (`suite_area`, `garage_area`, `balcony_area`, `roof_terrace_area` — Doc 4 #06), `unit_count` (Doc 4 #05), `bathrooms` (Doc 4 #12), `layout` (Eden convention `{facade_style}-{label}`), layout flags, `confidence`, `source_id`, …
- **No** `state` — visibility follows parent cluster publish + ConfidenceGate on specs.

#### `units`
- **Purpose:** Individual physical units (distinct from `unit_types` floor-plan templates). Foundation for a future interactive map / per-unit drive times (Doc 4 #06).
- **Key columns:** `cluster_id`, `unit_type_id`, `unit_number`, `plot_number`, `facade_style`, `bua`, `plex_id`, `th_position` (Doc 4 #12), `lat`/`lng`, `confidence`, `source_id`, …
- **Live rows:** 508 (Farm Gardens 146 + Eden 362). Public read when parent cluster is published (`pub_units`). App UI for units still deferred (Doc 8 Appendix C).

#### `plexes`
- **Purpose:** One physical plex/building row (6/8/9/10-plex townhouse configuration). Doc 4 #12.
- **Key columns:** `cluster_id`, `plex_size`, `street_side` (`up|down|left|right`), `range_start`/`range_end`, `confidence`, `source_id`.
- **Live rows:** 43 (Eden only). Null `units.plex_id` for standalone-villa clusters (Farm Gardens).

#### `facade_style_descriptions`
- **Purpose:** Per-cluster facade style copy (Horizon/Earth ≠ May Bell/Iris — not a Valley-wide catalog). Doc 4 #07.
- **Key columns:** `cluster_id`, `style_name` (unique per cluster), `description`, `sort_order`, `confidence`, `source_id`.
- **Live rows:** 5 (Farm Gardens Horizon + Earth; Eden Spruce + Iris + May Bell). **Admin:** CRUD on `/admin/clusters/[id]` (Doc 8).
- **Public:** rendered on `/clusters/[slug]` when rows exist; images via `media_links` subject `facade_style_description`.

#### `places`
- **Purpose:** Nearby / in-community services, and (from Doc 4 #06) cluster-scoped amenities as their own rows.
- **Key columns:** `slug`, `name`, `category` (Annex L, extended Doc 4 #10), `subcategory`, `cluster_id` (null = Valley-wide), `parent_place_id` (containment), `google_place_id`, `in_community`, geo (`lat`/`lng`), `hours` (jsonb), `drive_minutes`, `drive_verified`, publish + confidence fields.
- **RLS:** `pub_places` requires published + non-deleted, and if `cluster_id` is set the parent cluster must also be published.
- **Read:** `lib/queries/places.ts`; `/living/*` maps categories → place categories (cluster-internal categories do not map into living routes).

#### `status_log`
- **Purpose:** Append-only operational status observations.
- **Key columns:** `subject_type`, `subject_id`, `amenity_key`, `status`, `observed_on`, `note`, `confidence`, `source_id`.
- **No** `updated_at` — new rows, not edits-in-place (Doc 5 Block A).

#### `questions`
- **Purpose:** FAQ / answer pages.
- **Key columns:** `slug`, `question`, `answer_short`/`answer_long`, `audience`, `topic`, optional `cluster_id`/`place_id`, `ask_count`, `is_generated` (Q24 computed from hours — Doc 5 A), publish fields.

#### `communities` / `comparisons`
- **Purpose:** Competitor communities + dimension rows (Annex H).
- **comparisons.dimension:** price|commute|schools|amenities|maturity (app zod + Doc 1 Annex L).

#### `posts`
- **Purpose:** Blog articles.
- **Columns:** `slug`, `title`, `excerpt`, `body`, `topic`, optional `cluster_id`, SEO, `published_at`, `state`, `deleted_at`, timestamps.
- **Live rows:** 0. Public `/blog` routes exist; **no admin editor yet** (Doc 5 Block C).

#### `media` / `media_links`
- **Purpose:** Files in Storage + polymorphic links (`subject_type`: cluster|place|question|status_log|community|post|**unit_type**|**facade_style_description** — Doc 4 #08).
- **Live rows:** 30 (Farm Gardens 8 + Eden 22). Floor-plan/style images link to the shared template, not duplicated per unit.
- **Admin:** `/admin/media` upload + link/unlink to cluster / unit_type / facade_style_description (and manual other subject types).

#### `redirects`
- **Purpose:** Path redirects for middleware.
- **Columns:** `from_path` (unique), `to_path`, `status_code` (301|302|308), `reason`, `created_at`.
- **Live rows:** 0.

#### `audit_log`
- **Purpose:** Change history from `log_audit` trigger.
- **Columns:** `id` bigserial, `actor_id` → profiles (null if no `auth.uid()`), `table_name`, `record_id`, `action`, `diff` jsonb, `created_at`.
- **Read:** `/admin/audit` (authenticated `read_audit` policy).

### 3.3 Enums and vocabularies

**Postgres enums (live):**

| Enum | Labels |
|---|---|
| `app_role` | owner, editor, viewer |
| `confidence_level` | official, corroborated, unverified |
| `publish_state` | draft, published, archived |

**Controlled vocabularies (Doc 1 Annex L + `src/lib/schema.ts` zod — mostly NOT DB enums):**  
`questions.topic`, `places.category`, `status_log.amenity_key`, `comparisons.dimension`, living route categories, plus check constraints on `sources.kind`, `product_type`, `audience`, `status`, `media.kind`, redirect codes, etc.

**Why no DB check on every Annex L list:** UNKNOWN beyond “Annex L / app zod enforce; migration uses checks where specified” — Doc 5 does not record a rejected alternative for each vocab.

### 3.4 Views and functions

#### View `current_status`
- `WITH (security_invoker = on)` — verified live `reloptions`.
- Latest row per `(subject_type, subject_id, amenity_key)` by `observed_on desc`.
- **Why security_invoker:** so RLS of underlying `status_log` applies to the caller (Doc 5 Block A implies gate requirement; exact rejected alternative: UNKNOWN — “default security definer view would bypass RLS” is standard Postgres reasoning but not spelled in Doc 5).

#### Functions (app-relevant in `public`)
| Function | Role |
|---|---|
| `app_role_of(uid)` | Role lookup |
| `is_staff()` / `can_edit()` | RLS helpers for staff write policies |
| `handle_new_user()` | Profile bootstrap on auth user create |
| `set_updated_at()` | Touch `updated_at` |
| `log_audit()` | Audit trigger body |
| `notify_site_revalidate()` | `pg_net` POST to site `/api/revalidate` (Doc 5 Block C) |
| `rls_auto_enable()` | **Platform helper on project; not in `0001_init.sql`** (Doc 5 Block A gotcha) — do not drop |

### 3.5 Triggers (live)

| Trigger | Table | Function |
|---|---|---|
| `*_audit` | clusters, communities, comparisons, media, media_links, places, posts, questions, redirects, sources, status_log, unit_types | `log_audit` |
| `*_updated_at` | clusters, communities, comparisons, places, posts, questions, unit_types | `set_updated_at` |
| `revalidate_on_*` | clusters, places, questions, comparisons, posts, status_log | `notify_site_revalidate` |

Revalidate triggers pass public path args via `TG_ARGV` (e.g. `/`, `/clusters`). Secret is embedded in function body (V1) — rotate with Vercel env together (Doc 5 Block C).

### 3.6 Security

- **RLS enabled** on all 14 public tables (57 policies).
- **Anon + authenticated public read:** published, non-deleted content patterns on clusters/places/questions/posts/communities; comparisons via published community; unit_types via published cluster; status_log open read; sources/media/media_links/redirects pub select as defined in migration.
- **Staff write:** `can_edit()` gated INSERT/UPDATE/DELETE on content tables.
- **profiles:** `own_profile` SELECT for authenticated.
- **audit_log:** SELECT for authenticated (`read_audit`); inserts via trigger.
- **Service role:** `createAdminClient()` exists in `src/lib/supabase/admin.ts` but is **imported by nothing** — no V1 code path uses it (Doc 5 Block B). It also has **no table privileges anywhere**: the `grant`s in `0001_init.sql` name only `anon` and `authenticated`, and auto-expose is off, so `service_role` holds just `REFERENCES`/`TRIGGER`/`TRUNCATE` on all 15 public relations. Any read or write through the service-role key fails with `42501 permission denied`, `audit_log` and `clusters` included. **Consequence:** the data cannot be audited through the service key — use the Supabase SQL editor or a direct `postgres` connection. Anyone wiring `createAdminClient()` into a code path must add explicit grants first. Verified live 2026-08-08.
- **Storage:** bucket `media` with session policies for staff upload (Gate 2).

### 3.7 Indexes (live)

Includes PKs, unique slug/path keys, plus: `clusters_phase_idx`, `clusters_state_idx`, `places_category_idx`, `places_geo_idx`, `places_state_idx`, `posts_published_idx`, `questions_ask_idx`, `questions_audience_idx`, `questions_cluster_idx`, `questions_place_idx`, `unit_types_cluster_idx`, `status_subject_idx`, `status_amenity_idx`, `media_links_subj_idx`, `audit_record_idx`. Unique-constraint indexes appear without separate `create index` lines in SQL — expected (Doc 5 Block A).

### 3.8 Data provenance

- Seeded from Doc 1 via `supabase/seed/0N_*.sql` in order.
- Fixed source UUIDs; conflicting Doc 1 fields left null with notes (Doc 5 Block A).
- `masabih-masjid` remains `draft` (missing hours — Annex K).
- Confidence may be `unverified` on published rows; UI hides raw specs via ConfidenceGate.
- SQL/MCP edits → `audit_log.actor_id` null; admin UI writes → non-null actor (Gate 5).

---

## 4. APPLICATION

### 4.1 Routes

Route groups `(public)` / `(admin)` do not appear in URLs.

| URL | File | Data / render |
|---|---|---|
| `/` | `(public)/page.tsx` | Anon queries; static-eligible |
| `/about` | `(public)/about/page.tsx` | Static copy + disclaimer |
| `/blog` | `(public)/blog/page.tsx` | `posts` |
| `/blog/[slug]` | `(public)/blog/[slug]/page.tsx` | SSG `generateStaticParams` |
| `/clusters` | `(public)/clusters/page.tsx` | `clusters` + ConfidenceGate |
| `/clusters/[slug]` | `(public)/clusters/[slug]/page.tsx` | SSG + unit_types + facades + media_links + published cluster places |
| `/compare` | `(public)/compare/page.tsx` | `communities` |
| `/compare/[slug]` | `(public)/compare/[slug]/page.tsx` | SSG + comparisons |
| `/living` | `(public)/living/page.tsx` | Category index |
| `/living/[category]` | `(public)/living/[category]/page.tsx` | SSG from `LIVING_CATEGORIES` → places |
| `/places/[slug]` | `(public)/places/[slug]/page.tsx` | SSG |
| `/questions` | `(public)/questions/page.tsx` | questions list |
| `/questions/[slug]` | `(public)/questions/[slug]/page.tsx` | SSG + FAQ JSON-LD |
| `/status` | `(public)/status/page.tsx` | status_log / current_status |
| `/login` | `login/page.tsx` | Dynamic (cookies) |
| `/auth/callback` | `auth/callback/route.ts` | Dynamic OTP exchange |
| `/api/revalidate` | `api/revalidate/route.ts` | Dynamic POST |
| `/sitemap.xml` | `sitemap.ts` | Published paths |
| `/robots.txt` | `robots.ts` | Disallow `/admin/`, `/api/`, `/login` |
| `/admin` … | `(admin)/admin/**` | Dynamic; cookie gate |
| Middleware | `src/middleware.ts` | `redirects` table lookup |

**Admin URLs:** `/admin`, `/admin/clusters`, `/admin/clusters/[id]`, `/admin/places`, `/admin/places/[id]`, `/admin/questions`, `/admin/questions/new`, `/admin/questions/[id]`, `/admin/comparisons`, `/admin/comparisons/[id]`, `/admin/sources`, `/admin/sources/[id]`, `/admin/media`, `/admin/status/new`, `/admin/audit`.

**Naming map (URL ≠ table):** `/blog`→`posts`; `/compare`→`communities`+`comparisons`; `/living/*`→`places`; `/status`→`status_log`/`current_status` (SETUP.md + Doc 5 Block C).

### 4.2 Data layer

- `src/lib/queries/{clusters,places,questions,communities,status,posts}.ts` — **only** public read path for pages.
- All use `createAnonClient()` — SSG-safe; Proposal #01 APPROVED (Doc 5 Block B).
- Pages must not invent ad-hoc Supabase selects (Doc 5 Block A convention).
- **Cluster depth (Doc 8 / Doc 4 #11):** `listFacadeStylesForCluster`, `listPublishedClusterPlaces` (`state=published` only), `listMediaForSubject(s)` + `mediaPublicUrl` in `clusters.ts`. No `units` queries. UI gated on non-empty results — never `slug === 'farm-gardens'`.
- **Admin (Doc 8 Block D-B):** unit_type breakdown fields; `facade_style_descriptions` CRUD on `/admin/clusters/[id]`; `places.cluster_id` on place editor; `media_links` upsert/delete on `/admin/media` (cluster / unit_type / facade pickers). Session client only.

### 4.3 Components

- **ConfidenceGate** — hides children when `confidence === "unverified"` (`src/components/content/ConfidenceGate.tsx`); used on cluster list/detail.
- Content: `MarkdownBody`, `SiteNav`, `StatusPill`, `VerifiedBadge`, `WhatsOpenNow`.
- SEO: `JsonLd`.
- Admin: `AdminForm`, `fields`.
- UI: CVA `button`.

### 4.4 Admin

1. Magic link `/login` → `ADMIN_EMAIL` allowlist · `shouldCreateUser: false`.
2. `/auth/callback` exchanges code; non-allowlisted signed out.
3. `(admin)/admin/layout.tsx` → `getAdminUser()` or redirect `/login`.
4. Mutations → `src/lib/admin/actions.ts` + zod `src/lib/schema.ts` via `createActionClient()` only.
5. **Why session not service role:** RLS + `auth.uid()` + non-null `audit_log.actor_id` (Doc 5 Block B).

### 4.5 Conventions (from Doc 5)

- Clients: `createAnonClient` · cookie `createClient` · `createActionClient` · `createAdminClient` (service role, never content).
- Types: only generated `src/types/database.ts`.
- Seeds: `supabase/seed/0N_*.sql` numeric order; identity by `slug`.
- Schema source of truth file: `docs/0001_init.sql` ≡ `supabase/migrations/0001_init.sql`.
- Optional form empties → `null` via zod preprocessors.
- SEO: `src/lib/seo/*` + per-route metadata; no JSON-LD-only-in-root-layout.

---

## 5. CONTENT MODEL

1. Fact authored in **Doc 1** with source + confidence.
2. Seeded or entered via **admin** into Postgres with `source_id` / `confidence` / `state`.
3. **Anon RLS** exposes `published` + not deleted.
4. **Public page** reads via `lib/queries/*`; **ConfidenceGate** hides unverified numeric/spec fields.
5. Annex J prohibitions enforced at seed/review (Gate 3/7 greps); not a DB constraint.

**Published vs draft:** `state` enum; drafts invisible to anon. `masabih-masjid` draft for missing hours.

---

## 6. HOW TO EXTEND

### 6.1 Extension points (Doc 5)

| Point | Serves |
|---|---|
| `places.lat`/`lng` seeded | Map phase |
| `status_log` append-only | Live updates feed |
| `media` / `media_links` polymorphic | Photos/floorplans without schema churn |
| `profiles.role` | Extra editors = insert, not migration |
| `lib/queries/` isolation | Map/API reuse |
| `createAdminClient` | Non-session system tasks (unused in V1) |
| `/api/revalidate` `path`/`paths` | External/DB revalidation |
| `questions.is_generated` | Computed answers (Q24) |

### 6.2 Common tasks

- **Add cluster/place/question:** prefer `/admin` editors; or seed SQL following Doc 1 + Annex L; then revalidate (automatic on admin save / DB trigger).
- **Add route:** App Router page under `(public)` or `(admin)`; public data only through `lib/queries/`; add sitemap entry if public.
- **Schema change:** proposal if not in Doc 2; migrate; regenerate `database.ts`; update **this Doc 6** same session (Doc 3 §11).

### 6.3 Roadmap features

| Feature | Already supports | Missing | Do not break |
|---|---|---|---|
| Map | `lat`/`lng`, queries | Map UI, offline | Confidence/provenance columns |
| Forums | — | Entire feature | RLS model; single-editor auth assumption |
| Marketplace | — | Entire feature | Same |
| Events | — | Tables/UI | — |
| Listings | spine entities | Listing schema | Independent positioning (no Emaar affiliation) |
| Blog | `posts` + `/blog` | Content + admin editor | Naming (`posts` not `blog_posts`) |

### 6.4 What not to change

- **Anon client for `lib/queries`** — cookie client breaks SSG (Doc 5 B).
- **Session client for admin writes** — service role skips audit actor (Doc 5 B).
- **`current_status` security_invoker** — RLS integrity.
- **Null over invented facts** — site premise (Doc 3 §3.1).
- **`vercel.json` framework nextjs** — prevents platform NOT_FOUND (Doc 5 C).
- **Annex L vocabs without proposal** — Doc 1 rule.

---

## 7. GOTCHAS AND CONSTRAINTS

Consolidated from Doc 5 A–C:

1. Agent/sandbox often cannot read `.env.local` — use MCP or exported env.
2. MCP `execute_sql` returns **last** result set only in a multi-statement batch.
3. `public.rls_auto_enable()` exists outside `0001_init.sql` — do not drop.
4. Unique indexes (`*_slug_key`) appear without explicit `create index` in migration text.
5. SQL/MCP inserts → `audit_log.actor_id` null; Gate 5 needs `/admin` writes.
6. Cluster slug rejects underscores.
7. Never `alter table storage.*` / `auth.*` — dashboard fallback for storage policies.
8. `cookies()` in `generateStaticParams` fails build — use `createAnonClient`.
9. Empty parent `ADMIN_EMAIL=` shadows `.env.local`.
10. Magic-link `emailRedirectTo` follows `NEXT_PUBLIC_SITE_URL` — wrong port = wrong app.
11. RLS returns `[]`/`null`, not errors, for forbidden rows.
12. `SERVICE_ROLE` string must appear only in `admin.ts` (Gate 5 grep).
13. Vercel `framework: null` → apex `NOT_FOUND` despite READY builds.
14. `REVALIDATE_SECRET` must match **exactly** (no trailing space / typos); probe with `net.http_post`.
15. Next 16 deprecates `middleware` file name → `proxy`; still `middleware.ts` per Doc 2.
16. Never invent `blog_posts` — table is `posts`.

---

## 8. KNOWN GAPS

### Content (Doc 1 Annex K)
Amenity operational status; service charges; Nima specs; Orania handover; several unit counts/plots/facades; indoor gym; floor plans; payment plans; ECM ops; drive times (except Outlet Mall); masjid hours.

### Technical debt (known)
- Docs say Next 15; package is **16.3.0** (Doc 5 B/C).
- Revalidate secret stored in DB function body (V1).
- No admin UI for `posts`.
- Gate 0 `docs-baseline` tag still missing (optional).
- Custom domain + Search Console / Bing / analytics parked in **SETUP.md §7**.

### Deferred from V1
Map, forums, marketplace, events, listings, multi-editor, etc. (Appendix C). Units UI / interactive map also deferred under Doc 8 Appendix C until multiple clusters have Batch-001-scale injections (new Doc 4, not #11).

### Needs Ray
SETUP.md §7 launch checklist when product-ready; Doc 15↔16 pin; optional token rotation.

---

## 9. VERIFICATION STATE

| Gate | Result | Notes |
|---|---|---|
| 2 | ✅ | 14 tables, 57 policies, owner profile, types generated |
| 3 | ✅ | Seed counts + Annex J greps |
| 4 | ✅ | Public SSG build |
| 5 | ✅ | Admin session writes + audit actor |
| 6 | ✅ | Metadata, JSON-LD, sitemap/robots, redirects |
| 7 | ✅ (temp URL) | `thevalleyhub.vercel.app` 200; custom domain open in SETUP §7 |
| 8 | ✅ this document | Written from live audit 2026-08-08 |

**Objectively verified this writing:** table/view counts, policy count, enums, triggers, indexes, `security_invoker` on `current_status`, row counts, route inventory, package versions, env var names from `.env.example`.

**Assumed / Ray-reported:** Auth smoke + admin login OK on production; not re-executed in this Doc 6 session.

**UNKNOWN:**
- Full plain-language text of every RLS `USING` expression (summarized from policy names + migration intent; not re-printed SQL here).
- Why each Annex L vocab is zod-only vs check constraint (not in Doc 5).

---

## 10. CHANGELOG

### 2026-08-10 — Eden Batch 003 amenities promoted
**Why:** Ray authorized go-live for Eden cluster amenities from brochure page 15 (peach Eden boundary only).
**Affects:** 4 published `places` (`eden-community-centre`, `eden-central-gardens`, `eden-food-trucks`, `eden-kiosks`); `docs/clusters/eden/{staging,reference}.md`; `eden-floorplans/eden-batch-003-amenities.sql`. Public `/clusters/eden` amenities section via existing Doc 8 published-cluster-places query.
**Breaking:** No.
**Still open:** Eden payments/plot/pricing; Community Centre interior breakdown; Pavilion Valley-wide place row; 19 Farm Gardens draft amenities publish review; units/map app surfaces.

### 2026-08-10 — Doc 4 #12 live + Eden Batch 002 promoted
**Why:** Ray approved #12 and authorized promote. Apply `0003_eden_plexes_units.sql`, upload 22 Eden images, run `eden-batch-002-promotion.sql`, update Eden `reference.md` / staging, regenerate `src/types/database.ts`.
**Affects:** Live schema now 17 tables / 72 policies (`plexes`; `unit_types.bathrooms`; `units.bua`/`plex_id`/`th_position`). Eden: 15 unit_types, 43 plexes, 362 units, 3 facades, 22 media+links. Public `/clusters/eden` picks up facades, floor plans, and expanded unit_types via existing Doc 8 queries (no units UI).
**Breaking:** No for Farm Gardens (new columns nullable / plex null). Eden seed 2-row unit_types replaced by 15 style-specific rows.
**Still open:** Eden payments/plot/amenities/pricing; units/map app surfaces; optional unit-types table layout column on public page. *(Amenities closed by Batch 003 entry above.)*

### 2026-08-10 — Eden deep-dive: plex structure schema designed (#12), Batch 002 staged (not yet promoted)

**Why:** Extracting Eden's 15 floor-plan layouts (3 facade styles × 3-/4-bed, each layout-determining unlike Farm Gardens' cosmetic-only Horizon/Earth) required deriving all 362 physical units' style, bedroom type, exact layout, and exact per-unit floor area from the site plan and floor-plan PDFs — OCR'd plot positions, whole-plex and per-TH-position color/geometry cross-checks against the developer's own key-plan diagrams, and street-side orientation read directly off each of the 43 physical plex rows. That exposed the same class of schema gap Farm Gardens did: no way to represent a physical plex/building row, no per-unit floor-area column, no bathroom count anywhere, and no way for `unit_types` to carry a style discriminator without duplicating `units.facade_style`'s name and meaning. Each addressed by Doc 4 #12 (`plexes` table; `units.bua`/`plex_id`/`th_position`; `unit_types.bathrooms`; `unit_types.layout` repurposed as a populated-data convention, no schema change).

**Affects:** `supabase/migrations/0003_eden_plexes_units.sql` (designed here; applied in the changelog entry above); `docs/0001_init.sql`; `docs/clusters/eden/staging.md` Batch 002; `eden-floorplans/*`.

**Breaking:** No at design time — see apply/promote entry above for the live push.

**Superseded status:** #12 APPROVED and Batch 002 promoted in the entry above.

### 2026-08-09 — Doc 8 Blocks D-A + D-B (cluster depth app surfaces)
**Why:** Doc 4 #11 APPROVED. Surface post-`0002` cluster depth on the public cluster page and in admin without hardcoding Farm Gardens or reading `units`.
**Affects:** `src/lib/queries/clusters.ts` (facades, published cluster places, media helpers); `src/app/(public)/clusters/[slug]/page.tsx` (payment plan, unit-type count/areas when present, plans/floor plans/facades/amenities sections); `src/lib/schema.ts` (unit_type breakdown, facade fields, media link fields, Annex L #10 categories on zod); `src/lib/admin/actions.ts` + `/admin/clusters/[id]`, `/admin/places/[id]`, `/admin/media`; Doc 8 checkboxes; README Doc 8 row.
**Breaking:** No. Draft amenities stay hidden until published. Units/map still deferred (Doc 8 Appendix C).
**Still open:** Ray publish review on 19 Farm Gardens amenity places; place-*create* action not added (set `cluster_id` on existing rows). Gate D3 admin smoke confirmed by Ray 2026-08-09.

### 2026-08-09 — Farm Gardens Batch 001 promoted
**Why:** Complete the data path after migration 0002: upload 8 images to `media`/`farm-gardens/*`, run promotion SQL (cluster fields, unit_types BUA/plot fix, 2 facade descriptions, 19 draft amenity places, 146 units, 8 media links), update `docs/clusters/farm-gardens/{reference,staging}.md`.
**Affects:** Live Farm Gardens content; Doc 6 row counts; staging marked promoted. Amenity places remain `draft` pending Ray publish review.
**Breaking:** No for public UI — app still has no queries/UI for units/facades/cluster places; published cluster fields (`price_from_aed`, `summary`, `body`, corrected `unit_types`) will surface wherever existing cluster queries already read those columns.
**Still open:** `lib/queries/` + UI + admin for new tables; publish decision on 19 amenity places.

### 2026-08-09 — Migration 0002 applied live
**Why:** Ray authorized pushing `supabase/migrations/0002_farm_gardens_units_places.sql` after the Farm Gardens pre-merge review. Applied via Supabase MCP `apply_migration` (name `farm_gardens_units_places`, recorded as `20260809155601`). `src/types/database.ts` regenerated from the live project.
**Affects:** Live schema now 16 base tables / 67 RLS policies; §3 rewritten to match. Batch 001 data still not promoted — `units` and `facade_style_descriptions` are empty; Farm Gardens `unit_types` still carry the pre-fix BUA error until the promotion SQL runs.
**Breaking:** No for the public site — `src/` still queries the old surface; new columns/tables are additive and unused by app code. Admin/media paths that insert into `media_links` may now use the extended `subject_type` check.
**Still open:** image upload, Batch 001 promotion SQL, `lib/queries/` + UI + admin for the new tables.

### 2026-08-09 — Farm Gardens deep-dive: schema designed (#05–#08, #10), docs restructured per-cluster (#09)
**Why:** PDF extraction of Farm Gardens' official Emaar collateral found real errors and gaps in the live `farm-gardens` cluster/`unit_types` rows (`bua_max` had the plot figure instead of BUA; no price, payment plan, or amenities recorded). Fixing it exposed schema gaps — no home for floor-plan sub-areas, no way to scope `places` to one cluster, no per-unit tracking, no facade-style descriptions — each addressed by its own Doc 4 proposal (#05–#08). Separately, Doc 1's single-file cluster register and Doc 7's single-file staging log were identified as unworkable across the 15+ clusters still to come over the build-out, leading to the `docs/clusters/<slug>/{reference,staging}.md` restructure (#09 extends the docs guard to match).
**Affects:** `supabase/migrations/0002_farm_gardens_units_places.sql` (designed here; applied in the changelog entry above); `docs/01-information-reference.md` (Annex C slimmed for 7 migrated clusters, Annex L extended with 6 categories per #10); `docs/03-agent-operating-rules.md` (§2/§9 updated for the per-cluster split); `scripts/pre-commit` (guard extended per #09, applied and tested); new `docs/clusters/` tree (7 clusters migrated: Eden, Nara, Talia, Orania, Elora, Lillia, Farm Gardens); Doc 7 trimmed to a template/pointer.
**Breaking:** No at design time. See the apply entry above for the live push.
**Not yet done at design time:** Batch 001 promotion SQL, image upload, application code (`lib/queries/`, UI, `/admin`).

### 2026-08-08 — Docs guard given an owner bypass (Doc 4 #03)
**Why:** `scripts/pre-commit` filters on file path with no author check, so installing it would have locked Ray out of editing his own Docs 1–3 while Doc 3 §9 forbids `--no-verify`. Blocked approved proposal #02, which has to be written into Doc 2 Appendix B.  
**Affects:** `scripts/pre-commit` (5-line `DOCS_GUARD=off` early exit), SETUP.md "Docs guard", §2 fresh clone needs.  
**Breaking:** No. Guard behaviour is unchanged when the variable is unset — verified both paths: blocks a prose edit without it, exits 0 with it.

### 2026-08-08 — Service-role privileges and docs-guard state corrected
**Why:** An external review read `permission denied` on `audit_log` and `clusters` via the service-role key and asked whether it was intentional. A live privilege audit showed `service_role` has no DML on any public relation, and §3.6's previous wording ("available in `createAdminClient()`") implied it was usable. Separately, the hook Doc 3 §9 relies on was found uninstalled.  
**Affects:** §2 fresh clone needs, §3.6 security.  
**Breaking:** No — documentation only; no schema, grant or code change was made.

### 2026-08-08 — V1 baseline
**Why:** Initial release state at Gate 7 (temporary production domain) + Doc 6 first write (Gate 8).  
**Affects:** All sections.  
**Breaking:** n/a — baseline.

---

## COMPLETENESS CHECK

- [x] Every live base table in §3
- [x] Every `src/app` route in §4
- [x] Every `package.json` dependency in §2
- [x] Every `.env.example` variable in §2
- [x] Doc 5 gotchas in §7
- [x] Doc 5 extension points in §6.1
- [x] No template placeholder sections remain
- [x] Unknowns marked `UNKNOWN`
- [x] Changelog V1 baseline seeded
- [x] Ray told complete and ready for review
