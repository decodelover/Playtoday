# Sports Provider Failure Handling — PlayToday Phase 4B

## Policy & Invariants

1. **No Fake Fallback**: When third-party provider APIs fail or credentials are missing, PlayToday NEVER generates mock matches or fake live scores.
2. **Health Tracking**: Sync failures update `sports_provider_health` with error messages and consecutive failure counts.
3. **Graceful Degraded State**: UI displays last-known verified canonical data or a clear, truthful unavailable state ("Fixture data is temporarily unavailable").
