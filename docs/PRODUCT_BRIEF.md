# Product Brief

## Document status

- Product name: PlayToday (official name)
- Phase: Step 1B — monorepo initialization (completed)
- Initial market: football pre-match intelligence
- Product category: subscription sports-intelligence and decision-support SaaS

## Problem

Sports audiences often assemble predictions from disconnected statistics, opaque tipsters, and bookmaker interfaces optimized for wagering rather than analysis. Users cannot consistently tell where a prediction came from, how uncertain it is, whether its inputs were fresh, why a match was excluded, or which leg caused a historical ticket to fail. High target-odds requests further encourage weak additions when a service optimizes for a headline number instead of evidence quality.

The product must make the reasoning, evidence quality, uncertainty, and full outcome history visible without presenting analysis as a guarantee or acting as a bookmaker.

## Target users

- **Evidence-oriented football followers** who want structured pre-match analysis rather than unsupported tips.
- **Target-odds users** who want combinations constructed around a decimal-odds goal with explicit trade-offs.
- **Rollover trackers** who want transparent Daily Edge and personal-cycle progress, including losses and pass days.
- **Analytical subscribers** who want calibrated probabilities, historical performance, and data-quality context.
- **Operators and reviewers** who require auditable publication, settlement, correction, and model histories.

The MVP is not designed for professional trading, automated wagering, bookmaker account management, or users below the permitted age in their jurisdiction.

## Product vision

Create a premium, transparent, and auditable sports-intelligence platform that turns licensed event data and tested statistical models into understandable selections, target-odds combinations, and honest performance histories. Start with reliable football markets; expand only after the football system demonstrates data, calibration, settlement, security, and operational quality.

## Value proposition

- One view of supported daily fixtures and eligible markets.
- Conservative, balanced, and aggressive ways to approach a requested target odd.
- Probability, confidence, data quality, supporting evidence, failure reasons, and exclusions shown together.
- Immutable published tickets and leg-level live/final settlement, including the exact cutting selection.
- Universal market descriptions mapped into bookmaker-ready lists without fabricating official booking codes.
- Historical wins, losses, pass days, corrections, and rollover performance kept visible.

## Product positioning

PlayToday provides statistical analysis, probability estimates, target-odds construction, and bookmaker-ready selection information. It is not a bookmaker, financial adviser, guarantee service, or bet-placement agent. It does not accept or custody funds, calculate a user’s betting balance, place bets, or access bookmaker accounts.

A model-confidence or Data Quality Score of 95/100 is a diagnostic score, not a 95% probability of winning. Estimated probability must be separately named, calibrated, and presented with uncertainty and limitations.

## Supported sports

| Stage  | Sport      | Scope                                                                          |
| ------ | ---------- | ------------------------------------------------------------------------------ |
| MVP    | Football   | Pre-match only; major statistically reliable competitions and approved markets |
| Future | Basketball | Only after a dedicated data, modeling, market, and settlement phase            |
| Future | Tennis     | Only after a dedicated data, modeling, market, and settlement phase            |

## Supported bookmakers

SportyBet, Bet9ja, and MSport are target output platforms for bookmaker-ready market mapping. “Supported” does not mean an official commercial or technical relationship exists. Official booking-code generation requires documented permission or approved API/affiliate/partnership access and stays disabled until then.

## Revenue model

The planned model is SaaS subscription access with a free or limited discovery tier and paid plans for features such as Daily Odds, deeper analysis, target-odds generation, expanded history, analytics, and notifications. Exact plans, prices, trial rules, taxes, refunds, payment provider, entitlements, and regional availability remain product and legal decisions. Revenue must not depend on custody of stakes, automatic betting, hidden pay-for-pick incentives, or undisclosed bookmaker influence.

## Product principles

1. **Truth before conversion:** preserve losses, pass days, exclusions, and corrections.
2. **Evidence before target:** never add a weak leg merely to hit requested odds.
3. **Probability, not certainty:** communicate estimates and limitations without guarantees.
4. **Licensed data first:** use approved providers with traceable provenance and freshness.
5. **Audit by design:** version predictions, odds, models, tickets, settlements, and administrative actions.
6. **Deterministic outcomes:** generative AI cannot decide settlements or invent sports facts.
7. **Responsible access:** enforce age, cooling-off, self-exclusion, and risk communication.
8. **Secure defaults:** least privilege, Row Level Security, protected secrets, and rate limits.
9. **Modular delivery:** build coherent modules in a monorepo; add services only for a proven operational boundary.
10. **Replaceable identity:** keep the temporary product name out of durable domain semantics where possible.

## Deliberately excluded features

- Stake acceptance, wallets, deposits, withdrawals, cash-out, and bet settlement for money.
- Automatic or assisted bet placement.
- Storage of bookmaker usernames, passwords, sessions, or tokens belonging to users.
- “Sure bet,” guaranteed-win, or fixed high-accuracy claims.
- Loss-chasing prompts, martingale, and automatic stake progression.
- Unauthorized bookmaker scraping or reverse engineering.
- Official booking codes without approved access.
- In-play prediction in the MVP.
- Basketball, tennis, and native mobile apps in the MVP.
- User-to-user tip marketplaces, social betting feeds, and copy betting.
