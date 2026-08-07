# DOC 2 — MASTER BUILD GUIDE V1

**Version:** 1.1 · 7 August 2026 — *amended: Gate 3 places count, Gate 4/7/8 assertions, Section 2 source file, storage fallback, signup lockdown, admin.ts permitted use*
**Read Doc 3 before touching this file.**

---

# ►► STATUS BLOCK ◄◄

> **Overwrite this block after every completed step. Do not append.**

```
LAST COMPLETED:   Section 4 — Public routes (4.1–4.5). Gate 4 PASSED.
SPEC ALIGNED:     Yes
CURRENT TASK:     Section 5 — Admin portal. Not started.
NEXT UP:          Step 5.1 — auth gate + magic link sign-in
CONTEXT BLOCK:    B (Sections 4–5, application)
BLOCKERS:         None
OPEN QUESTIONS:   None
ATTENTION NEEDED: None
GATE STATUS:      Section 1–3 PASSED · Gate 4 PASSED · Gate 5 not started
```

**Rules for this block**
1. Read it first, before anything else.
2. Rewrite it immediately after finishing a step.
3. `SPEC ALIGNED: Yes` only after the step's checkbox conditions are objectively met.
4. On pause (Doc 3 §4), record exactly where you stopped and what remains.
5. Never mark a step complete you did not personally verify.
6. `ATTENTION NEEDED` lists anything requiring Ray — pending proposals, unanswered clarifications, `[R]` steps. If it is not `None`, Doc 3 §12 requires you to tell Ray directly, not just write it here.

## CONTEXT BLOCKS

Work is grouped into three blocks. Context clears **between** blocks, never mid-section.

| Block | Sections | Shape of work | On completion |
|---|---|---|---|
| **A** | 2–3 | Database — schema then seed | Write Doc 5 entry, then clear |
| **B** | 4–5 | Application — public then admin | Write Doc 5 entry, then clear |
| **C** | 6–7 | Ship — SEO then launch | Write Doc 5 entry; Doc 6 only on Ray's instruction (step 7.5) |

Procedure at a block boundary is in Doc 3 §10.

---

## ACTOR KEY

| Tag | Meaning |
|---|---|
| **[A]** | Agent does this unattended |
| **[R]** | Ray only — credentials, purchases, external accounts, physical verification |
| **[A+R]** | Agent prepares, Ray supplies the value or runs the command |

## COMPLETION RULE

A step is done when its checkbox is ticked **here** and in **Appendix A**. Once ticked in both, it is settled and is never revisited, re-read, or re-verified — except on gate failure or dependency change (Doc 3 §6).

---

# SECTION 1 — FOUNDATIONS ✅ COMPLETE

- [x] 1.1 Accounts created — GitHub, Supabase, Vercel, registrar **[R]**
- [x] 1.2 Stack decisions confirmed **[A+R]**
- [x] 1.3 Project scaffolded, dependencies installed **[A]**
- [x] 1.4 Folder structure created **[A]**
- [x] 1.5 Domain purchased and pointed at Vercel **[R]**
- [x] 1.6 Environment variables populated **[R]**
- [x] 1.7 `npm run dev` serves at localhost:3000 **[A+R]**

**Locked decisions from Section 1** — do not revisit:
Next.js 15 App Router · Tailwind v4 CSS-first `@theme`, no config file · CVA + clsx + tailwind-merge · Supabase direct queries in Server Components, no ORM · Server Actions for mutations · Supabase Auth magic link, single editor · `react-markdown` + `remark-gfm` · generated types only.

**Not installed, and not to be installed:** any UI kit, ORM, CMS library, state manager, rich-text editor.

---

# SECTION 2 — DATABASE

**Scope:** one migration file creating the complete schema, RLS, triggers, views, grants. Then generated types.
**Source:** `docs/0001_init.sql` — shipped alongside these documents. It is authoritative over all earlier SQL. Do not rewrite it; copy it.

### 2.1 Write the migration **[A]**
- [x] Copy `docs/0001_init.sql` verbatim to `supabase/migrations/0001_init.sql` — do not author from scratch
- [x] Extensions: `pgcrypto`, `citext`
- [x] Enums: `app_role`, `publish_state`, `confidence_level`
- [x] Function `set_updated_at()`
- [x] Table `profiles` + `app_role_of()`, `is_staff()`, `can_edit()`
- [x] Trigger `on_auth_user_created` — first user becomes owner
- [x] Table `sources`
- [x] Tables `clusters`, `unit_types`
- [x] Table `places`
- [x] Table `status_log` + view `current_status` **with `security_invoker = on`**
- [x] Table `questions`
- [x] Tables `communities`, `comparisons`
- [x] Table `posts`
- [x] Tables `media`, `media_links` + storage bucket `media`
- [x] Table `redirects`
- [x] Table `audit_log` + `log_audit()`
- [x] Trigger loops — `updated_at` and audit
- [x] All indexes
- [x] RLS enabled on all 14 tables
- [x] All RLS policies
- [x] All grants (auto-expose is OFF — grants are mandatory)

### 2.2 Apply **[A+R]**
- [x] `npx supabase link --project-ref <ref>` **[R supplies ref]** — ref `pyowmcabddaxzsoeoyhx`; CLI link skipped (agent shell cannot read `.env.local` token); applied via MCP `apply_migration` with identical SQL
- [x] `npx supabase db push` — equivalent: MCP apply of `0001_init` recorded as remote migration `0001_init`
- [x] Migration applies with no errors
- [x] **If push fails on the storage block** with `must be owner of table objects` (Supabase managed-schema restriction, not a schema error): comment out the `storage.buckets` insert and the three `storage.objects` policies, re-push, then create the bucket and those three policies via the dashboard **[R]**. Everything else stays in the migration. — *N/A — storage bucket + policies applied cleanly; `media` bucket present*

### 2.3 Generate types **[A]**
- [x] `npx supabase gen types typescript --linked > src/types/database.ts` — generated via MCP `generate_typescript_types` (same output)
- [x] File written, non-empty
- [x] Committed

### 2.4 Bootstrap owner **[R]**
- [x] Sign in once via magic link with `ADMIN_EMAIL`
- [x] `select role from profiles;` returns `owner`
- [x] **Then** disable public signups in Supabase Auth settings **[R]** — existing users can still sign in; this prevents self-registered accounts. Do this after the owner row exists, never before. — *Ray confirmed done 7 Aug 2026*

### 2.5 Verify **[A]**
- [x] Anon client `.from('clusters').select()` returns `[]`, not an error
- [x] Insert a test cluster; `audit_log` gains a row. (`actor_id` will be **null** for SQL-editor inserts — that is by design, since `auth.uid()` is null there. The non-null `actor_id` assertion belongs to Gate 5, where the write goes through `/admin` as a signed-in session.)
- [x] Delete the test row
- [x] Commit migration + types

**⛔ GATE 2 — see Appendix B. Do not start Section 3 until it passes.**

---

# SECTION 3 — SEED DATA

**Scope:** load all V1 content from Doc 1. No content originates anywhere else.
**Files:** `supabase/seed/` — one per entity, numbered.

### 3.1 Sources **[A]**
- [x] `01_sources.sql` — one row per source kind referenced in Doc 1
- [x] Every later seed row references a valid `source_id`

### 3.2 Clusters **[A]**
- [x] `02_clusters.sql` — all 25 from Doc 1 Annex C
- [x] 12 original clusters: `state = 'published'`
- [x] 13 Valley 2/3 clusters: `state = 'draft'`
- [x] `positioning` populated from Annex C.4 for the 11 that have it
- [x] Conflicting fields left `null` (Elva/Farm Gardens 2/Elea handover, Rivera price)
- [x] `confidence` per Annex C

### 3.3 Unit types **[A]**
- [x] `03_unit_types.sql` — only rows present in Annex D
- [x] No rows for nima, farm-gardens-2, farm-grove-2, elea, kaia, avena-2, venera, avelia, ovelle
- [x] `private_pool` null everywhere

### 3.4 Places **[A]**
- [x] `04_places.sql` — all of Annex E
- [x] `in_community = true` for the 7 in E.1
- [x] `lat`/`lng` on every row that has them
- [x] `hours` as jsonb per the documented shape
- [x] `drive_verified = true` **only** for `dubai-outlet-mall`
- [x] All published except `masabih-masjid` (missing hours → draft, flag)

### 3.5 Status log **[A]**
- [x] `05_status_log.sql` — three rows only: eden, nara, talia delivered
- [x] **No amenity rows**

### 3.6 Communities and comparisons **[A]**
- [x] `06_communities.sql` — 5 rows, published
- [x] `07_comparisons.sql` — Annex H, dimension-keyed

### 3.7 Questions **[A]**
- [x] `08_questions.sql` — all 52 from Annex I
- [x] `answer_short` ≤ 2 sentences, `answer_long` markdown
- [x] `topic` from Annex L vocabulary only
- [x] `cluster_id`/`place_id` linked where relevant
- [x] Q11–16 written as *specified*, never as *open*
- [x] Q24 flagged as generated, not static
- [x] Q25, Q28, Q29 lead with the plain negative
- [x] Q51 states 5.06% and no other figure
- [x] All `state = 'published'`

### 3.8 Run and verify **[A]**
- [x] Seeds execute in order without error
- [x] Row counts match Appendix B Gate 3
- [x] No value violates Annex J
- [x] Batch any clarification questions to Ray (Doc 3 §5 format) — none blocking; masabih draft for missing hours as specified

**⛔ GATE 3 — Appendix B.** ✅ PASSED

---

## ►► END OF CONTEXT BLOCK A ◄◄
- [x] Gate 2 and Gate 3 both passed
- [x] Doc 5 entry written for Block A **[A]**
- [x] Status block updated to `CONTEXT BLOCK: B`
- [ ] **Clear context.** Doc 3 §10. — *Ray/agent: clear conversation context before Section 4*

---

# SECTION 4 — PUBLIC ROUTES

**Scope:** every public page rendering seeded data. No new tables, no new content.

### 4.1 Data layer **[A]**
- [x] `lib/supabase/server.ts` — RSC client, anon key (+ `createAnonClient` for SSG)
- [x] `lib/queries/` — one file per entity, typed from `database.ts`
- [x] No inline Supabase calls in page components

### 4.2 Shared components **[A]**
- [x] `components/content/ConfidenceGate.tsx` — hides `unverified` fields
- [x] `components/content/VerifiedBadge.tsx` — renders `verified_at`
- [x] `components/content/StatusPill.tsx`
- [x] `components/ui/` CVA primitives as needed

### 4.3 Routes **[A]**
- [x] `/` hub
- [x] `/clusters` index, filterable
- [x] `/clusters/[slug]` — `generateStaticParams`
- [x] `/living` index
- [x] `/living/[category]` — the 5 in Annex L
- [x] `/places/[slug]`
- [x] `/questions` index, tabbed prospect/resident
- [x] `/questions/[slug]`
- [x] `/compare` index
- [x] `/compare/[slug]`
- [x] `/status`
- [x] `/blog` + `/blog/[slug]`
- [x] `/about` — methodology and author identity
- [x] 404

### 4.4 Global **[A]**
- [x] Footer disclaimer: independent resource, not affiliated with Emaar Properties
- [x] Nav
- [x] "What's open now" component from `places.hours` (Q24)

### 4.5 Verify **[A]**
- [x] `npm run build` succeeds
- [x] No `unverified` field rendered anywhere
- [x] Every page has real content, no placeholder text
- [x] `npx tsc --noEmit` clean

**⛔ GATE 4 — Appendix B.** ✅ PASSED

---

# SECTION 5 — ADMIN PORTAL

**Scope:** authenticated editing. Session-based writes only.

### 5.1 Auth **[A]**
- [ ] `lib/supabase/action.ts` — Server Action client
- [ ] `lib/supabase/admin.ts` — service role, `import 'server-only'` first line. **Permitted use: system tasks running outside a user session only — none exist in V1; it is created for the roadmap. Never for content writes (Doc 3 §3.4).**
- [ ] `/admin/layout.tsx` gate — redirect unauthenticated
- [ ] Magic link sign-in page

### 5.2 Forms **[A]**
- [ ] `lib/schema.ts` — zod per entity
- [ ] `/admin` dashboard — unverified count, stale rows, recent activity
- [ ] `/admin/status/new` — **build first**
- [ ] `/admin/questions` + `[id]`
- [ ] `/admin/places` + `[id]` with hours editor
- [ ] `/admin/clusters` + `[id]` with unit_types inline
- [ ] `/admin/media` upload with required alt text
- [ ] `/admin/comparisons`, `/admin/sources`
- [ ] `/admin/audit` read-only

### 5.3 Revalidation **[A]**
- [ ] `/api/revalidate` guarded by `REVALIDATE_SECRET`
- [ ] Supabase webhook configured **[R]**
- [ ] Publish → live within one revalidation cycle

### 5.4 Verify **[A]**
- [ ] All writes go through the session client, never service role
- [ ] `audit_log.actor_id` non-null on every admin write
- [ ] Service role key absent from client bundle
- [ ] `npm run build` clean

**⛔ GATE 5 — Appendix B.**

---

## ►► END OF CONTEXT BLOCK B ◄◄
- [ ] Gate 4 and Gate 5 both passed
- [ ] Doc 5 entry written for Block B **[A]**
- [ ] Status block updated to `CONTEXT BLOCK: C`
- [ ] **Clear context.** Doc 3 §10.

---

# SECTION 6 — SEO AND STRUCTURED DATA

### 6.1 Metadata **[A]**
- [ ] `generateMetadata` on every dynamic route
- [ ] `meta_title`/`meta_description` used when set, sensible fallback otherwise
- [ ] Canonical URLs from `NEXT_PUBLIC_SITE_URL`
- [ ] OpenGraph + Twitter cards

### 6.2 Structured data **[A]**
- [ ] `FAQPage` on question pages
- [ ] `Place` + `OpeningHoursSpecification` on place pages
- [ ] `Residence` on cluster pages
- [ ] `BreadcrumbList` sitewide
- [ ] `Article` on blog posts
- [ ] All generated from data, never hand-written

### 6.3 Crawl **[A]**
- [ ] `app/sitemap.ts` — published rows only
- [ ] `app/robots.ts`
- [ ] `middleware.ts` reading `redirects`

### 6.4 Performance **[A]**
- [ ] `next/image` everywhere
- [ ] Fonts via `next/font`
- [ ] No client components where a server component works

**⛔ GATE 6 — Appendix B.**

---

# SECTION 7 — LAUNCH

### 7.1 Pre-flight **[A]**
- [ ] Production build clean
- [ ] Env vars set in Vercel for preview and production
- [ ] Every published page reviewed against Annex J
- [ ] Disclaimer present

### 7.2 Deploy **[A+R]**
- [ ] Merge to main, Vercel deploys
- [ ] Domain resolves, HTTPS valid

### 7.3 Post-launch **[R]**
- [ ] Google Search Console verified, sitemap submitted
- [ ] Bing Webmaster Tools
- [ ] Analytics enabled

### 7.4 Handover **[A]**
- [ ] `README.md` — setup, migrations, seeds, deploy
- [ ] Docs 1–5 committed to `/docs`
- [ ] Superseded docs moved to `/docs/archive`
- [ ] Status block set to `V1 COMPLETE`

**⛔ GATE 7 — Appendix B.**

---

## ►► END OF CONTEXT BLOCK C ◄◄
- [ ] Gate 6 and Gate 7 both passed
- [ ] Doc 5 entry written for Block C **[A]**
- [ ] **Tell Ray V1 is complete and ask whether to begin Doc 6.** Do not start unprompted.

---

### 7.5 System of record **[A]** — only on Ray's instruction
- [ ] Confirm V1 complete and all gates passed
- [ ] Read Doc 5 in full — all three block entries
- [ ] Audit the live codebase and database directly; do not rely on memory
- [ ] Write `06-system-of-record.md` from the Doc 6 template
- [ ] Every schema claim verified against the live database, not the migration file
- [ ] Every reasoning claim traced to a Doc 5 entry
- [ ] Anything undocumented and unrecoverable flagged as `UNKNOWN` — never guessed
- [ ] Commit to `/docs`
- [ ] Status block set to `V1 COMPLETE — DOC 6 LIVE`

**⛔ GATE 8 — Appendix B.**

> From the moment Doc 6 exists, **Doc 3 §11 applies permanently.** Every subsequent change to code or database updates Doc 6 in the same session.

---

# APPENDIX A — MASTER CHECKLIST

Mirror of every step. Tick here **and** in the section. Both ticked = settled forever.

| Step | Actor | Done |
|---|---|---|
| 1.1 Accounts | R | [x] |
| 1.2 Stack decisions | A+R | [x] |
| 1.3 Scaffold + install | A | [x] |
| 1.4 Folder structure | A | [x] |
| 1.5 Domain | R | [x] |
| 1.6 Env vars | R | [x] |
| 1.7 Dev server | A+R | [x] |
| 2.1 Write migration | A | [x] |
| 2.2 Apply migration | A+R | [x] |
| 2.3 Generate types | A | [x] |
| 2.4 Bootstrap owner | R | [x] |
| 2.5 Verify | A | [x] |
| 3.1 Sources | A | [x] |
| 3.2 Clusters | A | [x] |
| 3.3 Unit types | A | [x] |
| 3.4 Places | A | [x] |
| 3.5 Status log | A | [x] |
| 3.6 Communities + comparisons | A | [x] |
| 3.7 Questions | A | [x] |
| 3.8 Run + verify | A | [x] |
| 4.1 Data layer | A | [x] |
| 4.2 Shared components | A | [x] |
| 4.3 Routes | A | [x] |
| 4.4 Global | A | [x] |
| 4.5 Verify | A | [x] |
| 5.1 Auth | A | [ ] |
| 5.2 Forms | A | [ ] |
| 5.3 Revalidation | A | [ ] |
| 5.4 Verify | A | [ ] |
| 6.1 Metadata | A | [ ] |
| 6.2 Structured data | A | [ ] |
| 6.3 Crawl | A | [ ] |
| 6.4 Performance | A | [ ] |
| 7.1 Pre-flight | A | [ ] |
| 7.2 Deploy | A+R | [ ] |
| 7.3 Post-launch | R | [ ] |
| 7.4 Handover | A | [ ] |
| Block A — Doc 5 entry + clear | A | [x] |
| Block B — Doc 5 entry + clear | A | [ ] |
| Block C — Doc 5 entry | A | [ ] |
| 7.5 Write Doc 6 | A | [ ] |

---

# APPENDIX B — SECTION GATES

Objective assertions. Pass/fail, no interpretation. Run at section end. **A failed gate sends you back only to the step that owns the failure** — nothing else reopens.

### Gate 1 — Foundations ✅ PASSED

### Gate 2 — Database ✅ PASSED
```
[x] select count(*) from information_schema.tables
      where table_schema='public' and table_type='BASE TABLE'   → 14
[x] select count(*) from pg_policies where schemaname='public'  → 57 (> 40)
[x] select count(*) from pg_views where viewname='current_status' → 1
[x] select role from profiles                                    → 'owner' (1 row)
[x] anon .from('clusters').select()                              → [] not error
[x] wc -l src/types/database.ts                                  → 959 (> 100)
[x] npx tsc --noEmit                                             → exit 0
[x] git log --oneline -1                                         → migration + types in history (1557dcf); HEAD may be later docs commits
```

### Gate 3 — Seed ✅ PASSED
```
[x] select count(*) from clusters                                → 25
[x] select count(*) from clusters where state='published'        → 12
[x] select count(*) from unit_types                              → 29
[x] select count(*) from places                                  → 47
[x] select count(*) from places where in_community               → 7
[x] select count(*) from questions where state='published'       → 52
[x] select count(*) from communities                             → 5
[x] select count(*) from status_log                              → 3
[x] select count(*) from places where drive_verified             → 1
[x] grep -riE "floresta|terra heights|\bsola\b|250,000 sqm" supabase/seed/ → no matches
[x] grep -ri "7%\|7.5%" supabase/seed/08_questions.sql            → no ROI matches
```

### Gate 4 — Public routes ✅ PASSED
```
[x] npm run build                                                → exit 0 (135 static pages)
[x] npx tsc --noEmit                                             → exit 0
[x] curl / and 3 random cluster pages                            → static HTML generated for hub + clusters (eden/nara/lillia)
[x] grep -riE "lorem|TODO|FIXME|coming soon" src/app/             → no matches
    (checks for placeholder *copy* — HTML placeholder= input attributes are permitted)
[x] Footer disclaimer present on every page
```

### Gate 5 — Admin
```
[ ] npm run build                                                → exit 0
[ ] grep -r "SERVICE_ROLE" src/ --include=*.tsx                   → no matches
[ ] head -1 src/lib/supabase/admin.ts                             → import 'server-only'
[ ] Create a test question via /admin
[ ] select actor_id from audit_log order by created_at desc limit 1 → not null
[ ] Delete the test row
```

### Gate 6 — SEO
```
[ ] curl /sitemap.xml                                            → valid, published only
[ ] curl /robots.txt                                             → 200
[ ] A question page contains FAQPage JSON-LD
[ ] A place page contains Place + OpeningHoursSpecification
[ ] Every page has a canonical tag
```

### Gate 7 — Launch
```
[ ] Production URL 200 over HTTPS
[ ] Custom domain resolves
[ ] /sitemap.xml live on production domain
[ ] Docs 1–5 in /docs, superseded docs in /docs/archive
[ ] Doc 5 has entries for Blocks A and B, none empty
    (Block C's entry is written at the block boundary AFTER this gate — Doc 3 §10.
     The three-entry check runs at Gate 8.)
[ ] Status block reads V1 COMPLETE
```

### Gate 8 — System of record
```
[ ] /docs/06-system-of-record.md exists
[ ] Doc 5 has three block entries, none empty
[ ] Every table in the live DB appears in Doc 6 section 3
[ ] select count(*) from information_schema.tables
      where table_schema='public' and table_type='BASE TABLE'
      → matches the table count stated in Doc 6
      (unfiltered, the query also counts the current_status view)
[ ] Every route in src/app appears in Doc 6 section 4
[ ] No section left as a template placeholder
[ ] Anything unrecoverable is marked UNKNOWN, not guessed
[ ] Changelog seeded with the V1 baseline entry
```

---

# APPENDIX C — V1 SCOPE BOUNDARY

**In V1:** content pages · questions · cluster and place directories · status tracker · comparisons · blog · admin portal · SEO.

**Not in V1, and not to be started:** offline map · forums · marketplace · events · property listings · resident verification · referral or QR systems · user accounts beyond the single editor · comments · newsletter · multi-language · payments.

Anything on the second list is a proposal at most (Doc 3 §4), never an implementation.

---

*End of Doc 2.*
