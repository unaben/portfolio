# Portfolio

Live: https://benedict-dev.vercel.app/

Next.js (App Router) + TypeScript + CSS Modules + `classnames`.

```bash
cp .env.example .env.local   # set ADMIN_PASSWORD and AUTH_SECRET
npm install
npm run dev                  # http://localhost:3000  (admin: /admin)
npm test
```

- Data: `data/projects.json`, screenshots in `data/uploads/` (JSON adapter, local/self-hosted only).
- Auth: single admin, password in env, signed JWT cookie (`jose`), enforced in `src/middleware.ts`.
- Edit your name/intro/links in `src/config/site.ts`.

## Supabase (needed on Vercel)

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor (table + public `screenshots` bucket).
2. Set `DATA_BACKEND=supabase`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (plus `ADMIN_PASSWORD`, `AUTH_SECRET`) in `.env.local` and in Vercel's project settings.
3. Optional: import the seed projects by adding them through `/admin`.

The service-role key bypasses RLS and is only ever used in server code.
