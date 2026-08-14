# Sports Data Operations & Runbooks — PlayToday

## Operational Runbooks

1. **Ingestion Job Execution**:
   - Ingestion tasks run on server-side schedulers using `@playtoday/sports-domain`.
   - All runs log accounting details (fetched count, created count, updated count, error summary) to `sports_ingestion_runs`.
2. **Provider Outage & Error Handling**:
   - In the event of 5xx errors or 429 rate limit errors from external providers, `SportsProviderHttpClient` applies exponential backoff up to 3 retries.
   - If failures persist, `sports_provider_health` status updates to `degraded` or `failing`.
3. **No Mock Data Fallback**:
   - Upstream API failures must never cause the ingestion engine to substitute fictional fixtures or scores. If data is unavailable, database state reflects the truthful zero/unavailable status.

## Current runbook

1. Confirm the target environment and required variable names with `pnpm env:check`.
2. Check provider authentication without ingesting fixtures: `pnpm sports:sync -- --health-only`.
3. Run one bounded date sync: `pnpm sports:sync -- --date YYYY-MM-DD`.
4. Review the sanitized command counts and the matching `sports_ingestion_runs` row.
5. Verify hosted canonical counts, mappings, foreign keys, UTC kickoff timestamps, and score nullability.
6. Repeat the same command once when validating idempotency. The second run must add no duplicate provider mappings or fixtures.

Do not run global historical ingestion. The default safety limits are four provider requests and 60 processed fixtures per execution. Production cron remains inactive until the Vercel environment and deployment are verified.
