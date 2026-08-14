# Phase 4B operational recovery

Phase 4B was reopened because its architecture had not been deployed or run. The missing production runtime work is now complete. Phase 4C remains not started, but is no longer blocked by Phase 4B.

## Initial audit

The repository already contained the shared API-Football client, adapter, validation, normalization, persistence layer, and a local sports migration. Hosted Supabase ended at Phase 3A, so its Data API had no sports tables or fixture view. The ingestion service was a documented Python placeholder with no executable composition root. `.env.local` contained the required provider and Supabase variable names, but local configuration did not establish a production runtime.

The approved application host is Vercel. There is no Railway deployment or approved Python worker host in the repository. The existing ingestion service was therefore made executable in TypeScript and exposed to one protected Vercel Cron route without duplicating the sports-domain implementation.

## Migration review and deployment

The sports migration was reviewed for destructive SQL, unsafe cascades, grants, RLS, function security, ordering, and conflicts. It does not reset or delete existing application data. Two additive migrations were added for explicit Data API access and foreign-key indexes.

The linked Supabase CLI was version 2.113.0. Direct database migration commands timed out, so the same reviewed SQL was applied through the authenticated, project-scoped Supabase migration API. No reset, wipe, or destructive command was used. Local filenames were then aligned with the hosted migration ledger:

- `20260814004912_phase_4a_sports_foundation.sql`
- `20260814004921_phase_4b_sports_access_hardening.sql`
- `20260814005206_phase_4b_sports_indexes.sql`

Hosted verification found the expected sports tables, `fixture_status`, and the security-invoker `v_public_fixtures` view.

## Provider and worker activation

The provider configuration uses `SPORTS_PROVIDER`, `SPORTS_PROVIDER_API_KEY`, and `SPORTS_PROVIDER_BASE_URL`. The key is passed only as the server-side `x-apisports-key` header. The HTTP client enforces a 10-second request timeout, retry rules, response validation, and safe rate-limit parsing.

The real `/status` health request returned HTTP 200. The subscription was active on the Free plan with a measured limit of 100 requests per day. No credential value was printed or stored in documentation.

`services/ingestion-worker/src/runner.ts` now starts and closes run records, checks provider health, requests one bounded date, validates fixture payloads, writes canonical entities through `SportsIngestionPersistence`, updates provider health, and returns sanitized counts. The manual command is `pnpm sports:sync -- --date YYYY-MM-DD`. Default limits are four provider requests and 60 processed fixtures.

## Real ingestion evidence

API-Football returned 389 fixtures for 2026-08-14. Completed run `85cb5f90-b2f1-41f0-a119-aad5dc0d6ca9` processed 60 with two provider requests and zero rejected records. During that run it inserted 7 competitions, 8 seasons, 41 teams, 10 venues, 21 fixtures, and 80 provider mappings. Two earlier tuning attempts were stopped, recorded as failed, and left valid idempotent writes.

Completed run `b9c0d173-0aac-4650-a357-6e34601466d1` repeated the same scope. It inserted no competitions, seasons, teams, venues, fixtures, or mappings, updated 60 existing fixtures, and rejected none.

Final hosted counts at verification were 1 sport, 32 areas, 50 competitions, 50 seasons, 274 teams, 52 venues, 137 fixtures, 513 provider mappings, 5 ingestion runs, 1 provider-health row, and 0 raw payload rows.

Integrity queries found zero orphan fixture mappings, zero same-team fixtures, zero scheduled fixtures with scores, and zero duplicate provider mapping groups. Kickoffs span UTC timestamps. Missing scores remain null and known zero scores remain zero.

## Dashboard integration

`/games` queries `v_public_fixtures` through the server-side canonical read service. Its date controls trigger a fresh server query. User-local calendar dates are converted to UTC boundaries from the stored IANA timezone, including daylight-saving transitions.

`/overview` uses the same canonical response for fixture, live, upcoming, finished, competition, match, and freshness information. Developer documentation and unsupported AI, odds, probability, ROI, and recommendation claims were removed. Empty, unavailable, and delayed data remain distinct states. The established PlayToday light design and responsive shell were preserved.

## Access and security evidence

Canonical sports tables and the fixture view are authenticated-read and system-write. Anonymous users have no sports access. Provider mappings, raw payloads, ingestion runs, and provider health are internal. Hosted anonymous fixture GET and POST requests returned 401. Effective privileges deny browser writes and internal-table access. Provider and Supabase service-role credentials remain server-only and are covered by environment security tests.

## Scheduler and production activation

`apps/web/vercel.json` defines one daily 00:15 UTC invocation of `/api/cron/sports-sync`. The route requires `CRON_SECRET` and runs the existing worker. This cadence fits the observed provider Free quota and Vercel Hobby's daily cron restriction.

All required production variables are configured. Provider credentials, the Supabase service role, and a freshly generated `CRON_SECRET` are sensitive server-only Vercel values. Deployment `dpl_54LNaL2iuaY9TgP7LxSBkvqVAFmg` is Ready and serves `https://playtoday-two.vercel.app`.

The protected production route was invoked against that exact deployment. Hosted run `21c620d4-ab56-4deb-9641-79a60b0696a1` completed at 2026-08-14 05:15:06 UTC after fetching 389 fixtures, updating 60, inserting none, and recording zero failures. An invocation without the bearer secret returned 401. This resolves the former production blocker.

## Verification results

The final repository run passed `pnpm install --frozen-lockfile`, all three environment checks, formatting, lint, type checking, the standard test suite, coverage, production build, the combined quality gate, and the local CI-equivalent gate. The standard suite passed 121 TypeScript tests and 3 Python tests. The Next.js build produced dynamic `/games`, `/overview`, and `/api/cron/sports-sync` routes.

`pnpm exec supabase test db` could not start the repository pgTAP suite because no local Supabase database is listening on port 54322 and Docker is not installed in this environment. This is a local tooling limitation, not an application or hosted-database failure. Equivalent hosted policy, privilege, RLS, integrity, and anonymous Data API checks were run directly against the deployed schema and passed. The local pgTAP command is therefore recorded as unavailable, not misreported as a pass.

Hosted checks confirmed RLS on all 11 sports tables, seven authenticated SELECT policies, no browser policy on four internal tables, authenticated fixture SELECT only, anonymous fixture denial, and `security_invoker=true` on the fixture view. All 137 hosted fixtures have an API-Football fixture mapping.

The mandatory production search found no listed fake fixture, match, team, or score identifiers, no `Math.random`, no hardcoded operational sports arrays, and no banned development copy in `/games` or `/overview`.

Vercel CLI confirmed that the public production alias resolves to the verified Ready deployment. `/api/health` and the public home page returned 200; unauthenticated `/games` and `/overview` redirected safely to sign-in; a disposable confirmed member reached the authenticated `/overview` and `/games` routes; and the temporary account was deleted afterward. The production error-log query returned no error entries.

Phase 4B operationally passes. Phase 4C is ready but has not been started.
