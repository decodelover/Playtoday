# Public content and data rules

## Source of truth

Public claims must come from the product brief, product requirements, data principles, approved legal material, or a production data source with recorded provenance. Copy must not create facts that those sources do not contain.

## Current data state

The repository has no licensed live sports feed, operational prediction service, settlement service, account system, billing system, or published performance dataset. Public pages state that directly.

The Contact page is the first real public write path. It validates and normalizes submissions on the server, then persists them to Supabase only when the server-only project configuration is available and the `contact_submissions` migration has been applied. It never reports success before the insert succeeds. The Help Centre searches only the articles committed in `help-content.ts`.

The former `home-demo-data.ts` source and its fictional fixture, probability, odds target, ticket, and settlement records have been removed. No public component contains a mock fixture, sample price, invented plan, testimonial, accuracy figure, return, or launch date.

An unavailable dataset receives an honest status block. It does not receive a placeholder chart or simulated record. The Verified Performance page uses the exact message: `No verified PlayToday performance records have been published yet.`

## Writing standard

Public copy should sound like a knowledgeable editor explaining a careful product. Prefer short verbs and concrete nouns. Use `is`, `has`, and `does` when they are the clearest choice.

Avoid promotional filler, false significance, unsupported authority, forced groups of three, stacked slogans, generic positive conclusions, and chatbot language. Do not use claims such as `guaranteed`, `sure`, `fixed`, or `100% accurate`.

Headings use sentence case. Copy contains no em dashes or en dashes. Product facts, names, numbers, dates, quotes, and citations cannot be invented to make a sentence sound more specific.

## Product language

- Estimated probability, model confidence, and data quality are separate concepts.
- A high data-quality score is not a win probability.
- A target-odds request may return below target or return no qualifying combination.
- A pass day is a valid recorded outcome.
- PlayToday does not accept stakes, hold funds, access bookmaker accounts, or place bets.
- SportyBet, Bet9ja, and MSport are planned mapping targets only. Their names do not imply affiliation or official booking-code access.

## Requirements for future live records

Future fixtures, odds, predictions, and settlements need provider identity, source time, observation time, freshness, mapping version, and validation status. Performance reports also need the publication window, sample size, exclusion rules, void handling, correction history, and model version where material.

Backtest, validation, shadow, simulation, and live-production records remain separate. Live pages must show stale, empty, delayed, and error states without falling back to bundled demonstration data.
