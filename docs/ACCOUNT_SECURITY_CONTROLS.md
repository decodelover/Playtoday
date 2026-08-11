# PlayToday account security controls

## Password

Signed-in password changes call Supabase Auth `updateUser` with the current password and new password. The client validates confirmation and the project minimum length before the request. Inputs support paste and password managers through `current-password` and `new-password` autocomplete values. Passwords are never logged, returned by a server action, or persisted in application tables.

## Email identity

The verified Auth email and confirmation state are read-only in Settings. PlayToday does not update a profile email field or claim that Auth identity changed. A writable email flow is deferred until both-address confirmation behavior, recovery handling, and account-state UX are complete.

## Sessions

The security page exposes only Supabase Auth sign-out scopes:

- `local` signs out the current browser session.
- `others` revokes other refresh sessions.
- `global` signs out across refresh sessions.

Existing access tokens can remain valid until expiry. No browser, IP, city, device, or last-active list is shown because there is no trusted session inventory source.

## MFA and security activity

MFA is not exposed. Enrollment alone is insufficient; login challenge and enforcement must ship as one reviewed flow. There is no application security-event table, so no activity history is fabricated. Phase 3B logs only safe failure metadata for settings writes and exports. It does not claim to maintain a user-visible audit trail.

## Reauthentication and privileged actions

Password change verifies the current password through Supabase Auth. Session revocation uses the authenticated browser session. Account deletion is not exposed because retention and cascade policy are unresolved. Any future Auth-user deletion requires reauthentication, explicit confirmation, rate limiting, audit treatment, and a server-only administrative path that accepts no arbitrary target user ID.
