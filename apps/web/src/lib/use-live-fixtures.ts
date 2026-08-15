"use client";

import { useEffect, useState } from "react";
import type { PublicFixtureDisplay } from "./games-service";
import { createSupabaseBrowserClient } from "./supabase/client";

interface FixtureUpdatePayload {
  id: string;
  status?: string;
  status_detail?: string | null;
  home_score?: number | null;
  away_score?: number | null;
  halftime_home_score?: number | null;
  halftime_away_score?: number | null;
  kickoff_at?: string;
}

export function useLiveFixtures(initialFixtures: PublicFixtureDisplay[]) {
  const [fixtures, setFixtures] = useState<PublicFixtureDisplay[]>(initialFixtures);
  const [lastLiveEventAt, setLastLiveEventAt] = useState<string | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  // Sync state if initialFixtures change via route/server navigation
  useEffect(() => {
    setFixtures(initialFixtures);
  }, [initialFixtures]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const channel = supabase
      .channel("public-fixtures-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "fixtures" },
        (payload) => {
          const updated = payload.new as FixtureUpdatePayload;
          if (!updated?.id) return;

          setFixtures((prev) =>
            prev.map((fixture) => {
              if (fixture.id !== updated.id) return fixture;
              return {
                ...fixture,
                status: (updated.status as PublicFixtureDisplay["status"]) ?? fixture.status,
                statusDetail: updated.status_detail !== undefined ? updated.status_detail : fixture.statusDetail,
                homeScore: updated.home_score !== undefined ? updated.home_score : fixture.homeScore,
                awayScore: updated.away_score !== undefined ? updated.away_score : fixture.awayScore,
                halftimeHomeScore:
                  updated.halftime_home_score !== undefined
                    ? updated.halftime_home_score
                    : fixture.halftimeHomeScore,
                halftimeAwayScore:
                  updated.halftime_away_score !== undefined
                    ? updated.halftime_away_score
                    : fixture.halftimeAwayScore,
                kickoffAt: updated.kickoff_at ?? fixture.kickoffAt,
              };
            }),
          );
          setLastLiveEventAt(new Date().toISOString());
        },
      )
      .subscribe((status) => {
        setIsLiveConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { fixtures, lastLiveEventAt, isLiveConnected };
}
