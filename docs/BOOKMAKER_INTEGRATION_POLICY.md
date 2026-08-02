# Bookmaker Integration Policy

## Purpose and current status

This policy governs outputs targeting **SportyBet**, **Bet9ja**, and **MSport**. No official API access, commercial partnership, affiliate integration, written technical permission, or booking-code capability is assumed to exist. Until approved access is documented, the product may provide clearly labeled bookmaker-ready selection lists and internal references only.

## Universal adapter architecture

Prediction and ticket domains use provider-neutral fixture identities and universal markets. A bookmaker adapter translates that canonical representation into a bookmaker-specific event, market, outcome, line, label, and observed odds where authorized data exists.

Each adapter must:

- expose a versioned capability matrix;
- map canonical and bookmaker identifiers with confidence and provenance;
- distinguish unsupported, unavailable, ambiguous, and temporarily stale mappings;
- preserve the original universal selection and mapped output;
- avoid changing prediction probability or settlement logic; and
- fail closed when identity, line, or market semantics are ambiguous.

SportyBet, Bet9ja, and MSport adapters are independent mappings behind the same contract; one bookmaker’s terminology or code must not become the universal model.

## Access required for an official integration

Official functions remain disabled until the repository’s operational records identify:

1. the contracting or authorizing party and scope of permission;
2. approved API, affiliate, partnership, or technical documentation;
3. permitted environments, regions, users, data uses, storage, caching, display, and attribution;
4. authentication and secret-rotation procedures;
5. request limits, availability commitments, and support/escalation channels;
6. booking-code creation, validation, expiry, and error semantics where applicable;
7. security, privacy, legal, and brand review approvals; and
8. test evidence and a revocation/disable mechanism.

A public website workflow, undocumented endpoint, or technically reproducible request is not approval.

## Scraping and reverse engineering

Do not scrape bookmaker websites, bypass access controls, imitate private clients, defeat bot protections, or reverse-engineer private endpoints without explicit written authorization covering the proposed method and use. `robots.txt` alone is not permission. Any authorized collection requires an ADR, legal and security review, rate limits, attribution analysis, monitoring, and an immediate kill switch.

## Credential and bet-placement restrictions

- Never ask for or store a user’s SportyBet, Bet9ja, or MSport password, session cookie, access token, PIN, one-time code, or recovery answer.
- Do not log into bookmaker accounts on a user’s behalf.
- Do not accept stakes, hold betting balances, initiate deposits or withdrawals, or place/confirm bets.
- Do not build browser automation intended to evade these restrictions.

## Output classifications

| Output                     | Meaning                                                                                                                                                                          | Permitted before official access?             |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Internal reference**     | PlayToday’s own immutable identifier for a ticket or mapped output. It works only inside the platform.                                                                           | Yes, if visibly labeled “internal reference.” |
| **Bookmaker-ready output** | A human-readable list mapped to a named bookmaker’s fixture/market terminology using authorized data or clearly qualified manual mapping. Availability and odds require recheck. | Yes, with labels, timestamp, and disclaimer.  |
| **Official booking code**  | A bookmaker-created or bookmaker-validated code usable under that bookmaker’s terms and expiry rules.                                                                            | No, until an approved integration exists.     |

Interfaces must never shorten these labels in a way that makes an internal reference look official. An unsupported “code” button is prohibited.

## Market mapping

The canonical market registry owns universal definitions, valid lines/outcomes, compatibility rules, and versioned settlement semantics. Each bookmaker mapping records:

- universal market/outcome and bookmaker market/outcome identifiers;
- sport, competition, fixture, participant, period, line, and home/away orientation;
- display labels and locale;
- mapping version, source, observed time, and confidence;
- availability and restrictions; and
- reviewer or automated-validation evidence.

The football MVP is limited to match winner, double chance, draw no bet, over/under goals, both teams to score, and team total goals. A selection must be excluded from that bookmaker output when an exact semantic mapping cannot be established. Similar wording is not sufficient.

## Odds observation and revalidation

Odds are time-sensitive observations, not promises. Store decimal odds, original source representation if needed, provider/bookmaker, observed-at time, mapping version, and fixture/market identity. Display the timestamp and warn that the user must verify current availability and odds on the bookmaker.

Before an authorized official code is requested, revalidate fixture status, market/outcome availability, line, odds, and code eligibility. If generated odds diverge materially, show the changed total and require user acknowledgment where relevant. Never substitute a different selection silently to maintain target odds.

## Code lifecycle and expiry

If official access is later approved, store code issuer, authorized integration, creation time, expiry supplied by the bookmaker, selection snapshot, response reference, status, and validation attempts. Treat an unknown expiry as unknown—not permanent. Codes become invalid when the bookmaker says so, the underlying market changes incompatibly, or authorization is revoked. Internal ticket history remains available even when an external code expires.

## Integration audit requirements

Audit adapter version, caller, request purpose, canonical input reference, mapped output, timestamps, revalidation result, external response identifiers, errors, and code lifecycle without storing secrets or prohibited payloads. Monitor mapping failures, stale odds, provider disagreement, rejected codes, rate limiting, and unusual request volume.

Changes to adapter semantics, official-access status, or code claims require reviewed tests and an ADR or access record. A feature flag and kill switch must disable each bookmaker integration independently. User-facing partnership and official-access wording requires written approval.
