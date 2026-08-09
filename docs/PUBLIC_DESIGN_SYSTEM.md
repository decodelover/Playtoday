# PlayToday public design system

## Direction

The public site takes its cues from modern football platforms, stadium wayfinding, and the working sheets used to review a match. It is confident and analytical, but it does not imitate a sportsbook or a trading terminal.

The system rejects glass panels, generic blue-purple glow, fake product screenshots, decorative dashboards, and casino neon. Layouts use rounded architectural surfaces, proportionate type, open space, real imagery, and deliberate asymmetry.

## Colour

| Role          | Value     | Use                                                  |
| ------------- | --------- | ---------------------------------------------------- |
| Deep navy     | `#01002C` | Header, heroes, footer, and highest-contrast text    |
| Soft navy     | `#04193B` | Layered dark surfaces and status panels              |
| Ground blue   | `#082D4B` | Subtle depth within dark section backgrounds         |
| Action pink   | `#FF0F50` | Primary actions, numbered icons, and active emphasis |
| Pink hover    | `#DB003B` | Hover and text-link emphasis                         |
| Fresh mint    | `#4ED8A0` | Focus, orientation, and supporting highlights        |
| Soft lavender | `#E3E2FF` | Elevated light surfaces                              |
| Cloud         | `#F0F0F5` | Quiet section backgrounds                            |
| Slate         | `#4D4C68` | Secondary reading text                               |
| White         | `#FFFFFF` | Reading surfaces and text on navy                    |

Pink is reserved for action and attention. Mint supports orientation and focus. Neither implies a win, a positive model output, or live status.

## Typography

Geist Sans carries headlines and reading text. Geist Mono carries section numbers, compact labels, status metadata, and values that need stable character widths.

Display headings use tight tracking and a line height between `0.96` and `1.08`. Body copy uses a line height between `1.6` and `1.8` and stays near 65 characters per line where the layout allows. Headings use sentence case and scale proportionally rather than dominating the viewport.

The responsive display scale starts near `2.55rem` on small screens and tops out at `5.75rem` for public heroes. Section headings use `2.1rem` to `4.25rem`. Reading text remains close to `1rem`; compact labels use Geist Mono between `0.60rem` and `0.70rem` with deliberate tracking.

## Layout

The wide content boundary is `82rem`; standard editorial content is `76rem`; reading copy is capped near `50rem`. Desktop sections may use broken grids, unequal columns, and row-spanning blocks. Mobile layouts reduce to one reading column without horizontal overflow.

Rounded panels, split fields, and contained status blocks define real content boundaries. Supporting pages use `ContentGrid` for unequal editorial columns, `ContentPanel` for grouped facts, and `EmptyState` only when the named source is genuinely unavailable. Section changes use navy, white, cloud, lavender, and mint surfaces. Stadium imagery appears behind every public hero with a deep navy overlay for legibility.

Public layouts use `44rem` and `68rem` adaptation points. At the smaller boundary, grids become one reading column, hero actions become full-width, image crops move from approximately `16:7` to `4:3`, and the navigation sheet fills the viewport. Content gutters reduce from `1.5rem` to `1rem` without removing safe-area padding.

## Background and image system

| Asset                                       | Role                          | Treatment                                                   |
| ------------------------------------------- | ----------------------------- | ----------------------------------------------------------- |
| `/images/playtoday-hero-bg.png`             | Default public hero           | Full-bleed cover crop under a deep navy overlay             |
| `/images/playtoday-match-analysis-hero.png` | Analysis and identity heroes  | Full-bleed cover crop with a slightly lighter upper overlay |
| `/images/playtoday-evidence-review.png`     | Evidence-review section       | Editorial right-weighted crop in a rounded `16:7` frame     |
| `/images/playtoday-data-pipeline.png`       | Source-to-settlement workflow | Wide architectural crop showing six conceptual checkpoints  |
| `/images/playtoday-results-archive.png`     | Performance-record section    | Archive crop with explicit conceptual-image caption         |

Hero overlays move from roughly 70 to 76 percent navy at the top to 84 to 100 percent near the base. Section images use `object-fit: cover`, a `2rem` desktop radius, a quiet navy shadow, declared aspect ratios, responsive `sizes`, and descriptive alt text. Generated imagery contains no readable results, odds, club marks, provider logos, or implied production records.

## Interaction

- Every interactive target is at least `44px` high.
- Keyboard focus uses a visible pink outline on light surfaces and mint on navy, always with an offset.
- Primary buttons use a 50px pill silhouette, action pink, and clear hover and pressed states.
- Control transitions last `180ms` to `220ms`; section reveals last `420ms`. Both use ease-out timing and transform/opacity only.
- `ScrollReveal` uses `IntersectionObserver` with a `0.12` threshold and an `-8%` lower root margin. Content remains readable without JavaScript, and newly mounted route content is observed automatically.
- Reduced-motion preferences reveal content immediately, stop the marquee, remove image zoom, and collapse control transitions to effectively instant feedback.
- Internal navigation uses `next/link`.
- Mobile navigation uses a solid `#01002C` focus-managed sheet and a solid `#FF0F50` native hamburger button. It preserves Escape close, focus restoration, and 44px targets.

## Engineering-foundation carousel

The homepage includes a continuous technology-mark rail inspired by the reference site's logo strip. It names only technologies verified in the repository: Next.js, React, TypeScript, Tailwind CSS, pnpm, and Vitest. It is labelled “Engineering foundation”, not “Trusted by” or “Data partners”, because the project has no approved partner or customer record.

The visual track contains two identical groups so the CSS animation can loop without a seam. The second group is hidden from assistive technology. The `28s` animation pauses on hover or through a visible Pause/Resume control; reduced-motion mode removes the duplicate and control, stops movement, and allows horizontal scrolling.

## Public components

`MarketingContainer`, `MarketingSection`, `PageHero`, `SectionLead`, `FactList`, `NumberedList`, `StatusNotice`, `ContentGrid`, `ContentPanel`, `EmptyState`, `ActionLink`, `ActionButton`, `Prose`, and `LegalPageLayout` form the public page grammar. `ScrollReveal` supplies progressive enhancement without product logic. They live in `apps/web/src/app/public-shell`.

Forms use visible labels, restrained help text, a single-column mobile flow, and a two-column desktop identity row. Search results retain category labels and article counts so filtering never removes context. Error and success feedback is textual, uses `aria-live`, and does not rely on colour.

Homepage-specific composition and the pauseable `FoundationCarousel` stay in `apps/web/src/components/public/home`. Shared public navigation, reveal behavior, and footer code stay in `apps/web/src/app/public-shell`.

## Accessibility checks

- Maintain at least 4.5:1 contrast for reading text.
- Keep one `h1` per page and preserve heading order.
- Use the skip link and semantic `main`, `nav`, `section`, `article`, `aside`, and `footer` elements.
- Do not use colour as the only status signal.
- Keep visible labels on any future form field.
- Verify at 375px, 768px, 1024px, and 1440px.

The live preview is available at `/design-system` and is excluded from indexing.
