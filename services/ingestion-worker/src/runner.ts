import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@playtoday/database-types";
import {
  ApiFootballAdapter,
  SportsIngestionPersistence,
  SportsProviderHttpClient,
  rawFixtureDtoSchema,
} from "@playtoday/sports-domain";
import { loadSportsWorkerEnvironment, type SportsWorkerEnvironment } from "./config";

const CANONICAL_TABLES = [
  "competitions",
  "seasons",
  "teams",
  "venues",
  "fixtures",
  "provider_entity_mappings",
] as const;

export interface SportsSyncOptions {
  date?: string;
  live?: boolean;
  healthOnly?: boolean;
}

export interface SportsSyncResult {
  ok: boolean;
  provider: string;
  scope: { date: string | null; live: boolean; healthOnly: boolean };
  providerRequests: number;
  quota: { used: number; limit: number; remaining: number };
  received: {
    competitions: number;
    seasons: number;
    teams: number;
    fixtures: number;
  };
  persisted: Record<(typeof CANONICAL_TABLES)[number], number>;
  processedFixtures: number;
  inserted: Record<(typeof CANONICAL_TABLES)[number], number>;
  updatedFixtures: number;
  rejected: number;
  runId: string | null;
}

function createAdminClient(environment: SportsWorkerEnvironment) {
  return createClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  );
}

function sanitizeError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Unknown ingestion error";
  return message.replace(/[A-Za-z0-9._-]{20,}/gu, "[redacted]").slice(0, 500);
}

async function readCounts(
  supabase: SupabaseClient<Database>,
): Promise<Record<(typeof CANONICAL_TABLES)[number], number>> {
  const output = Object.fromEntries(
    CANONICAL_TABLES.map((table) => [table, 0]),
  ) as Record<(typeof CANONICAL_TABLES)[number], number>;
  for (const table of CANONICAL_TABLES) {
    const result = await supabase
      .from(table)
      .select("id", { count: "exact", head: true });
    if (result.error) {
      throw new Error(`Could not count ${table}: ${result.error.message}`);
    }
    output[table] = result.count ?? 0;
  }
  return output;
}

export async function runSportsSync(
  options: SportsSyncOptions = {},
  environment = loadSportsWorkerEnvironment(),
): Promise<SportsSyncResult> {
  const supabase = createAdminClient(environment);
  const persistence = new SportsIngestionPersistence(supabase);
  const adapter = new ApiFootballAdapter(
    new SportsProviderHttpClient({
      baseUrl: environment.SPORTS_PROVIDER_BASE_URL,
      apiKey: environment.SPORTS_PROVIDER_API_KEY,
      timeoutMs: 10_000,
      maxRetries: 3,
    }),
  );

  const targetDate = options.live
    ? null
    : (options.date ?? new Date().toISOString().slice(0, 10));
  const jobType = options.healthOnly
    ? "provider_health"
    : options.live
      ? "live_fixtures"
      : "daily_fixtures";
  const run = await supabase
    .from("sports_ingestion_runs")
    .insert({ provider: environment.SPORTS_PROVIDER, job_type: jobType })
    .select("id")
    .single();
  if (run.error || !run.data) {
    throw new Error(
      `Could not start ingestion run: ${run.error?.message ?? "Unknown error"}`,
    );
  }

  const runId = run.data.id;
  let providerRequests = 0;
  try {
    const health = await adapter.getHealthStatus();
    providerRequests += 1;
    if (!health.healthy) {
      throw new Error("API-Football subscription is not active");
    }
    if (
      !options.healthOnly &&
      (environment.SPORTS_SYNC_MAX_REQUESTS < 2 || health.requestsRemaining < 1)
    ) {
      throw new Error("API-Football request budget is exhausted");
    }

    if (options.healthOnly) {
      await persistence.updateProviderHealth(environment.SPORTS_PROVIDER, "healthy");
      await supabase
        .from("sports_ingestion_runs")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", runId);
      const emptyCounts = Object.fromEntries(
        CANONICAL_TABLES.map((table) => [table, 0]),
      ) as Record<(typeof CANONICAL_TABLES)[number], number>;
      return {
        ok: true,
        provider: environment.SPORTS_PROVIDER,
        scope: { date: null, live: false, healthOnly: true },
        providerRequests,
        quota: {
          used: health.requestsUsed,
          limit: health.requestsLimit,
          remaining: health.requestsRemaining,
        },
        received: { competitions: 0, seasons: 0, teams: 0, fixtures: 0 },
        persisted: emptyCounts,
        processedFixtures: 0,
        inserted: emptyCounts,
        updatedFixtures: 0,
        rejected: 0,
        runId,
      };
    }

    const before = await readCounts(supabase);
    const rawFixtures = options.live
      ? await adapter.getLiveFixtures()
      : await adapter.getFixtures({ date: targetDate ?? undefined });
    providerRequests += 1;

    const fixtures = [];
    let rejected = 0;
    for (const rawFixture of rawFixtures.slice(
      0,
      environment.SPORTS_SYNC_MAX_FIXTURES,
    )) {
      const validated = rawFixtureDtoSchema.safeParse(rawFixture);
      if (validated.success) {
        fixtures.push(validated.data);
      } else {
        rejected += 1;
      }
    }

    let persistedFixtures = 0;
    let updatedFixtures = 0;
    const competitionGroups = new Map<string, typeof fixtures>();
    for (const fixture of fixtures) {
      const key = String(fixture.competitionId);
      const group = competitionGroups.get(key) ?? [];
      group.push(fixture);
      competitionGroups.set(key, group);
    }
    const groups = [...competitionGroups.values()];
    const concurrency = 12;
    for (let index = 0; index < groups.length; index += concurrency) {
      const batch = groups.slice(index, index + concurrency);
      const batchResults = await Promise.all(
        batch.map(async (group) => {
          let groupPersisted = 0;
          let groupUpdated = 0;
          let groupRejected = 0;
          for (const fixture of group) {
            try {
              const persisted = await persistence.upsertRawFixture(fixture, {
                provider: environment.SPORTS_PROVIDER,
              });
              groupPersisted += 1;
              if (!persisted.created) {
                groupUpdated += 1;
              }
            } catch {
              groupRejected += 1;
            }
          }
          return { groupPersisted, groupUpdated, groupRejected };
        }),
      );
      for (const result of batchResults) {
        persistedFixtures += result.groupPersisted;
        updatedFixtures += result.groupUpdated;
        rejected += result.groupRejected;
      }
    }

    const after = await readCounts(supabase);
    const inserted = Object.fromEntries(
      CANONICAL_TABLES.map((table) => [
        table,
        Math.max(0, after[table] - before[table]),
      ]),
    ) as Record<(typeof CANONICAL_TABLES)[number], number>;
    const uniqueCompetitions = new Set(
      fixtures.map((fixture) => String(fixture.competitionId)),
    );
    const uniqueSeasons = new Set(
      fixtures
        .filter((fixture) => fixture.seasonYear !== undefined)
        .map((fixture) => `${fixture.competitionId}:${fixture.seasonYear}`),
    );
    const uniqueTeams = new Set(
      fixtures.flatMap((fixture) => [
        String(fixture.homeTeamId),
        String(fixture.awayTeamId),
      ]),
    );

    const status = rejected > 0 ? "partial" : "completed";
    await supabase
      .from("sports_ingestion_runs")
      .update({
        status,
        completed_at: new Date().toISOString(),
        fetched_count: rawFixtures.length,
        created_count: inserted.fixtures,
        updated_count: updatedFixtures,
        failed_count: rejected,
        error_summary:
          rejected > 0 ? `${rejected} fixture records were rejected` : null,
      })
      .eq("id", runId);
    await persistence.updateProviderHealth(
      environment.SPORTS_PROVIDER,
      rejected > 0 ? "degraded" : "healthy",
      rejected > 0 ? `${rejected} fixture records were rejected` : undefined,
    );

    return {
      ok: rejected === 0,
      provider: environment.SPORTS_PROVIDER,
      scope: { date: targetDate, live: options.live ?? false, healthOnly: false },
      providerRequests,
      quota: {
        used: health.requestsUsed,
        limit: health.requestsLimit,
        remaining: health.requestsRemaining,
      },
      received: {
        competitions: uniqueCompetitions.size,
        seasons: uniqueSeasons.size,
        teams: uniqueTeams.size,
        fixtures: rawFixtures.length,
      },
      persisted: after,
      processedFixtures: persistedFixtures,
      inserted,
      updatedFixtures,
      rejected,
      runId,
    };
  } catch (error) {
    const summary = sanitizeError(error);
    await supabase
      .from("sports_ingestion_runs")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        failed_count: 1,
        error_summary: summary,
      })
      .eq("id", runId);
    await persistence.updateProviderHealth(
      environment.SPORTS_PROVIDER,
      "failing",
      summary,
    );
    throw new Error(summary);
  }
}
