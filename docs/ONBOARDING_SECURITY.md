# PlayToday Onboarding Security & RLS Policy

## Security Controls

1. **Authentication Verification**: Server actions verify session authenticity using `getAuthenticatedUser()`. Client-submitted `user_id` values are strictly ignored.
2. **Row Level Security (RLS)**:
   - RLS is enabled and forced on `public.profiles` and `public.user_preferences`.
   - `auth.uid() = user_id` enforces isolated read, insert, and update operations for every member.
   - Profile updates are restricted to `display_name` and `avatar_url`; completion fields are server-controlled.
3. **Input Validation**: Zod validates server-action input. PostgreSQL constraints independently enforce canonical sports, bookmakers, markets, odds, strategies, risk values, notification JSON, responsible-play state, and timezone shape. A trigger verifies IANA timezone names.
4. **Service Role Key Isolation**: Standard user preference writes use the client's authenticated session token. The Supabase service role key remains server-side.
5. **Atomic Completion**: `public.complete_onboarding(...)` derives the owner from `auth.uid()` and sets completion only if preference persistence succeeds in the same transaction.
6. **Function Safety**: Public onboarding RPCs have an empty `search_path`, accept no owner ID, check authentication, and grant execution only to `authenticated`. Trigger helpers live in the inaccessible `private` schema.
7. **Safe Errors**: Server actions return stable recovery messages and do not expose raw database or RLS details.
