# Security Policy

## Supported versions

PlayToday is in foundation development and has no production release. Security fixes apply to the current default branch; no older release line is supported yet.

## Responsible disclosure

Do not report vulnerabilities or credentials in a public issue. Use the repository's private GitHub security-advisory channel or another private contact mechanism explicitly approved by the repository owner. Because no remote or security address is configured, this repository does not invent one.

Report suspected authorization flaws, injection, data exposure, dependency compromise, secret exposure, unsafe workflow behavior, privacy failures, and integrity defects privately. Include a concise impact description, affected paths/version, safe reproduction steps, and redacted evidence. Do not include passwords, API keys, access tokens, bookmaker login credentials, payment-card data, identity documents, unnecessary personal data, or destructive proof-of-concept activity.

Maintainers should acknowledge receipt when practical, investigate privately, preserve evidence, contain exposure, and communicate remediation based on verified risk. This policy promises neither a fixed response time nor a bug bounty, legal safe harbour, or reward.

## Sensitive-data boundaries

- Revoke and rotate an exposed secret immediately; remove it from active use and investigate history and logs. Deleting a file alone is not remediation.
- PlayToday must never collect or store bookmaker credentials.
- Full payment-card data must never enter issues, logs, source, or application storage; future payment handling requires an approved processor boundary.
- Personal and user data must be minimized, access-controlled, redacted from diagnostics, and handled under approved retention and incident procedures.

Public issues may discuss a sanitized symptom only after maintainers confirm that doing so cannot disclose a vulnerability, credential, or affected-user information.
