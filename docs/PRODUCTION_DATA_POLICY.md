# PlayToday production data policy

Production data must represent real users and real product activity. Migrations, tests, and deployments must not add fake customers, preferences, contact submissions, predictions, or settlements.

Database tests use isolated fixtures inside transactions that always roll back. Local Auth users in pgTAP use reserved invalid email domains and never reach a hosted project.

All user-owned data requires authenticated ownership and RLS. Public data requires a reviewed read model that excludes private and unpublished fields. Service-role access is an exception with a documented server-only purpose.

Raw database errors, credentials, contact contents, and unrestricted personal data must not enter user responses or operational logs.
