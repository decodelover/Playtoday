# First real sports ingestion

## Execution

- Provider: API-Football
- Date executed: 2026-08-14 UTC
- Provider scope: fixtures for 2026-08-14
- Provider result: 389 fixtures available
- Safety scope: first 60 validated fixtures per completed run
- Provider requests per completed run: 2
- Verified plan: Free, active, 100 requests per day

## Completed run

Run `85cb5f90-b2f1-41f0-a119-aad5dc0d6ca9` completed with:

- competitions received: 30
- seasons received: 30
- teams received: 120 unique provider teams
- fixtures received from provider: 389
- fixtures processed: 60
- competitions inserted during that run: 7
- seasons inserted during that run: 8
- teams inserted during that run: 41
- venues inserted during that run: 10
- fixtures inserted during that run: 21
- provider mappings inserted during that run: 80
- fixtures updated: 60
- rejected records: 0

Two earlier performance-tuning runs were stopped before completion and are recorded as failed. Their already committed canonical writes are valid and idempotent.

## Idempotency run

Run `b9c0d173-0aac-4650-a357-6e34601466d1` repeated the same bounded scope:

- competitions inserted: 0
- seasons inserted: 0
- teams inserted: 0
- venues inserted: 0
- fixtures inserted: 0
- provider mappings inserted: 0
- fixtures updated: 60
- rejected records: 0

## Production runtime run

After the cron-bearing Vercel build was promoted, protected production invocation `21c620d4-ab56-4deb-9641-79a60b0696a1` completed with:

- fixtures received from provider: 389
- fixtures inserted: 0
- fixtures updated: 60
- failed records: 0
- sanitized error summary: none

This confirms the deployed route, production secrets, API-Football adapter, persistence layer, and hosted Supabase project work together. The zero inserts and 60 updates also preserve the earlier idempotency result.

## Hosted totals after verification

- sports: 1
- areas: 32
- competitions: 50
- seasons: 50
- teams: 274
- venues: 52
- fixtures: 137
- provider mappings: 513
- ingestion runs: 5
- provider health rows: 1
- provider payloads: 0

The provider fixture mapping has no duplicate provider IDs. All fixtures have valid competition and team relationships. Stored kickoff timestamps are UTC. Scheduled fixtures retain null scores, while known zero scores remain zero.
