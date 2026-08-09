# Deployment

## Deployment boundary

PlayToday deploys `apps/web` as the public Next.js application. The Python directories are non-operational service foundations and are not deployed with the web project. Vercel project settings must use `apps/web` as the Root Directory.

Production deployment does not authorize a later roadmap phase. The verified-performance page remains empty until a verified read model exists, and the Contact form must return a real failure until its database migration and environment are ready.

## Required accounts and access

- Write access to `decodelover/Playtoday` on GitHub.
- Access to the intended Vercel account and PlayToday project.
- Access to the intended Supabase project.
- Permission to manage Vercel environment variables.
- Database or Supabase SQL Editor access for reviewed migrations.

## Environment contract

Configure these values in Vercel for Production. Configure Preview separately and do not reuse production database credentials unless that access has been explicitly approved.

| Variable                    | Exposure      | Purpose                                        |
| --------------------------- | ------------- | ---------------------------------------------- |
| `APP_ENV`                   | Server        | `production` for the production deployment     |
| `LOG_LEVEL`                 | Server        | Approved production logging level              |
| `NEXT_PUBLIC_APP_NAME`      | Public        | Browser-visible product name                   |
| `NEXT_PUBLIC_APP_URL`       | Public        | Canonical deployed origin                      |
| `NEXT_PUBLIC_SUPABASE_URL`  | Public        | Supabase project URL used by the server client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server secret | Privileged Contact insert credential           |

The service-role key bypasses RLS and must never be committed, printed, placed in a `NEXT_PUBLIC_` variable, or reused in browser code. `.env.local` is for ignored local configuration only.

## Supabase release gate

Before enabling Contact submissions in production:

1. Review `supabase/migrations/20260809005815_phase_2f_contact_submissions.sql`.
2. Apply it through an authorized migration workflow or the Supabase SQL Editor.
3. Run `supabase/tests/database/contact_submissions.test.sql` against that database.
4. Confirm `anon` and `authenticated` cannot read or insert rows.
5. Confirm the server-only client can insert one authorized operational verification submission.
6. Remove the verification row through an approved administrative workflow and record the result without copying personal data into logs.

The project URL and API keys do not authorize schema migrations by themselves.

## GitHub publication

For the initial empty repository:

```sh
git remote add origin https://github.com/decodelover/Playtoday.git
git push -u origin main
```

After the initial publication, use short-lived branches and pull requests. GitHub Actions runs the repository quality gate defined under `.github/workflows`.

## Vercel project setup

1. Import `decodelover/Playtoday` into the intended Vercel account.
2. Set Root Directory to `apps/web`.
3. Keep Framework Preset set to Next.js.
4. Keep the detected pnpm install and build commands unless a measured failure requires an override.
5. Set the required environment variables in Vercel, with the service-role key marked sensitive.
6. Use `main` as the production branch.

The committed `apps/web/vercel.json` declares only the Next.js framework. Environment values stay in Vercel rather than source control.

## Deployment and verification

Run the repository checks before deployment:

```sh
pnpm env:example:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For a direct production deployment from a linked project:

```sh
vercel deploy --prod
```

After deployment, verify:

- `/` and every public supporting route return successful responses.
- `/api/health` returns the expected service status.
- Navigation, mobile menu, keyboard focus, and reduced motion still work.
- No browser bundle contains `SUPABASE_SERVICE_ROLE_KEY`.
- Contact displays success only after a row is persisted.
- Vercel build and runtime logs contain no secrets or personal message content.

## Rollback

If a production regression appears, use Vercel deployment history to promote the last verified deployment or run `vercel rollback`. A code rollback does not revert a database migration. Database remediation requires a separate reviewed migration and must preserve submitted contact records according to the approved retention policy.
