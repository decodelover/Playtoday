# PlayToday deployment runbook

## Current targets

The web application is configured for Vercel through `apps/web/vercel.json`. Supabase provides Auth and PostgreSQL. The Python services do not have an approved production host yet and must not be represented as deployed.

## Preconditions

- The release commit has passed the required GitHub checks.
- `pnpm ci:check` passes from a clean checkout.
- Database migrations replay successfully from an empty local Supabase database.
- Migration history and schema drift have been reviewed against the intended Supabase project.
- Production environment values are configured in the hosting providers, not committed to Git.
- The release owner has reviewed security, privacy, rollback, and data-retention effects.

## Web deployment

1. Import the repository into Vercel and select `apps/web` only if the Vercel project is configured as a subdirectory project. Otherwise retain the repository-root build configuration used by the monorepo.
2. Configure the production values required by `.env.example` in Vercel Environment Variables.
3. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it through a `NEXT_PUBLIC_` variable.
4. Deploy a preview and verify public routes, authentication redirects, account settings, health response, console output, and mobile layouts.
5. Promote only the reviewed commit.

## Database deployment

Link the local repository to the intended Supabase project, compare migration history, and run a dry run before applying anything:

```powershell
pnpm exec supabase login
pnpm exec supabase link --project-ref <project-ref>
pnpm exec supabase migration list --linked
pnpm exec supabase db push --linked --dry-run
```

Apply migrations only after the local reset and pgTAP suite pass and the dry-run output matches the approved release. Do not repair migration history or push to production merely to silence drift.

## Rollback

Application rollback uses the hosting provider's previous verified deployment. Database rollback requires a reviewed forward migration or a tested recovery plan; never edit an applied migration or run an improvised destructive statement. Restore data from an approved backup only under the incident process.

## Evidence

Record the commit, target environments, migration list, dry-run result, required check results, deployment URLs, smoke-test results, operator, timestamp, and any rollback decision in the release record without including secrets.
