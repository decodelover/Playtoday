# Sports ingestion scheduler

## Current schedule

The approved scheduler is the Vercel Cron route at `/api/cron/sports-sync`. `apps/web/vercel.json` requests one daily run at 00:15 UTC. The route checks Vercel's bearer `CRON_SECRET` before it starts the existing ingestion worker.

The daily job uses two API-Football requests: one subscription health request and one date-scoped fixture request. A run processes at most 60 fixtures and refuses to proceed without the configured request budget. This fits the observed API-Football Free allowance of 100 requests per day and Vercel Hobby's daily cron limit.

## Deployment status

The scheduler is active in the production deployment. Vercel accepted the daily cron configuration, all required production variables are configured, and deployment `dpl_54LNaL2iuaY9TgP7LxSBkvqVAFmg` is Ready behind `https://playtoday-two.vercel.app`.

The exact protected production route was manually exercised after deployment. Hosted run `21c620d4-ab56-4deb-9641-79a60b0696a1` completed with 389 fixtures fetched, 60 updated, and zero failures. The route rejects requests without the bearer secret with HTTP 401. Vercel production error logs were empty after the health, authentication, dashboard, and ingestion checks.

## Future live updates

API-Football live data uses polling. Minute-level polling is not enabled on the current free-tier schedule. A future paid quota and runtime decision may add a separate live polling cadence, but it must continue writing canonical Supabase records before clients receive updates.

## Overlap and recovery

Every attempt creates a `sports_ingestion_runs` row. Failures are sanitized and persisted. Idempotent provider mappings make a repeated date sync safe, but a distributed execution lock remains a production-hardening item before any higher-frequency schedule is introduced.
