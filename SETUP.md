# Valley — your remaining setup

Local foundations are scaffolded. Complete these before launch.

## 1. Supabase project (blocked — free-tier limit)

**Target:** project name `valley`, region **`ap-south-1` (Mumbai)**.

Creation via API failed with:

> Organization members have reached their maximum limits for active free projects (2 project limit). Delete, pause, or upgrade one or more projects to continue.

Your org currently shows:

| Project        | Region       | Status         |
|----------------|--------------|----------------|
| financia       | ap-south-1   | ACTIVE_HEALTHY |
| Alami RMS      | ca-central-1 | INACTIVE       |
| Bab Marrakech  | ca-central-1 | INACTIVE       |
| Pokellection   | ca-central-1 | INACTIVE       |

**What to do:**

1. In [Supabase Dashboard](https://supabase.com/dashboard), free a slot (pause/delete an unused project, or upgrade).
2. Create a new project named **`valley`** in **`ap-south-1`**.
3. Copy Project Settings → API into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon / publishable)
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role — keep secret)
4. Tell the agent the project ref when ready so types can be generated later:
   `npx supabase gen types typescript --project-id <ref> > src/types/database.ts`

Or ask the agent to create `valley` in Mumbai again once a free slot is available.

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
