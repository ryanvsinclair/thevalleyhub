# Valley

Independent community information hub for **The Valley** (Emaar), Dubai.  
Not affiliated with Emaar Properties.

Accuracy and sources over listings. Stack: Next.js App Router, Tailwind v4, Supabase (Postgres + Auth), Server Actions.

## Local development

```bash
cp .env.example .env.local   # fill values — see SETUP.md
npm install
# If ADMIN_EMAIL is empty in your shell, it shadows .env.local:
unset ADMIN_EMAIL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/login](http://localhost:3000/login) (magic link; `ADMIN_EMAIL` allowlist only).

## Environment

See [`.env.example`](./.env.example) and [`SETUP.md`](./SETUP.md).

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; never for content writes |
| `REVALIDATE_SECRET` | `POST /api/revalidate` header `x-revalidate-secret` |
| `ADMIN_EMAIL` | Single editor allowlist |

## Database

- Authoritative schema: [`docs/0001_init.sql`](./docs/0001_init.sql) → copied to [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql)
- Seeds: [`supabase/seed/`](./supabase/seed/) (`01`–`08_*.sql`), Doc 1 only
- Types: generated [`src/types/database.ts`](./src/types/database.ts)

```bash
# Types (example)
npx supabase gen types typescript --project-id <ref> > src/types/database.ts
```

## Docs (source of truth)

| Doc | File |
|-----|------|
| 1 Information | `docs/01-information-reference.md` |
| 2 Build guide | `docs/02-master-build-guide.md` |
| 3 Agent rules | `docs/03-agent-operating-rules.md` |
| 4 Proposals | `docs/04-proposals.md` |
| 5 Build notes | `docs/05-build-notes.md` |
| 6 System of record | after V1, on instruction |

## Deploy

1. Push to GitHub; import on Vercel.
2. Set the same env vars for Preview + Production.
3. Attach domain; confirm HTTPS.
4. Configure Supabase → `POST https://<domain>/api/revalidate` webhook (`SETUP.md` §6 / Doc 2 §7.2).

## Project layout (high level)

- `src/app/(public)/` — public site
- `src/app/(admin)/admin/` — authenticated editors
- `src/lib/queries/` — public reads (`createAnonClient`)
- `src/lib/admin/` — session writes (`createActionClient`)
- `src/lib/seo/` — metadata + JSON-LD helpers
