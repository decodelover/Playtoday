import "server-only";

import type { Database } from "@playtoday/database-types";
import { getLocalDateIso, getUtcBoundsForTimezone } from "./games-service";
import { createSupabaseServerClient } from "./supabase/server";

type CurrentOddsRow = Database["public"]["Views"]["v_current_odds"]["Row"];
type BookmakerRow = Database["public"]["Tables"]["bookmakers"]["Row"];
type BookmakerCapabilityRow =
  Database["public"]["Tables"]["bookmaker_capabilities"]["Row"];
type CanonicalMarketRow = Database["public"]["Tables"]["canonical_markets"]["Row"];

export interface OddsQuote {
  id: string;
  bookmakerKey: string;
  bookmakerName: string;
  marketKey: string;
  marketName: string;
  selectionKey: string;
  line: number | null;
  participant: string | null;
  decimalOdds: number;
  sourceUpdatedAt: string;
}

export interface FixtureOddsDisplay {
  id: string;
  kickoffAt: string;
  competitionName: string;
  homeTeamName: string;
  awayTeamName: string;
  quotes: OddsQuote[];
}

export interface OddsBoardResponse {
  dateIso: string;
  todayDateIso: string;
  userTimezone: string;
  totalCount: number;
  loadedCount: number;
  lastUpdatedAt: string | null;
  freshness: "current" | "stale" | "unavailable";
  fixtures: FixtureOddsDisplay[];
  bookmakers: { key: string; name: string }[];
  markets: { key: string; name: string }[];
}

export interface OddsCatalogResponse {
  bookmakers: {
    key: string;
    name: string;
    availability: "verified_supported" | "not_supported" | "not_verified";
    preMatchOdds: boolean;
    liveOdds: boolean;
    bookingCodeApi: boolean;
  }[];
  markets: { id: string; key: string; name: string; currentPriceCount: number }[];
}

function text(value: string | null): string {
  return value ?? "";
}

function groupOddsRows(rows: CurrentOddsRow[]): FixtureOddsDisplay[] {
  const fixtures = new Map<string, FixtureOddsDisplay>();
  for (const row of rows) {
    if (!row.fixture_id || !row.decimal_odds || !row.source_updated_at) {
      continue;
    }
    const fixture = fixtures.get(row.fixture_id) ?? {
      id: row.fixture_id,
      kickoffAt: text(row.kickoff_at),
      competitionName: text(row.competition_name),
      homeTeamName: text(row.home_team_name),
      awayTeamName: text(row.away_team_name),
      quotes: [],
    };
    fixture.quotes.push({
      id: text(row.id),
      bookmakerKey: text(row.bookmaker_key),
      bookmakerName: text(row.bookmaker_name),
      marketKey: text(row.market_key),
      marketName: text(row.market_name),
      selectionKey: text(row.selection_key),
      line: row.line,
      participant: row.participant,
      decimalOdds: row.decimal_odds,
      sourceUpdatedAt: row.source_updated_at,
    });
    fixtures.set(row.fixture_id, fixture);
  }
  return [...fixtures.values()].sort((a, b) => a.kickoffAt.localeCompare(b.kickoffAt));
}

export async function getCurrentOddsBoard(options?: {
  userTimezone?: string;
  dateIso?: string;
  bookmakerKey?: string;
  marketKey?: string;
}): Promise<OddsBoardResponse> {
  const userTimezone = options?.userTimezone ?? "UTC";
  const todayDateIso = getLocalDateIso(new Date(), userTimezone);
  const dateIso = options?.dateIso ?? todayDateIso;
  const { startUtc, endUtc } = getUtcBoundsForTimezone(dateIso, userTimezone);
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("v_current_odds")
    .select("*", { count: "exact" })
    .gte("kickoff_at", startUtc)
    .lte("kickoff_at", endUtc)
    .eq("market_status", "active")
    .order("kickoff_at", { ascending: true })
    .order("source_updated_at", { ascending: false })
    .limit(1000);
  if (options?.bookmakerKey) {
    query = query.eq("bookmaker_key", options.bookmakerKey);
  }
  if (options?.marketKey) {
    query = query.eq("market_key", options.marketKey);
  }

  const [oddsResult, bookmakerResult, marketResult] = await Promise.all([
    query,
    supabase
      .from("bookmakers")
      .select("canonical_key,name")
      .eq("active", true)
      .order("name"),
    supabase
      .from("canonical_markets")
      .select("canonical_key,name")
      .eq("active", true)
      .order("name"),
  ]);
  const rows = oddsResult.error ? [] : ((oddsResult.data ?? []) as CurrentOddsRow[]);
  const timestamps = rows
    .map((row) => new Date(row.source_updated_at ?? "").getTime())
    .filter(Number.isFinite);
  const lastUpdatedAt =
    timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null;
  const stale = lastUpdatedAt
    ? Date.now() - new Date(lastUpdatedAt).getTime() > 6 * 60 * 60 * 1000
    : false;

  return {
    dateIso,
    todayDateIso,
    userTimezone,
    totalCount: oddsResult.count ?? 0,
    loadedCount: rows.length,
    lastUpdatedAt,
    freshness:
      oddsResult.error || !lastUpdatedAt ? "unavailable" : stale ? "stale" : "current",
    fixtures: groupOddsRows(rows),
    bookmakers: ((bookmakerResult.data ?? []) as unknown as BookmakerRow[]).map(
      (item) => ({
        key: item.canonical_key,
        name: item.name,
      }),
    ),
    markets: ((marketResult.data ?? []) as unknown as CanonicalMarketRow[]).map(
      (item) => ({
        key: item.canonical_key,
        name: item.name,
      }),
    ),
  };
}

export async function getOddsCatalog(): Promise<OddsCatalogResponse> {
  const supabase = await createSupabaseServerClient();
  const [bookmakers, capabilities, markets] = await Promise.all([
    supabase
      .from("bookmakers")
      .select("id,canonical_key,name")
      .eq("active", true)
      .order("name"),
    supabase
      .from("bookmaker_capabilities")
      .select(
        "bookmaker_id,availability_status,pre_match_odds,live_odds,booking_code_api",
      )
      .eq("odds_provider", "api-football"),
    supabase
      .from("canonical_markets")
      .select("id,canonical_key,name")
      .eq("active", true)
      .order("name"),
  ]);
  const capabilityRows = (capabilities.data ??
    []) as unknown as BookmakerCapabilityRow[];
  const bookmakerRows = (bookmakers.data ?? []) as unknown as BookmakerRow[];
  const marketRows = (markets.data ?? []) as unknown as CanonicalMarketRow[];
  const capabilityMap = new Map(
    capabilityRows.map((capability) => [capability.bookmaker_id, capability]),
  );
  const counts = await Promise.all(
    marketRows.map((market) =>
      supabase
        .from("current_odds")
        .select("id", { count: "exact", head: true })
        .eq("market_id", market.id)
        .eq("market_status", "active"),
    ),
  );

  return {
    bookmakers: bookmakerRows.map((bookmaker) => {
      const capability = capabilityMap.get(bookmaker.id);
      const availability = capability?.availability_status;
      return {
        key: bookmaker.canonical_key,
        name: bookmaker.name,
        availability:
          availability === "verified_supported" || availability === "not_supported"
            ? availability
            : "not_verified",
        preMatchOdds: capability?.pre_match_odds ?? false,
        liveOdds: capability?.live_odds ?? false,
        bookingCodeApi: capability?.booking_code_api ?? false,
      };
    }),
    markets: marketRows.map((market, index) => ({
      id: market.id,
      key: market.canonical_key,
      name: market.name,
      currentPriceCount: counts[index]?.count ?? 0,
    })),
  };
}
