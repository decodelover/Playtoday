# PlayToday account deletion policy

## Current decision

Self-service account deletion is **not implemented or exposed**. Retention periods and the treatment of future sports history, settlements, security records, and financial records are unresolved. A one-click hard deletion would be premature and could destroy records that later require retention or anonymization.

## Current related data

| Record                       | Ownership                                       | Current Auth-user deletion behavior |
| ---------------------------- | ----------------------------------------------- | ----------------------------------- |
| `auth.users`                 | Supabase Auth                                   | Administrative deletion target      |
| `public.profiles`            | `profiles.id` references Auth user              | Cascades                            |
| `public.user_preferences`    | `user_preferences.user_id` references Auth user | Cascades                            |
| `public.contact_submissions` | No Auth-user foreign key                        | Unchanged                           |

There is no current audit-event, subscription, prediction-history, or settlement table to process.

## Required production model

Before deletion can be exposed, PlayToday must approve either delayed purge or anonymization with documented retention. The implementation must include explicit consequences, deliberate confirmation, recent reauthentication, server-side ownership derivation, rate limiting, session revocation, idempotent processing, failure recovery, and an auditable outcome. The browser must never receive a service-role key or choose the target user ID.

Retained operational or legal records must be minimized and pseudonymized where appropriate. Contact submissions require identity matching and privacy review because they are not linked to Auth accounts. Audit records, if introduced, must retain only approved non-secret metadata for an approved period.

## Unresolved approvals

- Legal basis and retention period for each future data category.
- Whether deletion uses a delay, anonymization, or both.
- How pending support, sports-history, settlement, and financial records are handled.
- Reversal rules during any delay and irreversible purge behavior.
- Audit-event retention and privacy-request verification.
