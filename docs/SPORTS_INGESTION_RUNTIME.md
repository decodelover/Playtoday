# Sports ingestion runtime

## Runtime decision

The ingestion worker runs in Node.js. This keeps provider requests, validation, normalization, and persistence on the existing `@playtoday/sports-domain` path. It does not duplicate the API-Football adapter in Python.

Local development uses `services/ingestion-worker/src/cli.ts`. Production uses the protected Next.js route at `/api/cron/sports-sync` on the existing Vercel project. Supabase remains the hosted database.

## Environment variables

The worker requires these names:

- `SPORTS_PROVIDER`
- `SPORTS_PROVIDER_API_KEY`
- `SPORTS_PROVIDER_BASE_URL`
- `SPORTS_SYNC_MAX_REQUESTS`
- `SPORTS_SYNC_MAX_FIXTURES`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` for the Vercel route

The provider key, service-role key, and cron secret are server-only. None may use a `NEXT_PUBLIC_` prefix.

## Manual synchronization

Run the current UTC date with the local server environment:

```sh
pnpm sports:sync
```

Run a specific date or provider health check:

```sh
pnpm sports:sync -- --date 2026-08-14
pnpm sports:sync -- --health-only
```

The command reports sanitized counts. It never prints credentials or raw provider account data.

## Scheduler

`apps/web/vercel.json` schedules `/api/cron/sports-sync` once per day at 00:15 UTC. The route requires Vercel's `Authorization: Bearer <CRON_SECRET>` header. This daily cadence works on Vercel Hobby and stays within the API-Football Free plan's 100-request daily limit. Each scheduled run is capped at four provider requests and 60 processed fixtures.

More frequent live polling is not enabled on the Free plan. A one-minute polling schedule would exceed the verified quota and may also require a paid Vercel plan.

## Production status

Production ingestion is operational on `https://playtoday-two.vercel.app`. Every required variable is configured for the Vercel production environment; provider, service-role, and cron credentials are stored as sensitive server-only values. The cron-bearing deployment `dpl_54LNaL2iuaY9TgP7LxSBkvqVAFmg` is Ready and serves the public production alias.

The protected production route was invoked on 2026-08-14 and created completed hosted run `21c620d4-ab56-4deb-9641-79a60b0696a1`. It fetched 389 provider fixtures, processed the bounded 60-fixture scope, updated 60 canonical fixtures, and recorded zero failures. An unauthenticated request to the same route returned 401.

## Security

The service-role client is non-persistent and exists only inside the worker. Authenticated and anonymous browser roles cannot mutate canonical sports tables or read ingestion metadata. Provider errors are sanitized before storage and HTTP responses.
