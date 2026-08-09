# Web environment boundary

PlayToday validates configuration through this directory instead of reading
`process.env` throughout application features.

- `schema.ts` defines the public, server-only, and combined runtime contracts and
  produces errors containing variable names—not values.
- `server.ts` uses the `server-only` boundary and exports only explicitly approved
  validated fields.
- `client.ts` references only the two approved `NEXT_PUBLIC_` variables explicitly so
  Next.js can safely substitute them in browser bundles.
- `test-utils.ts` provides deterministic, non-secret fixtures. It does not bypass
  validation.

Every `NEXT_PUBLIC_` variable is public. Never store a credential, token, private URL,
or secret in one. Direct `process.env` access should remain limited to `server.ts`,
`client.ts`, unavoidable build tooling, and tests specifically exercising environment
behavior.

To add a variable:

1. Classify it as public or server-only.
2. Add it to the correct Zod schema and explicit runtime module input/output.
3. Add a clearly non-secret entry to the root `.env.example` when developers need it.
4. Extend schema, error-redaction, template, and boundary tests.
5. Run `pnpm env:example:check`, `pnpm env:check:test`, and `pnpm quality`.

Future service credentials must wait for their authorized roadmap phases and must be
stored in approved secret storage or ignored local files, never committed templates.
