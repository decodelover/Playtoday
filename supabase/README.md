# Supabase foundation and sports data

Phase 2F brings forward the smallest Supabase boundary needed for the public contact form.

The committed migrations create `public.contact_submissions`, `public.profiles`, and `public.user_preferences`. RLS is enabled and forced on every table. Contact writes use the server-only contact client. Account and onboarding writes use authenticated sessions, ownership policies, explicit column grants, and narrow transaction-safe RPCs.

Run `pnpm exec supabase --help` before using the CLI. With an isolated local stack running, replay migrations and execute `pnpm exec supabase test db`. Never run a reset against an unidentified or production database.

Phase 4A through Phase 4C add canonical football fixtures, provider mappings,
bookmaker and market registries, current odds, immutable meaningful-change history,
ingestion runs, and provider health. Browser roles remain read-only on approved
views and catalogs. Sports and odds writes require the service role.

## Local workflow

Use the repository-pinned CLI:

```text
pnpm exec supabase start
pnpm exec supabase db reset
pnpm exec supabase migration list --local
pnpm exec supabase test db
```

Local execution requires Docker. Remote linking and migration deployment require a separately approved Supabase project and credentials.
