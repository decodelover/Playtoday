# PlayToday Onboarding Security & RLS Policy

## Security Controls

1. **Authentication Verification**: Server actions verify session authenticity using `getAuthenticatedUser()`. Client-submitted `user_id` values are strictly ignored.
2. **Row Level Security (RLS)**:
   - RLS is forced on `public.user_preferences`.
   - `auth.uid() = user_id` enforces isolated read, insert, and update operations for every member.
3. **Zod Input Validation**: Server-side parsing with `UserPreferencesSchema` prevents arbitrary text injection, invalid odds ranges, or illegal enum values.
4. **Service Role Key Isolation**: Standard user preference writes use the client's authenticated session token. The Supabase service role key remains server-side.
5. **Atomic Completion**: `onboarding_completed_at` is set only after preferences write succeeds, preventing incomplete preference profiles from accessing overview dashboard features.
