# Phase 8 Walkthrough Plan

## 1. Phase 7 Retroactive Audit & System Verification

### Production Engine & Data Architecture Audit
- **Canonical Fixtures**: Verified canonical fixtures in `fixtures` table sourced via API-Football sync.
- **Published Predictions**: Phase 5 Poisson & Bivariate ML models generating calibrated probabilities across Full Time Result (1X2), Both Teams To Score (BTTS), and Over/Under 2.5 Goals.
- **Verified Bookmaker Odds**: Phase 4C odds ingestion pipeline with active quotes from verified bookmakers (Betfair, BetOnline, Betclic, etc.) mapped through `provider_entity_mappings` and `sports_market_definitions`.
- **Target Odds Engine (Phase 7)**: Combination search with correlation filters, margin reduction, product multiplication, and bounded leg constraints.
- **AI Analyst Services**: Verified isolated zero-config runtime resolving live sports contexts without fabricating predictions or odds.

---

## 2. Real Daily Edge Inputs & Inventory

We will query and document the exact operational database state for candidate generation:
- Today's active pre-match fixtures.
- Validated model predictions with calibrated probability metrics.
- Fresh bookmaker odds quotes matching active fixture markets.
- Quality-qualified candidate selections meeting model confidence, market liquidity, and freshness bounds.
- Bookmakers represented in active market quotes.

---

## 3. Canonical Route & Fake Data Removal

- **Canonical Route**: `/daily-edge` (integrated seamlessly with `/overview`, `/todays-games`, and `/matches/[id]`).
- **Fake Data Audit**: Ensure all production surfaces contain zero hardcoded picks, mock slips, fake streak counters, or simulated win rates.

---

## 4. Daily Edge Policy & Target-Band Architecture

- **Objective**: Target approximately **~2.00 combined decimal odds** (Target Band: 1.85 to 2.25).
- **Quality Over Target (No-Force Rule)**: Quality, calibrated probability, odds freshness, and correlation safety strictly take precedence over reaching ~2.00. If no candidate combination meets all qualification gates, the engine deterministically issues an official **PASS DAY**.
- **Leg Bound**: Bounded to 1 to 2 high-conviction legs (e.g. Double Chance, Over 1.5 Goals, Draw No Bet, or strong Match Winner).
- **Same-Fixture Correlation Safeguard**: Strictly forbids multiple selections from the same match in a single Daily Edge ticket.
- **Idempotent Operational Cutoff**: Deterministic daily publication pipeline keyed by operational date (`YYYY-MM-DD`).

---

## 5. Pass-Day & Lifecycle Architecture

- **Pass-Day State**: An official, auditable publication record with `status = 'pass_day'` and a humanized truthful explanation (e.g., *"No selections met today's strict model qualification and odds value thresholds"*).
- **Separation of Infrastructure Failure vs. Pass Day**: Transient provider delays or database errors yield `temporarily_unavailable` / `evaluating`, never falsely recorded as a strategic pass day.
- **Settlement Boundary (Phase 9 Handoff)**: Phase 8 tracks match-derived states (`scheduled`, `live`, `postponed`, `awaiting_settlement`). Authoritative settlement (`won`, `lost`, `void`, cutting leg) is strictly preserved for Phase 9.

---

## 6. Database Schema & RLS Security

### Proposed Tables:
1. `daily_edge_publications`:
   - `id` (UUID PK)
   - `publication_date` (DATE UNIQUE, NOT NULL)
   - `status` ('published' | 'pass_day' | 'evaluating' | 'superseded')
   - `target_multiplier` (NUMERIC)
   - `original_combined_odds` (NUMERIC)
   - `bookmaker_id` (UUID FK -> bookmakers)
   - `bookmaker_name` (TEXT)
   - `pass_reason_code` (TEXT)
   - `pass_reason_text` (TEXT)
   - `policy_version` (TEXT, e.g., 'daily_edge_v1')
   - `published_at` (TIMESTAMPTZ)
   - `created_at` (TIMESTAMPTZ)
2. `daily_edge_legs`:
   - `id` (UUID PK)
   - `publication_id` (UUID FK -> daily_edge_publications)
   - `fixture_id` (UUID FK -> fixtures)
   - `prediction_id` (TEXT)
   - `market_key` (TEXT)
   - `selection_key` (TEXT)
   - `market_name` (TEXT)
   - `selection_name` (TEXT)
   - `original_decimal_odds` (NUMERIC NOT NULL)
   - `model_probability` (NUMERIC NOT NULL)
   - `kickoff_at` (TIMESTAMPTZ NOT NULL)
   - `display_order` (INT NOT NULL)
   - `lifecycle_status` ('scheduled' | 'live' | 'postponed' | 'cancelled' | 'awaiting_settlement')

### RLS Policies:
- Public/Authenticated users have `SELECT` on published records.
- Write/Update restricted strictly to service role / secure operational pipeline.

---

## 7. UI/UX Design & Taste System

- **Clean Analytical Presentation**: Built with refined typography, balanced contrast, and subtle brand accents. Completely free from neon casino banners, "sure odds" badges, or gambling clichés.
- **Mobile First**: Tested and verified across 360px, 375px, 390px, 430px, tablet, and desktop viewports.
- **Contextual Badges**: Subtle "Daily Edge" badge on `/todays-games` and Match Analysis drawer.
- **Truthful Historical Archive**: Transparent past Daily Edge publications and Pass Days without rewriting losing slips or altering original published odds.

---

## 8. Verification & Test Plan

1. **Deterministic Eligibility & Quality Tests**: Unit tests verifying quality threshold filtering.
2. **Target Band & No-Force Tests**: Unit tests confirming pass-day generation when no candidate falls in the ~2.00 target window.
3. **Correlation & Single-Bookmaker Tests**: Guaranteeing 1 bookmaker per slip and no same-match legs.
4. **Odds Immutability Tests**: Ensuring original published odds remain immutable even when current market prices shift.
5. **Idempotent Job Tests**: Verifying duplicate publication runs on the same date produce zero duplicates.
6. **Full Monorepo CI Validation**: `pnpm typecheck`, `pnpm test`, and `pnpm build`.
