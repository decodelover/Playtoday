# Phase 4C walkthrough plan

## Phase 4B retroactive audit

API-Football feeds the shared server client, provider adapter, runtime validation, normalization, canonical persistence, hosted Supabase, `v_public_fixtures`, `/games`, and `/overview`.

Hosted verification on 2026-08-14 found 50 competitions, 50 seasons, 274 teams, 137 fixtures, and 513 provider mappings. All 137 fixtures have an API-Football fixture mapping. There are no orphan fixture mappings, same-team fixtures, or missing kickoff timestamps. Current fixture state is 125 scheduled, 11 finished, and 1 postponed.

The protected Vercel scheduler is deployed. Its latest hosted run fetched 389 provider fixtures, updated 60 canonical fixtures, and recorded zero failures. The fixture read view uses invoker security and authenticated read access. Browser roles cannot mutate canonical sports data. Phase 4B has no unresolved operational blocker.

## Existing odds code audit

- `@playtoday/bookmaker-adapters` contains only a package identity placeholder.
- `/daily-odds` claims official picks, probabilities, bookmaker comparison, and settlement without operational data.
- `/markets` contains static prediction-market and analytical claims.
- `/selections` claims bookmaker-code export, live odds updates, and movement alerts that do not exist.
- User preferences contain canonical keys for SportyBet, Bet9ja, MSport, and seven market families. Preferences do not imply provider availability.
- No odds tables, current-price projection, history, ingestion runner, scheduler, or client subscription exists.
- No `/bookmaker-codes` route exists.

## Current odds provider assessment

Phase 4A recommended The Odds API as a separate odds-provider role, but the repository has no `ODDS_PROVIDER_*` credential. Current official verification shows that the existing API-Football plan includes pre-match and live odds. Phase 4C will keep a distinct odds adapter boundary backed by API-Football. This preserves provider-role separation while reusing the current server credential and exact provider fixture IDs.

Verified API-Football capabilities:

- `/odds` provides paginated pre-match odds, normally 1 to 14 days before kickoff.
- Pre-match data is updated about every three hours and provider history is limited to seven days.
- `/odds/bookmakers`, `/odds/bets`, and `/odds/live/bets` provide reference catalogs.
- `/odds/live` provides in-play odds, but live history is not retained by the provider.
- The current Free plan allows 100 requests per day.
- Provider publication and underlying rights-holder permission remain a business and legal review item.

## Target bookmaker assessment

- SportyBet: `NOT SUPPORTED`
- Bet9ja: `NOT SUPPORTED`
- MSport: `NOT SUPPORTED`

The live API-Football catalog returned 33 bookmakers with no exact or partial match for any target. PlayToday will not invent provider mappings, partnerships, proprietary identifiers, or booking-code support.

## Canonical strategies

Provider market IDs map through reviewed records to stable PlayToday keys. The initial market scope is match result, double chance, draw no bet, both teams to score, total goals, team total goals, and Asian handicap. A parameterized market uses a canonical key plus separate line and participant fields.

Selections use stable keys such as `home`, `draw`, `away`, `home_or_draw`, `home_or_away`, `draw_or_away`, `yes`, `no`, `over`, and `under`. Provider labels remain display and mapping metadata, not domain identity.

Canonical bookmaker UUIDs remain independent of provider IDs. Provider mappings require explicit review. Target bookmakers may exist as preference identities while their API-Football capability remains unavailable.

## Odds snapshot, history, freshness, and realtime

The write path is provider event to exact fixture mapping to verified bookmaker mapping to reviewed market and selection mapping to a validated decimal price. A meaningful change creates an immutable snapshot and updates an ordered current-price projection. Identical observations do not create duplicate history.

First observed odds are not called opening odds. Provider source time, fetch time, and persistence time remain separate. Older source updates cannot replace newer current state.

Far-future pre-match odds become delayed after six hours and stale after 24 hours. Same-day or near-kickoff odds become delayed after three hours and stale after six hours. Finished, cancelled, and postponed fixtures have no actionable current odds. Live odds remain disabled until the runtime can meet a live freshness threshold within quota.

Safe current rows may use scoped Supabase Realtime after publication and RLS verification. History and internal mapping tables are never globally subscribed to by clients.

## Design direction

This is a preserve-mode redesign of two authenticated sports-data pages. It keeps PlayToday's current light theme, type, accent, navigation, and spacing system.

- Design variance: 4
- Motion intensity: 3
- Visual density: 7
- Primary product-UI guide: UI/UX Pro Max
- Taste Skill role: preservation audit and anti-slop checks
- Humanizer role: customer-facing unavailable, delayed, stale, suspended, and filter copy

## Step-by-step execution plan

Each row records purpose, risk, implementation surface, commands, and expected result.

|   # | Work                    | Purpose and risk                                                                        | Files, objects, endpoints, commands, expected result                                                                                                       |
| --: | ----------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | Phase 4B audit          | Prove the fixture foundation. Risk: document-only confidence.                           | Inspect worker, migrations, read service, cron; query hosted tables and mappings; verified baseline above.                                                 |
|   2 | Odds and mock audit     | Find unsupported product claims. Risk: placeholders shown as facts.                     | Inspect app pages, packages, migrations, docs; run `rg`; produce a removal list.                                                                           |
|   3 | Provider verification   | Confirm current official capability. Risk: outdated assumptions.                        | Read official API-Football docs, pricing, terms; call `/status`; record capability.                                                                        |
|   4 | Credential audit        | Confirm names and isolation. Risk: secret exposure.                                     | Inspect `.env.local` names and env schemas without values; validate server-only use.                                                                       |
|   5 | Bookmaker coverage      | Classify targets. Risk: false support claims.                                           | Call `/odds/bookmakers`; exact review; three truthful statuses.                                                                                            |
|   6 | Market capability       | Bound the supported taxonomy. Risk: nonexistent markets.                                | Call `/odds/bets` and `/odds/live/bets`; compare with preferences.                                                                                         |
|   7 | Bookmaker model         | Create provider-independent identity. Risk: external IDs as primary keys.               | Migration, database types, domain types; add `bookmakers`.                                                                                                 |
|   8 | Market model            | Create stable market identity. Risk: provider strings drive logic.                      | Add `canonical_markets`; seed reviewed keys.                                                                                                               |
|   9 | Selection model         | Normalize outcomes and parameters. Risk: totals and handicap collisions.                | Add domain schemas for selection, line, and participant.                                                                                                   |
|  10 | Market mapping          | Map API-Football bet IDs safely. Risk: wrong market collision.                          | Add `provider_market_mappings`; unknown records skip safely.                                                                                               |
|  11 | Bookmaker mapping       | Map observed providers by review. Risk: fuzzy auto-mapping.                             | Add `provider_bookmaker_mappings`; no ambiguous verification.                                                                                              |
|  12 | Fixture mapping         | Reuse Phase 4B fixtures. Risk: odds on the wrong match.                                 | Use `provider_entity_mappings`; record unresolved events; use `/odds`.                                                                                     |
|  13 | Snapshot model          | Keep auditable changes. Risk: imprecision and volume.                                   | Add numeric `odds_snapshots` with structured parameters and timestamps.                                                                                    |
|  14 | Current read model      | Make latest reads efficient. Risk: history scans.                                       | Add `current_odds`, indexes, and an authenticated invoker view.                                                                                            |
|  15 | Opening terminology     | Prevent false opening claims. Risk: first seen mislabeled.                              | Store `first_observed_at`; require provider proof for opening flags.                                                                                       |
|  16 | Movement history        | Track real changes. Risk: invented movement.                                            | Compare snapshots and current state; expose real before and after only.                                                                                    |
|  17 | Implied probability     | Provide correct raw market math. Risk: margin-inclusive value presented as truth.       | Implement precise `1 / decimalOdds` and tests.                                                                                                             |
|  18 | Overround               | Calculate only complete markets. Risk: incomplete sums.                                 | Implement for complete 1X2 sets if used, otherwise document omission.                                                                                      |
|  19 | Pre-match ingestion     | Persist real bounded prices. Risk: quota and unresolved events.                         | Extend adapter and worker; call `/odds`; write canonical rows.                                                                                             |
|  20 | Live ingestion          | Avoid stale live claims. Risk: daily polling labeled live.                              | Keep architecture only until quota and schedule support live freshness.                                                                                    |
|  21 | Pagination              | Avoid page-one-only claims. Risk: incomplete ingestion.                                 | Follow `paging.current/total` within a hard request budget.                                                                                                |
|  22 | Idempotency             | Stop duplicate current and history rows. Risk: poll amplification.                      | Unique current identity and meaningful-change comparison.                                                                                                  |
|  23 | Update ordering         | Keep newest current price. Risk: old data regression.                                   | Transactional source-time ordering and tests.                                                                                                              |
|  24 | Freshness               | Classify current, delayed, stale, unavailable. Risk: misleading prices.                 | Add policy utilities and read-model fields.                                                                                                                |
|  25 | Stale handling          | Hide or label unusable prices. Risk: stale data shown as actionable.                    | Filter and label in service and UI.                                                                                                                        |
|  26 | Provider health         | Expose operational degradation internally. Risk: silent failure.                        | Track success, failure, quota, stale, unmapped, and unresolved counts.                                                                                     |
|  27 | Scheduler               | Reuse Vercel cron. Risk: duplicate or excessive jobs.                                   | Add one protected bounded odds job and update `vercel.json`.                                                                                               |
|  28 | Rate limiting           | Stay below 100 requests per day. Risk: quota exhaustion.                                | Parse headers, enforce budgets, handle 429 and `Retry-After`.                                                                                              |
|  29 | Retry and backoff       | Recover from transient failures. Risk: retry storms.                                    | Reuse capped exponential backoff with jitter.                                                                                                              |
|  30 | Daily Odds service      | Query one canonical read model. Risk: N+1 joins.                                        | Add `odds-service.ts`; filter by local date and real availability.                                                                                         |
|  31 | Markets service         | Separate taxonomy from live availability. Risk: false universal coverage.               | Query registry and actual counts separately.                                                                                                               |
|  32 | Fixture detail          | Integrate only an existing suitable route. Risk: invented scope.                        | Audit routes; modify only if real detail UI exists.                                                                                                        |
|  33 | Daily Odds UI           | Replace fake picks with real prices. Risk: casino styling and invented analysis.        | Modify page/client/CSS; Humanizer copy; accessible states.                                                                                                 |
|  34 | Markets UI              | Replace static prediction claims. Risk: taxonomy presented as availability.             | Modify page/client/CSS; show registry and actual coverage.                                                                                                 |
|  35 | Bookmaker compatibility | Respect preferences truthfully. Risk: relabeling alternatives.                          | Join preferences to verified availability; show unavailable targets.                                                                                       |
|  36 | Fake odds cleanup       | Remove unsupported odds and model claims. Risk: regression.                             | Modify daily odds, markets, selections, and affected copy; run search.                                                                                     |
|  37 | Booking-code cleanup    | Remove exporter claims. Risk: implied official integration.                             | Audit routes and copy; show no codes or partnership claims.                                                                                                |
|  38 | Realtime client         | Scope updates to visible current rows. Risk: global subscriptions.                      | Publish safe current data only after RLS verification; add cleanup/revalidation.                                                                           |
|  39 | RLS and grants          | Enforce system-write and authenticated-read boundaries. Risk: forged odds.              | Explicit grants, RLS, invoker views, hosted attack checks.                                                                                                 |
|  40 | Provider tests          | Lock parsing and failures. Risk: schema drift.                                          | Test-only fixtures for valid, malformed, auth, quota, and pagination cases.                                                                                |
|  41 | Mapping tests           | Prove bookmaker, market, selection, and fixture mappings. Risk: silent wrong mapping.   | Unit and database tests; ambiguous input fails closed.                                                                                                     |
|  42 | Ingestion tests         | Cover price and state transitions. Risk: current-state corruption.                      | Test new, changed, unchanged, suspended, reopened, missing, invalid.                                                                                       |
|  43 | History tests           | Prove deduplication and ordering. Risk: duplicate or regressed history.                 | Snapshot, change, and old-update tests.                                                                                                                    |
|  44 | Browser tests           | Verify production routes and responsive behavior. Risk: local-only confidence.          | Test filters, empty and stale states, viewports, console, hydration, overflow.                                                                             |
|  45 | Performance             | Prevent N+1 and unbounded reads. Risk: slow pages and high Realtime volume.             | Query plans, indexes, payload size, and subscription scope review.                                                                                         |
|  46 | Documentation           | Record architecture, rights, operations, security, and rules. Risk: overstated support. | Create and update every required document.                                                                                                                 |
|  47 | Final verification      | Require operational evidence. Risk: code-only completion.                               | Run install, env, format, lint, types, tests, coverage, build, quality, CI, Python, migrations, RLS, real smoke, ingestion, browser, and fake-data checks. |

## Risks

The implementation guards against fake bookmaker assumptions, stale odds, provider ID mismatch, unresolved or ambiguous fixture mapping, bookmaker and market collisions, selection errors, decimal conversion errors, live race conditions, out-of-order snapshots, precision loss, duplicate history, quota exhaustion, provider outage, suspension and reopening ambiguity, removed markets, postponement and cancellation, incorrect implied probability, overround misuse, secret exposure, scraping, and unauthorized booking-code claims.

## Scope exclusions

Phase 4C does not implement prediction models, AI probabilities, Daily Edge recommendations, Target Odds Builder logic, settlement, AI Analyst backend, official bookmaker APIs, booking-code generation, automatic bet placement, bookmaker login, payments, admin tooling, scraping, or Phase 4D work.

## Completion conditions

Phase 4C passes only when hosted schema, real provider smoke testing, canonical mappings, real odds persistence, current and history separation, deduplication, ordering, freshness, protected scheduling, RLS, real Daily Odds and Markets reads, fake-data cleanup, tests, build, CI, documentation, and production verification pass. If real odds cannot be mapped and persisted, Phase 4C fails.
