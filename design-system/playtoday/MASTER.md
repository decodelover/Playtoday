# PlayToday master design direction

## Product frame

PlayToday is a pre-launch football-intelligence product. The public site must explain evidence, uncertainty, target construction, and complete result tracking without resembling a bookmaker or claiming operational data.

## Visual character

Use a refined football-platform composition: deep navy fields, white and lavender reading surfaces, tight display type, compact mono labels, pink action, and mint orientation. Layouts are asymmetric, content led, image aware, and built from generously rounded architectural surfaces rather than generic SaaS cards.

## Tokens

```css
--public-navy: #01002c;
--public-navy-soft: #04193b;
--public-blue: #082d4b;
--public-pink: #ff0f50;
--public-pink-hover: #db003b;
--public-mint: #4ed8a0;
--public-lavender: #e3e2ff;
--public-cloud: #f0f0f5;
--public-slate: #4d4c68;
--public-white: #ffffff;
```

Geist Sans is the public reading and display face. Geist Mono is reserved for numbers, section markers, status labels, and compact metadata.

Hero type scales from approximately `2.55rem` on small phones to a maximum of `5.75rem`. Section headings cap at `4.25rem`; body copy remains near `1rem` with `1.6` to `1.8` line height. Compact mono labels remain secondary and never replace readable body text.

## Composition

- Maximum public width: `82rem`.
- Standard editorial width: `76rem`.
- Reading width: `50rem`.
- Display line height: `0.96` to `1.08`.
- Body line height: `1.6` to `1.8`.
- Interaction transition: `180ms` to `220ms ease-out`.
- Scroll-reveal transition: `500ms` to `760ms` with `cubic-bezier(0.16, 1, 0.3, 1)`.
- Minimum touch target: `44px`.
- Primary responsive boundaries: `44rem` and `68rem`.

Prefer editorial rows, split fields, numbered lists, status bands, image-backed heroes, purposeful rounded panels, honest empty states, and clearly labelled forms. Supporting-page grids may be equal only when the content has equal weight. Avoid equal card towers used for decoration, glass panels, floating mockups, generic blue-purple glow, and decorative dashboards.

## Backgrounds and assets

Every public hero uses a real football image beneath a deep navy legibility overlay. The default goal-view image and the match-analysis tunnel image are supplemented by three section assets: evidence review, a six-stage data pipeline, and a permanent results archive. Section imagery uses responsive Next.js images, declared aspect ratios, cover crops, rounded framing, and factual conceptual-image captions.

No generated asset may contain readable odds, scores, claims, club marks, provider logos, or synthetic performance records. The image palette remains deep navy with restrained pink, mint, lavender, and stadium-white light.

## Motion and continuous rails

Public sections reveal once with opacity and a short upward transform when they enter the viewport. Heroes sequence their copy and evidence rail. Lists, panels, and factual grids use a capped `55ms` stagger, while editorial images uncover through a restrained mask. The observer threshold is `0.12` with an `-8%` lower root margin. Motion must not gate content and must respond to route-mounted DOM changes.

The desktop header is a single-line, inset navy navigation surface from `60rem` upward. A viewport sentinel deepens the surface and raises its shadow after the page leaves the top, without a continuous scroll handler. Smaller screens use a solid text-labelled Menu control and an opaque focus-managed sheet. Reduced-motion mode removes the header entrance and all scroll-triggered transitions.

The homepage engineering-foundation rail loops for `28s` using duplicated visual groups. The duplicate is `aria-hidden`; a visible control can pause or resume the track. Reduced-motion mode stops animation, hides that redundant control, and exposes one horizontally scrollable group. Technology names are factual repository dependencies, never customer or partner claims.

The mobile menu trigger is a visible native button labelled `Menu` on solid action pink. The mobile sheet is a fully opaque deep navy surface.

## Data rule

No fixture, odds, probability, result, price, plan, person, testimonial, partnership, or performance number may appear without a real approved source. When no live source exists, state that clearly and show no record.

Contact submissions are the only Phase 2F public write model. Success means a confirmed Supabase insert. Help search is limited to the committed article catalogue. Performance remains empty until a verified database read model exists.

## Content rule

Write plain, specific sentences. Use sentence-case headings. Do not use em dashes or en dashes. Do not add a fact to make copy sound more convincing. Avoid slogans that substitute for meaning, promotional filler, AI vocabulary, forced lists of three, and generic conclusions.

## Accessibility

Maintain 4.5:1 text contrast, visible keyboard focus, semantic landmarks, one `h1` per page, logical heading order, non-colour status cues, reduced-motion support, and responsive behavior at 375px, 768px, 1024px, and 1440px.

Page-specific rules may extend this file under `pages/` but cannot weaken its data, content, or accessibility boundaries.
