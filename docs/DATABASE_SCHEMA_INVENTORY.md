# PlayToday database schema inventory

This inventory describes the schema produced by the version-controlled migrations in `supabase/migrations`. The repository is not linked to a remote Supabase project, so remote drift remains unverified.

## Tables

| Table                             | Purpose                                                                    | Domain  | Exposure    | Ownership         | Primary key and foreign keys                                        | RLS                                                                        | Realtime                    | Retention                                | Origin                                      |
| --------------------------------- | -------------------------------------------------------------------------- | ------- | ----------- | ----------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------- | ---------------------------------------- | ------------------------------------------- |
| `public.contact_submissions`      | Stores public contact enquiries submitted by the server action             | Support | Private     | System-owned      | UUID `id`; no foreign keys                                          | Enabled and forced; no policies; public API roles have no grants           | Not published by migrations | Business and legal period unresolved     | Phase 2F                                    |
| `public.profiles`                 | Stores member-facing profile fields and server-controlled onboarding state | Account | Private     | User-owned        | UUID `id` references `auth.users(id)` with `ON DELETE CASCADE`      | Enabled and forced; authenticated self-read and column-limited self-update | Not published by migrations | Account lifetime; removed with Auth user | Phase 2G, extended in 2H and hardened in 3A |
| `public.user_preferences`         | Stores canonical onboarding and Settings preferences                       | Account | Private     | User-owned        | UUID `user_id` references `auth.users(id)` with `ON DELETE CASCADE` | Enabled and forced; authenticated self-read, self-insert, and self-update  | Not published by migrations | Account lifetime; removed with Auth user | Phase 2H, hardened in 3A                    |
| `public.sports`                   | Canonical sports definitions                                               | Domain  | Public Read | System-owned      | UUID `id`                                                           | Enabled; public SELECT                                                     | Optional                    | Permanent                                | Phase 4A                                    |
| `public.areas`                    | Canonical geographical regions                                             | Domain  | Public Read | System-owned      | UUID `id`                                                           | Enabled; public SELECT                                                     | Optional                    | Permanent                                | Phase 4A                                    |
| `public.competitions`             | Canonical leagues and tournaments                                          | Domain  | Public Read | System-owned      | UUID `id`, FK to `sports`, `areas`                                  | Enabled; public SELECT                                                     | Optional                    | Permanent                                | Phase 4A                                    |
| `public.seasons`                  | Competition season windows                                                 | Domain  | Public Read | System-owned      | UUID `id`, FK to `competitions`                                     | Enabled; public SELECT                                                     | Optional                    | Permanent                                | Phase 4A                                    |
| `public.teams`                    | Canonical sports teams                                                     | Domain  | Public Read | System-owned      | UUID `id`, FK to `sports`, `areas`                                  | Enabled; public SELECT                                                     | Optional                    | Permanent                                | Phase 4A                                    |
| `public.venues`                   | Stadiums and match venues                                                  | Domain  | Public Read | System-owned      | UUID `id`                                                           | Enabled; public SELECT                                                     | Optional                    | Permanent                                | Phase 4A                                    |
| `public.fixtures`                 | Canonical match fixtures and live scores                                   | Domain  | Public Read | System-owned      | UUID `id`, FK to `competitions`, `teams`, `venues`                  | Enabled; public SELECT                                                     | Supported                   | Permanent                                | Phase 4A                                    |
| `public.provider_entity_mappings` | External provider ID resolution lookup                                     | System  | Private     | Service-role only | UUID `id`                                                           | Enabled; Service role only                                                 | No                          | System lifetime                          | Phase 4A                                    |
| `public.provider_payloads`        | Raw response payload audit store                                           | System  | Private     | Service-role only | UUID `id`                                                           | Enabled; Service role only                                                 | No                          | Retention policy applies                 | Phase 4A                                    |
| `public.sports_ingestion_runs`    | Ingestion job run history                                                  | System  | Private     | Service-role only | UUID `id`                                                           | Enabled; Service role only                                                 | No                          | Diagnostic history                       | Phase 4A                                    |
| `public.sports_provider_health`   | Operational provider health indicators                                     | System  | Private     | Service-role only | UUID `id`                                                           | Enabled; Service role only                                                 | No                          | Diagnostic history                       | Phase 4A                                    |

## Views and materialized views

- `public.v_public_fixtures`: Public read view exposing normalized fixture schedules, status, scores, competitions, and home/away team details.

## Functions

| Function                        | Schema    | Security                     | Purpose                                                            | Direct callers                |
| ------------------------------- | --------- | ---------------------------- | ------------------------------------------------------------------ | ----------------------------- |
| `handle_new_auth_user()`        | `private` | Definer, empty `search_path` | Creates one profile after an Auth user is inserted                 | Auth trigger only             |
| `validate_user_preferences()`   | `private` | Invoker, empty `search_path` | Rejects unknown IANA timezone identifiers                          | Preference write trigger only |
| `set_updated_at()`              | `private` | Invoker, empty `search_path` | Applies one timestamp policy to mutable user tables                | Update triggers only          |
| `save_onboarding_progress(...)` | `public`  | Definer, empty `search_path` | Saves a validated draft and current step in one transaction        | Authenticated server action   |
| `complete_onboarding(...)`      | `public`  | Definer, empty `search_path` | Persists final preferences and completion state in one transaction | Authenticated server action   |

The two public functions accept no user ID. Both derive ownership from `auth.uid()` and deny anonymous execution.

## Triggers

| Trigger                                  | Relation                  | Timing                  | Purpose                            |
| ---------------------------------------- | ------------------------- | ----------------------- | ---------------------------------- |
| `on_auth_user_created`                   | `auth.users`              | After insert            | Idempotent profile creation        |
| `validate_user_preferences_before_write` | `public.user_preferences` | Before insert or update | IANA timezone validation           |
| `set_profiles_updated_at`                | `public.profiles`         | Before update           | Canonical `updated_at` maintenance |
| `set_user_preferences_updated_at`        | `public.user_preferences` | Before update           | Canonical `updated_at` maintenance |

## Enums, indexes, and extensions

- PostgreSQL enums: none. Stable values use application schemas plus database `CHECK` constraints.
- Explicit application indexes: none. The three primary keys already index the only current ownership lookup columns.
- Extensions explicitly enabled by application migrations: none. `gen_random_uuid()` relies on the Supabase database baseline.

## Deletion behavior

Profiles and preferences cascade when the corresponding Auth user is deleted. Contact submissions are not tied to an Auth user and require a separate retention decision. No financial, prediction, settlement, or subscription history exists in this schema.

## Phase 4 sports objects

Hosted tables are `sports`, `areas`, `competitions`, `seasons`, `teams`, `venues`, `fixtures`, `provider_entity_mappings`, `provider_payloads`, `sports_ingestion_runs`, and `sports_provider_health`. The hosted read view is `v_public_fixtures`, and the enum is `fixture_status`. No sports database function was added.

The deployed migration versions are `20260814004912`, `20260814004921`, and `20260814005206`. Local filenames match the hosted migration ledger. The sports schema uses canonical UUID relationships, unique provider mappings, a unique competition-season name pair, UTC timestamps, and indexed foreign keys.
