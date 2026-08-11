# PlayToday release checklist

## Scope and source

- [ ] The release commit and target environment are identified.
- [ ] The change matches an approved roadmap scope.
- [ ] The working tree contains no accidental generated files, secrets, or unrelated changes.
- [ ] Naming uses PlayToday, `playtoday`, and `@playtoday/*`.

## Quality and security

- [ ] `pnpm install --frozen-lockfile` passes from a clean checkout.
- [ ] `pnpm ci:check` passes.
- [ ] Required GitHub checks pass on the release commit.
- [ ] Security-sensitive changes have an appropriate reviewer.
- [ ] Logs, exports, errors, and screenshots contain no secrets or unnecessary personal data.

## Supabase

- [ ] Docker or a compatible runtime is available.
- [ ] `pnpm exec supabase db reset --local` passes.
- [ ] `pnpm exec supabase test db` passes.
- [ ] Local database lint and advisors have been reviewed.
- [ ] The repository is linked to the intended Supabase project.
- [ ] Local and remote migration history is understood.
- [ ] `pnpm exec supabase db push --linked --dry-run` shows only approved migrations.
- [ ] Backup and rollback implications are documented before an applied migration.

## Application verification

- [ ] Public and authenticated routes load without console or hydration errors.
- [ ] Authentication, onboarding, account settings, persistence, export, and sign-out have been tested with controlled accounts.
- [ ] Authorization attack tests pass with two controlled users and an anonymous client.
- [ ] Small-mobile, large-mobile, tablet, laptop, desktop, and wide layouts have been checked.
- [ ] Keyboard, focus, labels, announcements, contrast, and reduced-motion behavior have been checked.

## Deployment and closeout

- [ ] Production environment values are configured in the provider and are not stored in Git.
- [ ] The deployment and database target are confirmed before mutation.
- [ ] Smoke tests pass after deployment.
- [ ] The roadmap, changelog, decisions, policies, and walkthrough reflect the released state.
- [ ] The release record contains evidence, operator, timestamp, and rollback status.
