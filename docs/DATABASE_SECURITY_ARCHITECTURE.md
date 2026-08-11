# PlayToday database security architecture

## Trust boundaries

The browser receives only the Supabase URL and publishable or legacy anonymous key. Supabase Auth establishes identity. PostgreSQL RLS is the authorization boundary for private user rows. Server actions validate payloads and return stable messages, but they do not replace RLS or database constraints.

The service-role key exists only in a `server-only` module for contact insertion. Normal account and onboarding operations use the member session.

## Ownership

Profiles use `profiles.id = auth.uid()`. Preferences use `user_preferences.user_id = auth.uid()`. Browser payloads never choose the owner for onboarding RPCs. Public RPCs derive the owner internally and reject missing authentication.

Profile creation has one canonical path: an `AFTER INSERT` trigger on `auth.users` calls `private.handle_new_auth_user()`. The insert is idempotent and does not create preference or acknowledgement data.

## Public and private data

All current application tables are private. Public marketing, performance, and Help Centre content is static application content. There is no reason to expose database tables or views for it. Future public read models must contain only published fields and use `security_invoker` views where appropriate.

Contact submissions are server-written. Anonymous and normal authenticated roles cannot read, insert, update, or delete them through the Data API.

## Functions and triggers

Trigger-only functions live in the unexposed `private` schema. Definer functions set `search_path = ''`, schema-qualify object references, and have execution revoked from public API roles. The two public onboarding RPCs remain definer functions because they must update server-controlled profile columns in the same transaction as preference persistence. They validate `auth.uid()` and expose no general-purpose write primitive.

## Realtime

No application migration adds `profiles`, `user_preferences`, or `contact_submissions` to `supabase_realtime`. No client subscription exists. Private tables must remain unpublished until a documented use case, RLS test, payload review, and cleanup strategy exist.

## Error handling

Database messages, schema names, SQL, and RLS details stay on the server. Onboarding actions log only the operation and database error code, without user IDs, form values, or raw messages. Users receive a short recovery instruction.

## Testing

The database test matrix uses pgTAP inside a rolled-back transaction. It checks grants, policies, cross-user isolation, forged ownership, direct privilege-field mutation, function access, contact privacy, idempotency, and Realtime publication state. Static Vitest checks prevent removal of the critical migration controls.

## Account settings and export

Phase 3B adds no database object or privilege. Account settings actions authenticate server-side, validate a narrow payload, and filter writes with the authenticated user ID. Profiles and preferences remain protected by the Phase 3A grants, forced RLS, and ownership policies. The export route uses the same member session, filters both reads to the authenticated ID, returns an uncached attachment, and excludes secrets and unscoped contact records. No service-role client is involved.

## Future admin model

No admin role exists. Future privileged authorization must use server-controlled `app_metadata` or a private role table. User-editable metadata and normal profile columns must never grant administrative authority.
