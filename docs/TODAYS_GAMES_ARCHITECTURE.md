# Today's Games Architecture — PlayToday Phase 4B

## Overview

The Today's Games system delivers real, timezone-aware football fixtures for the user's local calendar day.

## Read Pipeline

1. **User Timezone Resolution**: Reads user's preferred IANA timezone (`Africa/Lagos`, `Europe/London`, `UTC`, etc.).
2. **UTC Boundary Conversion**: `getUtcBoundsForTimezone(dateIso, timezone)` calculates UTC bounds `[startUtc, endUtc]`.
3. **Database View Query**: Queries `v_public_fixtures` with `kickoff_at BETWEEN startUtc AND endUtc`.
4. **UI Presentation**: `GamesClient` renders `Live`, `Upcoming`, and `Finished` fixture sections with status badges and timezone-adjusted kickoff times.
5. **Data Honesty**: Zero mock fixtures or fake predictions. Displays truthful empty state when no games exist.

## Operational behavior

`getTodaysGames` reads the signed-in member's stored IANA timezone, converts the chosen local date to an exclusive UTC interval, and queries `v_public_fixtures`. The conversion is covered for UTC, Africa/Lagos, and a daylight-saving transition in America/New_York.

The `/games` date controls change the server query instead of filtering a browser snapshot. The page distinguishes no fixtures from unavailable data and renders only canonical records. The `/overview` route uses the same service for real fixture, live, upcoming, finished, competition, and freshness counts.
