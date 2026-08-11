# Step 1D environment and secrets walkthrough

## Objective

Define a reproducible environment contract without committing credentials or pretending example values are deployable secrets.

## Implemented controls

- `.env.example` documents required names using safe example values.
- `.env.local` is ignored and must never be tracked.
- `scripts/env-check.mjs` validates example, test, and current environment modes.
- Browser-visible variables use the `NEXT_PUBLIC_` prefix deliberately.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and prohibited from client bundles.
- CI uses explicit non-production test values rather than repository secrets for static and unit checks.

## Verification

```powershell
pnpm env:example:check
pnpm env:check:test
pnpm repository:guard
git ls-files .env.local
```

The first three commands must pass. The final command must return no tracked file. Real environment values belong in local ignored files or the hosting provider's secret store and must not be printed in completion reports.

## Rotation and incidents

An exposed credential must be revoked and rotated at its provider. Removing it from the latest file is insufficient because Git history, caches, logs, and deployed environments may still contain it. Follow `SECURITY.md` and preserve only redacted incident evidence.
