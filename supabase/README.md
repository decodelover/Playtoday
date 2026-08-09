# Supabase foundation

Phase 2F brings forward the smallest Supabase boundary needed for the public contact form.

The committed migration creates `public.contact_submissions`. Row Level Security is enabled and forced. The `anon` and `authenticated` roles receive no table privileges and no policies. Contact writes pass through a server action that uses a server-only Supabase secret key.

No seed data is configured. No authentication, sports-data, prediction, settlement, billing, or performance schema is introduced in this phase.

## Local workflow

Use the repository-pinned CLI:

```text
pnpm exec supabase start
pnpm exec supabase db reset
pnpm exec supabase migration list --local
pnpm exec supabase test db
```

Local execution requires Docker. Remote linking and migration deployment require a separately approved Supabase project and credentials.
