# Phase 4D Walkthrough Plan: Production Football Intelligence Data, Standings, Form, Statistics, Lineups, Availability & Historical Feature Foundation

## 1. Executive Summary & Identity
- **Product**: PlayToday (`playtoday`, `@playtoday/*`)
- **Phase Objective**: Establish PlayToday's production football-intelligence layer using **ONLY** real provider-backed or verified derived canonical data. Prepare a robust, point-in-time, anti-leakage foundation for the upcoming Phase 5 Prediction Engine without generating synthetic, placeholder, or estimated data.
- **Absolute Data Truth Rule**: If PlayToday cannot obtain a value from an approved provider or deterministically calculate it from verified canonical records, the value **DOES NOT EXIST** in production. Missing data is preserved as `null`/`unavailable`, never replaced with fake 0s, random numbers, or artificial completions.

---

## 2. Phase 4C Retroactive Audit

A full inspection of the active Supabase PostgreSQL database and provider integration was conducted on 2026-08-15:

| System Component | Database Status / Count | Operational Assessment |
| :--- | :--- | :--- |
| **Sports** | `1` row (`football`) | Operational |
| **Geographic Areas** | `62` rows | Operational |
| **Competitions** | `187` rows | Operational |
| **Seasons** | `187` rows | Operational |
| **Teams** | `1,310` rows | Operational |
| **Venues** | `245` rows | Operational |
| **Fixtures** | `655` rows (`415` scheduled, `141` finished, `79` live, `11` halftime, `5` postponed, `3` cancelled, `1` unknown) | Operational |
| **Provider Entity Mappings** | `2,397` rows | Operational |
| **Bookmakers** | `17` canonical bookmakers | Operational |
| **Bookmaker Capabilities** | `17` verified capability profiles | Operational |
| **Canonical Markets** | `7` markets (`match_winner`, `double_chance`, `over_under_25`, `both_teams_to_score`, etc.) | Operational |
| **Provider Market Mappings** | `7` verified mappings | Operational |
| **Provider Selection Mappings**| `8` verified selection mappings | Operational |
| **Current Odds** | `9,712` verified live quotes from active bookmakers | Operational |
| **Sports Provider Health** | `healthy` (`last_successful_sync_at` active, `0` consecutive failures) | Operational |

**Audit Conclusion**: Phase 4C is fully operational and grounded in live database records.

---

## 3. Current Intelligence Data Inventory

Host database query results for intelligence-specific tables prior to Phase 4D:

| Intelligence Entity | Table Name | Existing Row Count | Schema Cache Status |
| :--- | :--- | :--- | :--- |
| **League Standings** | `competition_standings` | `0` | Table to be created in Phase 4D |
| **Match Statistics** | `fixture_team_statistics` / `fixture_statistics` | `0` | Table to be created in Phase 4D |
| **Team Lineups** | `fixture_lineups` | `0` | Table to be created in Phase 4D |
| **Player Availability & Injuries** | `player_injuries` | `0` | Table to be created in Phase 4D |
| **Player Registry** | `players` | `0` | Table to be created in Phase 4D |
| **Derived Form / Streaks** | `derived_team_form_snapshots` | `0` | Table/View to be created in Phase 4D |
| **Head-to-Head Snapshots** | N/A (Derived dynamically from `fixtures`) | N/A | Deterministic query model to be created |

---

## 4. Provider Capability Audit

Verified against live API-Football endpoints (`https://v3.football.api-sports.io`):

| Endpoint | Tested Parameter | Response Status | Result Count | Verification Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/standings` | `league=39&season=2024` | `200 OK` | `20` teams | Provides rank, points, goals diff, form string, home/away splits |
| `/fixtures` | `league=39&season=2024` | `200 OK` | `380` fixtures | Full season schedule, past results, scores, and status details |
| `/fixtures/statistics` | `fixture=1208021` | `200 OK` | `2` teams | Shots on/off goal, possession %, corners, fouls, passes, cards |
| `/fixtures/lineups` | `fixture=1208021` | `200 OK` | `2` teams | Confirmed starting XI, substitutes, coach, formations (e.g. 4-2-3-1) |
| `/injuries` | `fixture=1208021` | `200 OK` | `6` absences | Player name, photo, injury reason, type, fixture ID |
| `/fixtures/headtohead` | `h2h=42-49` | `200 OK` | `47` matches | Historical match-by-match results between canonical clubs |

---

## 5. Real-Data Availability Matrix

| Data Category | Provider Support | Current Plan Access | Real Data Available | Current DB State | Phase 4D Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Standings** | Yes (`/standings`) | Full | Yes | None | Create `competition_standings`, build ingestion adapter & sync |
| **Historical Fixtures** | Yes (`/fixtures?league&season`) | Full | Yes | `141` finished | Controlled backfill for top tier leagues (2024 season) |
| **Match Statistics** | Yes (`/fixtures/statistics`) | Full | Yes | None | Create `fixture_team_statistics`, ingest on match completion |
| **Team Form (L5/L10)**| Derived from canonical fixtures | Full | Yes | None | Create point-in-time deterministic calculator with sample sizes |
| **Head-to-Head** | Yes (`/fixtures/headtohead` + DB) | Full | Yes | None | Derive from canonical fixtures DB with provider fallback |
| **Lineups & Formations**| Yes (`/fixtures/lineups`) | Full | Yes | None | Create `fixture_lineups`, ingest confirmed XI pre-kickoff |
| **Injuries & Absences** | Yes (`/injuries`) | Full | Yes | None | Create `player_injuries`, ingest real provider absence records |
| **Player Registry** | Yes (via lineups & injuries) | Full | Yes | None | Create `players` table with provider entity mapping |
| **Expected Goals (xG)** | No (Not in standard feed) | None | No | None | **Mark Unavailable** (Zero fake xG mandate) |

---

## 6. Existing Fake Intelligence Audit

- **Grep for Synthetic Placeholders**: Searched for `mockStandings`, `fakeStandings`, `sampleForm`, `demoH2H`, `dummyPossession`. Result: **0 matches found**.
- **Grep for Random Data Generators**: Searched for `Math.random()` in `apps/web` and `packages/sports-domain`. Result: **0 occurrences in sports data code**.
- **Sanity Check**: No synthetic fallback or demo data exists in production paths.

---

## 7. Historical Coverage Strategy

- **Scope Boundary**: Ingest the **2024/2025 season** for core monitored leagues (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, UEFA Champions League).
- **Quota Protection**: Rate-limit requests and cache raw payloads in `provider_payloads` to avoid redundant API consumption.
- **Fixture Lifecycle**: Historical fixtures share the exact same `public.fixtures` schema as live/upcoming matches (using `status = 'finished'`).

---

## 8. Feature-Readiness & Point-in-Time Integrity Strategy

To ensure zero future data leakage when Phase 5 builds prediction models:
1. **Pre-Match Cutoff Rule**: For any fixture $T$ kicking off at time $K$, features computed for $T$ may **ONLY** evaluate canonical events, form, and standings updated strictly before $K$.
2. **Target Exclusion**: The target match itself is strictly excluded from historical calculations of the competing teams' form, scoring averages, and H2H records.
3. **Explicit Sample Size Tracking**: Every derived statistical record outputs both its computed value and its verified denominator (e.g. `{ form: 'WWD', sampleSize: 3, requestedSize: 5 }`).

---

## 9. Data Leakage Strategy

| Leakage Risk | Mitigation Mechanism |
| :--- | :--- |
| **Target Result Leakage** | SQL window functions filter `kickoff_at < target_fixture.kickoff_at` and `id != target_fixture.id`. |
| **Post-Match Stats Leakage** | Match statistics (possession, shots) are strictly stored with `fixture_id` and cannot be joined as pre-match features of that same fixture. |
| **Standings Leakage** | Standings snapshots store `source_updated_at` / `fetched_at` or are reconstructed point-in-time before matchday $M$. |
| **Lineup Timing Leakage** | Lineups store `confirmed_at`; pre-match models verify `confirmed_at <= feature_cutoff_at`. |

---

## 10. Match Analysis & Dashboard Integration Architecture

- **Match Analysis (`/matches/[id]`)**:
  - Standings Context: Real table position, points, goal difference for both clubs.
  - Team Form: Verified last 5 matches with opponent, score, home/away distinction.
  - Head-to-Head: Verified past encounters with dates and scorelines.
  - Confirmed Lineups: Official starting XI, bench, coach, and formation (or "Lineup not yet announced").
  - Team Statistics: Real shots on target, possession %, fouls, corners for finished games.
  - Injuries & Suspensions: Verified missing players and stated reason.
- **Overview Dashboard (`/overview`)**:
  - Live Standings widget for primary leagues.
  - Form badges (W/D/L) beside teams in Today's Games with verified tooltip breakdowns.

---

## 11. Step-by-Step Execution Plan

### Step 1: Database Schema Migration for Football Intelligence
- **Purpose**: Create canonical tables for `competition_standings`, `fixture_team_statistics`, `players`, `fixture_lineups`, `player_injuries`, and `team_form_snapshots`.
- **Files**: Create `supabase/migrations/20260815220000_phase_4d_football_intelligence.sql`.
- **DB Objects**:
  - `public.competition_standings`
  - `public.fixture_team_statistics`
  - `public.players`
  - `public.fixture_lineups`
  - `public.player_injuries`
- **Security**: Enable RLS on all tables with public/authenticated `SELECT` policies and `service_role` write policies.

### Step 2: Update Database TypeScript Definitions
- **Purpose**: Synchronize `@playtoday/database-types` with the new schema objects.
- **Files**: Modify `packages/database-types/src/index.ts`.

### Step 3: Sports Provider Ingestion Client for Intelligence
- **Purpose**: Add adapter methods in `@playtoday/sports-domain` to ingest standings, match statistics, lineups, injuries, and historical fixtures from API-Football.
- **Files**: Modify `packages/sports-domain/src/adapter.ts`, `packages/sports-domain/src/types.ts`, and `packages/sports-domain/src/persistence.ts`.

### Step 4: Deterministic Point-in-Time Form & Trends Engine
- **Purpose**: Implement pure, zero-leakage calculation utilities for Last-N form, Home/Away form splits, BTTS rates, Over/Under rates, clean sheet rates, and H2H history.
- **Files**: Create `packages/sports-domain/src/intelligence.ts`.

### Step 5: Match Analysis Read Model & API Integration
- **Purpose**: Expose server-side read models for complete fixture intelligence in the web application.
- **Files**: Create `apps/web/src/lib/match-intelligence-service.ts` and update `apps/web/src/app/(app)/matches/[id]/page.tsx`.

### Step 6: Standings & Intelligence Integration on Overview Page
- **Purpose**: Connect `/overview` and `/matches` to real verified standings and team form.
- **Files**: Update `apps/web/src/app/(app)/overview/overview-client.tsx` and related components.

### Step 7: Automated Unit, Integration & Leakage Tests
- **Purpose**: Verify that no synthetic data is produced, denominators are respected, and future data leakage is mathematically blocked.
- **Files**: Create `packages/sports-domain/tests/intelligence.test.ts` and `packages/sports-domain/tests/leakage.test.ts`.

### Step 8: Final Verification & Typecheck
- **Purpose**: Run `pnpm typecheck` and `pnpm test` across all 10 packages to guarantee zero regressions.

---

## 12. Scope Exclusions (What Phase 4D Will NOT Build)

- **No Predictions**: No AI match winner picks, prediction scores, confidence levels, or target odds.
- **No Synthetic xG**: No estimated expected goals unless officially licensed from an approved feed.
- **No Scraping**: No unofficial web scraping or third-party spreadsheet imports.
- **No Future Information Leakage**: No post-match statistics used as pre-match inputs.

---

## 13. Completion Conditions

Phase 4D will be considered **PASS** when:
1. `competition_standings`, `fixture_team_statistics`, `fixture_lineups`, and `player_injuries` schemas exist and are secured with RLS.
2. Ingestion worker successfully persists real standings, statistics, lineups, and injuries from API-Football.
3. Form, BTTS, and scoring trends are deterministically calculated from canonical database fixtures with verified sample sizes.
4. Missing data is cleanly presented as unavailable (no fake 0s or placeholder mock data).
5. All 10 monorepo packages pass `pnpm typecheck` and test suites cleanly.
