# GitHub Ownership Guidance

No GitHub remote, organization, username, or approved team handle is configured. A `CODEOWNERS` file is therefore intentionally absent: placeholder handles would be invalid and could create false assurance.

## Recommended ownership model

After real GitHub teams exist, repository administrators should map accountable teams to these paths and add `.github/CODEOWNERS` using verified handles:

| Path                                                                  | Required expertise                               |
| --------------------------------------------------------------------- | ------------------------------------------------ |
| `/.github/`, `/SECURITY.md`                                           | Repository administration and security           |
| `/apps/web/`                                                          | Web platform and product engineering             |
| `/packages/config/`, root build/config files                          | Developer experience and platform                |
| `/supabase/`, `/packages/database-types/`                             | Database, privacy, and authorization             |
| `/services/prediction-api/`, `/packages/ai-tools/`                    | Data science, model risk, and AI integrity       |
| `/services/settlement-worker/`                                        | Settlement rules and data integrity              |
| `/services/ingestion-worker/`                                         | Licensed data and ingestion operations           |
| `/packages/bookmaker-adapters/`                                       | Legal/commercial approval and integrations       |
| `/docs/SECURITY_AND_COMPLIANCE.md`, `/docs/DATA_AND_AI_PRINCIPLES.md` | Security, legal, compliance, and data governance |

Workflows, Dependabot, ownership rules, security policy, environment contracts, database migrations, prediction/model paths, settlement logic, and bookmaker adapters should require specialist review. Admin-sensitive changes should require repository-administrator review in addition to path ownership.

When handles are approved, test the syntax with GitHub's CODEOWNERS documentation, ensure the file is on the default branch, protect the CODEOWNERS file itself, and verify that every named team has repository visibility and appropriate membership. Ownership supplements CI and review rules; it does not replace them.
