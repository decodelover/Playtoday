# Release checklist

## Repository

- [ ] The intended branch and commit are recorded.
- [ ] `.env.local`, `.vercel/`, credentials, generated output, and personal data are absent from Git.
- [ ] `pnpm env:example:check` passes.
- [ ] `pnpm format:check` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.
- [ ] GitHub Actions passes on the published commit.

## Database and Contact

- [ ] The target Supabase project is confirmed.
- [ ] The Contact migration is reviewed and applied.
- [ ] Database-level pgTAP tests pass.
- [ ] Public read and write denial is verified.
- [ ] The server-only insert path is verified without retaining test personal data.
- [ ] No production sports or performance record was fabricated for release testing.

## Vercel configuration

- [ ] The project is linked to `decodelover/Playtoday`.
- [ ] Root Directory is `apps/web`.
- [ ] Production branch is `main`.
- [ ] Required public variables are configured for the intended environment.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is configured as a server-side sensitive value.
- [ ] Preview deployments do not receive unapproved production credentials.

## Post-deployment

- [ ] The production deployment reports Ready.
- [ ] `/api/health` responds successfully.
- [ ] Public routes render without console, hydration, or overflow errors.
- [ ] Mobile navigation and keyboard focus are verified.
- [ ] The service-role value is absent from browser assets.
- [ ] Contact returns a real persisted success or an honest failure.
- [ ] Error logs are reviewed without exposing secrets or submitted messages.
- [ ] The deployment URL and verification result are recorded in the release report.
