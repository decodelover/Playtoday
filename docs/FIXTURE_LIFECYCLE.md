# Fixture Lifecycle Strategy — PlayToday Phase 4B

## Status Transition State Machine

- `scheduled`: Pre-match fixture schedule.
- `live`: Match in progress (1st half, 2nd half).
- `halftime`: Interval period.
- `extra_time`: Additional time.
- `penalties`: Penalty shoot-out.
- `finished`: Official full-time whistle.
- `postponed`: Pushed back to a future date.
- `cancelled`: Match cancelled.
- `suspended`: Match interrupted/paused.
- `abandoned`: Match permanently stopped mid-play.
- `awarded`: Result awarded by governing body.
- `delayed`: Kickoff delayed on matchday.

## Unusual Status Handling

- Postponed matches retain the same canonical fixture ID when kickoff is rescheduled.
- Cancelled and abandoned matches remain in historical records for transparent auditability.
