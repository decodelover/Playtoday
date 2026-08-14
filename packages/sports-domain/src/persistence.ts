import type { Database } from "@playtoday/database-types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompetitionDto, TeamDto } from "./adapter";
import {
  rawFixtureDtoSchema,
  normalizeFixtureStatus,
  normalizeUtcTimestamp,
  type RawFixtureDto,
} from "./normalization";
import type { IngestionRunResult } from "./types";

export interface IngestionOptions {
  provider: string;
  sportKey?: string;
}

export class SportsIngestionPersistence {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Resolves or upserts a competition into canonical storage with provider entity mapping.
   */
  public async upsertRawCompetition(
    comp: CompetitionDto,
    provider = "api-football",
    sportKey = "football",
  ): Promise<string> {
    const sportId = await this.getSportId(sportKey);

    const areaId = comp.country
      ? await this.upsertArea(comp.country, comp.countryCode)
      : null;

    const competitionId = await this.resolveEntity(
      provider,
      "competition",
      String(comp.id),
      async (): Promise<string> => {
        const canonicalKey = `${provider}-${comp.id}`;
        const res = await this.supabase
          .from("competitions")
          .upsert(
            {
              sport_id: sportId,
              area_id: areaId,
              canonical_key: canonicalKey,
              name: comp.name,
              type: comp.type,
              logo_url: comp.logoUrl ?? null,
              active: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "canonical_key" },
          )
          .select("id")
          .single();

        if (res.error || !res.data) {
          const errMsg = res.error?.message ?? "Unknown error";
          throw new Error(`Competition upsert failed: ${errMsg}`);
        }
        return res.data.id;
      },
    );

    await this.supabase
      .from("competitions")
      .update({
        area_id: areaId,
        name: comp.name,
        type: comp.type,
        logo_url: comp.logoUrl ?? null,
        active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", competitionId);

    return competitionId;
  }

  /**
   * Resolves or upserts a team into canonical storage with provider entity mapping.
   */
  public async upsertRawTeam(
    team: TeamDto,
    provider = "api-football",
    sportKey = "football",
  ): Promise<string> {
    const sportId = await this.getSportId(sportKey);

    const areaId = team.country ? await this.upsertArea(team.country) : null;
    const teamId = await this.resolveEntity(
      provider,
      "team",
      String(team.id),
      async (): Promise<string> => {
        const res = await this.supabase
          .from("teams")
          .insert({
            sport_id: sportId,
            area_id: areaId,
            canonical_name: team.name,
            code: team.code ?? null,
            logo_url: team.logoUrl ?? null,
            active: true,
          })
          .select("id")
          .single();

        if (res.error || !res.data) {
          const errMsg = res.error?.message ?? "Unknown error";
          throw new Error(`Team insert failed: ${errMsg}`);
        }
        return res.data.id;
      },
    );

    await this.supabase
      .from("teams")
      .update({
        area_id: areaId,
        canonical_name: team.name,
        code: team.code ?? null,
        logo_url: team.logoUrl ?? null,
        active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", teamId);

    return teamId;
  }

  /**
   * Resolves or upserts a fixture into canonical storage with provider entity mapping.
   * Ensures idempotency: 100 sync calls for the same fixture ID update the same canonical row.
   * Preserves NULL vs 0 scores correctly.
   */
  public async upsertRawFixture(
    dto: RawFixtureDto,
    options: IngestionOptions,
  ): Promise<{ canonicalFixtureId: string; created: boolean }> {
    const validated = rawFixtureDtoSchema.parse(dto);
    const provider = options.provider;
    const sportKey = options.sportKey ?? "football";
    const sportId = await this.getSportId(sportKey);

    // 1. Resolve Competition
    const competitionId = await this.upsertRawCompetition(
      {
        id: String(validated.competitionId),
        name: validated.competitionName,
        type: validated.competitionType ?? "league",
        country: validated.countryName,
        countryCode: validated.countryCode,
        logoUrl: validated.competitionLogoUrl,
      },
      provider,
      sportKey,
    );

    // 2. Resolve Home Team
    const homeTeamId = await this.upsertRawTeam(
      {
        id: String(validated.homeTeamId),
        name: validated.homeTeamName,
        logoUrl: validated.homeTeamLogoUrl,
        country: validated.countryName,
      },
      provider,
      sportKey,
    );

    // 3. Resolve Away Team
    const awayTeamId = await this.upsertRawTeam(
      {
        id: String(validated.awayTeamId),
        name: validated.awayTeamName,
        logoUrl: validated.awayTeamLogoUrl,
        country: validated.countryName,
      },
      provider,
      sportKey,
    );

    const seasonId = validated.seasonYear
      ? await this.upsertSeason(competitionId, validated.seasonYear)
      : null;
    const venueId = validated.venueName
      ? await this.upsertVenue(
          provider,
          validated.venueProviderId,
          validated.venueName,
          validated.venueCity,
          validated.countryName,
        )
      : null;

    // 4. Resolve / Upsert Fixture
    const kickoffUtc = normalizeUtcTimestamp(validated.kickoffIso);
    const canonicalStatus = normalizeFixtureStatus(validated.statusRaw);

    let isCreated = false;
    const canonicalFixtureId = await this.resolveEntity(
      provider,
      "fixture",
      String(validated.fixtureId),
      async (): Promise<string> => {
        isCreated = true;
        const res = await this.supabase
          .from("fixtures")
          .insert({
            sport_id: sportId,
            competition_id: competitionId,
            season_id: seasonId,
            home_team_id: homeTeamId,
            away_team_id: awayTeamId,
            venue_id: venueId,
            kickoff_at: kickoffUtc,
            status: canonicalStatus,
            status_detail: validated.statusRaw,
            round: validated.round ?? null,
            home_score: validated.homeScore ?? null,
            away_score: validated.awayScore ?? null,
            halftime_home_score: validated.halftimeHomeScore ?? null,
            halftime_away_score: validated.halftimeAwayScore ?? null,
            last_synced_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (res.error || !res.data) {
          const errMsg = res.error?.message ?? "Unknown error";
          throw new Error(`Fixture insert failed: ${errMsg}`);
        }
        return res.data.id;
      },
    );

    // If existing fixture, update dynamic fields (status, scores, kickoff timestamp)
    if (!isCreated) {
      await this.supabase
        .from("fixtures")
        .update({
          kickoff_at: kickoffUtc,
          competition_id: competitionId,
          season_id: seasonId,
          home_team_id: homeTeamId,
          away_team_id: awayTeamId,
          venue_id: venueId,
          status: canonicalStatus,
          status_detail: validated.statusRaw,
          round: validated.round ?? null,
          home_score: validated.homeScore ?? null,
          away_score: validated.awayScore ?? null,
          halftime_home_score: validated.halftimeHomeScore ?? null,
          halftime_away_score: validated.halftimeAwayScore ?? null,
          last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", canonicalFixtureId);
    }

    return { canonicalFixtureId, created: isCreated };
  }

  /**
   * Logs execution metrics to public.sports_ingestion_runs.
   */
  public async logIngestionRun(run: IngestionRunResult): Promise<string> {
    const res = await this.supabase
      .from("sports_ingestion_runs")
      .insert({
        provider: run.provider,
        job_type: run.jobType,
        status: run.status,
        fetched_count: run.fetchedCount,
        created_count: run.createdCount,
        updated_count: run.updatedCount,
        failed_count: run.failedCount,
        error_summary: run.errorSummary ?? null,
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    return res.data?.id ?? "";
  }

  /**
   * Updates provider health tracking in public.sports_provider_health.
   */
  public async updateProviderHealth(
    provider: string,
    status: "healthy" | "degraded" | "failing",
    error?: string,
  ): Promise<void> {
    const isSuccess = status === "healthy";
    const now = new Date().toISOString();

    const existing = await this.supabase
      .from("sports_provider_health")
      .select("consecutive_failures")
      .eq("provider", provider)
      .maybeSingle();

    const consecutiveFailures = isSuccess
      ? 0
      : (existing.data?.consecutive_failures ?? 0) + 1;

    const payload: Database["public"]["Tables"]["sports_provider_health"]["Insert"] = {
      provider,
      status,
      consecutive_failures: consecutiveFailures,
      last_error: error ?? null,
      updated_at: now,
    };

    if (isSuccess) {
      payload.last_successful_sync_at = now;
    } else {
      payload.last_failure_at = now;
    }

    await this.supabase
      .from("sports_provider_health")
      .upsert(payload, { onConflict: "provider" });
  }

  private async getSportId(sportKey: string): Promise<string> {
    const sportRes = await this.supabase
      .from("sports")
      .select("id")
      .eq("key", sportKey)
      .single();

    if (sportRes.error || !sportRes.data) {
      throw new Error(`Sport '${sportKey}' not initialized in canonical database`);
    }

    return sportRes.data.id;
  }

  private async upsertArea(name: string, code?: string): Promise<string> {
    const normalizedCode = code?.trim().toLowerCase();
    const key =
      normalizedCode && normalizedCode.length > 0
        ? normalizedCode
        : name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/gu, "-");
    const result = await this.supabase
      .from("areas")
      .upsert(
        { key, name, code: code ?? null, updated_at: new Date().toISOString() },
        { onConflict: "key" },
      )
      .select("id")
      .single();
    if (result.error || !result.data) {
      throw new Error(
        `Area upsert failed: ${result.error?.message ?? "Unknown error"}`,
      );
    }
    return result.data.id;
  }

  private async upsertSeason(
    competitionId: string,
    seasonYear: number,
  ): Promise<string> {
    const name = String(seasonYear);
    const result = await this.supabase
      .from("seasons")
      .upsert(
        {
          competition_id: competitionId,
          name,
          current: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "competition_id,name" },
      )
      .select("id")
      .single();
    if (result.error || !result.data) {
      throw new Error(
        `Season upsert failed: ${result.error?.message ?? "Unknown error"}`,
      );
    }
    return result.data.id;
  }

  private async upsertVenue(
    provider: string,
    providerId: string | number | undefined,
    name: string,
    city?: string,
    country?: string,
  ): Promise<string> {
    const identity = providerId ?? `${name}|${city ?? ""}|${country ?? ""}`;
    const venueId = await this.resolveEntity(
      provider,
      "venue",
      String(identity),
      async () => {
        const result = await this.supabase
          .from("venues")
          .insert({ name, city: city ?? null, country: country ?? null })
          .select("id")
          .single();
        if (result.error || !result.data) {
          throw new Error(
            `Venue insert failed: ${result.error?.message ?? "Unknown error"}`,
          );
        }
        return result.data.id;
      },
    );
    await this.supabase
      .from("venues")
      .update({
        name,
        city: city ?? null,
        country: country ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", venueId);
    return venueId;
  }

  private async resolveEntity(
    provider: string,
    entityType: string,
    providerEntityId: string,
    createFn: () => Promise<string>,
  ): Promise<string> {
    const res = await this.supabase
      .from("provider_entity_mappings")
      .select("canonical_entity_id")
      .eq("provider", provider)
      .eq("entity_type", entityType)
      .eq("provider_entity_id", providerEntityId)
      .maybeSingle();

    if (res.data?.canonical_entity_id) {
      await this.supabase
        .from("provider_entity_mappings")
        .update({
          source_last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("provider", provider)
        .eq("entity_type", entityType)
        .eq("provider_entity_id", providerEntityId);
      return res.data.canonical_entity_id;
    }

    const newCanonicalId = await createFn();

    await this.supabase.from("provider_entity_mappings").insert({
      provider,
      entity_type: entityType,
      provider_entity_id: providerEntityId,
      canonical_entity_id: newCanonicalId,
    });

    return newCanonicalId;
  }
}
