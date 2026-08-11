# PlayToday GitHub ownership

## Current state

The repository does not yet contain an approved `.github/CODEOWNERS` file or a verified list of GitHub teams. Ownership must not be invented. Until maintainers configure real accounts or teams, repository administrators assign reviewers manually and remain responsible for releases.

## Required ownership areas

When real GitHub teams are known, the ownership map should cover:

- Web application and shared UI.
- Supabase migrations, RLS, Auth, and generated database types.
- Environment validation, CI workflows, and deployment configuration.
- Python services.
- Security, privacy, retention, and Responsible Play documentation.

Supabase migrations and authentication changes require a database/security reviewer. Workflow and deployment changes require a repository administrator. Privacy, deletion, or retention changes require the designated policy owner.

## CODEOWNERS activation

Add `.github/CODEOWNERS` only after every referenced user or team has been verified in the repository organization. Then enable required code-owner review in branch protection and test the rule with a pull request. A placeholder username or nonexistent team is prohibited.
