# GitHub Branch-Protection Recommendations

These settings are recommendations only. They have not been applied automatically. Applying them requires repository-administrator access, and the exact rules must be reviewed after a remote repository and its default branch exist.

For the future default branch:

- require pull requests before merging and at least one approval;
- dismiss stale approvals after relevant changes;
- require all review conversations to be resolved;
- require the stable `PlayToday CI` status check;
- require branches to be up to date when the team determines the queue cost is acceptable;
- restrict direct pushes and block force pushes and branch deletion;
- apply rules to administrators where appropriate;
- require signed commits only after the team adopts and supports that policy;
- require CODEOWNERS review after verified handles are configured; and
- prevent required checks from being bypassed by automated dependency updates.

Review these recommendations after the first successful remote CI run. Do not select matrix implementation names as required checks; use the stable final result.
