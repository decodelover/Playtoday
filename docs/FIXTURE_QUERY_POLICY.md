# Fixture Query Policy — PlayToday Phase 4B

## Rules & Guidelines

1. **UTC Storage**: All fixture kickoff timestamps are stored in UTC (`timestamptz`).
2. **User-Local Day Conversion**: Today queries convert local calendar day `[00:00:00, 23:59:59]` into an exact UTC timestamp range.
3. **Database View Optimization**: Client applications query `v_public_fixtures` with indexed `kickoff_at` bounds.
4. **No N+1 Lookups**: Views join competition, team, and venue metadata in single queries.
