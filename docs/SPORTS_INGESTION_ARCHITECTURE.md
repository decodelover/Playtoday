# Sports Data Ingestion Architecture — PlayToday

## Ingestion Flow

1. **Transport**: `SportsProviderHttpClient` makes HTTP requests using server-only credentials, incorporating configurable request timeouts, exponential backoff, and rate-limit header parsing.
2. **Adapter Layer**: `SportsProviderAdapter` converts raw third-party endpoints into typed DTOs.
3. **Normalization**: Zod schemas validate DTO structures and convert raw status codes into PlayToday canonical enums.
4. **Idempotent Persistence**: `SportsIngestionPersistence` checks `provider_entity_mappings` to prevent duplicate entity creation and executes atomic UPSERT operations.
5. **Auditing**: Raw response payloads are hashed and logged to `provider_payloads` for replay and diagnostic auditing.
