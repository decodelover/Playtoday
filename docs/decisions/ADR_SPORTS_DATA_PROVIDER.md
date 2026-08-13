# ADR: Sports Data Provider Strategy & Ingestion Foundation

- **Status**: Decided
- **Date**: 2026-08-12
- **Deciders**: PlayToday Architecture Team

## Context & Problem Statement

PlayToday requires a production-grade, provider-independent football data architecture to power match schedules, scores, standings, and future prediction models.

## Decision Drivers

1. Absolute data honesty — zero fictional fixtures or generated scores in production.
2. Provider decoupling — internal canonical models must not depend on third-party JSON response formats.
3. Separate roles for Core Sports Data and Market Odds Data.
4. Server-only credential isolation (`NEXT_PUBLIC_` forbidden).

## Decision Summary

1. **Role Separation**:
   - **Core Sports Provider**: Adaptable interface (`SportsProviderAdapter`) defaulting to API-Football / Sportmonks schema contracts for fixtures, teams, leagues, and live scores.
   - **Odds Provider**: Adaptable interface for bookmaker odds feeds (e.g., The Odds API).
2. **Canonical Domain Model**:
   - Provider DTOs are validated via Zod and normalized into PlayToday canonical entities (`sports`, `competitions`, `seasons`, `teams`, `fixtures`, `provider_entity_mappings`).
3. **Target Bookmaker Status**:
   - SportyBet, Bet9ja, and MSport coverage is explicitly recorded as `TARGET BOOKMAKER COVERAGE NOT VERIFIED`. No partnerships or official odds APIs are claimed.
4. **Credential Isolation**:
   - All provider API keys remain server-only (`SPORTS_PROVIDER_API_KEY`, etc.). Client applications access data solely through Supabase RLS-protected database read views.

## Consequences

- Third-party API payload changes will require updating only the provider adapter, leaving downstream domain logic untouched.
- If live credentials are absent in an environment, system safely reports `REAL PROVIDER CREDENTIALS REQUIRED FOR LIVE INGESTION TEST` without breaking database migrations or domain build pipelines.
