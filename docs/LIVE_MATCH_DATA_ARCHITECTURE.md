# Live Match Data Architecture — PlayToday Phase 4B

## Ingestion & Distribution Flow

1. **Provider Sync**: Live match endpoint (`/fixtures?live=all`) polled at 1-minute cadence during match windows.
2. **Canonical Persistence**: `SportsIngestionPersistence.upsertRawFixture` updates live scores, halftime scores, and status.
3. **Ordering Protection**: Source update timestamps prevent older delayed payloads from overwriting newer canonical match state.
4. **Supabase Realtime**: Public read clients subscribe to `v_public_fixtures` changes for live score updates.
