# PlayToday authentication architecture

PlayToday uses Supabase Auth with cookie-based SSR clients. Browser, server, and proxy clients use the publishable key or legacy anonymous key. Server identity checks call `auth.getUser()` before protected work.

The request proxy refreshes session cookies and redirects guests away from authenticated routes. Server layouts repeat the identity and onboarding checks so client state is never the access-control source of truth.

An Auth user insert triggers one private database function that creates the profile. No signup application path inserts a second profile, and signup does not create preference or responsible-play acknowledgement rows.

The service-role key is not part of authentication or normal account updates. Administrative authorization is not implemented. Future privileged roles must use server-controlled authority, never user-editable metadata.
