# PlayToday Development Rules

## Core Principles

1. **Production Identity**: Product is named **PlayToday** (`@playtoday/*`). Retired names (EdgePilot, EdgePilot AI) must never appear in active production code or user-facing copy.
2. **Authentic Data & Credentials**: Never use fake mock preferences or dummy user records. Never collect or request user bookmaker credentials (passwords, PINs, API keys).
3. **Onboarding Requirements**:
   - Onboarding must use the real authenticated user.
   - Preferences must be persisted to the database.
   - User-owned onboarding data requires RLS (`auth.uid() = user_id`).
   - Server-side validation with Zod is mandatory.
   - Interrupted onboarding must be recoverable via saved step state.
   - Completed users are redirected away from `/onboarding` to `/overview`.
   - Responsible play disclaimers and risk acknowledgements are mandatory.
