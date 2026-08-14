# Fixture Ingestion Architecture — PlayToday Phase 4B

## Ingestion Pipeline & Principles

1. **Idempotent Synchronization**: 100 sync executions for the same provider fixture update the single canonical PlayToday fixture record.
2. **Provider Entity Resolution**: Provider fixture IDs are mapped to canonical UUIDs via `provider_entity_mappings`.
3. **Score Integrity**: Scores explicitly distinguish `null` (not started) from `0` (zero goals).
4. **Rescheduling Continuity**: Kickoff date changes preserve the existing canonical fixture UUID.
5. **Job Audit & Tracking**: All runs are recorded in `sports_ingestion_runs` with fetched, inserted, updated, and failed counts.

## Verified behavior

On 2026-08-14, API-Football returned 389 date-scoped fixtures. The worker processed the configured first 60 and wrote canonical competitions, seasons, teams, venues, fixtures, and mappings. Repeating the same scope inserted zero new records and updated the existing 60 fixtures. Hosted integrity checks found no orphan fixture mappings, same-team fixtures, invalid scheduled scores, or duplicate provider IDs.

The external status code is normalized before persistence. Kickoff timestamps remain UTC. A missing score stays `NULL`; a known score of zero stays `0`.
