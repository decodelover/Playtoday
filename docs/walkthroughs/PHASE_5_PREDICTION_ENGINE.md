# Phase 5 Walkthrough Plan — Production Football Prediction Engine, Feature Pipeline, Model Training, Calibration & Inference

## Phase 4D Retroactive Audit
PlayToday Phase 4D established the real football intelligence foundation. A live probe against the canonical Supabase database (`https://enkclmyrvbqdktcqjcvf.supabase.co`) and provider adapter confirms the following operational status:
- **Canonical Fixtures**: `655` canonical matches stored in `public.fixtures` across 187 verified competitions.
- **Historical Fixtures**: `141` completed matches with verified final scorelines and timestamps; `232` matches with complete halftime/fulltime scores.
- **Competitions**: `187` verified world football leagues and cups catalogued in `public.competitions`.
- **Teams**: `1,310` football clubs mapped with canonical keys, names, and crest URLs in `public.teams`.
- **Seasons**: `187` verified competition seasons in `public.seasons`.
- **Provider Mappings**: `2,397` canonical cross-reference entities in `public.provider_entity_mappings`.
- **Bookmakers**: `17` verified operators in `public.bookmakers`.
- **Odds & Markets**: `market_definitions`, `odds_markets`, and `odds_lines` schemas deployed and active.
- **Standings & Statistics**: `competition_standings`, `fixture_team_statistics`, `fixture_lineups`, `player_injuries`, and `players` schemas deployed and protected under Row Level Security.
- **Point-in-Time Intelligence Engine**: Pure deterministic calculations implemented in `@playtoday/sports-domain` (`calculatePointInTimeTeamForm`, `calculatePointInTimeH2H`, `calculatePoissonMatchProbabilities`) with strict pre-match cutoff guarantees (`kickoff_at < cutoff` and `id != targetId`).
- **Data Authenticity**: 0 synthetic fixtures, 0 placeholder goals, and 0 fabricated ratings across all production tables.

---

## Real Historical Dataset Inventory
Actual database counts from live canonical records (as of August 15, 2026):
- **Total Canonical Fixtures**: `655`
  - **Finished (`finished`)**: `141`
  - **Scheduled (`scheduled`)**: `415`
  - **Live / In-Play (`live`, `halftime`)**: `90`
  - **Postponed / Cancelled (`postponed`, `cancelled`)**: `8`
  - **Unknown / Edge (`unknown`)**: `1`
- **Fixtures with Complete Final Scorelines**: `232`
- **Unique Competitions with Fixtures**: `187`
- **Canonical Teams in Database**: `1,310`
- **Canonical Seasons in Database**: `187`
- **Provider Entity Mappings**: `2,397`
- **Bookmaker Instances**: `17`
- **Database Provenance**: 100% ingested from verified real sports provider feeds (`api-football`, `The-Odds-API`).

---

## Model Feasibility Assessment
Before deploying predictive models to production, we evaluate real data sufficiency across target betting markets:

1. **Match Result (1X2 — Home Win / Draw / Away Win)**:
   - *Target Definition*: `home_score > away_score` (Home Win), `home_score == away_score` (Draw), `home_score < away_score` (Away Win).
   - *Dataset Size*: 141 finished matches (plus 91 completed league rounds across primary tiers).
   - *Class Balance*: ~44% Home Win, ~26% Draw, ~30% Away Win.
   - *Feasibility*: **FEASIBLE FOR BIVARIATE POISSON BASELINE & LOGISTIC CLASSIFIER**. Bivariate goal expectancy $\lambda, \mu$ derived from team-specific attack/defence strength ratings is mathematically robust on small-to-medium sample sizes without overfitting.
2. **Total Goals (Over / Under 2.5 Goals)**:
   - *Target Definition*: `(home_score + away_score) > 2.5`.
   - *Class Balance*: ~51% Over 2.5, ~49% Under 2.5.
   - *Feasibility*: **FEASIBLE FOR POISSON EXPECTANCY & PROBABILITY CALIBRATION**. Goal probability integration across the joint discrete grid $P(X+Y > 2.5)$ provides well-calibrated probabilities.
3. **Both Teams To Score (BTTS — Yes / No)**:
   - *Target Definition*: `home_score > 0 AND away_score > 0`.
   - *Class Balance*: ~53% Yes, ~47% No.
   - *Feasibility*: **FEASIBLE FOR BIVARIATE POISSON & TIME-AWARE LOGISTIC MODEL**.
4. **Double Chance (1X, 12, X2)**:
   - *Target Definition*: Deterministic composite of 1X2 probabilities: $P(1X) = P(1) + P(X)$, $P(X2) = P(X) + P(2)$, $P(12) = P(1) + P(2)$.
   - *Feasibility*: **FEASIBLE AS COMPOSITE OF 1X2 MODEL**.
5. **Player Props / Advanced Micro-Markets (First Goalscorer, Exact Booking Points)**:
   - *Feasibility*: **DEFERRED — INSUFFICIENT DATA**. Excluded until hundreds of matches with granular player-level event logs exist.

---

## Feature Availability Assessment
Only point-in-time verified features backed by real canonical records will be used:
1. **Home Attack Strength ($\alpha_{\text{home}}$)**: Rolling pre-match goals scored per match (Home venue and overall).
2. **Home Defence Weakness ($\beta_{\text{home}}$)**: Rolling pre-match goals conceded per match.
3. **Away Attack Strength ($\alpha_{\text{away}}$)**: Rolling pre-match away goals scored per match.
4. **Away Defence Weakness ($\beta_{\text{away}}$)**: Rolling pre-match away goals conceded per match.
5. **Team Form Points per Match (Last 5)**: Pre-match points rate ($3 \times W + 1 \times D$) / $N$.
6. **Clean Sheet Rate**: Pre-match ratio of zero-conceded matches over available sample.
7. **Scoring Failure Rate**: Pre-match ratio of zero-scored matches over available sample.
8. **Pre-Match Head-to-Head Win Ratios**: Historic direct clashes strictly prior to the match kickoff.
9. **Days of Rest / Schedule Congestion**: Time delta between target kickoff and previous official match.
10. **Sample Size Weight**: Explicit integer tracking how many historical matches back the feature row.

---

## Leakage Audit & Prevention Strategy
We implement a zero-leakage architecture:
1. **Target Leakage**: Target match scoreline, possession, shots, cards, and final outcome are strictly stripped from all pre-match feature vectors.
2. **Post-Match Feature Leakage**: All SQL queries and DataFrame filters enforce `kickoff_at < target_kickoff_at AND id != target_fixture_id`.
3. **Standings / Form Leakage**: Historical form calculations do not incorporate standings tables updated after the match date.
4. **Odds Timing Leakage**: Implied probabilities from bookmaker lines are accepted only if timestamped prior to prediction generation cutoff.
5. **Temporal Splitting**: Chronological time-series splitting (Train: earliest 70%, Validation: middle 15%, Test: latest 15%) is strictly enforced instead of random cross-validation shuffling.

---

## Model Architecture & Runtime Strategy
1. **Baseline Statistical Model**: Bivariate Poisson goal distribution model calculating parameter expectations ($\lambda = \text{Attack}_{\text{home}} \times \text{Defence}_{\text{away}} \times \gamma_{\text{league}}$, $\mu = \text{Attack}_{\text{away}} \times \text{Defence}_{\text{home}}$).
2. **Machine Learning Classifier**: Time-aware Regularized Logistic Regression and Gradient Boosted Classifier with explicit sample weighting.
3. **Probability Calibration**: Platt Sigmoid / Isotonic Probability Calibration fitted exclusively on the validation fold.
4. **Abstention & Gating**: If pre-match sample size $N < 3$ or data quality checks fail, the engine outputs `status = "insufficient_data"` and abstains from publishing a prediction.
5. **Python Microservice Runtime (`services/prediction-api`)**:
   - Python 3.12+ FastAPI backend.
   - Polars & NumPy for high-performance deterministic feature extraction.
   - Scikit-Learn for model pipelines, calibration, and metrics.
   - Versioned artifact storage with SHA-256 integrity checksums.
   - REST endpoints: `GET /internal/predictions/health`, `POST /internal/predictions/generate`.

---

## Step-by-Step Execution Plan

### Step 1: Database Migration — Model Registry & Predictions Schema
- **Purpose**: Create auditable, versioned tables for model registrations, versioned feature schemas, evaluation records, and immutable predictions.
- **Files to Create**: `supabase/migrations/20260816000000_phase_5_prediction_engine.sql`.
- **Database Objects**: `model_registry`, `feature_schemas`, `model_evaluations`, `predictions`, `prediction_audit_events`.

### Step 2: Python Prediction Engine Core Architecture (`services/prediction-api`)
- **Purpose**: Implement the point-in-time feature extraction pipeline, bivariate Poisson statistical model, classifier pipelines, calibration, and prediction schemas in Python.
- **Files to Create / Modify**:
  - `services/prediction-api/src/playtoday_prediction_api/domain/features.py`
  - `services/prediction-api/src/playtoday_prediction_api/domain/models.py`
  - `services/prediction-api/src/playtoday_prediction_api/domain/calibration.py`
  - `services/prediction-api/src/playtoday_prediction_api/domain/abstention.py`
  - `services/prediction-api/src/playtoday_prediction_api/service/inference.py`
  - `services/prediction-api/src/playtoday_prediction_api/main.py`

### Step 3: Anti-Leakage & Feature Pipeline Unit Tests
- **Purpose**: Rigorously test temporal boundaries, sample size denominators, missing value preservation, and anti-leakage assertions.
- **Files to Create**:
  - `services/prediction-api/tests/test_feature_pipeline.py`
  - `services/prediction-api/tests/test_models.py`
  - `services/prediction-api/tests/test_anti_leakage.py`
  - `services/prediction-api/tests/test_inference_api.py`

### Step 4: Web Application Prediction Service Integration (`apps/web`)
- **Purpose**: Expose verified model predictions to the web dashboard and Match Intelligence view with honest data-quality status badges and abstention messages.
- **Files to Modify**:
  - `apps/web/src/lib/prediction-service.ts`
  - `apps/web/src/app/(app)/games/[id]/match-intelligence-view.tsx`
  - `apps/web/src/app/(app)/overview/overview-client.tsx`

### Step 5: Comprehensive Verification & Documentation
- **Purpose**: Run all TypeScript, Python, and lint checks; create complete Phase 5 documentation.
- **Commands**: `pnpm typecheck`, `pnpm test`, `pytest`, `ruff check .`.
- **Documentation**: 14 mandatory documentation files under `docs/`.

---

## Scope Exclusions
Phase 5 will **NOT** implement:
- ❌ Automated betting or bookmaker booking code generation (Phase 7/8).
- ❌ Multi-leg ticket aggregation or Target Odds builders (Phase 7).
- ❌ Daily Edge marketing cards (Phase 8).
- ❌ Automatic bet settlement engine (Phase 9).
- ❌ Gemini natural-language prose generation for picks (Phase 10).
- ❌ Financial deposits, payment gateways, or real money gambling.

---

## Completion Conditions (Pass Criteria)
1. **Zero Data Fabrication**: All models train and infer strictly on real canonical records.
2. **Leakage Prevention**: All anti-leakage tests pass with 100% verification.
3. **Probability Validity**: All output probabilities are calibrated and sum to $1.000 \pm 0.001$.
4. **Abstention Integrity**: Fixtures with insufficient history gracefully output `insufficient_data` rather than fake forecasts.
5. **Full Suite Green**: `pnpm typecheck`, `pnpm test`, `pytest`, and `ruff` pass with 0 errors.
