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
