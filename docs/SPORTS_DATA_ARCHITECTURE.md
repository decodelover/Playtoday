# Sports Data Architecture — PlayToday

## Architecture Principles

1. **Provider Independence**: Third-party API response schemas are normalized into PlayToday canonical domain entities (`sports`, `competitions`, `seasons`, `teams`, `fixtures`) before persistence.
2. **Provider Separation**: Core sports data (schedules, results, teams) is decoupled from bookmaker odds data.
3. **Data Integrity**: Absolute honesty in data. Zero mock or generated fixture data in production pipelines.
4. **Server-Only Credentials**: External API secrets are restricted to server-side ingestion jobs; never exposed to browser context.

```
[ External Sports Provider ] ---> [ Server-Only HTTP Client ]
                                             │
                                             ▼
                                  [ SportsProviderAdapter ]
                                             │
                                             ▼
                                 [ Normalization & Zod ]
                                             │
                                             ▼
                               [ Idempotent Persistence ]
                                             │
                                             ▼
                                 [ PostgreSQL Canonical DB ]
                                             │
                                             ▼
                                  [ RLS Read Views ]
```

## Operational status, 2026-08-14

The architecture is active against hosted Supabase. API-Football records pass through the shared HTTP client, adapter, validation, normalization, provider mapping, and persistence layers. The authenticated dashboard reads `v_public_fixtures`; it never calls API-Football from the browser. A bounded real sync produced 137 hosted fixtures and 509 provider mappings.

Provider mappings, payload audits, run logs, and provider health remain internal. Canonical sports tables and the fixture view are authenticated-read and system-write. Anonymous sports access is denied.
