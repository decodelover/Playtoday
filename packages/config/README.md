# `@playtoday/config`

This private workspace owns reusable code-quality configuration for PlayToday.

## Exports

- `@playtoday/config/eslint/base` — strict TypeScript and secret-like-value checks.
- `@playtoday/config/eslint/react` — base rules plus React and Hooks correctness.
- `@playtoday/config/eslint/next` — base rules plus supported Next.js rules.
- `@playtoday/config/typescript/base.json` — strict modern TypeScript defaults.
- `@playtoday/config/typescript/node-library.json` — declaration-emitting libraries.
- `@playtoday/config/typescript/react-library.json` — React component libraries.
- `@playtoday/config/typescript/nextjs.json` — Next.js App Router applications.

Each workspace keeps a small local config that selects the correct preset. This
prevents Next.js rules from leaking into unrelated libraries. Changes here must pass
`pnpm quality` from the repository root.

Coverage starts at a reasonable 80% threshold for the tested foundation modules and
will rise as substantive modules are introduced. Configuration files, generated
files, declarations, build output, and fixtures are not counted as product coverage.
