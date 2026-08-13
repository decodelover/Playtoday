import type { Database } from "@playtoday/database-types";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  rawFixtureDtoSchema,
  normalizeFixtureStatus,
  normalizeUtcTimestamp,
  type RawFixtureDto,
} from "./normalization";

export interface IngestionOptions {
  provider: string;
  sportKey?: string;
}

export class SportsIngestionPersistence {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  public async upsertRawFixture(
    dto: RawFixtureDto,
    options: IngestionOptions,
  ): Promise<{ canonicalFixtureId: string; created: boolean }> {
    const validated = rawFixtureDtoSchema.parse(dto);
    const provider = options.provider;
    const sportKey = options.sportKey ?? "football";

    // 1. Fetch Sport ID
    const sportRes = await this.supabase
      .from("sports")
      .select("id")
      .eq("key", sportKey)
      .single();

    if (sportRes.error || !sportRes.data) {
      throw new Error(`Sport '${sportKey}' not initialized in canonical database`);
    }

    const sportId = sportRes.data.id;

    // 2. Resolve/Upsert Competition
    const competitionId = await this.resolveEntity(
      provider,
      "competition",
      String(validated.competitionId),
      async (): Promise<string> => {
        const res = await this.supabase
          .from("competitions")
          .upsert(
            {
              sport_id: sportId,
              canonical_key: `${provider}-${validated.competitionId}`,
              name: validated.competitionName,
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

    // 3. Resolve/Upsert Home Team
    const homeTeamId = await this.resolveEntity(
      provider,
      "team",
      String(validated.homeTeamId),
      async (): Promise<string> => {
        const res = await this.supabase
          .from("teams")
          .insert({
            sport_id: sportId,
            canonical_name: validated.homeTeamName,
          })
          .select("id")
          .single();

        if (res.error || !res.data) {
          const errMsg = res.error?.message ?? "Unknown error";
          throw new Error(`Home team insert failed: ${errMsg}`);
        }
        return res.data.id;
      },
    );

    // 4. Resolve/Upsert Away Team
    const awayTeamId = await this.resolveEntity(
      provider,
      "team",
      String(validated.awayTeamId),
      async (): Promise<string> => {
        const res = await this.supabase
          .from("teams")
          .insert({
            sport_id: sportId,
            canonical_name: validated.awayTeamName,
          })
          .select("id")
          .single();

        if (res.error || !res.data) {
          const errMsg = res.error?.message ?? "Unknown error";
          throw new Error(`Away team insert failed: ${errMsg}`);
        }
        return res.data.id;
      },
    );

    // 5. Resolve/Upsert Fixture
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
            home_team_id: homeTeamId,
            away_team_id: awayTeamId,
            kickoff_at: kickoffUtc,
            status: canonicalStatus,
            status_detail: validated.statusRaw,
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

    // If existing fixture, update dynamic fields
    if (!isCreated) {
      await this.supabase
        .from("fixtures")
        .update({
          kickoff_at: kickoffUtc,
          status: canonicalStatus,
          status_detail: validated.statusRaw,
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
