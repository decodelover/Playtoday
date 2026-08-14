# Sports Data Ingestion Architecture — PlayToday

## Ingestion Flow

1. **Transport**: `SportsProviderHttpClient` makes HTTP requests using server-only credentials, incorporating configurable request timeouts, exponential backoff, and rate-limit header parsing.
2. **Adapter Layer**: `SportsProviderAdapter` converts raw third-party endpoints into typed DTOs.
3. **Normalization**: Zod schemas validate DTO structures and convert raw status codes into PlayToday canonical enums.
4. **Idempotent Persistence**: `SportsIngestionPersistence` checks `provider_entity_mappings` to prevent duplicate entity creation and executes atomic UPSERT operations.
5. **Auditing**: Run counts and sanitized failures are recorded in `sports_ingestion_runs`. `provider_payloads` is reserved for a future approved retention policy.

## Operational implementation

`services/ingestion-worker/src/runner.ts` is the executable composition root. It loads server-only configuration, checks provider health, fetches one bounded fixture date through the existing adapter, validates each fixture, groups writes by competition, persists canonical records, updates provider health, and closes the run log.

The current runtime records run summaries but does not persist raw payload bodies, so `provider_payloads` remains empty. This avoids storing unnecessary provider data until a retention policy is approved. The manual command is `pnpm sports:sync -- --date YYYY-MM-DD`.

Local execution is proven. Production execution is blocked until Vercel production variables are configured and the cron-bearing build is deployed.
