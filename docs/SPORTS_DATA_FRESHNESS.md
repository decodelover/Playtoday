# Sports Data Freshness Policies — PlayToday

## Freshness Windows

1. **Pre-Match Fixture Schedules**:
   - Refreshed daily for future match windows (7–30 days ahead).
   - Refreshed hourly for upcoming same-day matches (0–24 hours ahead).
2. **Live Match Score Ingestion**:
   - Short-polling interval during live windows: 60s.
   - Stale threshold: If no live update received within 180s, fixture status detail is flagged as `STALE_LIVE_DATA`.
3. **Completed Fixtures & Standings**:
   - Reconciled 15 minutes post-match for final scores, cards, and standings.
