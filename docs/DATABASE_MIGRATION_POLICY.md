# PlayToday database migration policy

## Source of truth

Every production schema change must be committed under `supabase/migrations`. Dashboard-only schema edits are prohibited.

## Naming and ordering

Create migrations with `pnpm exec supabase migration new <descriptive_name>`. Keep the generated UTC timestamp prefix and a lowercase descriptive suffix. Do not rename a migration after it has been deployed.

## Review requirements

Each migration review must cover data compatibility, locks, RLS, grants, functions, triggers, foreign keys, deletion behavior, Realtime, generated types, and application rollback behavior. Public-schema objects require explicit grants because Supabase no longer auto-exposes new tables by default.

## Production safety

- Prefer additive changes and staged validation.
- Inspect existing data before adding a constraint that may reject stored rows.
- Do not reset, truncate, or delete production data during normal deployment.
- Stop destructive work until affected rows, backup, rollback, and recovery steps are approved.
- Keep data corrections narrow, deterministic, and documented in the migration.

The Phase 3A migration only normalizes contradictory onboarding state and clears a pre-filled responsible-play acknowledgement for incomplete members. It preserves completed acknowledgements and all valid preferences.

## Rollback philosophy

Production rollbacks normally use a new forward migration. Reversing security changes can reopen a vulnerability, so application rollback and schema rollback must be reviewed together. Restore from a verified backup only for data-loss or unrecoverable migration failures.

## Drift detection

Before deployment, compare local migration history with the linked project, run a schema diff, and inspect every statement. Never apply an automatically generated destructive diff without review. The current repository is not linked to a remote project, so remote drift is unresolved.

## Required commands

Inspect the installed CLI help first. In an isolated local stack, run migration replay, database lint, advisors, pgTAP, migration list, and a reviewed schema diff. Production commands require an explicitly identified target and change approval.
