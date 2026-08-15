# Phase 4C odds and markets

## Status

Phase 4C is operational as of 2026-08-14. It stores real API-Football pre-match
odds, maintains a deduplicated current projection and immutable meaningful-change
history, and serves authenticated Daily Odds and Markets pages. Phase 4D has not
started.

The production proof run persisted 9,712 current prices and 9,712 snapshots for
20 fixtures, 14 verified bookmakers, and 6 provider-backed canonical markets.
There were no unresolved fixtures, invalid stored prices, duplicate current
identities, or failed writes. Draw No Bet exists in the canonical registry but has
no verified API-Football full-time mapping, so it correctly has zero prices.

## Architecture

```text
API-Football /odds
  -> validated odds adapter
  -> exact API-Football fixture ID mapping
  -> Phase 4B canonical fixture persistence when missing
  -> verified bookmaker and market mappings
  -> strict decimal and selection normalization
  -> service-only batch RPC
  -> atomic current_odds + meaningful odds_snapshots
  -> authenticated v_current_odds
  -> Daily Odds and Markets server views
```

Provider fixture IDs are never matched by team-name similarity. A missing mapping
is reconciled through the existing API-Football fixture adapter for the same date
and exact event ID. If that fails, the event is recorded as unresolved and no odds
are attached to a fixture.

The `@playtoday/bookmaker-adapters` package owns provider odds validation and
normalization. The ingestion worker owns budgets, fixture reconciliation, mapping
lookups, run metrics, and health. PostgreSQL owns atomic ordering, deduplication,
current state, and history.

## Canonical markets

| PlayToday key         | API-Football bet                       | Provider ID | Parameters                  | Operational   |
| --------------------- | -------------------------------------- | ----------: | --------------------------- | ------------- |
| `match_result`        | Match Winner                           |           1 | none                        | Yes           |
| `asian_handicap`      | Asian Handicap                         |           4 | participant and signed line | Yes           |
| `total_goals`         | Goals Over/Under                       |           5 | line                        | Yes           |
| `both_teams_to_score` | Both Teams Score                       |           8 | none                        | Yes           |
| `double_chance`       | Double Chance                          |          12 | none                        | Yes           |
| `team_total_goals`    | Total - Home / Total - Away            |     16 / 17 | participant and line        | Yes           |
| `draw_no_bet`         | No verified full-time provider mapping |        none | none                        | Registry only |

Simple outcomes use reviewed mapping records. Totals accept only `Over` or `Under`
plus a bounded numeric line. Asian handicap accepts only `Home` or `Away` plus a
bounded signed numeric line. Unknown markets and selections fail closed.

## Bookmaker capability matrix

The active API-Football catalog was checked directly on 2026-08-14.

| Bookmaker group                                                                                                                 | Pre-match odds                  | Live runtime | Booking code | Direct integration |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------ | ------------ | ------------------ |
| 10Bet, Marathonbet, Betfair, Pinnacle, SBO, William Hill, Bet365, Dafabet, 1xBet, Unibet, 888Sport, Betano, Superbet, BetVictor | Verified in current source      | Disabled     | No           | No                 |
| SportyBet                                                                                                                       | Not supported by current source | No           | No           | No                 |
| Bet9ja                                                                                                                          | Not supported by current source | No           | No           | No                 |
| MSport                                                                                                                          | Not supported by current source | No           | No           | No                 |

“Not supported” describes API-Football’s current bookmaker catalog. It is not a
claim that the bookmaker has no odds elsewhere. PlayToday does not rename another
bookmaker as a target bookmaker and does not generate booking codes.

## Current state and history

`current_odds` has one row for a fixture, bookmaker, canonical market, outcome,
line, and participant identity. `odds_snapshots` receives a row only when a price,
market status, or provider selection meaningfully changes. A repeated observation
updates observation time but creates no history. An older provider timestamp cannot
replace a newer current value.

The first observed value is called first observed, not opening odds. PlayToday has
no provider proof that the first value it receives is the market’s opening price.

The provider source timestamp, fetch timestamp, first observation, and last
observation are stored separately. The UI marks data unavailable when no current
source time exists and stale after six hours for the displayed date.

Raw bookmaker implied probability is implemented as `1 / decimal odds` with the
same strict price bounds used by ingestion. It is bookmaker market math, not a
PlayToday model probability. A generic overround utility is also implemented as the
sum of raw probabilities minus one, but it returns no result for incomplete or
invalid input. The current UI does not display overround because it cannot yet prove
that every loaded selection set is a complete mutually exclusive market.

Fixture state closes prices for finished, cancelled, abandoned, and awarded
fixtures. Postponed or suspended fixtures make prices unavailable. A later active
observation reopens the same current identity and records the status change in
history. A selection that disappears from an otherwise received provider event is
also made unavailable instead of silently remaining active.

## Security

- Odds provider credentials remain server-only and are never returned to clients.
- Anonymous roles cannot read odds.
- Authenticated roles can read the bookmaker catalog, capability catalog,
  canonical markets, current odds, and the invoker-security read view.
- Authenticated roles cannot read provider mappings, unresolved events, history,
  runs, or provider health and cannot execute ingestion RPCs.
- Only the service role can write odds or execute single and batch ingestion.
- RLS is enabled on every Phase 4C table, with explicit deny policies for internal
  client surfaces.
- Internal odds tables are not published directly to Supabase Realtime.

The batch RPC accepts at most 10,000 already-normalized observations and delegates
each one to the canonical atomic observation function inside one transaction.

## Scheduler and budgets

Vercel runs the Phase 4B fixture sync daily at 00:15 UTC and the Phase 4C odds sync
daily at 00:35 UTC. Both endpoints require a timing-safe `CRON_SECRET` bearer token.
The odds job is bounded by environment values:

```text
ODDS_SYNC_MAX_REQUESTS=4
ODDS_SYNC_MAX_PAGES=2
ODDS_SYNC_MAX_EVENTS=20
```

The worker follows provider pagination only within these limits. It uses the shared
capped retry and `Retry-After` handling. It records request use, quota remaining,
events, mappings, invalid values, current changes, history changes, failures, and
provider health. A manual run is:

```sh
pnpm odds:sync
pnpm odds:sync -- --date 2026-08-14
```

## Authenticated UI behavior

Daily Odds shows current provider prices, source time, timezone, freshness, filters,
and the best displayed bookmaker price for each loaded mapped selection. “Best” is a
numeric comparison in the loaded source data, not a recommendation or prediction.

Markets separates canonical registry support from current availability. It shows
real current-price counts and verified bookmaker capabilities. Empty states explain
the scope of the current source without making universal availability claims.

Saved selections, alerts, predictions, settlement, target-odds tickets, live odds,
bookmaker codes, bookmaker login, payments, and automatic bet placement remain out
of scope.

## Data rights and provider limits

API-Football’s official documentation says pre-match odds are paginated, typically
available one to fourteen days before a fixture, update around every three hours,
and retain limited provider history. The current free plan includes odds endpoints
with a daily request quota. Coverage varies by competition and bookmaker.

API-Sports terms permit API use in applications but prohibit direct data resale and
do not grant publication or underlying trademark rights. A business and legal review
of publication, territory, competition, bookmaker-name, and logo rights remains
required before a broad commercial launch. Phase 4C stores bookmaker names only and
does not introduce bookmaker logos.

Official references:

- https://www.api-football.com/documentation
- https://www.api-football.com/pricing
- https://www.api-football.com/coverage
- https://www.api-football.com/terms
- https://api-sports.io/terms

## Operations and incident handling

Check `odds_ingestion_runs` and `odds_provider_health` first. A failed run must have a
sanitized error summary and completion time. A stuck process must be marked failed;
it must not remain “running.” Do not retry by removing request limits.

If provider payload validation fails, update the narrow leaf schema only after
inspecting the official response. If a bookmaker or market is unmapped, add a
reviewed mapping migration; never create a fuzzy mapping in the worker. If fixture
resolution fails, leave the odds unresolved. If duplicate current identities appear,
stop ingestion and audit the unique identity before continuing.

For rollback, disable the odds cron first. The schema is additive and the fixture
foundation remains independent. Preserve history for audit unless a separately
approved retention or data-rights operation requires deletion.

## Verification evidence

- Atomic create, unchanged, update, older-source rejection, and history-count tests passed.
- Service-only batch create and unchanged rollback tests passed.
- A repeated live sync created zero prices and zero snapshots for unchanged data.
- After signed-handicap correction, the live run created 1,187 valid prices, skipped
  135 invalid selections, resolved all 20 fixtures, and recorded zero failures.
- Hosted audit: 9,712 current prices, 9,712 snapshots, 20 fixtures, 14 bookmakers,
  6 operational markets, 0 unresolved, 0 invalid stored prices, 0 duplicate identities.
- Browser automation was unavailable in the execution environment; responsive browser
  interaction remains the only verification item that could not be automated locally.

The required pre-implementation walkthrough is in
`docs/walkthroughs/PHASE_4C_ODDS_MARKETS.md`.
