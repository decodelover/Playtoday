# Phase 7 Walkthrough Plan — Production Target Odds Engine, Selection Optimization & Target-Building Experience

## Phase 6 Retroactive Audit
PlayToday Phase 6 established the real customer-facing sports-intelligence experience:
- **Real Canonical Fixtures**: `655` canonical matches stored in `public.fixtures` (`415` scheduled future matches, `141` finished, `90` live/halftime).
- **Real Match Intelligence**: Dedicated `/games/[id]` route providing Poisson goal expectancy ($\lambda_{\text{home}}, \mu_{\text{away}}$), true outcome probabilities (1X2, Over/Under 2.5, BTTS, Double Chance), point-in-time anti-leakage L5 form sequences, and live standings.
- **Real Odds Feeds & Markets**: Normalized live decimal odds from verified bookmakers across primary canonical betting markets.
- **User Preferences**: Canonical timezone and bookmaker preferences loaded cleanly from user profile settings.
- **Data Authenticity**: 0 synthetic fixtures, 0 placeholder goals, and 0 fake probabilities across all production surfaces.

---

## Target Engine Input Inventory
Actual database counts from live canonical records (as of August 15, 2026):
- **Scheduled Fixtures Available**: `415` upcoming matches
- **Active Bookmakers**: `17` verified operators in `public.bookmakers` (including SportyBet, Bet9ja, MSport, 10Bet, Bet365, William Hill, Unibet, 1xBet, etc.)
- **Supported Primary Markets**: Match Result (1X2), Total Goals (Over/Under 2.5), Both Teams To Score (BTTS), Double Chance (1X, 12, X2)
- **Target Multiplier Presets**: 2.00, 3.00, 5.00, 10.00, 20.00, 50.00, 100.00, Custom
- **Strategy Profiles**: Conservative (high-probability threshold, lower risk), Balanced (balanced value threshold), Aggressive (wider search space)

---

## Market & Bookmaker Feasibility Audit
1. **Target Odds Mathematics**:
   - $\text{Combined Odds} = \prod_{i=1}^{k} \text{Odds}_i$.
   - $\text{Combined Model Probability} = \prod_{i=1}^{k} P(\text{Selection}_i)$ (under mutual fixture independence).
   - $\text{Target Distance Metric} = |\ln(\text{Combined Odds} / \text{Target Multiplier})|$.
2. **Same-Fixture Correlation Safeguard**:
   - Selections from the same fixture are strictly prohibited from appearing in the same target combination to prevent invalid joint probability estimation.
3. **No-Force Rule**:
   - If no valid combination of real pre-match selections meets the target multiplier within strategy tolerance, the engine returns `NO QUALIFYING COMBINATION` rather than degrading selection quality or inventing fake odds.
4. **Bookmaker Coverage**:
   - SportyBet, Bet9ja, and MSport are mapped in the canonical catalog (`public.bookmakers`). Combinations built for a specific bookmaker strictly use verified prices from that bookmaker without substituting unverified providers.
5. **No Booking Code Fabrication**:
   - No unofficial or fabricated booking codes are generated.

---

## Target Odds Builder Architecture & Strategy Rules
1. **Conservative Strategy**:
   - Minimum single-leg model probability: $\ge 60\%$.
   - Maximum leg count: 4.
   - Primary markets: Match Result (heavy favorites), Double Chance, Over 1.5 Goals.
2. **Balanced Strategy**:
   - Minimum single-leg model probability: $\ge 48\%$.
   - Maximum leg count: 6.
   - Primary markets: 1X2, Over/Under 2.5, BTTS, Double Chance.
3. **Aggressive Strategy**:
   - Minimum single-leg model probability: $\ge 38\%$.
   - Maximum leg count: 8.
   - Allows higher-variance markets to reach larger multipliers (10.00+).

---

## Step-by-Step Execution Plan

### Step 1: Target Odds Optimizer Core Architecture
- **Purpose**: Implement deterministic branch-and-bound / combinatorial search over eligible pre-match fixtures with strict anti-correlation rules, precise decimal arithmetic, and strategy filters.
- **Files to Inspect / Modify**: `packages/sports-domain/src/target-odds-optimizer.ts` or `apps/web/src/lib/target-odds-engine.ts`.

### Step 2: Target Odds API Route Hardening (`/api/ai/target-odds`)
- **Purpose**: Ensure the API route calls the deterministic target engine, enforces rate limiting and request validation, and returns structured leg objects with model probabilities and bookmaker prices.
- **Files to Modify**: `apps/web/src/app/api/ai/target-odds/route.ts`.

### Step 3: Target Odds Builder UI Polish (`/target-odds`)
- **Purpose**: Provide a clean quantitative interface supporting presets (2.00, 3.00, 5.00, 10.00, 20.00, 50.00, 100.00, Custom), Strategy selector (Conservative, Balanced, Aggressive), Bookmaker selector, and responsible risk notices.
- **Files to Modify**: `apps/web/src/app/(app)/target-odds/target-odds-client.tsx`, `apps/web/src/app/(app)/target-odds/target-odds.module.css`.

### Step 4: Unit & No-Force Test Suite
- **Purpose**: Add comprehensive tests covering target search, precision multiplication, strategy boundaries, same-fixture exclusion, and no-force abstention.
- **Files to Create**: `apps/web/src/lib/target-odds-engine.test.ts`.

### Step 5: Full Monorepo Typecheck & Tests
- **Purpose**: Run `pnpm typecheck` and `pnpm test` to guarantee 0 errors.

---

## Scope Exclusions
Phase 7 will **NOT** implement:
- ❌ Daily Edge pre-packaged marketing cards (Phase 8).
- ❌ Automatic bet settlement engine (Phase 9).
- ❌ Gemini conversational AI sports analyst (Phase 10).
- ❌ Official bookmaker booking code generation or automatic wagering.
- ❌ Wallet, stake input, deposits, or withdrawals.

---

## Completion Conditions (Pass Criteria)
1. **Strict Data Authenticity**: Target combinations use only verified scheduled fixtures, real bookmaker odds, and calibrated model probabilities.
2. **Zero Price Fabrication**: No placeholder prices or fabricated slips.
3. **Correlation Protection**: Same-fixture multiple selections are 100% blocked.
4. **No-Force Principle**: Return truthful no-qualifying-result when requirements are not satisfied.
5. **Full Suite Green**: `pnpm typecheck`, `pnpm test`, and `pnpm build` pass with 0 errors.
