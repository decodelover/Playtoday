# Phase 6 Walkthrough Plan — Production Today's Games, Match Analysis, Prediction Surfaces & Real Dashboard Intelligence

## Phase 5 Retroactive Audit
PlayToday Phase 5 established the point-in-time statistical prediction engine and model evaluation architecture:
- **Canonical Model Registrations**: Production models defined for Match Result (1X2), Total Goals (Over/Under 2.5), and Both Teams To Score (BTTS).
- **Statistical Model Foundation**: Bivariate Poisson goal expectancy ($\lambda_{\text{home}}, \mu_{\text{away}}$) with venue-adjusted attack and defence ratings and probability matrix integration.
- **Calibrated Probabilities**: Mathematical probability normalization ensuring all output vectors sum to $1.000 \pm 0.001$.
- **Strict Anti-Leakage Rules**: Zero target leakage, zero post-match feature leakage, and strict temporal boundary cutoffs (`kickoff_at < cutoff` and `id != target_fixture_id`).
- **Abstention State**: Robust gating returning `status = "insufficient_data"` when historical match samples are below minimum statistical thresholds ($N < 3$) rather than manufacturing fabricated picks.
- **Data Authenticity**: 100% verified real sports records; 0 synthetic fixtures, 0 placeholder goals, and 0 fake probabilities.

---

## Production Data Inventory
Actual database counts from live canonical records (as of August 15, 2026):
- **Total Fixtures Today**: `500`
- **Total Canonical Fixtures in Database**: `655`
  - **Finished Matches (`finished`)**: `141`
  - **Live & In-Play Matches (`live`, `halftime`)**: `90` (79 live in-play + 11 halftime)
  - **Scheduled Upcoming Matches (`scheduled`)**: `415`
  - **Postponed / Cancelled (`postponed`, `cancelled`)**: `8`
  - **Unknown / Edge (`unknown`)**: `1`
- **Verified World Football Competitions**: `187`
- **Verified Football Clubs / Teams**: `1,310`
- **Verified League Seasons**: `187`
- **Active Bookmakers**: `17` verified operators
- **Cross-Provider Entity Mappings**: `2,397`
- **Database Tables Verified Active**: `fixtures`, `competitions`, `teams`, `seasons`, `bookmakers`, `market_definitions`, `odds_markets`, `odds_lines`, `competition_standings`, `fixture_team_statistics`, `fixture_lineups`, `player_injuries`, `players`, `profiles`, `contact_submissions`.

---

## Current UI Audit
- **`/overview` (Dashboard)**:
  - Displays real KPI metric counters (total fixtures today, live now, upcoming, finished).
  - Surfaces actual live matches and upcoming fixture cards with real scores and timestamps.
  - Action cards link cleanly to `/games`, `/daily-odds`, `/markets`, and `/settings`.
  - Zero documentation text or placeholder mocks remaining.
- **`/games` (Today's Games)**:
  - Canonical fixture discovery route rendering 500 fixtures with status tabs (All, Live, Upcoming, Finished).
  - Search filter by team/league, live score updates, and direct "Match Intel" links to `/games/[id]`.
- **`/games/[id]` (Match Intelligence & Analysis)**:
  - Full statistical breakdown: calibrated Poisson outcome probabilities (1X2, Over/Under 2.5, BTTS, Double Chance), point-in-time L5 team form badges with match details, head-to-head records, live competition standings, confirmed starting lineups, and match team statistics.
- **`/daily-odds` & `/markets`**:
  - Live decimal odds feed normalized from The-Odds-API across primary markets.

---

## Existing Route Architecture
The canonical customer-facing sports-intelligence routes are:
1. **`/overview`**: High-level daily dashboard with real KPIs, live match radar, and intelligence summaries.
2. **`/games`**: Today's Games fixture directory with date navigation, status filtering, and live search.
3. **`/games/[id]`**: Canonical Match Analysis and Intelligence Center for any specific fixture.
4. **`/daily-odds`**: Real-time odds comparison across verified bookmakers.
5. **`/markets`**: Canonical market definitions and betting types catalog.
6. **`/settings`**: Account preferences (timezone, preferred bookmaker, odds format).

---

## Product Information Architecture
- **Overview (`/overview`)**: High-level situational awareness. Real fixture counts by status, live match ticker, quick-action navigation, and featured high-data-quality matches.
- **Today's Games (`/games`)**: Discovery and scheduling. Filterable by status (Live, Upcoming, Finished), competition, and search query in the user's localized timezone.
- **Match Analysis (`/games/[id]`)**: Deep statistical intelligence. Bivariate Poisson goal expectancy ($\lambda, \mu$), true outcome probabilities, point-in-time form badges, H2H record, live league table, team match stats, and official starting XI.

---

## Real Data Flow
```
1. Ingestion:
   [API-Football / The-Odds-API]
             │
             ▼
   [Supabase Canonical DB: fixtures, teams, competitions, odds, standings, lineups]
             │
2. Intelligence & Prediction:
   [Point-in-Time Intelligence Engine: @playtoday/sports-domain]
   - Filters: kickoff_at < target_kickoff_at AND id != target_fixture_id
   - Computes: Attack/Defence strengths, Poisson expectations, L5 form, H2H
             │
3. Server-Side Data Assembly:
   [Next.js Server Component: apps/web/src/app/(app)/games/[id]/page.tsx]
   - Fetches fixture details, historical records, standings, stats, lineups
             │
4. Client Presentation:
   [MatchIntelligenceView / OverviewClient / GamesClient]
   - Calibrated probability meters, form badges, standings table, live score ticker
```

---

## Step-by-Step Execution Plan

### Step 1: Real Data Audit & Read-Model Hardening
- **Purpose**: Verify all query builders strictly respect user timezone, status filtering, and anti-leakage constraints.
- **Files to Inspect**: `apps/web/src/lib/games-service.ts`, `apps/web/src/lib/match-intelligence-service.ts`.

### Step 2: Overview Dashboard Polish & Real Intelligence Feeds
- **Purpose**: Ensure `/overview` delivers a clean financial-grade analytics feel with genuine query-derived metric counters, active live match cards, and direct links to Match Intel.
- **Files to Inspect / Modify**: `apps/web/src/app/(app)/overview/page.tsx`, `apps/web/src/app/(app)/overview/overview.module.css`.

### Step 3: Today's Games Navigation & Realtime Status
- **Purpose**: Refine `/games` with instant status tabs, responsive fixture cards, and WebSocket real-time score updates.
- **Files to Inspect / Modify**: `apps/web/src/app/(app)/games/games-client.tsx`, `apps/web/src/lib/use-live-fixtures.ts`.

### Step 4: Match Analysis Deep Intelligence & Probabilities (`/games/[id]`)
- **Purpose**: Ensure the match intelligence view cleanly renders Poisson probabilities, market comparisons, verified form sequences, official lineups, and live standings.
- **Files to Inspect / Modify**: `apps/web/src/app/(app)/games/[id]/match-intelligence-view.tsx`, `apps/web/src/app/(app)/games/[id]/match-intelligence.module.css`.

### Step 5: Responsive Verification & Accessibility
- **Purpose**: Test mobile viewports (360px, 375px, 390px, 430px) and tablet/desktop breakpoints for clean layout, solid backgrounds, and full keyboard navigation.

### Step 6: Full Monorepo Typecheck, Tests & Documentation
- **Purpose**: Run all test suites and generate comprehensive Phase 6 documentation.
- **Commands**: `pnpm typecheck`, `pnpm test`, `pnpm build`.

---

## Risks & Mitigation
1. **Target Leakage**: Pre-match probability calculations must never incorporate post-match statistics from the target match itself. (*Mitigated by pure point-in-time filters in `@playtoday/sports-domain`*).
2. **Missing Data as Zero**: Missing stats or lineups must be displayed as "Not Available" rather than 0. (*Mitigated by explicit null-safe conditional rendering*).
3. **Overconfident Language**: Probabilities must be displayed factually without casino/guaranteed terminology. (*Mitigated by Humanizer-approved wording*).
4. **Timezone Discrepancies**: All kickoffs must be rendered in the user's selected profile timezone. (*Mitigated by `userTimezone` passing in `getTodaysGames`*).

---

## Scope Exclusions
Phase 6 will **NOT** implement:
- ❌ Target Odds multi-leg accumulator builders (Phase 7).
- ❌ Daily Edge marketing cards (Phase 8).
- ❌ Automatic bet settlement engine (Phase 9).
- ❌ Gemini conversational AI sports analyst (Phase 10).
- ❌ Real money betting, booking codes, or payment processors.

---

## Completion Conditions (Pass Criteria)
1. **100% Real Data**: Every fixture, score, odds line, standing, and probability traces directly to verified canonical database records.
2. **Zero Placeholders**: No documentation text, mock cards, or fake win percentages.
3. **Mobile & Desktop Excellence**: Flawless responsive layout across all screen widths.
4. **Clean Builds**: `pnpm typecheck`, `pnpm test`, and `pnpm build` pass with 0 errors.
