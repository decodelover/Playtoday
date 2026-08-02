# Product Requirements

## Document conventions

- **MUST** is required for the football MVP unless a section says future.
- **SHOULD** is expected but may be deferred through an explicit product decision.
- **MAY** is optional.
- PlayToday is the official product name; repository and package identifiers use `playtoday` and `@playtoday/*`.
- IDs (for example `PUB-01`) provide stable references; they are not implementation order.

## Public platform requirements

- **PUB-01:** Explain the product as statistical sports-intelligence and target-odds decision support, not a bookmaker or guarantee service.
- **PUB-02:** Provide accessible, responsive public product, methodology, pricing, responsible-play, security, support, privacy, and terms surfaces before production launch.
- **PUB-03:** Display supported sports, competitions, markets, regions, feature limitations, and data freshness without implying unsupported coverage.
- **PUB-04:** Public performance views must include all published Daily Edge wins, losses, voids, cancellations, corrections, and pass days under consistent inclusion rules.
- **PUB-05:** Do not expose private user tickets, rollover cycles, subscriptions, disputes, notifications, or security data.
- **PUB-06:** The installable PWA must communicate online/offline and stale-data state; cached odds or statuses must show their observation time.
- **PUB-07:** Marketing must not use “sure bet,” guaranteed outcome, risk-free return, or unsupported accuracy claims.

## Authentication requirements

- **AUTH-01:** Support sign-up, sign-in, sign-out, verified contact, password reset, session management, and account recovery through Supabase Auth.
- **AUTH-02:** Rate-limit and monitor authentication and recovery flows without revealing account existence.
- **AUTH-03:** Require recent authentication for sensitive account/security changes, data export, deletion, and self-exclusion changes where appropriate.
- **AUTH-04:** Require administrator two-factor authentication and server-controlled role authorization.
- **AUTH-05:** Provide session/device visibility and revocation where supported by the chosen identity implementation.
- **AUTH-06:** Obtain age confirmation and required policy consent with version and timestamp before access to restricted features.
- **AUTH-07:** Cooling-off, self-exclusion, geographic restrictions, account suspension, and subscription state must be enforced server-side.

## User dashboard requirements

The authenticated information architecture must include the following destinations; navigation may group related destinations without removing their capabilities.

| Destination             | Required capability                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Overview**            | Today’s eligible activity, active tickets, Daily Edge state, rollover progress, alerts, and subscription access.        |
| **AI Analyst**          | Grounded questions and explanations using verified internal tools, with sources/freshness and no invented sports facts. |
| **Today’s Games**       | Supported fixtures for the user’s current date/time zone, filters, data freshness, eligibility, and status.             |
| **Daily Odds**          | Official Daily Edge details, progress, leg states, settlement, pass days, and full history.                             |
| **Target Odds Builder** | Preset/custom targets, risk alternatives, evidence, exclusions, and permanent ticket generation.                        |
| **Markets**             | Canonical football market discovery, definitions, availability, and odds observations.                                  |
| **Match Analysis**      | Model estimates, fair/observed odds, confidence, DQS, form/context inputs, limitations, and failure reasons.            |
| **Bookmaker Codes**     | Bookmaker-ready mappings and internal references; official codes only when approved and clearly labeled.                |
| **My Selections**       | Saved and generated tickets with immutable original details and live/final leg progress.                                |
| **Rollover Tracker**    | Official Daily Edge and personal rollover cycle/day progress without custody of money.                                  |
| **Simulation Mode**     | Clearly hypothetical, non-monetary tickets and cycles, separated from published production performance.                 |
| **Watchlist**           | User-selected fixtures/competitions and related update preferences.                                                     |
| **Analytics**           | Transparent performance, calibration, risk, market, competition, and time-period reporting.                             |
| **Prediction History**  | Searchable, filterable predictions/tickets with original and corrected settlement history.                              |
| **Notifications**       | In-app history, delivery preferences, quiet hours, consent, and status.                                                 |
| **Subscription**        | Plan, entitlement, billing status, invoices/provider links, cancellation, and applicable renewal terms.                 |
| **Responsible Play**    | Risk information, controls, cooling-off, self-exclusion, and jurisdiction-appropriate support resources.                |
| **Security**            | Password/authentication controls, active sessions where available, 2FA options, and recent security events.             |
| **Settings**            | Profile, locale, time zone, odds display, accessibility, privacy, and communication preferences.                        |
| **Support**             | Help content and auditable support requests without exposing secrets.                                                   |
| **Settlement Disputes** | Submit a dispute against a settled selection, attach allowed evidence, and track review/outcome history.                |

## Daily Edge requirements

- **DE-01:** Daily Odds is a core Pro-plan feature; exact preview/free behavior remains a pricing decision.
- **DE-02:** For each operating day, create either one official published Daily Edge artifact or an immutable pass-day record under a defined cutoff policy.
- **DE-03:** Display target odds, generated odds, selection count, original per-leg/bookmaker odds, publication time, first kickoff time, current progress, and final settlement.
- **DE-04:** Show every leg and its state, plus the exact ticket-cutting selection for a lost ticket.
- **DE-05:** Lock a published ticket when its first event begins; do not mutate original selections, odds, model version, generation time, or publication time.
- **DE-06:** Retain all published outcomes and corrections. A published loss must never be hidden or silently deleted.
- **DE-07:** Show daily, weekly, and monthly rollover performance with transparent denominators, date boundaries, time zone, and void/pass-day treatment.
- **DE-08:** Do not publish when candidates fail quality, probability, freshness, mapping, or dependency requirements; record a pass day instead.
- **DE-09:** Qualification, review/publication authority, publication cutoff, and emergency pause must be auditable and configurable by versioned policy.

## Target-odds requirements

- **TO-01:** Accept presets 2.00, 3.00, 5.00, 10.00, 20.00, 50.00, and 100.00, plus a validated custom decimal target within approved limits.
- **TO-02:** Label targets using approved risk bands; high targets must say high risk and the highest band must say extreme risk.
- **TO-03:** Return conservative, balanced, and aggressive alternatives when qualifying differences exist; never relabel the same combination misleadingly.
- **TO-04:** Each alternative shows generated decimal odds, estimated combined probability, risk rating, model confidence, DQS, selection-level support, failure reasons, timestamps, and model/policy context.
- **TO-05:** Return excluded candidates and audience-appropriate exclusion reasons.
- **TO-06:** Do not add a selection that fails the chosen profile’s thresholds only to reach the target. A below-target or no-combination response is valid.
- **TO-07:** Account for correlated legs; block incompatible selections and avoid naive independence assumptions.
- **TO-08:** Persist every generated ticket, including request, eligible input snapshot/lineage, alternatives returned, chosen combination if any, exclusions, odds, and versions.
- **TO-09:** Revalidate time-sensitive odds before publication or bookmaker-ready export and show changes; never silently substitute a leg.
- **TO-10:** A user may save/publish only through an explicit action. Draft versus published status must be unambiguous.

## Settlement requirements

- **SET-01:** A selection supports Draft, Published, Not started, Live, Currently winning, Currently losing, Won, Lost, Void, Postponed, Suspended, Cancelled, and Partially settled states through a controlled transition model.
- **SET-02:** A ticket supports Pending, In progress, Won, Lost, Void, Partially settled, and Cancelled states.
- **SET-03:** Versioned deterministic market rules and verified provider results determine settlement; an LLM never settles a selection.
- **SET-04:** Store all legs and settle them independently even after the overall ticket becomes Lost.
- **SET-05:** Identify the first definitive lost leg that cuts the ticket, without hiding later lost/void/won legs.
- **SET-06:** Jobs are idempotent and replayable; duplicate or out-of-order provider events cannot create contradictory final states.
- **SET-07:** Fixture or result ambiguity enters pending/review state. Postponed, suspended, cancelled, void, and partial outcomes follow explicit versioned rules.
- **SET-08:** A correction appends original settlement, corrected settlement, reason, evidence reference, administrator, and timestamp.
- **SET-09:** Users can dispute eligible settlements and see status, response, evidence summary, and correction linkage.
- **SET-10:** Publication and first-kickoff locks are race-safe and enforced by the authoritative data layer.

## Rollover requirements

- **ROL-01:** Track official Daily Edge rollover series and private personal cycles separately.
- **ROL-02:** Record cycle policy/version, start date, target days, per-day ticket/pass state, status, and timestamps.
- **ROL-03:** If reference amounts or potential returns are shown, label them user-entered or simulated; do not accept, transfer, or custody funds.
- **ROL-04:** Do not recommend stake doubling, martingale, loss recovery, or chasing.
- **ROL-05:** A cycle reflects void, partial, postponed, cancellation, and correction rules consistently with its policy version.
- **ROL-06:** Historical cycle performance cannot omit failed cycles or pass days.
- **ROL-07:** Cooling-off and self-exclusion rules must suppress restricted rollover interactions and promotions.

## Analytics requirements

- **AN-01:** Report counts and rates for won, lost, void, partial, cancelled, pending, and pass-day artifacts by explicit date range/time zone.
- **AN-02:** Segment where sample size permits by model version, market, competition, risk profile, odds band, and publication type.
- **AN-03:** Show calibration and prediction-quality measures separately from financial-style outcome views.
- **AN-04:** Distinguish backtest, validation, shadow, live Daily Edge, user-generated, and simulation results.
- **AN-05:** Display sample sizes, inclusion/exclusion rules, void handling, odds source/time, and low-sample warnings.
- **AN-06:** Never imply historical performance guarantees future outcomes or present simulated return as realized profit.
- **AN-07:** Preserve corrected and original outcomes in auditable history while current aggregate views use an explicitly declared correction policy.

## Notification requirements

- **NOT-01:** Support in-app notifications and adapter-based email/push channels in roadmap order.
- **NOT-02:** Candidate events include ticket publication, approaching kickoff, live status, final settlement, cutting leg, rollover day/cycle state, disputes, subscriptions, security, and system integrity.
- **NOT-03:** Store notification intent, user preference/consent, template version, source event, attempts, delivery state, and timestamps.
- **NOT-04:** Enforce idempotency, retry limits, quiet hours, per-channel opt-outs, frequency limits, and cooling-off/self-exclusion suppression.
- **NOT-05:** Do not include sensitive prediction/account details in lock-screen, email-subject, or shared-channel content by default.
- **NOT-06:** Security and essential service messages must be classified separately from marketing.

## Subscription requirements

- **SUB-01:** Plans and entitlements are configurable server-side and applied consistently to routes, APIs, exports, history windows, and quotas.
- **SUB-02:** Process subscription checkout through a compliant provider; the platform stores tokens/identifiers and state, not raw card data.
- **SUB-03:** Verify webhook signatures and apply events idempotently; browser redirects do not grant entitlement.
- **SUB-04:** Show current plan, renewal/cancellation status, entitlement effects, and provider-hosted billing/invoice access where available.
- **SUB-05:** Define trials, grace periods, upgrades, downgrades, cancellation, refunds, taxes, failed payments, and regional prices before launch.
- **SUB-06:** Subscription payment is never described as a stake and does not buy a guaranteed outcome.

## Admin requirements

- **ADM-01:** Provide least-privilege roles for support, publication, settlement review, subscription support, and security administration.
- **ADM-02:** Require administrator 2FA, server-controlled roles, session protections, and sensitive-action audit logging.
- **ADM-03:** Allow authorized operators to review data health, candidate eligibility, Daily Edge publication/pass day, job failures, disputes, and corrections.
- **ADM-04:** Never allow direct silent editing or deletion of published tickets, original settlements, audit records, or model versions.
- **ADM-05:** Require reasons for publication overrides, manual review, corrections, entitlement overrides, role changes, and user restriction changes.
- **ADM-06:** Support feature flags and kill switches for publication, AI tools, payments, notifications, data providers, and each bookmaker integration.
- **ADM-07:** Display provider freshness, model/rule versions, job state, and evidence needed for decisions.
- **ADM-08:** High-impact bulk correction or model promotion should require dual control before production.

## Responsible-play requirements

- **RP-01:** Confirm legally applicable age and policy consent before restricted use; do not target minors.
- **RP-02:** Present clear risk language on prediction, target-odds, Daily Edge, rollover, simulation, and bookmaker-ready surfaces.
- **RP-03:** Offer cooling-off and self-exclusion with prompt enforcement, marketing suppression, auditability, and controlled reversal.
- **RP-04:** Provide notification quiet hours, promotional opt-out, and user-configurable usage reminders/limits as defined in later design.
- **RP-05:** Never encourage loss chasing, borrowing, martingale, or increasing risk in response to loss.
- **RP-06:** Provide jurisdiction-appropriate help resources after professional review.
- **RP-07:** Simulation mode must remain clearly separate and non-monetary.

## Security requirements

- **SEC-01:** Enable and test RLS on every exposed Supabase table and appropriate Storage access path.
- **SEC-02:** Keep service-role, sports-provider, payment, notification, AI, and monitoring secrets out of frontend code and logs.
- **SEC-03:** Validate inputs at trust boundaries; encode outputs; protect against common web, API, prompt-injection, and dependency threats.
- **SEC-04:** Apply per-identity/IP/risk-sensitive rate limits to authentication, generation, AI, export, dispute, notification, and admin operations.
- **SEC-05:** Use immutable audit events for sensitive actions and monitor access to them.
- **SEC-06:** Provide authenticated data export and deletion under documented retention rules.
- **SEC-07:** Verify payment webhooks and make payment, ingestion, settlement, scheduled, and notification operations idempotent.
- **SEC-08:** Maintain environment separation, least-privilege service identities, secret rotation, dependency scanning, backup/restore, and incident runbooks.
- **SEC-09:** Do not use editable user metadata to grant administrative authority.
- **SEC-10:** Follow [Security and Compliance](SECURITY_AND_COMPLIANCE.md) and complete legal review gates before launch.

## Non-functional requirements

- **NFR-01 Availability:** Define launch SLOs before production; critical reads and settlement processing must degrade visibly, not return fabricated state.
- **NFR-02 Performance:** Set and test p75/p95 budgets for public, dashboard, generation, and update flows using representative mobile networks and data volumes.
- **NFR-03 Accessibility:** Meet WCAG 2.2 AA for core journeys, including keyboard operation, focus, contrast, semantics, reduced motion, error identification, and live-update announcements.
- **NFR-04 Responsiveness:** Support current major mobile, tablet, and desktop browsers; core features remain usable at 320 CSS pixels without horizontal workflow breakage.
- **NFR-05 PWA:** Provide installability and safe caching; never imply stale cached status is current.
- **NFR-06 Reliability:** Use constraints, state machines, idempotency, bounded retry, reconciliation, backups, and tested restore procedures.
- **NFR-07 Observability:** Correlate web requests, jobs, provider calls, model versions, publication, settlement, and notification events with redacted logs, metrics, traces, and alerts.
- **NFR-08 Privacy:** Minimize and classify data, honor retention/export/deletion rules, manage consent, and restrict analytics capture.
- **NFR-09 Maintainability:** Use strict TypeScript/Python typing, shared validation/contracts, modular boundaries, migrations, automated tests, and current documentation.
- **NFR-10 Scalability:** Scale read, inference, ingestion, and settlement workloads independently only when measurements justify it.
- **NFR-11 Recovery:** Define RPO/RTO and test backup restoration, job replay, provider recovery, settlement reconciliation, and integration kill switches before launch.
- **NFR-12 Localization:** Store times in UTC, display a declared user time zone, use locale-aware formatting, and avoid hard-coded product name/currency/legal text.

## Football MVP scope

Included:

- responsive web application and installable PWA;
- football pre-match fixtures in major, statistically reliable approved competitions;
- match winner, double chance, draw no bet, over/under goals, both teams to score, and team total goals;
- model-based predictions, match analysis, DQS, confidence, exclusions, and grounded AI explanations;
- target-odds builder and persistent tickets;
- official Daily Edge, pass days, personal rollover tracking, and simulation mode;
- leg/ticket settlement, cutting-selection identification, disputes, history, analytics, and notifications;
- subscription entitlements and responsible-play/security/account functions; and
- bookmaker-ready SportyBet, Bet9ja, and MSport mapping without official-code claims unless access is later approved.

## Future scope

- Basketball and tennis through dedicated domain, data, model, market, and settlement phases.
- In-play predictions only after latency, rights, risk, market-state, and settlement architecture is approved.
- Native iOS/Android applications after web/PWA validation.
- Additional sports, bookmakers, markets, languages, providers, and advanced portfolio analytics.
- Official booking codes only after approved access.

Future scope explicitly does not presume automatic bet placement, bookmaker credential storage, stake custody, or guaranteed outcomes; those remain excluded unless the product positioning is formally reconsidered with legal review.

## MVP acceptance criteria

The MVP is acceptable only when all applicable detailed requirements above pass and the following end-to-end criteria are evidenced:

1. A verified eligible user can view today’s supported football fixtures and sees freshness, eligibility, and unsupported/excluded states accurately.
2. For a target request, the system returns evidence-backed conservative/balanced/aggressive alternatives—or an honest below-target/no-combination result—without weakening thresholds.
3. Each generated/published ticket permanently preserves request, legs, original odds, timestamps, prediction/model/policy versions, probabilities, DQS, support, failure reasons, and exclusions.
4. A published ticket locks at first kickoff; deterministic jobs transition every leg and ticket idempotently through live and final states.
5. A lost ticket identifies its cutting leg and continues settling remaining legs; a correction preserves original result, corrected result, evidence, reason, actor, and time.
6. Daily Edge shows ticket/pass day, progress, complete win/loss history, and daily/weekly/monthly reporting with disclosed rules.
7. Analytics separate backtest, live, user-generated, and simulation data and disclose samples, denominators, uncertainty, voids, and corrections.
8. Bookmaker views clearly distinguish internal references and bookmaker-ready lists; official code actions are unavailable without documented approved access.
9. No flow accepts stakes, holds balances, places bets, requests bookmaker credentials, promises wins, or encourages chasing losses.
10. Authentication, server authorization, admin 2FA, RLS on all exposed tables, rate limits, validation, audit logs, secure webhooks, export/deletion, cooling-off, and self-exclusion pass security tests.
11. Core flows meet agreed performance SLOs, WCAG 2.2 AA checks, responsive/PWA tests, observability checks, backup/restore tests, and incident exercises.
12. Legal, privacy, data-license, bookmaker, payment, marketing, age, geographic, and responsible-play launch gates are explicitly approved by accountable professionals; unresolved gates block launch.
