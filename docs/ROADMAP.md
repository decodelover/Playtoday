# Product and Engineering Roadmap

## Status legend and delivery rule

- 🟡 **In progress** — active step.
- ⚪ **Not started** — no implementation is authorized.
- ✅ **Complete** — verification evidence recorded and completion explicitly accepted.

Only one step may be in progress. **Step 1B is complete and no step is currently in progress. Step 1C remains not started.** Completion of a step does not automatically start the next one.

## Phase 1 — Definition and delivery governance

### Objective

Establish an internally consistent source of truth, resolve launch-critical product decisions, and define contracts before application initialization.

### Steps

- [x] ✅ **Step 1A — Documentation foundation:** create the product, requirements, architecture, roadmap, development rules, glossary, security/compliance, data/AI, bookmaker policy, ADR index, and changelog documents.
- [x] ✅ **Step 1B — Monorepo initialization:** initialize the pnpm/Turborepo workspace, minimal Next.js web foundation, shared TypeScript package placeholders, Python service placeholders, and repository tooling without product functionality.
- [ ] ⚪ **Step 1C — Product validation and provider/legal feasibility:** validate target-user problems and resolve initial region, age, competition, risk, Daily Edge, plan, analytics, retention, licensed-provider, payment, notification, AI, monitoring, and bookmaker-access decisions.
- [ ] ⚪ **Step 1D — Domain, configuration, and contract design:** specify canonical entities, identifiers, state machines, market/settlement rules, event schemas, environment validation, RLS ownership model, and API contracts without production feature implementation.

### Dependencies

- Step 1A: approved product brief supplied by the sponsor.
- Step 1B: accepted Step 1A and locally available Node.js, pnpm, and Python toolchains.
- Steps 1C–1D: accepted Step 1B and access to product, legal, data-science, and security stakeholders.
- Step 1C: provider commercial/technical information; no access is assumed.
- Step 1D: decisions from Step 1C.

### Deliverables

- Version-controlled source-of-truth documentation and ADR process.
- Functional monorepo foundation with minimal web, shared-package, and Python-service skeletons.
- Decision/risk register with accountable owner and launch gate for unresolved items.
- Provider evaluation and documented rights/access status.
- Canonical domain, lifecycle, authorization, and interface specifications.

### Verification

- Trace every requirement to a roadmap phase and testable acceptance criterion.
- Review terminology, status transitions, product claims, security, data rights, and provider assumptions across documents.
- Obtain named product, engineering, data, security, and legal acknowledgements where applicable.
- Confirm repository inspection shows documentation only at Step 1A and foundation-only scaffolding at Step 1B.

### Completion criteria

- **Step 1A:** all twelve requested Markdown files exist; requested sections, diagrams, ADRs, restrictions, and acceptance criteria are present; links resolve; no code, dependencies, scaffolding, Supabase configuration, calls, or scraping were added.
- **Step 1B:** the root workspace, pnpm lockfile, Turborepo tasks, minimal Next.js App Router web app, eight shared package placeholders, three Python service placeholders, and repository configuration exist; install, lint, typecheck, test, build, live page, and health endpoint checks pass; no product feature or external integration exists.
- **Phase 1:** critical decisions have owners and outcomes; required professional reviews are recorded (not presumed); canonical contracts and state machines are approved; Phase 2 scope is explicit.

### Explicitly excluded

For Step 1A: application scaffolding and dependencies. For Step 1B: database projects/migrations, production business logic, provider calls, bookmaker scraping, model training, feature pages, deployment, and external integrations.

## Phase 2 — Engineering quality and interface foundation

### Objective

Harden the initialized workspace and establish reusable design, testing, runtime, and operational conventions without premature product features.

### Steps

- [ ] ⚪ **Step 2A — Quality and CI hardening:** add Python lint/type/test tooling, test coverage policy, secret/dependency scanning, GitHub Actions, and protected contributor workflows.
- [ ] ⚪ **Step 2B — Design system and PWA baseline:** introduce approved shadcn/ui primitives, accessibility tokens, responsive application shell, icons/manifest, and safe offline/staleness behavior.
- [ ] ⚪ **Step 2C — Python runtime boundaries:** add FastAPI and worker runtimes with typed health/config contracts, lifecycle checks, and no domain behavior.
- [ ] ⚪ **Step 2D — Local infrastructure and observability baseline:** define Docker-based local workflow, structured logging, correlation IDs, redaction policy, and development diagnostics.
- [ ] ⚪ **Step 2E — Contract and integration-test foundation:** establish schema compatibility checks and legitimate cross-workspace test harnesses before product features depend on them.

### Dependencies

Accepted Phase 1 outputs, compatible toolchain versions, provider-neutral contracts, and approved repository/CI ownership.

### Deliverables

CI assurance, reusable design/PWA foundations, typed Python runtime shells, local operational conventions, and cross-workspace contract testing.

### Verification

Clean clone/install/build/test on supported environments; dependency and license review; secret scan; Python and TypeScript quality checks; health endpoints and minimal web shell smoke-tested; no business feature behavior present.

### Completion criteria

CI enforces documented commands, runtime boundaries match the accepted architecture, secrets are absent, the PWA communicates stale/offline state safely, and legitimate contract tests protect later work.

### Explicitly excluded

Production Supabase data, authentication journeys, sports ingestion, prediction models, Daily Edge, target-odds generation, settlement, bookmaker outputs, subscriptions, and deployment.

## Phase 3 — Operational data and identity foundation

### Objective

Establish secure identity, canonical football data storage, authorization, auditability, and licensed ingestion before predictions.

### Steps

- [ ] ⚪ **Step 3A — Supabase environments and migration workflow:** provision approved non-production projects, migrations, generated types, backups, and secret boundaries.
- [ ] ⚪ **Step 3B — Authentication and account controls:** implement sign-up/sign-in/recovery, verified contact, age/consent records, sessions, user settings, cooling-off, self-exclusion, export, and deletion foundations.
- [ ] ⚪ **Step 3C — Authorization and audit:** implement server-controlled roles, admin 2FA enforcement, RLS for every exposed table, immutable audit events, and authorization tests.
- [ ] ⚪ **Step 3D — Canonical football schema:** implement competitions, participants, fixtures, statuses, markets, outcomes, odds observations, provider mappings, provenance, and data-quality records.
- [ ] ⚪ **Step 3E — Licensed provider ingestion:** implement one approved provider adapter, validation, normalization, idempotency, freshness, quarantine, scheduling, and monitoring.
- [ ] ⚪ **Step 3F — Read-only fixture experience:** expose authorized Today’s Games, Markets, Watchlist, and basic match-data views with freshness and exclusion states.

### Dependencies

Phase 2, approved sports-data rights and provider selection, Phase 1 domain contracts, privacy/retention decision, and environment ownership.

### Deliverables

Migrated non-production databases, tested RLS policies, authenticated account foundation, immutable audit trail, normalized football feed, provider-health dashboards, and read-only fixture surfaces.

### Verification

Migration up/down recovery rehearsal as supported; RLS allow/deny matrix; cross-user and role tests; provider replay/duplicate/outage/conflict tests; freshness alarms; privacy export/deletion tests; accessibility/responsive tests.

### Completion criteria

Every exposed table has passing RLS tests; ingestion is licensed, repeatable, and observable; stale/conflicting data is not represented as current; account restrictions are server-enforced; no prediction is yet published.

### Explicitly excluded

Model-generated predictions, target-odds tickets, Daily Edge publication, deterministic market settlement, bookmaker codes, payment collection, and basketball/tennis.

## Phase 4 — Football prediction intelligence

### Objective

Build, evaluate, and expose calibrated pre-match football predictions and safe target-odds construction using approved data.

### Steps

- [ ] ⚪ **Step 4A — Research dataset and evaluation protocol:** establish feature cutoffs, lineage, leakage tests, competition coverage, baselines, time-aware validation, and promotion metrics.
- [ ] ⚪ **Step 4B — Model pipeline:** implement feature generation, training, calibration, artifact registry, reproducible evaluation, and monitoring baselines for MVP markets.
- [ ] ⚪ **Step 4C — Prediction API:** implement typed inference, eligibility/exclusion, DQS, confidence, fair odds, model version, and reproducible prediction storage.
- [ ] ⚪ **Step 4D — Target-odds engine:** generate conservative, balanced, and aggressive combinations with dependency checks, constraints, risk bands, below-target/no-result behavior, and exclusions.
- [ ] ⚪ **Step 4E — Match Analysis and Builder experiences:** deliver analysis and persistent draft/generated tickets with honest probability and failure explanations.
- [ ] ⚪ **Step 4F — Grounded AI Analyst:** add allowlisted read-only tools, provenance/freshness grounding, prompt/output claim controls, monitoring, and rate limits.

### Dependencies

Phase 3 licensed historical/operational data, approved market definitions, risk bands, evaluation thresholds, model governance, and AI provider/privacy approval.

### Deliverables

Versioned model artifacts and model cards, evaluation reports, prediction service, combination engine, match analysis, target builder, generated-ticket persistence, and grounded AI explanations.

### Verification

Leakage and reproducibility tests; out-of-sample calibration/discrimination evaluation by segment; dependency/constraint property tests; API contract/load tests; adversarial prompt and factual-grounding tests; content-claim review; failure and abstention testing.

### Completion criteria

Promotion thresholds are met on approved coverage; every output is versioned and reconstructable; weak/stale candidates are excluded; the engine can decline targets; LLM outputs contain no invented authoritative sports facts; no result claims are guaranteed.

### Explicitly excluded

In-play predictions, Daily Edge public publication, live/final settlement, official booking codes, automatic bet placement, basketball, and tennis.

## Phase 5 — Ticket lifecycle, settlement, and Daily Edge

### Objective

Deliver immutable publication, complete ticket/leg lifecycle, deterministic settlement, transparent Daily Edge, rollovers, history, and disputes.

### Steps

- [ ] ⚪ **Step 5A — Ticket and publication state machines:** implement immutable snapshots, explicit draft/published states, race-safe first-kickoff lock, and publication audit.
- [ ] ⚪ **Step 5B — Deterministic settlement engine:** implement versioned rules for every MVP market/status, idempotent jobs, reconciliation, cutting-leg identification, and continued leg settlement.
- [ ] ⚪ **Step 5C — Corrections and disputes:** implement evidence-based correction append records, reviewer roles, dispute lifecycle, and user-visible history.
- [ ] ⚪ **Step 5D — Daily Edge:** implement qualification, authorized publication/pass day, core Pro page, live progress, complete history, and emergency pause.
- [ ] ⚪ **Step 5E — Rollover and simulation:** implement official and personal cycles, pass/void/correction behavior, non-monetary simulation, and responsible-play controls.
- [ ] ⚪ **Step 5F — History and analytics:** implement transparent filters, performance/calibration views, sample disclosures, and separation of backtest/live/user/simulation results.
- [ ] ⚪ **Step 5G — Realtime and notifications:** implement authorized refresh signals, in-app delivery, preference/quiet-hour controls, idempotent retries, and integrity/security messages.

### Dependencies

Phases 3–4; approved settlement rules and official-result provider; publication policy; analytics definitions; dispute/correction authority; responsible-play decisions.

### Deliverables

Immutable ticket store, settlement worker, correction/dispute controls, Daily Edge/pass days, rollover tracker, simulation mode, histories, analytics, realtime projections, and in-app notifications.

### Verification

State-transition and market-rule fixtures; duplicate/out-of-order/replay tests; kickoff lock concurrency tests; provider correction/postponement scenarios; cutting-leg end-to-end test; complete-history reconciliation; RLS/realtime tests; accessibility and responsible-play review.

### Completion criteria

Published facts cannot be silently changed; every leg reaches an auditable state; losses and pass days remain visible; corrections preserve originals; Daily Edge and rollovers match declared rules; analytics reconcile to underlying records.

### Explicitly excluded

Official bookmaker codes without approved access, automatic bet placement, custody of funds, native apps, in-play prediction, basketball, and tennis.

## Phase 6 — Bookmaker-ready outputs and subscriptions

### Objective

Add safe bookmaker-specific mapping and sustainable subscription entitlements without crossing into wagering operations.

### Steps

- [ ] ⚪ **Step 6A — Universal adapter contract and registry:** implement capability, mapping, evidence, versioning, freshness, and fail-closed behavior.
- [ ] ⚪ **Step 6B — SportyBet bookmaker-ready mapping:** validate exact MVP market mapping and produce clearly labeled selection lists/internal references.
- [ ] ⚪ **Step 6C — Bet9ja bookmaker-ready mapping:** validate exact MVP market mapping and produce clearly labeled selection lists/internal references.
- [ ] ⚪ **Step 6D — MSport bookmaker-ready mapping:** validate exact MVP market mapping and produce clearly labeled selection lists/internal references.
- [ ] ⚪ **Step 6E — Odds revalidation and integration audit:** show observation times/change, require recheck, add per-adapter monitoring and kill switches.
- [ ] ⚪ **Step 6F — Subscription billing and entitlements:** integrate an approved payment provider, verified idempotent webhooks, plan enforcement, billing UI, and lifecycle policies.
- [ ] ⚪ **Step 6G — External notification channels:** add approved email/push providers with consent, suppression, privacy, and delivery monitoring.
- [ ] ⚪ **Step 6H — Official code capability (conditional):** only if documented approved bookmaker access exists, implement one separately reviewed adapter behind a disabled-by-default capability flag.

### Dependencies

Phase 5; bookmaker mapping evidence and brand/terms review; approved payment/notification providers; pricing, refund, tax, consent, and entitlement decisions. Step 6H additionally requires the approvals listed in the bookmaker policy.

### Deliverables

Three audited bookmaker-ready output adapters, odds revalidation, subscriptions/entitlements, external notifications, and—only conditionally—an authorized official-code capability.

### Verification

Golden mapping and ambiguity tests per bookmaker; stale/change/unsupported-market tests; UI label review; credential and bet-placement negative tests; webhook signature/replay tests; entitlement/RLS tests; consent/suppression tests; integration kill-switch drills.

### Completion criteria

Mappings fail closed and never imply official status; no bookmaker credentials or bet placement exist; subscriptions reconcile to verified provider state; notifications honor controls. Step 6H is skipped unless access is approved and evidenced.

### Explicitly excluded

Unauthorized scraping, bookmaker account login, automatic bet placement, stakes/wallets/deposits/withdrawals, unsupported official-code claims, and future sports.

## Phase 7 — Production hardening and football MVP launch

### Objective

Prove the complete football product is secure, reliable, responsible, observable, legally cleared, and operable before controlled release.

### Steps

- [ ] ⚪ **Step 7A — End-to-end verification:** test visitor-to-subscription, fixture-to-prediction, generation-to-settlement, Daily Edge, dispute, restriction, and recovery journeys.
- [ ] ⚪ **Step 7B — Security and privacy assurance:** threat model, penetration test, dependency/secret review, RLS audit, admin access review, export/deletion, retention, and incident exercises.
- [ ] ⚪ **Step 7C — Reliability and performance:** load/soak tests, SLOs, queue failure/replay, provider outage, model rollback, backup restoration, RPO/RTO, and kill switches.
- [ ] ⚪ **Step 7D — Accessibility and PWA quality:** WCAG 2.2 AA audit, supported-device/browser matrix, offline/stale behavior, and assistive-technology testing.
- [ ] ⚪ **Step 7E — Professional launch approvals:** record legal, privacy, data-license, payment, bookmaker, marketing, age, geographic, and responsible-play sign-offs or block launch.
- [ ] ⚪ **Step 7F — Controlled beta and production launch:** shadow operations, limited cohorts/regions, support/on-call readiness, telemetry review, rollback gate, and transparent launch communication.

### Dependencies

Phases 2–6, production provider contracts, trained operators, complete runbooks, approved budgets/regions, and no unresolved critical risks.

### Deliverables

Verification dossier, threat model and security report, accessibility report, load/recovery evidence, model/data operational dashboards, legal approval register, runbooks, and controlled production release.

### Verification

Independent security and accessibility review where feasible; full acceptance suite; reconciliation of published artifacts; incident/game-day simulations; backup restore; failover/kill-switch drills; beta metrics and support review.

### Completion criteria

All MVP acceptance criteria pass; critical/high issues are resolved or formally accepted by accountable owners; launch jurisdictions and claims are approved; operators can detect, pause, recover, reconcile, and explain failures.

### Explicitly excluded

Unapproved regions/providers/bookmaker claims, native apps, in-play markets, basketball, tennis, automatic bet placement, and betting-money custody.

## Phase 8 — Post-launch learning and optimization

### Objective

Improve the football product from production evidence without compromising historical integrity or responsible-play principles.

### Steps

- [ ] ⚪ **Step 8A — Reliability and data-quality iteration:** prioritize incidents, provider gaps, freshness, settlement delay, and operational toil.
- [ ] ⚪ **Step 8B — Model monitoring and controlled upgrades:** evaluate drift/calibration, run shadow/champion-challenger tests, and promote through model governance.
- [ ] ⚪ **Step 8C — Product and accessibility refinement:** use consented research and analytics to improve clarity, navigation, notifications, and controls.
- [ ] ⚪ **Step 8D — Commercial and compliance review:** evaluate plans, churn, support, regional obligations, marketing claims, and provider economics.

### Dependencies

Stable Phase 7 launch, adequate sample sizes, valid consent/analytics, and operational capacity.

### Deliverables

Post-launch review cadence, prioritized evidence-backed improvements, revised model cards, incident reductions, and updated decision records.

### Verification

Pre/post measures with declared samples; experiment guardrails; calibration and fairness/coverage checks; security/privacy review; history reconciliation after every model or policy change.

### Completion criteria

Changes demonstrate measurable benefit without selective reporting, weakened controls, or retroactive history changes; documentation and ADRs match production.

### Explicitly excluded

Expansion based only on demand without validated data rights, model quality, settlement rules, staffing, security, and legal approval.

## Phase 9 — Future sports and platforms

### Objective

Expand only through sport-specific evidence and repeat the data-to-settlement assurance process.

### Steps

- [ ] ⚪ **Step 9A — Basketball discovery and governance:** define competitions, data rights, markets, rules, models, risk, provider coverage, and acceptance gates.
- [ ] ⚪ **Step 9B — Basketball implementation and controlled launch:** build canonical extensions, ingestion, models, settlement, UI, analytics, and verification after Step 9A approval.
- [ ] ⚪ **Step 9C — Tennis discovery and governance:** define tours, surfaces, participants, data rights, markets, rules, models, risk, and acceptance gates.
- [ ] ⚪ **Step 9D — Tennis implementation and controlled launch:** build canonical extensions, ingestion, models, settlement, UI, analytics, and verification after Step 9C approval.
- [ ] ⚪ **Step 9E — Native mobile decision:** assess user evidence, PWA limits, notification needs, security, cost, and app-store/regulatory requirements before choosing implementation.
- [ ] ⚪ **Step 9F — In-play feasibility:** separately assess data latency/rights, suspension states, model validity, odds volatility, settlement, harm, infrastructure, and regulatory impact.

### Dependencies

Stable and reviewed football operations, adequate team capacity, sport-specific licensed data, approved models/rules, legal review, and separate launch gates.

### Deliverables

Sport-specific briefs, ADRs, model cards, rules, provider contracts, implementations, and verification dossiers; a native/in-play decision rather than an assumed commitment.

### Verification

Repeat Phase 3–7 security, data, model, settlement, accessibility, operational, and legal gates independently for each sport/platform capability.

### Completion criteria

Each expansion meets explicit sport-specific acceptance criteria and does not degrade football reliability, transparency, or user controls.

### Explicitly excluded

Copying football probabilities or settlement logic into other sports without validation; bundling several sports into one unreviewed release; relaxing the prohibitions on guarantees, credentials, bet placement, or fund custody.
