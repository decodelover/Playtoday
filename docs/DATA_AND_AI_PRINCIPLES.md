# Data and AI Principles

## Licensed-data-first policy

Use sports data only under a license, written permission, public-data grant, or other reviewed basis that permits the intended storage, transformation, display, and model use. Provider contracts, attribution, retention, derived-data rights, redistribution limits, environments, and rate limits must be recorded before integration. “Available online” is not sufficient authorization.

## Sports-provider abstraction

Provider-specific payloads terminate at ingestion adapters. The internal sports domain uses canonical identifiers and schemas for competitions, teams, fixtures, participants, statuses, scores, statistics, markets, outcomes, odds observations, and provenance. Mappings are versioned and traceable back to provider identifiers. Provider changes must not leak directly into prediction, settlement, or UI contracts.

The initial system may use one provider, but the boundary must allow replacement and selective fallback without pretending feeds are equivalent.

## Data freshness and provenance

Every material observation records:

- provider and source identifier;
- source event time where available;
- ingestion/observation time;
- effective time and expiry or staleness threshold;
- normalization/mapping version; and
- validation result.

Freshness thresholds vary by data class and workflow. Fixture identity may remain stable longer than pre-match odds, lineup information, or status. Stale inputs must be labeled, excluded, or revalidated rather than silently used. Publication captures the precise input snapshot or immutable references needed for reconstruction.

## Data Quality Score

The Data Quality Score (DQS) is a documented 0–100 diagnostic composed from dimensions such as completeness, freshness, cross-source consistency, identifier confidence, provider reliability, historical sample adequacy, and anomaly checks. Each score stores its rubric version and component values.

DQS is not model confidence, estimated probability, or win probability. Thresholds determine whether a match is eligible, shown with a warning, or excluded. A high DQS cannot make an inherently uncertain prediction certain.

## Match exclusion

Exclude or defer a fixture when minimum evidence or integrity rules fail, including unresolved identity, inadequate history, stale or inconsistent status, unreliable competition, missing required features, suspicious odds, unsupported market semantics, or provider outage. Record an audience-appropriate exclusion reason and internal diagnostics.

The target-odds engine must return below-target or no qualifying combination rather than weaken thresholds. Excluded candidates and understandable reasons are part of the output.

## Probability estimation and calibration

- Statistical and machine-learning models—not an LLM—produce probabilities.
- Define prediction time, target, feature cutoff, leakage controls, training window, validation scheme, and competition coverage for each model.
- Normalize mutually exclusive market probabilities where appropriate and distinguish model estimates from bookmaker-implied probabilities.
- Measure calibration out of sample using reliability plots and suitable scores such as Brier score and log loss, segmented by competition, market, probability band, and time.
- Apply a documented calibration method only on held-out data and monitor drift after deployment.
- Display estimates with honest precision, sample limitations, and uncertainty. Do not translate confidence scores into unsupported win percentages.

For combined tickets, do not multiply leg probabilities blindly when legs are dependent. Estimate or conservatively account for correlation, document the method, and refuse combinations whose dependency risk cannot be assessed adequately.

## Model versioning and reproducibility

Every production prediction references an immutable model version, feature/schema version, calibration version, code artifact, training-data snapshot or lineage, evaluation report, and generation timestamp. Promotion requires approved evaluation and rollback criteria. Published predictions retain their original outputs even after a new model is deployed.

Randomness must be controlled where practical, and the system must preserve enough inputs or lineage to investigate a prediction without retaining data beyond license or privacy limits.

## Backtesting versus production performance

Backtests must use time-aware splits, realistic availability cutoffs, competition coverage, market availability, historical odds assumptions, and no future leakage. Report sample size, exclusions, uncertainty, and sensitivity to selection rules.

Backtest, validation, shadow, and live-production results must be labeled separately. Simulated return must not be presented as realized user profit. Production performance uses the exact published selections, observed original odds, rule versions, pass days, and final corrected settlements; it cannot be rebuilt by selecting winners retrospectively.

## No LLM-generated factual sports data

The LLM may interpret user intent, call trusted internal tools, compare verified combinations, and explain structured model outputs. It must not independently invent or “fill in” fixtures, scores, odds, injuries, lineups, probabilities, booking codes, or results.

Tool responses supplied to the LLM must include provenance, freshness, and confidence fields. Generated explanations must remain grounded in supplied facts; unsupported claims are rejected or qualified. Prompts and output policy must prevent guarantees and distinguish model confidence, DQS, and estimated probability.

## Deterministic settlement

Settlement is implemented by versioned rules applied to verified event results. Generative AI cannot select a result, resolve a market, or override a settlement. Jobs must be idempotent, replayable, and capable of processing remaining legs after a ticket is already lost.

Ambiguous, conflicting, suspended, postponed, or corrected provider data enters a review state instead of being guessed. Manual correction appends an auditable decision and preserves the original.

## Human review boundaries

Authorized reviewers may:

- pause publication or settlement when data integrity is uncertain;
- approve model promotion against documented evidence;
- resolve provider identity or rule ambiguities with cited evidence; and
- correct settlements through the controlled, append-only workflow.

Reviewers may not hand-pick results to improve performance, alter historical prediction content, delete losses, relabel pass days, or publish unsupported booking codes. Dual control should apply to high-impact bulk corrections and production model promotion.

## AI explanation requirements

Every user-facing prediction explanation must identify the selection, estimated probability, observed odds and time, model confidence, DQS, principal supporting factors, important limitations, failure scenarios, and relevant exclusions. It must use calibrated language, avoid causal claims from correlation, and never imply certainty.

If evidence is stale, incomplete, conflicting, or outside model coverage, the explanation must say so or the match must be excluded. Users must be able to distinguish sourced facts, model estimates, and LLM-written narrative.

## Model and data monitoring

Monitor:

- feed availability, latency, freshness, completeness, mapping failures, duplicates, and provider disagreement;
- feature drift, prediction distribution, calibration, discrimination, scoring metrics, coverage, and abstention rate;
- performance by competition, market, risk profile, odds band, and model version;
- publication-to-kickoff timing, odds movement, settlement delay, correction rate, and job replay failures; and
- explanation-grounding failures and prohibited-claim detections.

Define warning, pause, rollback, and incident thresholds before production. Low sample sizes must be visible and must not trigger misleading conclusions.

## Transparent wins and losses

All published tickets are immutable historical facts. Retain and display wins, losses, voids, cancellations, partial settlements, corrections, and pass days using the same inclusion rules. A losing ticket identifies its cutting selection while remaining legs continue to settle. Performance dashboards disclose denominators, time windows, model versions where material, and treatment of voids and missing data. No silent deletion, selective windowing, or retroactive eligibility change is permitted.
