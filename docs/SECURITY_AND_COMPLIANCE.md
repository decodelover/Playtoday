# Security and Compliance Baseline

> This document defines product and engineering requirements. It is not legal advice. Qualified counsel must review gambling-related classification, consumer protection, privacy, payments, marketing, and geographic availability before launch.

## Security principles

- Deny by default and grant least privilege.
- Treat the browser, external providers, webhook senders, and model outputs as untrusted.
- Use defense in depth: authentication, authorization, RLS, validation, rate limiting, monitoring, and auditable operations.
- Minimize collection, retention, exposure, and replication of personal data.
- Keep published prediction, ticket, settlement, and correction history traceable and tamper-evident.
- Separate public, user, support, administrative, and service capabilities.
- Design scheduled and event-driven operations to be idempotent and recoverable.

## Authentication

- Supabase Auth is the planned identity system for the MVP.
- Require verified contact information before sensitive account operations.
- Use secure, short-lived sessions, supported refresh-token rotation, and secure cookie practices appropriate to the final architecture.
- Protect sign-up, sign-in, password reset, verification, and recovery with rate limits and anti-automation controls.
- Require recent reauthentication for password, identity, data-export, deletion, and security-setting changes.
- Require phishing-resistant or TOTP-based two-factor authentication for administrators before production access; recovery must be controlled and audited.
- Do not disclose whether an account exists through recovery and authentication responses.

## Authorisation

- Enforce authorization server-side on every request and database operation.
- Use server-controlled role assignments stored outside user-editable metadata. `user_metadata` or equivalent client-editable fields must never confer administrator access.
- Define explicit roles such as user, support, analyst/publisher, settlement reviewer, administrator, and service identity. Separate publication, correction, subscription support, and security administration where practical.
- Service-role credentials may exist only in protected server or worker environments and must never reach frontend code.
- Test vertical and horizontal privilege boundaries, including access to another user’s tickets, notifications, exports, disputes, or rollover cycles.

## Row Level Security

- Enable RLS on every table exposed through Supabase APIs, including join and storage metadata tables where applicable.
- Commit policies through reviewed migrations and test allowed and denied paths using realistic identities.
- Users may access only their own private artifacts unless a record is intentionally public.
- Public Daily Edge records must expose an explicit public projection, not unrestricted underlying operational rows.
- Administrative access must use narrow policies or server-only operations; disabling RLS is not a valid authorization strategy.

## Data protection

- Maintain a data inventory and classify identity, behavioral, subscription, security, support, and prediction data.
- Collect only fields needed for a declared purpose and document retention periods before production launch.
- Encrypt data in transit and rely on approved platform encryption at rest; use separate secret management for provider credentials.
- Never store bookmaker passwords, bookmaker sessions, complete payment-card data, or payment-provider secrets in user-accessible records.
- Redact secrets and unnecessary personal information from logs, traces, analytics, support exports, and error reports.
- Provide authenticated user data export and deletion workflows. Document legal or fraud-prevention retention exceptions.
- Establish processor agreements, data-transfer safeguards, and regional hosting decisions before collecting production personal data.

## Auditability

- Use append-only audit events for authentication security changes, role changes, publication, ticket locking, settlement, correction, dispute resolution, subscription overrides, exports, deletions, and configuration changes.
- An audit event records actor/service, action, subject, original and new references where safe, reason, timestamp, request/correlation identifier, and source context.
- Audit logs must be immutable to ordinary users and operators, access-controlled, monitored, and retained under a documented policy.
- Manual settlement corrections preserve the original settlement and record corrected result, reason, administrator, evidence, and timestamp.
- Clock synchronization, stable identifiers, and model/rule versions are required for meaningful reconstruction.

## Payment restrictions

- The platform may charge subscriptions only; it must not accept stakes, maintain wagering balances, or process betting deposits/withdrawals.
- Use a compliant payment provider’s hosted or tokenized flows. Do not store raw card details.
- Verify webhook signatures, enforce replay protection where available, process events idempotently, and retrieve authoritative event state when necessary.
- Subscription entitlements must be server-controlled. A client return URL is not evidence of payment.
- Refund, cancellation, tax, trial, chargeback, and failed-payment rules require product, finance, and legal approval.

## Bookmaker restrictions

- Do not store user bookmaker credentials or automate bookmaker login or bet placement.
- Do not scrape or reverse-engineer bookmakers without written authorization and formal review.
- Do not claim partnership, official codes, real-time availability, or official odds access that is not documented.
- Keep internal references, bookmaker-ready mappings, and official booking codes visually and semantically distinct.
- Follow [BOOKMAKER_INTEGRATION_POLICY.md](BOOKMAKER_INTEGRATION_POLICY.md).

## Responsible play

- Present the platform as probabilistic decision support, not a path to reliable income.
- Show risk disclosures near target-odds generation, rollover, historical performance, and bookmaker-ready outputs.
- Label high target odds as high risk and very high targets as extreme risk using approved thresholds.
- Never encourage chasing losses, increasing stakes after losses, martingale, urgency based on recovery, or borrowing to participate.
- Allow configurable notification quiet hours and promotional-notification opt-out.
- Keep simulation mode clearly non-monetary and prevent it from implying withdrawable winnings.
- Provide links to locally relevant support resources subject to geographic and legal review.

## Age restrictions

- Require explicit confirmation that the user meets the legally applicable minimum age before access to restricted features.
- Do not assume one global age threshold; determine and enforce jurisdictional requirements before launch.
- The service must not target, profile for acquisition, or knowingly serve minors.
- Age assurance and remediation methods require privacy-aware legal review.

## Cooling-off and self-exclusion

- Users must be able to start a time-bounded cooling-off period and an account-level self-exclusion period through a clear flow.
- Restrictions take effect promptly, survive normal sign-out/sign-in, and cannot be casually reversed.
- Define which analytical, marketing, subscription, and account functions remain available during restriction periods with legal review.
- Suppress promotional notifications during cooling-off/self-exclusion and audit state transitions without exposing them unnecessarily.
- Administrators cannot silently remove an active restriction; exceptional remediation requires controlled review and an audit record.

## Geographic restrictions

- Availability, marketing, pricing, content, and bookmaker mappings must be configurable by jurisdiction.
- Before launch in a region, document whether the service is classified as regulated gambling, an affiliate, advertising, tipping, or information service.
- Geolocation and sanctions controls must be proportionate, disclosed, and reviewed. Location signals must not be presented as infallible.
- Block or limit features when licensing, provider rights, bookmaker terms, payment rules, sanctions, or consumer-protection requirements are unresolved.

## Incident management

- Define security severity levels, on-call ownership, containment, evidence preservation, notification, recovery, and post-incident review.
- Maintain runbooks for credential exposure, account takeover, authorization failure, fraudulent payment events, provider-data corruption, incorrect mass settlement, and accidental publication.
- Preserve logs and affected model/data/rule versions; pause publication or settlement when integrity is uncertain.
- Rotate compromised secrets, assess user impact, meet applicable notification deadlines, and record remediation.
- Test incident and disaster-recovery procedures before production and at a recurring cadence.

## Professional legal review required

At minimum, counsel and relevant specialists must review:

- product classification and licensing in each launch jurisdiction;
- age-gating, responsible-play, cooling-off, and self-exclusion obligations;
- privacy notices, lawful bases, cookies, analytics, profiling, automated decision-making, retention, deletion, and international transfers;
- terms of service, risk disclosures, acceptable use, marketing claims, testimonials, and historical-performance presentation;
- sports-data licenses, database rights, competition marks, team marks, and provider attribution;
- bookmaker names, deep links, affiliate relationships, terms, market mapping, and booking-code access;
- subscription payments, taxes, recurring billing, refunds, trials, chargebacks, and consumer cancellation rights;
- sanctions, geographic restrictions, accessibility, cybersecurity, incident reporting, and records retention.

No launch gate may mark these items approved solely because this document exists.
