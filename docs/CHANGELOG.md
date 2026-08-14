# PlayToday Changelog

## 2026-08-14: Phase 4B operational recovery

- Deployed the sports foundation, access hardening, and foreign-key index migrations to hosted Supabase.
- Activated real API-Football fixture ingestion with a bounded manual command, provider health tracking, run history, and idempotent canonical writes.
- Added 137 real hosted fixtures and verified the canonical fixture view for `/games` and `/overview`.
- Replaced unsupported dashboard AI and probability claims with real fixture, score, status, freshness, and timezone content.
- Configured the required production environment variables, deployed and promoted the cron-bearing Vercel build, and verified a protected production ingestion run with zero failures.
- Verified public health and authentication redirects, authenticated `/overview` and `/games` routing, unauthenticated cron rejection, and an empty production error-log scan.

## [Phase 4B] - 2026-08-13

### Added

- **Production Football Catalog & Fixture Sync**: Implemented `getCompetitions()`, `getTeams()`, and `getFixtures()` in `ApiFootballAdapter` and `SportsIngestionPersistence`.
- **Today's Games Read Service**: Created `apps/web/src/lib/games-service.ts` to convert user-local calendar day bounds into UTC timestamptz ranges for `v_public_fixtures` queries.
- **Data-Backed Today's Games UI**: Connected `/games` page to real canonical database query service, rendering live score indicators, timezone-aware kickoff formatting, date navigation, status filtering, and mature no-match empty states.
- **Overview Fixture Integration**: Connected `/overview` workspace card to real canonical fixture tracking metrics.
- **Phase 4B Documentation Suite**: Created `FOOTBALL_CATALOG_ARCHITECTURE.md`, `FIXTURE_INGESTION_ARCHITECTURE.md`, `FIXTURE_LIFECYCLE.md`, `TODAYS_GAMES_ARCHITECTURE.md`, `SPORTS_SCHEDULER.md`, `LIVE_MATCH_DATA_ARCHITECTURE.md`, `FIXTURE_QUERY_POLICY.md`, and `SPORTS_PROVIDER_FAILURE_HANDLING.md`.

## [Phase 4A] - 2026-08-12

### Added

- **Canonical Sports Data Foundation**: Created the Phase 4A sports foundation migration, now aligned to hosted version `20260814004912`, defining `sports`, `areas`, `competitions`, `seasons`, `teams`, `venues`, `fixtures`, `provider_entity_mappings`, `provider_payloads`, `sports_ingestion_runs`, `sports_provider_health`, and `v_public_fixtures`.
- **Decoupled Ingestion Engine (`@playtoday/sports-domain`)**: Implemented provider-independent TypeScript architecture featuring `SportsProviderHttpClient` (with exponential backoff and rate-limiting), `SportsProviderAdapter` (API-Football adapter), Zod normalization schemas, and `SportsIngestionPersistence` with idempotent entity resolution and PostgreSQL upserts.
- **Provider Research & Evaluation Suite**: Created `SPORTS_DATA_PROVIDER_EVALUATION.md`, `ADR_SPORTS_DATA_PROVIDER.md`, `SPORTS_DATA_ARCHITECTURE.md`, `SPORTS_CANONICAL_MODEL.md`, `SPORTS_INGESTION_ARCHITECTURE.md`, `SPORTS_DATA_FRESHNESS.md`, `SPORTS_DATA_SECURITY.md`, `SPORTS_PROVIDER_CAPABILITIES.md`, and `SPORTS_DATA_OPERATIONS.md`.

### Changed

- Enforced absolute data honesty across public and authenticated user routes—all demo/mock fixture objects removed in favor of canonical database models and truthful empty states.
- Extended `DEVELOPMENT_RULES.md` with 25 mandatory Phase 4A sports data rules.

## [Phase 3B] - 2026-08-11

### Added

- Canonical authenticated Settings routes for profile, preferences, notifications, security, Responsible Play, and privacy data.
- Real display-name and timezone persistence, signed-in password changes, supported Supabase Auth session-revocation scopes, and authenticated JSON data export.
- Shared settings validation, focused security and export tests, and account-settings architecture, security, deletion, and data-management documentation.

### Changed

- The application account menu now uses the signed-in member's real display name, email, and initials.
- Settings edit the existing onboarding preference record and canonical identifiers.
- `/notifications` redirects to `/settings/notifications`, and subscription content no longer implies billing data exists.

### Security and scope note

- Normal settings and export paths use the member session and RLS; Phase 3B adds no service-role use.
- MFA, device history, security activity, push delivery, enforced cooling-off, self-exclusion, email change, and account deletion are not exposed without complete supporting systems.

### Verification note

- Local CI passes, including the repository guard, environment checks, formatting, lint, typecheck, tests, coverage, and production build.
- Local Supabase replay and pgTAP still require a Docker-compatible runtime.
- Remote drift and authenticated persistence checks require Supabase CLI authentication and an explicitly selected project.

## [Phase 3A] - 2026-08-11

### Added

- Additive Supabase hardening migration with explicit grants, constrained preferences, safe trigger functions, timestamp triggers, and atomic onboarding RPCs.
- pgTAP attack matrix for anonymous access, cross-user isolation, forged ownership, privileged profile fields, contact privacy, function execution, and Realtime publication state.
- Database security, schema, RLS, migration, service-role, and retention documentation.

### Changed

- Profile creation now uses one private idempotent Auth trigger.
- Signup no longer creates a preference row or pre-fills responsible-play acknowledgement.
- Onboarding save and completion derive ownership from `auth.uid()` and complete related writes in one database transaction.
- User-facing onboarding failures no longer include raw database messages.

### Verification note

- Repository baseline tests passed before editing.
- Local Supabase replay and pgTAP are pending because Docker and Podman are unavailable.
- Remote migration drift is pending because the repository is not linked to an identified Supabase project.

## [Phase 2H] - 2026-08-11

### Added

- **Production User Onboarding & Preferences**: Implemented `/onboarding` multi-step wizard for newly registered members.
- **Database Schema & RLS**: Created `supabase/migrations/20260811140000_phase_2h_onboarding.sql` creating `public.user_preferences` table and adding `onboarding_completed_at` / `onboarding_step` to `public.profiles`.
- **Server Gating & Resuming**: Added server-side layout protection redirecting incomplete members to `/onboarding` and completed members to `/overview`.
- **Validation & Canonical Preferences**: Created `@playtoday/validation` onboarding schema with canonical definitions for Sports, Bookmakers, Markets, Target Odds, Strategy, Risk, and Responsible Play.
- **Documentation**: Created `ONBOARDING_ARCHITECTURE.md`, `USER_PREFERENCES.md`, and `ONBOARDING_SECURITY.md`.
