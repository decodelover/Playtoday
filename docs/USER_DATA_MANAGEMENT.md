# PlayToday user data management

## Data categories

- Auth identity: account ID, email, confirmation time, and creation time.
- Profile: display name, optional avatar field, onboarding state, and timestamps.
- Preferences: supported sports, bookmakers, markets, target odds, strategy, risk, notification channels, timezone, and responsible-play acknowledgement.
- Contact submissions: stored independently and not linked to an authenticated account ID.

No billing, subscription history, bookmaker credentials, device inventory, or security-event history exists in the current account model.

## Export

`GET /settings/privacy/export` authenticates the request with `auth.getUser()`, reads the caller's profile and preferences through RLS, and returns a direct JSON attachment. Queries are explicitly filtered by the authenticated ID. The response is private, non-cacheable, and excludes passwords, tokens, service credentials, raw Auth metadata, and contact messages. No public or predictable export URL is created.

## Deletion and retention

Self-service deletion is not exposed. The Auth user currently owns profile and preference rows through cascading foreign keys, but contact submissions are independent and future historical records do not yet have an approved retention model. Destructive account deletion waits for legal and operational approval of retention, anonymization, audit, reauthentication, and failure-recovery behavior.

Privacy requests are routed to support for review. This is not represented as an automated deletion request or completed deletion.

## Account lifecycle and privilege boundary

The only application account lifecycle represented today is an active Auth user with onboarding incomplete or complete. No user-editable admin, suspended, restricted, entitlement, or billing state exists. Future privileged transitions must use controlled server processes. Phase 3B uses no service-role operation.
