# PlayToday ingestion worker

This service runs the real API-Football to Supabase ingestion path. The executable runtime is Node.js so it can compose the existing TypeScript provider adapter and persistence package without duplicating provider logic.

From the repository root, run a bounded sync for the current UTC date:

```sh
pnpm sports:sync
```

Run a specific provider date or a health-only check:

```sh
pnpm sports:sync -- --date 2026-08-14
pnpm sports:sync -- --health-only
```

Run the bounded pre-match odds job:

```sh
pnpm odds:sync
pnpm odds:sync -- --date 2026-08-14
```

The odds job reuses exact API-Football fixture IDs, reconciles missing fixtures
through the canonical Phase 4B persistence path, and writes validated observations
through a service-only transactional batch RPC. Unknown bookmakers, markets, and
selection shapes are counted and skipped rather than inferred.

The command reads server-only values from `.env.local` during local development. It prints sanitized counts and never prints credentials. Production runs through the protected Vercel route configured in `apps/web/vercel.json`.

The small Python module remains only for repository-wide Python identity and packaging checks. It does not implement provider or database logic. See
`docs/PHASE_4C_ODDS_AND_MARKETS.md` for mappings, security, scheduling, and incident
handling.
