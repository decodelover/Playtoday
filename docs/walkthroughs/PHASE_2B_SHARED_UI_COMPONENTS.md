# Phase 2B Shared UI Components Walkthrough

> **Current-system note, 2026-08-09:** This historical walkthrough describes the shared application component library. Public marketing colors, image framing, section reveals, the engineering-foundation rail, and the opaque public mobile menu remain app-local and are specified in `docs/PUBLIC_DESIGN_SYSTEM.md`. They do not replace `@playtoday/ui` semantic application tokens.

## Original walkthrough plan

Before repository changes, the visible plan defined the Phase 2A assessment; a fifteen-step sequence covering the audit, architecture, dependencies, actions, forms, feedback, layout, overlays, navigation, data display, accessibility, tests, preview, documentation, and verification; component scope; accessibility strategy; feature-independent boundaries; risks; exclusions; deliverables; and pass conditions.

It committed to baseline checks before changes, token-only styling, server compatibility by default, small client boundaries, proven accessible primitives, behavioral tests, fictional preview content, permanent documentation, and no Phase 2C/product work.

## Repository state before changes

- Phase 1 and Phase 2A quality, CI, build, coverage, environment, and Python checks passed.
- `@playtoday/ui` contained nine Phase 2A primitives, typed tokens, dark/light themes, and 14 tests.
- `/design-system` was a static visual-language preview.
- No Radix, class merger, UI framework, Storybook, or feature dependency existed.
- Existing uncommitted Phase 1/2A work was preserved.
- No dashboard, authentication, Supabase implementation, provider, prediction, settlement, bookmaker, payment, or external integration existed.

## Components implemented

- Actions: expanded Button, IconButton, ButtonGroup, LoadingButton.
- Forms: Label, Field, FieldInput, Textarea, SearchInput, Select family, Checkbox, RadioGroup/RadioItem, Switch.
- Feedback: Badge, Alert, Progress, Spinner, expanded StatusChip, Skeleton, EmptyState, ErrorState.
- Layout: expanded Card composition, SectionHeading, PageHeader, Separator, Stack, Container, Surface, VisuallyHidden.
- Overlays: Dialog, AlertDialog, Sheet, Popover, Tooltip, DropdownMenu families.
- Navigation: Tabs, SegmentedControl, Breadcrumb, Pagination families.
- Data: expanded DataValue, StatCard, DefinitionList, Table family, DataList, Avatar, Kbd.
- Analytical: RiskIndicator, ConfidenceIndicator, DataQualityIndicator, TrendIndicator.
- Utility: exported `cn()` replaced the transitional helper.

Toast, CommandPalette, and CopyField remain planned because their conditional scope was not justified.

## Dependencies changed

Added `radix-ui@1.6.7` for accessible complex behavior, `clsx@2.1.1` for conditional class composition, and `tailwind-merge@3.6.0` for Tailwind 4 conflict resolution. React DOM became an explicit peer for overlay portals.

Rejected: CVA, Lucide, React Hook Form, Zod, TanStack Table, toast libraries, full UI frameworks, and Storybook.

## Files created

- UI `lib`, categorized `components`, `components.css`, and five Phase 2B behavior test files.
- `apps/web/src/app/design-system/interactive-preview.tsx`.
- `docs/COMPONENT_LIBRARY.md`, `docs/COMPONENT_API_STATUS.md`, and this walkthrough.

## Files modified

- UI manifest, public index, Phase 2A primitives, style index, and tests.
- pnpm catalog and lockfile.
- `/design-system` page, styles, and tests.
- README, roadmap, changelog, decisions, development rules, design language/governance, UI README, and `.21st` context.

## Files deleted

- `packages/ui/src/primitives/class-names.ts`, superseded by `cn()`.

## Commands executed

Baseline and final records include frozen installation; environment checks; Prettier/Ruff; ESLint; TypeScript; Vitest; coverage; Pytest; UI/web builds; quality; CI; package/import/naming/scope scans; 21st context/search/review; and HTTP probes. Final results were 32 UI tests, 20 web tests, and 3 Python tests passing; UI coverage was 95.83% statements, 80.99% branches, 94.18% functions, and 95.83% lines; web coverage was 100% statements/functions/lines and 85.71% branches.

## Accessibility verification

Behavior tests cover names, labels, descriptions, errors, disabled/loading states, Select keyboard use, choices, menus, Tabs, Dialog focus entry/Escape/restoration, Sheet behavior, semantic Alert/Table markup, status text/markers, and explicit risk/confidence/data-quality wording. Styles provide focus, 44px controls, responsive overlays/overflow, reduced motion, and forced-colors fallbacks.

## Plan deviations

- The attachment had to be read before its embedded first-response rule was discoverable; no repository file changed before the detailed plan.
- 21st catalog search required authentication, so existing context and deterministic review were used.
- A registry multi-query timed out; exact current versions were verified from npm records before changes.
- The official `radix-ui` entry point was selected for coherent version governance; production tree-shaking is verified during build.
- Toast, CopyField, and CommandPalette remained planned because their conditional scope was not justified.
- The in-app browser runtime had no available browser instance, so deterministic interaction tests, production compilation, and HTTP route probes supplied the executable verification; live console and assistive-technology passes remain a warning.

## Remaining risks

- Interactive browser/assistive-technology coverage depends on available browser tooling.
- The Radix entry point increases installed packages; production bundle monitoring remains required.
- Storybook remains deferred until its maintenance cost is justified.

## Final decision

PHASE 2B PASSES — READY FOR PHASE 2C. Phase 2C has not started.
