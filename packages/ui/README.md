# `@playtoday/ui`

The shared visual and interaction source of truth for PlayToday. Phase 2B expands the Phase 2A tokens into feature-independent actions, forms, feedback, layout, overlays, navigation, semantic data display, and analytical presentation.

Import `@playtoday/ui/styles.css` once at the application root. Import primitives and typed token references from `@playtoday/ui`.

Import stable APIs from `@playtoday/ui`; do not deep-import source paths. Component exports, source tests, and the `/design-system` route are the current API and presentation references.

Feature code must not add raw colors, arbitrary typography, a second icon system, or parallel status definitions. Public pages follow `docs/PUBLIC_DESIGN_SYSTEM.md`; their navy-led palette, image treatments, scroll-reveal behavior, engineering-foundation rail, and opaque mobile navigation stay scoped to the public shell and do not enter this shared application package.
