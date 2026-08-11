# PlayToday branch protection

## Recommended default-branch rules

Configure these rules for `main` in GitHub. This document records the desired state; it does not claim the remote settings are already enabled.

- Require a pull request before merging.
- Require at least one approval from an eligible reviewer.
- Dismiss stale approvals when reviewed code changes.
- Require review from code owners after a CODEOWNERS file and ownership map are approved.
- Require conversation resolution.
- Require the final `PlayToday CI` status check.
- Require the branch to be current before merge when GitHub can enforce it safely.
- Block force pushes and branch deletion.
- Restrict bypass permissions to named repository administrators.
- Apply rules to administrators unless emergency access is explicitly documented.

Do not guess status-check names. Run the workflow on a pull request first, then select the exact final check reported by GitHub.

## Merge policy

Use squash merge for a focused pull request unless release or audit requirements justify preserving individual commits. Delete merged feature branches. Never merge with required checks pending, skipped, cancelled, or failing.

## Emergency changes

Emergency bypasses require a documented incident, named approver, minimal change, post-merge CI, and follow-up review. An emergency does not permit committing secrets, bypassing data protections, or running unreviewed destructive migrations.
