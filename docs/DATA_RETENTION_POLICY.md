# PlayToday data retention policy foundation

Retention periods require legal and business approval. This document records categories and deletion relationships without inventing durations.

| Category                           | Current data                                               | Current deletion behavior                         | Retention period                                |
| ---------------------------------- | ---------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| Account and profile                | `auth.users`, `public.profiles`                            | Profile cascades when the Auth user is deleted    | Unresolved                                      |
| Preferences and onboarding         | `public.user_preferences`, onboarding fields on `profiles` | Preferences cascade when the Auth user is deleted | Unresolved                                      |
| Contact submissions                | `public.contact_submissions`                               | Independent of Auth account deletion              | Unresolved; support and privacy review required |
| Security and audit events          | No application table yet                                   | Not applicable                                    | Define before privileged administration ships   |
| Predictions and settlements        | Not implemented                                            | Not applicable                                    | Define with the future domain model             |
| Subscription and financial records | Not implemented                                            | Not applicable                                    | Define with billing and legal requirements      |

## Account deletion foundation

A deletion workflow must revoke active sessions before deleting the Auth user, verify cascade effects, and handle contact records separately. Financial, settlement, or trusted audit history may require retention or pseudonymization rather than cascading deletion. Phase 3B does not expose self-service deletion while these requirements and retention periods remain unresolved. Privacy requests go through support review and are not represented as automated deletion.

The current authenticated JSON export covers Auth identity, profile, and preferences only. It is generated directly for the requesting member, is not cached, and creates no retained export file.

## Data minimization

Database logs and application logs must exclude secrets, raw contact messages, emails, preference payloads, and unrestricted metadata. Audit metadata must use an approved field allow-list before an audit table is introduced.
