# Environment and Secrets

## Purpose

This policy defines PlayToday’s typed environment boundary. It reduces accidental
secret exposure and configuration drift, but it is not a guarantee of complete
security. The Contact form has a server-only Supabase integration. No live credential
is committed to this repository.

## Environment classifications

`APP_ENV` has exactly four supported values:

- `development` — local developer execution with intentionally supplied local values.
- `test` — deterministic automated tests that never depend on `.env.local`.
- `preview` — isolated pre-production deployments with preview-scoped configuration.
- `production` — live deployments; every required value must be explicitly supplied.

`NODE_ENV` remains framework-owned. Application behavior must use validated `APP_ENV`
instead of inventing additional environment names.

## Public versus private variables

Server-only variables currently are `APP_ENV`, `LOG_LEVEL`, and
`SUPABASE_SERVICE_ROLE_KEY`. They are read only in controlled server modules. The
service-role value is required and must never use the `NEXT_PUBLIC_` prefix.

Client-safe variables currently are `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`, and
`NEXT_PUBLIC_SUPABASE_URL`. Next.js substitutes `NEXT_PUBLIC_` values into browser
bundles, so every such value is public. Never give a credential, private service
address, service-role key, token, or personal data that prefix.

## Environment-file hierarchy

Next.js considers operating-system variables first, then environment-specific local
files, `.env.local` (except during tests), environment-specific shared files, and
finally `.env`. Higher-priority values win. PlayToday currently commits only
`.env.example`; it does not commit shared runtime `.env` files.

Allowed tracked files:

- `.env.example`, containing non-secret documentation values.
- `.env.test` only if a future decision explicitly approves safe deterministic values.

Never tracked:

- `.env.local`
- `.env.development.local`
- `.env.preview.local`
- `.env.production.local`
- `.env.test.local`
- environment backups, provider exports, or credential snapshots
- `.vercel/` project-link metadata

## Local-development workflow

Copy the template without changing the tracked source:

```powershell
Copy-Item .env.example .env.local
```

On POSIX shells use `cp .env.example .env.local`. Edit only the ignored copy. Then run:

```sh
pnpm env:check
pnpm dev
```

`env:check` reads explicit process variables first and an existing root `.env.local`
second. It never creates the file and never prints values.

## Test-environment workflow

Tests use `createTestEnvironment()` and deterministic non-secret values from
`apps/web/src/env/test-utils.ts`. They do not read `.env.local`.

```sh
pnpm env:check:test
pnpm test
```

## Preview-environment workflow

Set `APP_ENV=preview` and provide all four foundation variables through the approved
preview environment’s secret/configuration controls. Preview must not reuse production
credentials. No preview provider or Vercel project is linked during Step 1D.

## Production-environment workflow

Set `APP_ENV=production` and explicitly provide every required value through approved
deployment configuration. The schemas have no production defaults. Missing or invalid
values fail with variable names only; values are never included in the error.

## Validation commands

```sh
pnpm env:example:check # Template keys, values, duplicates, and Git-ignore policy
pnpm env:check:test    # Deterministic test contract
pnpm env:check         # Current process/.env.local contract
pnpm quality           # Complete non-destructive repository gate
```

The example check is targeted validation, not a complete secret scanner.

## Adding a public variable

1. Confirm the value is safe for anyone to read.
2. Prefix it with `NEXT_PUBLIC_`.
3. Add it to the client schema and explicit `client.ts` reference/export.
4. Add it to the combined server-side validation input if the server consumes it.
5. Add a non-secret example and tests.
6. Inspect the browser bundle and rendered output before release.

## Adding a server-only variable

1. Do not use `NEXT_PUBLIC_`.
2. Add it to the server schema and explicit `server.ts` reference/export.
3. Store real values only in approved secret storage or ignored local files.
4. Add tests using controlled fake inputs that cannot be mistaken for credentials.
5. Confirm no Client Component imports the server module.

## Adding future service credentials safely

External-service variables are introduced only during their authorized integration
phase. That phase must define ownership, environment scope, least privilege, rotation,
revocation, logging redaction, incident response, and tests before adding the key name.
Templates describe purpose with an empty or unmistakably non-secret placeholder—never
a realistic-looking credential.

Supabase secret keys must never be committed or exposed to clients. PlayToday
must never request or store bookmaker user passwords, sessions, tokens, PINs, or
recovery factors.

For Contact persistence, set `NEXT_PUBLIC_SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` in the deployment environment after applying the Phase 2F
migration. The URL is public by design. The service-role key stays in approved
server-side secret storage. Rotate it if logs, source control, or a browser bundle ever
exposes it.

## Rotation and revocation principles

- Give credentials the narrowest scope and shortest practical lifetime.
- Rotate on a documented schedule and after personnel, vendor, or access changes.
- Revoke immediately when exposure, misuse, or unnecessary access is suspected.
- Test replacement before removing a still-required old credential where safe.
- Record the owner and completion evidence without recording the secret itself.

## Accidentally committed secret incident checklist

1. Revoke or rotate the exposed credential immediately.
2. Remove it from active configuration.
3. Inspect Git history.
4. Notify the relevant administrator.
5. Review access logs where available.
6. Replace the credential in approved secret storage.
7. Document the incident.
8. Never assume deleting the latest commit alone makes the secret safe.

Do not print the credential during investigation. Coordinate history rewriting only
after revocation and with repository owners because rewriting affects every clone.
