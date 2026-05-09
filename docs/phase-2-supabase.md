# Phase 2: Supabase Setup

This phase adds the Supabase database foundation for HealthNook. It does not add login screens yet; that happens in Phase 3.

## Free-Tier Notes

Supabase has a free plan that is enough for this MVP while you are building. Avoid enabling paid add-ons such as custom domains, paid compute upgrades, point-in-time recovery, or HIPAA/compliance add-ons during the MVP.

Do not store medical records, diagnoses, insurance details, or protected health information in RSVP or volunteer notes. HealthNook should store event logistics and participation information only.

## Files Added

- `.env.example`
- `supabase/migrations/202605090001_initial_schema.sql`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/env.ts`
- `src/lib/supabase/database.types.ts`

## Configure Supabase

1. Create a free Supabase project.
2. Open the Supabase SQL Editor.
3. Paste and run the SQL from `supabase/migrations/202605090001_initial_schema.sql`.
4. In Supabase, open your project's Connect settings and copy:
   - Project URL
   - Publishable key
5. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

6. Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Never put the service role key in frontend code or commit it to Git.

## Local Commands

```bash
pnpm install
pnpm lint
pnpm build
```

## Test The Schema

In Supabase Table Editor, confirm these tables exist:

- `profiles`
- `organizations`
- `events`
- `rsvps`
- `volunteers`
- `generated_messages`

In Supabase Authentication settings, email/password auth can stay enabled for Phase 3.

In the SQL Editor, you can confirm RLS is enabled:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'profiles',
    'organizations',
    'events',
    'rsvps',
    'volunteers',
    'generated_messages'
  );
```

Every row should show `rowsecurity = true`.

## Test App Connectivity

After `.env.local` is filled in and the dev server is running, open:

```text
http://localhost:3000/api/health/supabase
```

Expected response:

```json
{
  "ok": true,
  "service": "supabase",
  "check": "published_events_select",
  "publishedEventsCount": 0,
  "elapsedMs": 123
}
```

The count may be `0` until you publish real events. This endpoint does not require login and does not expose any private keys.
