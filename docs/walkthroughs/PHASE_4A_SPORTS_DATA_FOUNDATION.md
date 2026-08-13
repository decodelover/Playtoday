# Phase 4A Walkthrough Plan — Real Sports Data Provider Selection, Canonical Football Data Model & Ingestion Foundation

## Phase 3B Retroactive Audit

- **Authentication & Middleware**: Validated `apps/web/src/lib/supabase/proxy-session.ts` and `apps/web/src/lib/supabase/server.ts`. Session management properly refreshes cookies and protects authenticated routes (`/overview`, `/settings`, `/onboarding`, etc.).
- **User Account & Security System**: Phase 3B settings architecture (`apps/web/src/lib/account-settings-service.ts`) enforces password changes, session revocations, preference updates, data export, and deletion deferral.
- **Supabase RLS & Database Hardening**: Hardened RLS policies in `supabase/migrations/20260811141949_phase_3a_security_hardening.sql` isolate user profile and preference access to `auth.uid()`.
- **Database Migration Health**: Migrations follow linear timestamp order (`20260809005815_phase_2f_contact_submissions.sql`, `20260810190000_phase_2g_profiles.sql`, `20260811140000_phase_2h_onboarding.sql`, `20260811141949_phase_3a_security_hardening.sql`).
- **Service Role Boundaries**: `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side ingestion and administrative services; never exposed to browser context via `NEXT_PUBLIC_*`.

---

## Existing Sports Data Audit

- **Repository Search**: Searched workspace for `mockFixtures`, `mockMatches`, `mockGames`, `sampleFixtures`, `demoFixtures`, `fakeFixtures`, `mockTeams`, `demoOdds`, `mockOdds`, `sampleOdds`, `fakeOdds`, `randomOdds`, `Math.random`.
- **Findings**: No fictional fixture or match data generators exist in active application logic. All app shell routes (`/overview`, `/games`, `/daily-odds`, `/markets`, etc.) render `PagePlaceholder` components without fake data.
- **Public Homepage**: Marketing sections in `apps/web/src/components/public/home/home-sections.tsx` present conceptual platform capabilities and architecture without generating fake live scores or fake game odds cards.

---

## Current Environment Audit

- **Environment Keys in `.env.example` & `.env.local`**:
  - `APP_ENV`, `LOG_LEVEL`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- **Sports Data Provider Variables**: No live sports data provider API keys or URLs currently exist in `.env.local`.
- **Secrets Exposure Check**: No `NEXT_PUBLIC_` prefixed keys leak server secrets. `SUPABASE_SERVICE_ROLE_KEY` is properly scoped to server environments.

---

## Official Provider Research Plan

Primary, official documentation sources to investigate:

1. **Sportmonks Football API**:
   - Official Docs: `https://docs.sportmonks.com/football/`
   - Evaluate coverage for Top 5 European Leagues, CAF/African competitions, NPFL (Nigeria), fixtures, live scores, lineups, statistics, standings, injuries, and historical depth.
2. **API-Football (API-SPORTS)**:
   - Official Docs: `https://www.api-football.com/documentation-v3`
   - Evaluate coverage, rate limits (free vs paid tiers), live score update frequency, standings, fixture events, and pre-match/live odds API support.
3. **Football-Data.org**:
   - Official Docs: `https://www.football-data.org/documentation/quickstart`
   - Evaluate free tier capabilities, top competition limits, live data latency, and historical fixture statistics.
4. **The Odds API**:
   - Official Docs: `https://the-odds-api.com/live-odds-api/`
   - Evaluate pre-match and live odds bookmaker coverage, market types (head-to-head, totals, handicaps), refresh frequency, and target bookmaker presence (SportyBet, Bet9ja, MSport).
5. **Sportradar / Stats Perform**:
   - Official Docs: `https://developer.sportradar.com/`
   - Assess commercial enterprise suitability, licensing, and access tier requirements.

---

## Provider Separation Strategy

PlayToday separates provider responsibilities into decoupled roles to avoid single-provider lock-in:

```
+------------------------------------+      +------------------------------------+
|        Core Sports Provider        |      |           Odds Provider            |
|  (Fixtures, Teams, Competitions,   |      |   (Bookmaker Odds, Markets,        |
|  Scores, Events, Standings, etc.)  |      |   Price Movements, Selections)     |
+-----------------+------------------+      +-----------------+------------------+
                  |                                           |
                  v                                           v
+--------------------------------------------------------------------------------+
|                   PlayToday Ingestion & Normalization Layer                    |
|       (Provider Adapters -> Validation -> Canonical Models -> Database)        |
+--------------------------------------------------------------------------------+
```

1. **Core Sports Provider**: Supplies core football entity data (competitions, seasons, teams, venues, fixtures, scores, events, standings).
2. **Odds Provider**: Supplies market odds, price movements, and bookmaker odds data.
3. **Future Specialist Providers**: Advanced metrics (e.g. xG, detailed tracking, weather, referee metrics) will be added via dedicated adapters without altering the canonical database schema.

---

## Canonical Data Architecture

Canonical entities strictly decouple internal PlayToday domain models from third-party provider DTO schemas:

- `sports`: Top-level sport classification (`football`).
- `areas`: Geographical entities (countries, regions).
- `competitions`: Leagues, tournaments, and cups.
- `seasons`: Competition seasons (calendar year or multi-year).
- `teams`: Canonical team records with logos, codes, and metadata.
- `venues`: Match venues (stadiums, cities, capacities).
- `fixtures`: Primary match entity (kickoff, teams, stage, canonical status, scores, source timestamps).
- `provider_entity_mappings`: Stable mapping between external provider IDs and canonical PlayToday UUIDs.
- `provider_payloads`: Immutable raw payload audit store with hash deduplication and retention policy.
- `sports_ingestion_runs`: Execution logs for batch and realtime ingestion jobs.
- `sports_provider_health`: Operational metrics tracking provider availability, consecutive failures, and latency.

---

## Ingestion Architecture

```
[ External Provider API ]
          │
          ▼
[ Server-Only HTTP Client ] (Timeout, Exponential Backoff, Rate-Limit Headers, Sanitized Logs)
          │
          ▼
[ SportsProviderAdapter ] (Raw DTO Mapping, Capability Inspection)
          │
          ▼
[ Zod Normalization & Validation ] (Canonical Enums, UTC Timestamps, Entity Integrity Checks)
          │
          ▼
[ Idempotent Persistence Service ] (UPSERT with ON CONFLICT ON (provider, entity_type, provider_entity_id))
          │
          ▼
[ Canonical Database & Read Models ] (PostgreSQL / Supabase RLS Protected Tables & Views)
```

---

## Realtime / Live Update Architecture

1. **External Ingestion (Provider → PlayToday)**:
   - **Pre-match & Schedule Sync**: Scheduled cron jobs (e.g. daily/hourly) for fixture schedules, standings, and team metadata.
   - **In-Play Live Ingestion**: Adaptive short-polling or webhooks/WebSockets (depending on provider support) active only during live match windows.
2. **Internal Realtime (PlayToday → Browser)**:
   - **Supabase Realtime**: Used exclusively for live changing state (live match scores, minute updates, status transitions) broadcast from PlayToday DB to client subscribers.
   - **Zero Secret Exposure**: Clients never connect directly to third-party provider endpoints or hold provider secrets.

---

## Step-by-Step Execution Plan

### 1. Phase 3B Retroactive Audit

- **Purpose**: Verify integrity of Auth, RLS, onboarding, settings, and migrations.
- **Current Risk**: Low.
- **Files to Inspect**: `apps/web/src/lib/supabase/proxy-session.ts`, `apps/web/src/lib/account-settings-service.ts`, `supabase/migrations/*`.
- **Files to Modify**: None.
- **Database Objects**: Existing auth, profiles, and settings tables.
- **Expected Outcome**: Verified baseline stability.

### 2. Existing Sports-Data Audit

- **Purpose**: Audit codebase for legacy sports code or demo data.
- **Files to Inspect**: `apps/web/src/app/`, `packages/`.
- **Expected Outcome**: Verified no fictional fixture data or fake sports objects exist in production code.

### 3. Fake / Demo Sports-Data Cleanup

- **Purpose**: Ensure public and authenticated routes show real data or truthful empty/unavailable states.
- **Files to Modify**: `apps/web/src/app/(app)/overview/page.tsx`, `apps/web/src/components/public/home/home-sections.tsx`.
- **Expected Outcome**: Absolute data honesty across public and authenticated screens.

### 4. Official Provider Research

- **Purpose**: Research primary official docs for candidate providers (Sportmonks, API-Football, Football-Data.org, The Odds API, Sportradar).
- **Files to Create**: `docs/SPORTS_DATA_PROVIDER_EVALUATION.md`.
- **Expected Outcome**: Objective, factual comparison matrix.

### 5. Provider Evaluation Matrix

- **Purpose**: Document evaluation across 13 criteria (coverage, live data, odds, target bookmakers, API quality, commercial terms, etc.).
- **Files to Modify**: `docs/SPORTS_DATA_PROVIDER_EVALUATION.md`.
- **Expected Outcome**: Structured technical evaluation.

### 6. Provider Decision ADR

- **Purpose**: Record official provider strategy decision or explicit `SPORTS DATA PROVIDER DECISION PENDING` status.
- **Files to Create**: `docs/decisions/ADR_SPORTS_DATA_PROVIDER.md`.
- **Expected Outcome**: Version-controlled architectural decision record.

### 7. Environment Variable Architecture

- **Purpose**: Define server-only environment variables for sports providers.
- **Files to Modify**: `.env.example`, `apps/web/src/env/schema.ts`, `scripts/env-check.mjs`.
- **Expected Outcome**: Server-only validation rules for provider credentials.

### 8. Canonical Sports Model (`sports`)

- **Purpose**: Define sport classification entity.
- **Files to Create**: `supabase/migrations/20260812150000_phase_4a_sports_foundation.sql`.
- **Database Objects**: `sports` table.
- **Expected Outcome**: Football sport record seeded cleanly.

### 9. Canonical Competition Model (`competitions`)

- **Purpose**: Define competition schema.
- **Database Objects**: `competitions` table with RLS and indexes.
- **Expected Outcome**: Stable competition entity structure.

### 10. Season Model (`seasons`)

- **Purpose**: Define competition season schema supporting multi-year and calendar year leagues.
- **Database Objects**: `seasons` table.
- **Expected Outcome**: Season tracking tied to competitions.

### 11. Team Model (`teams`)

- **Purpose**: Define canonical team entity.
- **Database Objects**: `teams` table with indexes on name and area.
- **Expected Outcome**: Provider-independent team model.

### 12. Venue Model (`venues`)

- **Purpose**: Define stadium/venue entity if supported by provider data.
- **Database Objects**: `venues` table.
- **Expected Outcome**: Nullable venue references attached to fixtures.

### 13. Fixture Model (`fixtures`)

- **Purpose**: Define core fixture table with kickoff timestamps, scores, and status.
- **Database Objects**: `fixtures` table with indexes on `kickoff_at`, `status`, `competition_id`.
- **Expected Outcome**: Primary match entity schema.

### 14. Fixture Participants

- **Purpose**: Enforce home and away team relations and validation (`home_team_id != away_team_id`).
- **Database Objects**: Constraints on `fixtures`.
- **Expected Outcome**: Guaranteed participant integrity.

### 15. Canonical Match Status Enum

- **Purpose**: Define canonical fixture statuses (`scheduled`, `live`, `finished`, `postponed`, `cancelled`, `suspended`, `abandoned`, `unknown`).
- **Database Objects**: Postgres enum `fixture_status`.
- **Expected Outcome**: Uniform status representation across PlayToday.

### 16. Score Model

- **Purpose**: Store halftime, fulltime, extra time, and penalty scores safely.
- **Database Objects**: Score fields on `fixtures`.
- **Expected Outcome**: Immutable score breakdown.

### 17. Provider Entity Mapping (`provider_entity_mappings`)

- **Purpose**: Map external provider IDs to PlayToday canonical UUIDs.
- **Database Objects**: `provider_entity_mappings` table with unique index on `(provider, entity_type, provider_entity_id)`.
- **Expected Outcome**: Idempotent mapping between external APIs and internal domain.

### 18. Raw Payload Strategy (`provider_payloads`)

- **Purpose**: Audit and replay store for raw provider JSON responses.
- **Database Objects**: `provider_payloads` table.
- **Expected Outcome**: Secure raw response history.

### 19. Ingestion Run Model (`sports_ingestion_runs`)

- **Purpose**: Audit trail for ingestion jobs.
- **Database Objects**: `sports_ingestion_runs` table.
- **Expected Outcome**: Job accounting and error metrics.

### 20. Provider Health Model (`sports_provider_health`)

- **Purpose**: Operational health tracking.
- **Database Objects**: `sports_provider_health` table.
- **Expected Outcome**: Transparent provider availability metrics.

### 21. Freshness Strategy

- **Purpose**: Document freshness rules and thresholds.
- **Files to Create**: `docs/SPORTS_DATA_FRESHNESS.md`.
- **Expected Outcome**: Clear freshness definitions for scheduled and live data.

### 22. Quality Strategy

- **Purpose**: Define data validation and quality rules.
- **Files to Create**: `docs/SPORTS_DATA_SECURITY.md`.
- **Expected Outcome**: Quality rules for unmapped data and invalid scores.

### 23. Ingestion Adapter Interface

- **Purpose**: Define TypeScript/Python provider adapter interfaces.
- **Files to Create**: `packages/sports-domain/src/adapter.ts`.
- **Expected Outcome**: Strong abstraction interface.

### 24. Selected-Provider Adapter Implementation

- **Purpose**: Implement concrete adapter for chosen provider.
- **Files to Create**: `packages/sports-domain/src/providers/`.
- **Expected Outcome**: Tested provider data fetching adapter.

### 25. HTTP Client Infrastructure

- **Purpose**: Robust HTTP client with timeouts, retries, exponential backoff, and rate limit header parsing.
- **Files to Create**: `packages/sports-domain/src/http-client.ts`.
- **Expected Outcome**: Safe, server-only HTTP client.

### 26. Retries, Backoff & Rate Limits

- **Purpose**: Prevent 429 quota exhaustion and retry only transient 5xx/network errors.
- **Expected Outcome**: Rate-limit aware transport layer.

### 27. Normalization Layer

- **Purpose**: Map raw DTOs into canonical PlayToday types with Zod validation.
- **Files to Create**: `packages/sports-domain/src/normalization.ts`.
- **Expected Outcome**: Strict runtime validation of incoming data.

### 28. Persistence & Upsert Logic

- **Purpose**: Write canonical records and entity mappings atomically to Supabase.
- **Files to Create**: `packages/sports-domain/src/persistence.ts`.
- **Expected Outcome**: Safe PostgreSQL upsert implementation.

### 29. Idempotency Verification

- **Purpose**: Ensure repeated ingestion runs do not create duplicate records.
- **Expected Outcome**: Verified single canonical record per provider fixture.

### 30. Ingestion Job Foundation

- **Purpose**: Create server-side runner for scheduled sync.
- **Files to Create**: `packages/sports-domain/src/ingestion-runner.ts`.
- **Expected Outcome**: Operational ingestion entry point.

### 31. Real Provider Smoke Test

- **Purpose**: Execute smoke test against real provider API if credentials exist, or document required credentials.
- **Expected Outcome**: Honest, verified smoke test report.

### 32. Current Sports-Page Demo Cleanup

- **Purpose**: Verify all application pages show real DB records or truthful unavailable states.
- **Files to Modify**: `apps/web/src/app/(app)/overview/page.tsx`, `apps/web/src/app/(app)/games/page.tsx`, `apps/web/src/app/(app)/daily-odds/page.tsx`.
- **Expected Outcome**: Clean, truthful UI pages.

### 33. Read-Model Foundation

- **Purpose**: Expose safe database views / helper queries for frontend consumption.
- **Database Objects**: `v_public_fixtures` read view.
- **Expected Outcome**: RLS-protected public fixture read path.

### 34. Realtime / Live-Data Strategy

- **Purpose**: Document Supabase Realtime broadcasting strategy.
- **Files to Create**: `docs/SPORTS_DATA_OPERATIONS.md`.
- **Expected Outcome**: Decoupled internal realtime broadcasting.

### 35. Security Review

- **Purpose**: Audit RLS, service-role calls, and secret exposure.
- **Expected Outcome**: 100% verified server-only secret isolation.

### 36. Database Tests

- **Purpose**: Unit test schema constraints, RLS policies, and triggers.
- **Files to Create**: `packages/sports-domain/tests/schema.test.ts`.
- **Expected Outcome**: Passing database unit tests.

### 37. Provider Contract Tests

- **Purpose**: Test provider payload parsing against mock responses.
- **Files to Create**: `packages/sports-domain/tests/provider-contract.test.ts`.
- **Expected Outcome**: Passing contract tests.

### 38. Integration Tests

- **Purpose**: Test end-to-end ingestion flow from adapter to database.
- **Files to Create**: `packages/sports-domain/tests/ingestion.test.ts`.
- **Expected Outcome**: Passing integration suite.

### 39. Documentation

- **Purpose**: Create comprehensive architecture, provider evaluation, model, and operational docs.
- **Files to Create**: `docs/SPORTS_DATA_ARCHITECTURE.md`, `docs/SPORTS_CANONICAL_MODEL.md`, `docs/SPORTS_INGESTION_ARCHITECTURE.md`, `docs/SPORTS_PROVIDER_CAPABILITIES.md`.
- **Expected Outcome**: Complete Phase 4A documentation suite.

### 40. Final Verification

- **Purpose**: Run full repository verification suite (`pnpm quality`, `pnpm test`, `pnpm typecheck`, `pnpm build`).
- **Expected Outcome**: Clean build and test execution across all monorepo packages.

---

## Risks

1. **Provider Lock-in**: Directly coupling internal models to third-party API JSON keys.
   - _Mitigation_: Enforce adapter abstraction layer and Zod canonical normalization.
2. **Rate Limit Exhaustion & Cost Spikes**: Uncontrolled client-side or high-frequency polling.
   - _Mitigation_: Server-only ingestion, scheduled batching, adaptive polling.
3. **Fixture Rescheduling & Identity Collisions**: Missing or unstable provider fixture IDs.
   - _Mitigation_: `provider_entity_mappings` lookup table combined with strict participant constraints.
4. **Timezone Misalignments**: Storing localized timestamps instead of UTC.
   - _Mitigation_: Strict `timestamptz` storage in UTC.

---

## Scope Exclusions

Phase 4A does **NOT** build:

- Statistical prediction algorithms or AI prediction models
- Target-odds calculation engine
- Daily Edge publication engine
- Match settlement or result calculation engine
- Bookmaker booking code generators
- Automated bet placement or staking integrations
- AI Analyst LLM reasoning flows
- Historical performance marketing claims or fake win rates

---

## Completion Conditions

Phase 4A passes when:

- Baseline Phase 3B security, auth, and RLS remain 100% operational.
- All fake/mock fixture data has been audited and removed from production paths.
- Primary official sports data providers have been researched and evaluated in `docs/SPORTS_DATA_PROVIDER_EVALUATION.md`.
- Canonical football database schema (`sports`, `competitions`, `seasons`, `teams`, `fixtures`, `provider_entity_mappings`) is deployed and RLS-protected.
- Ingestion client, adapter interface, rate-limiting, backoff, and Zod normalization layer are fully implemented and tested.
- Real provider smoke test has been executed (or transparent missing credentials documented).
- Monorepo checks (`pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm quality`) pass cleanly.
