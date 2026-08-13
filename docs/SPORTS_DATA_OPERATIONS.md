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
