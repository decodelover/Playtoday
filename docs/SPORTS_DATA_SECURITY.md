# Sports Data Security & Access Controls — PlayToday

## Security Rules

1. **Server-Only Credentials**:
   - `SPORTS_PROVIDER_API_KEY` and third-party secrets must never be exposed via `NEXT_PUBLIC_` or sent to the browser.
2. **Database Permissions & RLS**:
   - `authenticated` and `anon` user roles have read-only access (`SELECT`) to canonical domain tables (`sports`, `competitions`, `seasons`, `teams`, `venues`, `fixtures`, `v_public_fixtures`).
   - All `INSERT`, `UPDATE`, `DELETE` operations on sports tables are revoked from client roles. Writes are performed strictly by trusted server-side ingestion workers using `SUPABASE_SERVICE_ROLE_KEY`.
3. **Internal Audit Tables**:
   - `provider_entity_mappings`, `provider_payloads`, `sports_ingestion_runs`, and `sports_provider_health` are protected by service-role-only RLS policies.
