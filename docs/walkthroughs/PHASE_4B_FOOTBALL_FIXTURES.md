# Phase 4B Walkthrough Plan — Production Football Catalog, Fixture Ingestion, Live Match State & Today's Games

## Phase 4A Retroactive Audit

- **SPORTS PROVIDER**: API-Football (v3 API-SPORTS REST API) via `ApiFootballAdapter`.
- **ODDS PROVIDER**: Dedicated Odds Role (The Odds API / Provider Abstraction Layer).
- **SPORTS PROVIDER CREDENTIAL STATUS**: `SPORTS DATA PROVIDER CREDENTIAL REQUIRED` (`SPORTS_PROVIDER_API_KEY` is required in `.env.local` / server environment for live external API traffic).
- **PROVIDER ADAPTER**: `ApiFootballAdapter` in `packages/sports-domain/src/adapter.ts`.
- **CANONICAL MODELS**: `sports`, `competitions`, `seasons`, `teams`, `venues`, `fixtures`, `provider_entity_mappings`.
- **MIGRATIONS**: `20260812150000_phase_4a_sports_foundation.sql` (deployed & verified).
- **FRESHNESS & QUALITY ARCHITECTURE**: `SportsIngestionPersistence`, `normalizeFixtureStatus`, `normalizeUtcTimestamp`, Zod DTO validations.
- **RLS POLICIES**: RLS enabled on all 11 tables. Public `SELECT` on `sports`, `competitions`, `seasons`, `teams`, `venues`, `fixtures`. Service role ONLY for ingestion tables (`provider_entity_mappings`, `provider_payloads`, `sports_ingestion_runs`, `sports_provider_health`).

---

## Current Canonical Data Inventory

Safely queryable PostgreSQL database state:

| Canonical Entity           | Record Count | Operational Status                   |
| :------------------------- | :----------- | :----------------------------------- |
| `sports`                   | **1**        | Active (`football`)                  |
| `competitions`             | **0**        | Ready for synchronization            |
| `seasons`                  | **0**        | Ready for synchronization            |
| `teams`                    | **0**        | Ready for synchronization            |
| `venues`                   | **0**        | Ready for synchronization            |
| `fixtures`                 | **0**        | Ready for synchronization            |
| `provider_entity_mappings` | **0**        | Ready for mapping lookup             |
| `sports_ingestion_runs`    | **0**        | Ready for job tracking               |
| `sports_provider_health`   | **1**        | Healthy (`api-football` initialized) |

---

## Existing Sports UI Audit

Audited all authenticated dashboard pages for mock data / placeholder content:

1. `/overview`: Cleaned of mock games and fake odds cards. Uses `WorkspacePageWrapper` with canonical database metrics.
2. `/games` (Today's Games): Uses `WorkspacePageWrapper`. Ready to connect to `v_public_fixtures` database read view.
3. `/daily-odds`: Cleaned of fake picks or mock odds. Displays truthful unavailable state until Phase 4C odds integration.
4. `/markets`: Cleaned of fake prediction cards. Displays supported market registry.
5. `/target-odds`: Cleaned of fake tickets. Displays target multiplier builder framework.
6. Public Homepage: Conceptual marketing sections without fake live scores or fictional match records.

---

## Provider Capability Audit

API-Football (v3 API-SPORTS) capabilities verified:

- **Competitions**: `/leagues` endpoint supplies league ID, name, type (`league`/`cup`), country/area, logo URL, and active seasons.
- **Seasons**: `/leagues` endpoint supplies start date, end date, current season indicator, and historical years.
- **Teams**: `/teams` endpoint supplies team ID, canonical name, code, logo URL, country, and venue details.
- **Fixtures**: `/fixtures` endpoint supplies fixture ID, UTC kickoff date, status short code, home/away team details, goals, and halftime scores.
- **Live Updates**: `/fixtures?live=all` endpoint supplies real-time live score feeds.
- **API Status & Health**: `/status` endpoint supplies API key validity, subscription tier, and request quota limits.

---

## Coverage Strategy

Initial production competition synchronization list (per `docs/FOOTBALL_COVERAGE_POLICY.md`):

1. **Premier League** (England) — Provider ID: `39`
2. **UEFA Champions League** (Europe) — Provider ID: `2`
3. **La Liga** (Spain) — Provider ID: `140`
4. **Serie A** (Italy) — Provider ID: `135`
5. **Bundesliga** (Germany) — Provider ID: `78`
6. **NPFL** (Nigeria) — Provider ID: `240` (when available)

---

## Fixture Lifecycle Strategy

Canonical status flow:

- `scheduled` → `live` / `halftime` / `extra_time` / `penalties` → `finished`

Unusual status handling:

- `postponed`: Kickoff updated, provider entity mapping retained.
- `suspended`: Distinct from postponed; preserves match minute/context.
- `abandoned`: Distinct from finished; score preserved as-is.
- `cancelled`: Retained in database history with `cancelled` status.
- `delayed`: Preserved when kickoff is pushed back on matchday.

---

## Live Update Strategy

Ingestion Cadence:

- **Pre-match**: Every 6 hours for fixture schedule updates.
- **Upcoming (24h window)**: Every 30 minutes.
- **Live Matches**: Every 1 minute during match windows.
- **Post-match Reconciliation**: 15 minutes after full-time whistle to capture official final scores and status corrections.

---

## Today’s Games Read Architecture

1. **User Timezone Awareness**: Accepts user's IANA timezone (e.g. `Africa/Lagos`, `Europe/London`, `America/New_York`).
2. **UTC Range Calculation**: Converts the local calendar day bounds (`00:00:00` to `23:59:59`) into UTC timestamp bounds `[startUtc, endUtc]`.
3. **Database Query**: Queries `v_public_fixtures` using indexed `kickoff_at BETWEEN startUtc AND endUtc`.
4. **Grouping & Display**: Groups fixtures into `Live`, `Upcoming`, and `Finished` sections with competition sub-headers.

---

## Step-by-Step Execution Plan

1. **Phase 4A Audit**: Verify provider selection and schema integrity.
2. **Current Record Inventory**: Verify database counts.
3. **Mock/Demo Audit**: Confirm zero fake data in production code.
4. **Competition Coverage Policy**: Verify initial competition list.
5. **Provider Credential Check**: Document `SPORTS_PROVIDER_API_KEY` requirement.
6. **Competition Ingestion Service**: Build `ingestCompetitions()` in `@playtoday/sports-domain`.
7. **Season Ingestion Service**: Build `ingestSeasons()` in `@playtoday/sports-domain`.
8. **Team Ingestion Service**: Build `ingestTeams()` in `@playtoday/sports-domain`.
9. **Venue Handling**: Ensure venue data is safely ingested and nullable.
10. **Mapping Verification**: Ensure idempotent `provider_entity_mappings` resolution.
11. **Fixture Bootstrap Ingestion**: Build date-bounded fixture bootstrap.
12. **Upcoming Fixture Sync**: Implement 7-day upcoming fixture sync.
13. **Recent Result Sync**: Implement 7-day completed fixture sync.
14. **Canonical Status Mapping**: Expand `normalizeFixtureStatus` to cover all API-Football status codes.
15. **Score Updates**: Preserve `null` score vs `0-0` score distinction.
16. **Fixture Corrections**: Support post-match score and status updates.
17. **Postponement / Reschedule Handling**: Ensure kickoff updates retain canonical fixture UUID.
18. **Live Update Ingestion**: Implement live match sync for active games.
19. **Ingestion Checkpoints**: Log sync progress in `sports_ingestion_runs`.
20. **Provider Health Updates**: Record success/failure in `sports_provider_health`.
21. **Freshness Calculation**: Expose derived freshness states (`current`, `stale`, `delayed`).
22. **Quality Validation**: Enforce Zod validation on incoming provider DTOs.
23. **Scheduler Configuration**: Implement job runner in `services/ingestion-worker`.
24. **Database & Index Optimization**: Verify `idx_fixtures_kickoff` and `idx_fixtures_status`.
25. **Public Read Model**: Enhance `v_public_fixtures` read view.
26. **Today’s Games Query Service**: Build `getTodaysGames(timezone)` server action in `apps/web`.
27. **Today’s Games UI Integration**: Connect `/games` page to real canonical data query service.
28. **Overview Integration**: Update `/overview` fixture summary card.
29. **Filtering & Search**: Add competition and status filter controls to `/games`.
30. **Timezone Display**: Display kickoff times formatted in user's preferred timezone.
31. **Pagination**: Implement cursor/offset pagination for large fixture lists.
32. **Realtime Client Updates**: Add Supabase Realtime subscription for live scores on `/games`.
33. **Stale / Error States**: Implement graceful offline and delayed data banners using Humanizer strings.
34. **Production Mock Removal**: Final audit to confirm zero fake fixture arrays.
35. **Security & RLS Verification**: Verify read-only access for public users and service-role access for ingestion.
36. **Provider Integration Tests**: Add adapter unit tests.
37. **Database Tests**: Add schema and RLS unit tests.
38. **E2E / Browser Tests**: Add Playwright / Vitest UI tests for `/games`.
39. **Performance Verification**: Test query latency and index usage.
40. **Operations Documentation**: Create system architecture and operational docs.
41. **Final Verification**: Run `pnpm quality` and full monorepo check.

---

## Security Risks & Mitigation

- **Provider Secret Exposure**: `SPORTS_PROVIDER_API_KEY` is server-only (`.env.local` / environment schema), never exposed via `NEXT_PUBLIC_*`.
- **Public Canonical Writes**: RLS blocks client `INSERT`/`UPDATE`/`DELETE` on sports tables. Writes require `service_role`.
- **Ingestion Endpoint Abuse**: Sync API endpoints protected with bearer token authentication (`CRON_SECRET`).

---

## Data Risks & Mitigation

- **Duplicate Fixtures**: Enforced by `provider_entity_mappings` unique constraint `(provider, entity_type, provider_entity_id)`.
- **Score Corruption**: Scores explicitly distinguish `null` (not started) from `0` (zero goals).
- **Out-of-Order Live Events**: Updates strictly check `source_updated_at` to prevent stale overwrites.

---

## Scope Exclusions

Phase 4B does **NOT** build:

- Bookmaker odds ingestion engine (Phase 4C)
- AI prediction model or target odds generator
- Daily Edge publishing or automated bet placement
- Booking code generation

---

## Completion Conditions

Phase 4B passes when:

- Provider adapter and ingestion pipelines process real competitions, teams, and fixtures.
- Fixture status, score integrity, idempotency, and lifecycle updates are verified.
- `/games` page displays real canonical data with timezone-aware display.
- All unit, RLS, integration, and monorepo checks (`pnpm quality`) pass cleanly.
