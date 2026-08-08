# Valley — your remaining setup

Project docs live in [`docs/`](./docs/) (moved from `read/`). Local foundations are scaffolded. Complete these before launch.

## 1. Supabase project

**Project:** [valley](https://supabase.com/dashboard/project/pyowmcabddaxzsoeoyhx) (`pyowmcabddaxzsoeoyhx`, `ap-south-1`) — connected via MCP.

`.env.local` should have URL, anon key, and service role. Schema migration `0001_init` is applied.

**Next (you — Doc 2 step 2.4):**

1. Set `ADMIN_EMAIL` in `.env.local` to your editor email
2. Sign in once via magic link (auth UI comes in Section 5; for now use Supabase Auth → Users → invite/magic link, or a temporary sign-in once admin exists)
3. Confirm `select role from profiles;` → `owner`
4. **Then** disable public signups in Auth settings
5. Rotate `SUPABASE_ACCESS_TOKEN` if it was pasted into chat/agent context; keep it local-only (not Vercel)

Later, generate types:

```bash
npx supabase gen types typescript --project-id pyowmcabddaxzsoeoyhx > src/types/database.ts
```

### Naming map (URL / UI ≠ Postgres)

Canonical names live in the DB and in `src/types/database.ts`. Public routes sometimes use friendlier labels — **always query the table name**, never invent synonyms.

| URL / UI | Postgres | Notes |
|----------|----------|--------|
| `/blog`, “blog post” | `posts` | No `blog_posts` table |
| `/compare` | `communities` + `comparisons` | Community pages + dimension rows |
| `/living/[category]` | `places` | Category groups in `src/lib/queries/places.ts` |
| `/status` | `status_log` / view `current_status` | Log is append-only; view is latest |
| `/clusters`, `/places`, `/questions` | same table names | 1:1 |

Revalidate webhooks must target real tables (`posts`, not `blog_posts`) and public paths (`/blog`, `/clusters`, …).

## 2. Fill remaining env vars

Copy `.env.example` → `.env.local` (already present) and set:

| Variable | Notes |
|----------|--------|
| `ADMIN_EMAIL` | Your editor email for magic-link allowlist |
| `REVALIDATE_SECRET` | Long random string (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | Final domain, e.g. `https://thevalleyrecord.com` |

Mirror the same keys in Vercel → Project → Settings → Environment Variables for **Preview** and **Production**.

## 3. GitHub

Repo is local only (first commit on `main`). To publish:

```bash
gh repo create valley --private --source=. --remote=origin --push
```

Or create an empty private repo on GitHub and `git remote add origin <url> && git push -u origin main`.

## 4. Domain

- Prefer `.com` over `.ae` (trade licence for `.ae`; no ranking benefit here).
- Avoid names that imply Emaar affiliation (`thevalleydubai.com`, `emaarvalley.com`, etc.).
- Safer editorial-style names (e.g. `thevalleyrecord.com`).
- Point DNS at Vercel once the project is linked.

## 5. Vercel

1. Import the GitHub repo (Hobby is fine until monetisation may require Pro — check their terms for brokerage lead-gen).
2. Set env vars from `.env.example` for Preview + Production.
3. Deploy; attach your domain.

## 6. Supabase → revalidate webhook **[R]** (Doc 2 §5.3)

After deploy, point a Database Webhook (or Edge Function) at:

`POST https://<your-domain>/api/revalidate`

Header: `x-revalidate-secret: <REVALIDATE_SECRET>`

JSON body: `{ "path": "/clusters" }` or `{ "paths": ["/clusters", "/questions"] }`

Admin Server Actions already call `revalidatePath` on save; the webhook covers external/DB-side changes.

## 7. Google Search Console

Set up **at launch**, not before.

## Local verify

```bash
npm run dev
```

→ http://localhost:3000 — blank page + footer disclaimer.
