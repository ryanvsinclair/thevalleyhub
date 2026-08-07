# Valley — your remaining setup

Project docs live in [`docs/`](./docs/) (moved from `read/`). Local foundations are scaffolded. Complete these before launch.

## 1. Supabase project

**Project:** [valley](https://supabase.com/dashboard/project/pyowmcabddaxzsoeoyhx) (`pyowmcabddaxzsoeoyhx`, `ap-south-1`) — connected via MCP.

`.env.local` already has URL + anon key. Still paste from **Project Settings → API**:

- `SUPABASE_SERVICE_ROLE_KEY` (`service_role` — MCP cannot read this)

Later, generate types:

```bash
npx supabase gen types typescript --project-id pyowmcabddaxzsoeoyhx > src/types/database.ts
```



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

## 6. Google Search Console

Set up **at launch**, not before.

## Local verify

```bash
npm run dev
```

→ http://localhost:3000 — blank page + footer disclaimer.
