# PlayToday design context

## Product and stack

- Product: pre-launch football intelligence and decision support
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS 4
- Type: Geist Sans and Geist Mono
- Accessibility: keyboard first, 44px targets, visible focus, reduced motion

## Public system

Public pages use a refined football-platform visual language. The core palette is deep navy `#01002C`, soft navy `#04193B`, ground blue `#082D4B`, action pink `#FF0F50`, pink hover `#DB003B`, fresh mint `#4ED8A0`, soft lavender `#E3E2FF`, cloud `#F0F0F5`, slate `#4D4C68`, and white `#FFFFFF`. Composition uses proportionate tight headlines, image-backed heroes, numbered sections, unequal grids, rounded panels, and clear status bands.

Heroes and key homepage sections use responsive football imagery with navy overlays, declared aspect ratios, cover crops, descriptive alt text, and conceptual-image captions. Scroll reveals use opacity and transform for `420ms`, run once through `IntersectionObserver`, and disappear under reduced motion. The homepage technology carousel loops for `28s`, contains one accessible group plus an `aria-hidden` visual duplicate, provides Pause/Resume, and becomes static and horizontally scrollable under reduced motion.

At `44rem`, layouts collapse to one reading column, section images move to `4:3`, actions become full-width, and the solid navy mobile sheet fills the viewport. The hamburger button remains solid action pink and at least 44px in both dimensions.

Avoid glass, generic blue-purple AI glow, casino neon, equal card towers, product mockups, and decorative dashboards. No public fixture, odds, probability, result, price, plan, person, or performance number appears without an approved source.

Read `docs/PUBLIC_DESIGN_SYSTEM.md`, `docs/PUBLIC_CONTENT_AND_DATA.md`, and `design-system/playtoday/MASTER.md` before changing a public page.

## Authenticated application system

The authenticated shell and shared `@playtoday/ui` package retain their semantic application tokens and status vocabulary. Do not apply public raw colours to shared components. Public composition stays inside `apps/web/src/app/public-shell` and `apps/web/src/components/public`.
