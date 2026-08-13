# PlayToday Development Rules

## Core Principles

1. **Production Identity**: Product is named **PlayToday** (`@playtoday/*`). Retired product names must never appear in active production code or user-facing copy.
2. **Authentic Data & Credentials**: Never use fake mock preferences or dummy user records. Never collect or request user bookmaker credentials (passwords, PINs, API keys).
3. **Onboarding Requirements**:
   - Onboarding must use the real authenticated user.
   - Preferences must be persisted to the database.
   - User-owned onboarding data requires RLS (`auth.uid() = user_id`).
   - Server-side validation with Zod is mandatory.
   - Interrupted onboarding must be recoverable via saved step state.
   - Completed users are redirected away from `/onboarding` to `/overview`.
   - Responsible play disclaimers and risk acknowledgements are mandatory.

## Database and security rules

1. All production schema changes require migrations.
2. Never mutate production schema only through the dashboard.
3. All exposed private tables require RLS.
4. Authenticated identity and RLS must enforce user ownership.
5. Never trust client-supplied ownership IDs.
6. Normal user operations must not use service role to bypass RLS.
7. Service-role clients are server-only.
8. Every `SECURITY DEFINER` function requires an explicit security review.
9. Public read models expose only required fields.
10. Realtime must not expose private cross-user data.
11. Database constraints complement application validation.
12. Foreign-key deletion behavior must be deliberate.
13. Avoid speculative indexes.
14. Multi-write critical operations require transaction safety.
15. Duplicate submissions must be handled safely.
16. Raw PostgreSQL errors must not be sent to users.
17. Production databases must not contain fake test data.
18. Investigate migration drift before deployment.
19. RLS changes require security tests.
20. Do not destroy existing production data casually.
21. Database architecture must remain auditable.
22. Humanizer review is required for UI copy affected by database errors.
23. Design skills remain mandatory whenever visual changes are made.

## Account settings rules

1. Settings must always use real authenticated user data.
2. Onboarding and Settings must share canonical preference storage.
3. No client-supplied ownership IDs may be trusted.
4. User settings require server validation.
5. RLS remains the primary database ownership boundary.
6. Normal settings operations must not use service-role.
7. Passwords/tokens must never be logged.
8. Fake security/session data is prohibited.
9. Unsupported settings controls must not be rendered as functional.
10. Account deletion must be real if exposed.
11. Data export must be real if exposed.
12. Privileged account fields cannot be user-editable.
13. Responsible Play controls require real server enforcement.
14. Taste Skill + UI/UX Pro Max remain mandatory for settings design.
15. Humanizer remains mandatory for account copy.
16. Customer-facing settings must not expose roadmap/development language.
17. Destructive actions require clear confirmation.
18. Data-retention and deletion behaviour must be documented.
19. Settings changes must survive refresh and reflect canonical persisted state.
20. No production dummy account data.

## Phase 4A Sports Data Development Rules

1. Production sports data must come from approved real providers.
2. Provider payloads must be normalized before entering domain logic.
3. Provider IDs must not become PlayToday’s canonical primary keys.
4. External provider credentials are server-only.
5. Browser components must not call secret sports APIs directly.
6. Production mock fixture/odds data is prohibited.
7. Missing sports data must produce real unavailable/empty states.
8. Provider ingestion must be idempotent.
9. Provider rate limits must be respected.
10. Live polling must use evidence-based cadence.
11. Upstream provider failures must never trigger fabricated fallback data.
12. All important dynamic sports records require freshness information.
13. Provider status mappings must normalize into PlayToday canonical statuses.
14. Provider-specific logic belongs inside adapters.
15. Core application logic must remain provider-independent.
16. Sports ingestion writes come only from trusted server infrastructure.
17. Normal users cannot mutate canonical sports reference data.
18. Bookmaker websites must not be scraped for odds or booking codes.
19. Official bookmaker integrations require authorized access.
20. Sports-provider terms/data rights must be reviewed before broad production use.
21. Realtime is reserved for genuinely changing data.
22. Tests may use isolated fixtures; production UI may not.
23. User-facing sports-data messages require Humanizer.
24. UI changes continue to require Taste Skill + UI/UX Pro Max.
25. Production maturity in presentation and absolute honesty in data remain permanent.
