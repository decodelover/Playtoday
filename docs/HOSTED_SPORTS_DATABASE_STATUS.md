# Hosted sports database status

## Deployed migrations

The hosted PlayToday Supabase project contains these sports migrations:

- `20260814004912_phase_4a_sports_foundation`
- `20260814004921_phase_4b_sports_access_hardening`
- `20260814005206_phase_4b_sports_indexes`

They were applied on 2026-08-14 through the authenticated, project-scoped Supabase migration API. The linked CLI direct database connection timed out. No database reset or destructive data operation was used.

## Objects

Hosted tables:

- `sports`
- `areas`
- `competitions`
- `seasons`
- `teams`
- `venues`
- `fixtures`
- `provider_entity_mappings`
- `provider_payloads`
- `sports_ingestion_runs`
- `sports_provider_health`

Hosted view:

- `v_public_fixtures`, with `security_invoker=true`

Hosted enum:

- `fixture_status`

No sports database functions were introduced.

## Access model

All sports tables have RLS enabled. Authenticated members have SELECT-only access to canonical sports tables and the fixture view. Anonymous users have no sports access. Browser roles have no access to provider mappings, raw payloads, ingestion runs, or provider health. The service role is the system writer.

Anonymous GET and POST requests to `fixtures` returned 401. Effective privileges confirm that authenticated users cannot insert, update, or delete fixtures.

## Read model verification

For the 2026-08-14 Africa/Lagos calendar day, `v_public_fixtures` returned 137 real fixtures across 50 competitions. At the application-query verification point, 8 were live, 128 were upcoming, and none were finished. Match status can change after that observation.

After production runtime verification, hosted totals were 1 sport, 32 areas, 50 competitions, 50 seasons, 274 teams, 52 venues, 137 fixtures, 513 provider mappings, 5 ingestion runs, 1 provider-health row, and 0 raw payload rows. The latest run completed with zero failures.

## Advisor status

The sports foreign-key index notices were resolved by `phase_4b_sports_indexes`. Supabase still reports informational no-policy notices for internal-only tables. Those tables intentionally have no browser policy and no browser grants. Existing onboarding SECURITY DEFINER warnings and leaked-password protection are not caused by the sports migrations.
