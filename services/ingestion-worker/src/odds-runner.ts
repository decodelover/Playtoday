import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@playtoday/database-types";
import {
  ApiFootballOddsAdapter,
  normalizeSelection,
  parseDecimalOdds,
  type ProviderOddsEvent,
} from "@playtoday/bookmaker-adapters";
import {
  ApiFootballAdapter,
  SportsIngestionPersistence,
  SportsProviderHttpClient,
} from "@playtoday/sports-domain";
import { loadSportsWorkerEnvironment, type SportsWorkerEnvironment } from "./config";

type AdminClient = SupabaseClient<Database>;
type MarketMapping = Database["public"]["Tables"]["provider_market_mappings"]["Row"];
type CurrentOddsRecord = Database["public"]["Tables"]["current_odds"]["Row"];

export interface OddsSyncOptions {
  date?: string;
}

export interface OddsSyncResult {
  ok: boolean;
  provider: string;
  date: string;
  runId: string;
  requestsUsed: number;
  requestsRemaining: number | null;
  eventsReceived: number;
  fixturesResolved: number;
  currentPricesCreated: number;
  currentPricesUpdated: number;
  unchangedPrices: number;
  snapshotsCreated: number;
  unresolvedEvents: number;
  unmappedBookmakers: number;
  unmappedMarkets: number;
  invalidPrices: number;
  failures: number;
}

function createAdminClient(environment: SportsWorkerEnvironment): AdminClient {
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
  const message = error instanceof Error ? error.message : "Unknown odds error";
  return message.replace(/[A-Za-z0-9._-]{20,}/gu, "[redacted]").slice(0, 500);
}

function oddsIdentity(
  fixtureId: string,
  bookmakerId: string,
  marketId: string,
  selectionKey: string,
  line: number | null,
  participant: string | null,
): string {
  return [
    fixtureId,
    bookmakerId,
    marketId,
    selectionKey,
    line ?? "",
    participant ?? "",
  ].join(":");
}

export function deriveOddsMarketStatus(
  status: string | undefined,
): "active" | "closed" | "unavailable" {
  if (["finished", "cancelled", "abandoned", "awarded"].includes(status ?? "")) {
    return "closed";
  }
  if (["postponed", "suspended"].includes(status ?? "")) {
    return "unavailable";
  }
  return "active";
}

async function markUnresolved(
  supabase: AdminClient,
  provider: string,
  providerEventId: string,
): Promise<void> {
  const existing = await supabase
    .from("unresolved_odds_events")
    .select("id,occurrence_count")
    .eq("provider", provider)
    .eq("provider_event_id", providerEventId)
    .maybeSingle();
  if (existing.error) {
    throw new Error(`Unresolved lookup failed: ${existing.error.message}`);
  }
  if (existing.data) {
    const update = await supabase
      .from("unresolved_odds_events")
      .update({
        occurrence_count: existing.data.occurrence_count + 1,
        reason: "missing_fixture_mapping",
        last_seen_at: new Date().toISOString(),
        resolved_at: null,
      })
      .eq("id", existing.data.id);
    if (update.error) {
      throw new Error(`Unresolved update failed: ${update.error.message}`);
    }
    return;
  }
  const insert = await supabase.from("unresolved_odds_events").insert({
    provider,
    provider_event_id: providerEventId,
    reason: "missing_fixture_mapping",
  });
  if (insert.error) {
    throw new Error(`Unresolved insert failed: ${insert.error.message}`);
  }
}

async function loadFixtureMappings(
  supabase: AdminClient,
  provider: string,
  eventIds: string[],
): Promise<Map<string, string>> {
  if (eventIds.length === 0) {
    return new Map();
  }
  const result = await supabase
    .from("provider_entity_mappings")
    .select("provider_entity_id,canonical_entity_id")
    .eq("provider", provider)
    .eq("entity_type", "fixture")
    .in("provider_entity_id", eventIds);
  if (result.error) {
    throw new Error(`Fixture mapping lookup failed: ${result.error.message}`);
  }
  return new Map(
    (result.data ?? []).map((row) => [row.provider_entity_id, row.canonical_entity_id]),
  );
}

async function updateHealth(
  supabase: AdminClient,
  provider: string,
  healthy: boolean,
  result: OddsSyncResult,
  error?: string,
): Promise<void> {
  const previous = await supabase
    .from("odds_provider_health")
    .select("consecutive_failures")
    .eq("provider", provider)
    .maybeSingle();
  const now = new Date().toISOString();
  const healthPayload: Database["public"]["Tables"]["odds_provider_health"]["Insert"] =
    {
      provider,
      status: healthy ? "healthy" : "degraded",
      consecutive_failures: healthy
        ? 0
        : (previous.data?.consecutive_failures ?? 0) + 1,
      requests_remaining: result.requestsRemaining,
      unmapped_bookmaker_count: result.unmappedBookmakers,
      unmapped_market_count: result.unmappedMarkets,
      unresolved_event_count: result.unresolvedEvents,
      last_error: error ?? null,
      updated_at: now,
    };
  if (healthy) {
    healthPayload.last_successful_sync_at = now;
  } else {
    healthPayload.last_failure_at = now;
  }
  const update = await supabase
    .from("odds_provider_health")
    .upsert(healthPayload, { onConflict: "provider" });
  if (update.error) {
    throw new Error(`Odds health update failed: ${update.error.message}`);
  }
}

export async function runOddsSync(
  options: OddsSyncOptions = {},
  environment = loadSportsWorkerEnvironment(),
): Promise<OddsSyncResult> {
  const provider = environment.SPORTS_PROVIDER;
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  const supabase = createAdminClient(environment);
  const httpClient = new SportsProviderHttpClient({
    baseUrl: environment.SPORTS_PROVIDER_BASE_URL,
    apiKey: environment.SPORTS_PROVIDER_API_KEY,
    timeoutMs: 10_000,
    maxRetries: 3,
  });
  const oddsAdapter = new ApiFootballOddsAdapter(httpClient);
  const sportsAdapter = new ApiFootballAdapter(httpClient);
  const sportsPersistence = new SportsIngestionPersistence(supabase);
  const started = await supabase
    .from("odds_ingestion_runs")
    .insert({ provider, job_type: "daily_pre_match", fixtures_requested: 0 })
    .select("id")
    .single();
  if (started.error || !started.data) {
    throw new Error(
      `Could not start odds run: ${started.error?.message ?? "Unknown error"}`,
    );
  }

  const result: OddsSyncResult = {
    ok: false,
    provider,
    date,
    runId: started.data.id,
    requestsUsed: 0,
    requestsRemaining: null,
    eventsReceived: 0,
    fixturesResolved: 0,
    currentPricesCreated: 0,
    currentPricesUpdated: 0,
    unchangedPrices: 0,
    snapshotsCreated: 0,
    unresolvedEvents: 0,
    unmappedBookmakers: 0,
    unmappedMarkets: 0,
    invalidPrices: 0,
    failures: 0,
  };

  try {
    const events: ProviderOddsEvent[] = [];
    let page = 1;
    let totalPages = 1;
    while (
      page <= totalPages &&
      page <= environment.ODDS_SYNC_MAX_PAGES &&
      result.requestsUsed < environment.ODDS_SYNC_MAX_REQUESTS - 1 &&
      events.length < environment.ODDS_SYNC_MAX_EVENTS
    ) {
      const response = await oddsAdapter.getPreMatchOdds({ date, page });
      result.requestsUsed += 1;
      result.requestsRemaining = response.requestsRemaining;
      totalPages = response.totalPages;
      events.push(...response.events);
      page += 1;
    }
    const boundedEvents = events.slice(0, environment.ODDS_SYNC_MAX_EVENTS);
    result.eventsReceived = boundedEvents.length;
    const eventIds = [...new Set(boundedEvents.map((event) => event.providerEventId))];
    let fixtureMappings = await loadFixtureMappings(supabase, provider, eventIds);

    const missingIds = new Set(
      eventIds.filter((eventId) => !fixtureMappings.has(eventId)),
    );
    if (
      missingIds.size > 0 &&
      result.requestsUsed < environment.ODDS_SYNC_MAX_REQUESTS
    ) {
      const rawFixtures = await sportsAdapter.getFixtures({ date });
      result.requestsUsed += 1;
      const fixtureGroups = new Map<string, typeof rawFixtures>();
      for (const fixture of rawFixtures.filter((candidate) =>
        missingIds.has(String(candidate.fixtureId)),
      )) {
        const key = String(fixture.competitionId);
        const group = fixtureGroups.get(key) ?? [];
        group.push(fixture);
        fixtureGroups.set(key, group);
      }
      const groups = [...fixtureGroups.values()];
      for (let index = 0; index < groups.length; index += 8) {
        const outcomes = await Promise.all(
          groups.slice(index, index + 8).map(async (group) => {
            let failures = 0;
            for (const fixture of group) {
              try {
                await sportsPersistence.upsertRawFixture(fixture, { provider });
              } catch {
                failures += 1;
              }
            }
            return failures;
          }),
        );
        for (const failures of outcomes) {
          result.failures += failures;
        }
      }
      fixtureMappings = await loadFixtureMappings(supabase, provider, eventIds);
    }
    result.fixturesResolved = fixtureMappings.size;

    const [bookmakers, markets, selections] = await Promise.all([
      supabase
        .from("provider_bookmaker_mappings")
        .select("provider_bookmaker_id,bookmaker_id")
        .eq("provider", provider)
        .eq("verified", true),
      supabase
        .from("provider_market_mappings")
        .select("provider_market_id,market_id,participant")
        .eq("provider", provider)
        .eq("market_scope", "pre_match")
        .eq("verified", true),
      supabase
        .from("provider_selection_mappings")
        .select("provider_market_id,provider_selection_key,canonical_selection_key")
        .eq("provider", provider)
        .eq("verified", true),
    ]);
    if (bookmakers.error || markets.error || selections.error) {
      throw new Error("Could not load verified odds mappings");
    }
    const bookmakerMap = new Map(
      (bookmakers.data ?? []).map((row) => [
        row.provider_bookmaker_id,
        row.bookmaker_id,
      ]),
    );
    const marketMap = new Map<string, MarketMapping>(
      (markets.data ?? []).map((row) => [row.provider_market_id, row as MarketMapping]),
    );
    const selectionMap = new Map(
      (selections.data ?? []).map((row) => [
        `${row.provider_market_id}:${row.provider_selection_key}`,
        row.canonical_selection_key,
      ]),
    );
    const [fixtureStatesResult, existingOddsResult] = await Promise.all([
      supabase
        .from("fixtures")
        .select("id,status")
        .in("id", [...fixtureMappings.values()]),
      supabase
        .from("current_odds")
        .select("*")
        .eq("provider", provider)
        .in("provider_event_id", eventIds),
    ]);
    if (fixtureStatesResult.error || existingOddsResult.error) {
      throw new Error("Could not load fixture or current odds state");
    }
    const fixtureStates = new Map(
      (fixtureStatesResult.data ?? []).map((fixture) => [fixture.id, fixture.status]),
    );
    const existingOdds = (existingOddsResult.data ??
      []) as unknown as CurrentOddsRecord[];
    const eventSourceTimes = new Map(
      boundedEvents.map((event) => [
        event.providerEventId,
        new Date(event.sourceUpdatedAt).toISOString(),
      ]),
    );

    let bookmakersReceived = 0;
    let marketsProcessed = 0;
    let selectionsProcessed = 0;
    const observations: Record<string, string | number | null>[] = [];
    for (const event of boundedEvents) {
      const fixtureId = fixtureMappings.get(event.providerEventId);
      if (!fixtureId) {
        result.unresolvedEvents += 1;
        await markUnresolved(supabase, provider, event.providerEventId);
        continue;
      }
      const resolved = await supabase
        .from("unresolved_odds_events")
        .update({
          resolved_at: new Date().toISOString(),
          canonical_fixture_id: fixtureId,
        })
        .eq("provider", provider)
        .eq("provider_event_id", event.providerEventId)
        .is("resolved_at", null);
      if (resolved.error) {
        throw new Error(`Unresolved resolution failed: ${resolved.error.message}`);
      }

      for (const bookmaker of event.bookmakers) {
        bookmakersReceived += 1;
        const bookmakerId = bookmakerMap.get(bookmaker.providerBookmakerId);
        if (!bookmakerId) {
          result.unmappedBookmakers += 1;
          continue;
        }
        for (const market of bookmaker.markets) {
          const mapping = marketMap.get(market.providerMarketId);
          if (!mapping) {
            result.unmappedMarkets += 1;
            continue;
          }
          marketsProcessed += 1;
          for (const value of market.values) {
            selectionsProcessed += 1;
            const decimalOdds = parseDecimalOdds(value.decimalOdds);
            const selection = normalizeSelection(
              market.providerMarketId,
              value.selection,
              selectionMap.get(`${market.providerMarketId}:${value.selection}`),
              mapping.participant as "home" | "away" | null,
            );
            if (decimalOdds === null || selection === null) {
              result.invalidPrices += 1;
              continue;
            }
            observations.push({
              fixture_id: fixtureId,
              bookmaker_id: bookmakerId,
              market_id: mapping.market_id,
              selection_key: selection.selectionKey,
              line: selection.line,
              participant: selection.participant,
              decimal_odds: decimalOdds,
              provider,
              provider_event_id: event.providerEventId,
              provider_market_id: market.providerMarketId,
              provider_selection_key: value.selection,
              market_status: deriveOddsMarketStatus(fixtureStates.get(fixtureId)),
              source_updated_at: new Date(event.sourceUpdatedAt).toISOString(),
              fetched_at: new Date().toISOString(),
            });
          }
        }
      }
    }

    const observedIdentities = new Set(
      observations.map((observation) =>
        oddsIdentity(
          String(observation.fixture_id),
          String(observation.bookmaker_id),
          String(observation.market_id),
          String(observation.selection_key),
          typeof observation.line === "number" ? observation.line : null,
          typeof observation.participant === "string" ? observation.participant : null,
        ),
      ),
    );
    for (const current of existingOdds) {
      const identity = oddsIdentity(
        current.fixture_id,
        current.bookmaker_id,
        current.market_id,
        current.selection_key,
        current.line,
        current.participant,
      );
      const sourceUpdatedAt = eventSourceTimes.get(current.provider_event_id);
      if (observedIdentities.has(identity) || !sourceUpdatedAt) {
        continue;
      }
      const status = deriveOddsMarketStatus(fixtureStates.get(current.fixture_id));
      observations.push({
        fixture_id: current.fixture_id,
        bookmaker_id: current.bookmaker_id,
        market_id: current.market_id,
        selection_key: current.selection_key,
        line: current.line,
        participant: current.participant,
        decimal_odds: current.decimal_odds,
        provider,
        provider_event_id: current.provider_event_id,
        provider_market_id: current.provider_market_id,
        provider_selection_key: current.provider_selection_key,
        market_status: status === "active" ? "unavailable" : status,
        source_updated_at: sourceUpdatedAt,
        fetched_at: new Date().toISOString(),
      });
    }

    for (let index = 0; index < observations.length; index += 10_000) {
      const ingested = await supabase.rpc("ingest_odds_batch", {
        p_observations: observations.slice(index, index + 10_000),
      });
      if (ingested.error || !ingested.data?.[0]) {
        throw new Error(
          `Odds batch ingestion failed: ${ingested.error?.message ?? "No result"}`,
        );
      }
      const batch = ingested.data[0];
      result.currentPricesCreated += batch.created_count;
      result.currentPricesUpdated += batch.updated_count;
      result.unchangedPrices += batch.unchanged_count + batch.ignored_older_count;
      result.snapshotsCreated += batch.snapshot_count;
    }

    result.ok = result.failures === 0 && result.fixturesResolved > 0;
    const completedAt = new Date().toISOString();
    const runUpdate = await supabase
      .from("odds_ingestion_runs")
      .update({
        status: result.ok ? "completed" : "failed",
        completed_at: completedAt,
        requests_used: result.requestsUsed,
        fixtures_requested: eventIds.length,
        events_received: result.eventsReceived,
        bookmakers_received: bookmakersReceived,
        markets_processed: marketsProcessed,
        selections_processed: selectionsProcessed,
        snapshots_created: result.snapshotsCreated,
        current_prices_created: result.currentPricesCreated,
        current_prices_updated: result.currentPricesUpdated,
        unchanged_prices: result.unchangedPrices,
        unresolved_events: result.unresolvedEvents,
        unmapped_bookmakers: result.unmappedBookmakers,
        unmapped_markets: result.unmappedMarkets,
        invalid_prices: result.invalidPrices,
        failures: result.failures,
        error_summary: result.ok
          ? null
          : "Odds sync completed with unresolved failures",
      })
      .eq("id", result.runId);
    if (runUpdate.error) {
      throw new Error(`Odds run update failed: ${runUpdate.error.message}`);
    }
    await updateHealth(supabase, provider, result.ok, result);
    return result;
  } catch (error) {
    const summary = sanitizeError(error);
    result.failures += 1;
    await supabase
      .from("odds_ingestion_runs")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        requests_used: result.requestsUsed,
        events_received: result.eventsReceived,
        failures: result.failures,
        error_summary: summary,
      })
      .eq("id", result.runId);
    await updateHealth(supabase, provider, false, result, summary);
    throw new Error(summary);
  }
}
