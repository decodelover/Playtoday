# PlayToday service-role usage

## Approved usage

| File                                                        | Purpose                                        | Why the member client is not used                                                               | Data                             | Boundary                                                 |
| ----------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------- |
| `apps/web/src/lib/supabase/contact-client.ts`               | Creates a non-persistent Supabase admin client | Contact visitors may be anonymous, while the table intentionally has no anonymous insert policy | New contact enquiry fields only  | `server-only`, no session persistence, no browser import |
| `apps/web/src/components/public/contact/persist-contact.ts` | Inserts the validated enquiry                  | Calls the approved contact client and never returns database details                            | One contact submission           | Server action call path only                             |
| `packages/sports-domain/src/persistence.ts`                 | Upserts canonical sports entities and mappings | Sports ingestion writes are system-managed and restricted from member roles                     | Canonical sports data & mappings | `server-only`, ingestion runner execution only           |

The service role has only an explicit `INSERT` grant on `contact_submissions` in application migrations. It has no explicit contact read grant. Supabase service roles can bypass RLS, so every new call site requires a security review even when table grants appear narrow.

## Prohibited usage

Normal profile, onboarding, preference, notification, and Settings operations must use the authenticated member context plus RLS. The service-role key must never use a `NEXT_PUBLIC_` prefix, enter rendered output, be logged, or appear in a Client Component.

## Current audit result

No other application service-role call site exists. `.env.local` is ignored and untracked. The repository scan found no credential-shaped tracked value and no historical `.env` or `.env.local` file.
