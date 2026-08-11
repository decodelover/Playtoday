# PlayToday account settings architecture

## Routes and information architecture

Authenticated account management uses one canonical settings area:

- `/settings` provides the overview.
- `/settings/profile` manages display name and timezone and shows Auth identity.
- `/settings/preferences` edits the same sports, bookmaker, market, odds, strategy, and risk record used by onboarding.
- `/settings/notifications` edits supported delivery channels.
- `/settings/security` manages password and session scopes.
- `/settings/responsible-play` shows the stored acknowledgement and only enforceable controls.
- `/settings/privacy` inventories user data and provides the authenticated export.

The former `/notifications` route redirects to `/settings/notifications`. Subscription remains separate because no billing model exists. The compact settings navigation is nested inside the existing application shell and becomes horizontally scrollable at narrow widths rather than compressing a desktop sidebar.

## Data ownership and Supabase integration

Identity comes from the verified Supabase Auth user. Profile data comes from `public.profiles`; preferences come from `public.user_preferences`. A single server-only loader retrieves each source once for a settings page. No settings-specific preference table, local-only shadow state, or Realtime subscription exists.

Server actions obtain the current user with `auth.getUser()`, validate input with the shared `@playtoday/validation` schemas, and update rows through the user's normal Supabase session. The browser never supplies an ownership ID. RLS remains the primary authorization boundary, and normal settings writes never use the service role.

## Validation and save strategy

Editable settings use explicit save actions. Display names, IANA timezones, canonical preference identifiers, odds, strategies, risk values, and notification JSON are checked before persistence. Successful writes revalidate the affected settings route. Errors shown to members are stable, safe messages; database codes remain server-side.

Onboarding and Settings import the same identifiers and schemas. Both persist to `public.user_preferences`, so a setting saved in either experience is the next value read everywhere.

## Accessibility and responsive behavior

Forms use associated labels, native controls, status announcements, password autocomplete values, visible focus, keyboard operation, and controls sized for touch. Errors do not rely on color alone. Reduced-motion and forced-color modes are supported. Long identities wrap, form grids collapse to one column, and the subnavigation remains usable from small mobile through wide displays.
