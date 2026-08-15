import { NextResponse } from "next/server";
import { GeminiSportsChat, type ChatMessage, type LiveSportsContext } from "@playtoday/ai-tools";
import { TheOddsApiClient } from "@playtoday/bookmaker-adapters";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { getTodaysGames } from "../../../../lib/games-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json({ error: "Messages array cannot be empty" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const userTimezone = body.userTimezone ?? "UTC";

    // 1. Fetch today's games from Supabase
    const todaysData = await getTodaysGames({ userTimezone });
    const formattedFixtures = todaysData.fixtures.map((f) => ({
      id: f.id,
      kickoffAt: f.kickoffAt,
      status: f.status,
      competition: f.competition.name,
      homeTeam: f.homeTeam.name,
      awayTeam: f.awayTeam.name,
      homeScore: f.homeScore,
      awayScore: f.awayScore,
      venue: f.venue?.name ?? null,
    }));

    // 2. If scheduled count is low, also fetch upcoming fixtures from Supabase (next 48 hours)
    const activeScheduled = formattedFixtures.filter((f) => f.status === "scheduled" || f.status === "live");
    if (activeScheduled.length < 10) {
      const nowIso = new Date().toISOString();
      const in48hIso = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
      const { data: upcomingRows } = await supabase
        .from("v_public_fixtures")
        .select("*")
        .gte("kickoff_at", nowIso)
        .lte("kickoff_at", in48hIso)
        .order("kickoff_at", { ascending: true })
        .limit(30);

      const rows = (upcomingRows as any[]) ?? [];
      for (const row of rows) {
        if (!formattedFixtures.some((f) => f.id === row.id)) {
          formattedFixtures.push({
            id: String(row.id ?? ""),
            kickoffAt: String(row.kickoff_at ?? ""),
            status: (row.status ?? "scheduled") as any,
            competition: String(row.competition_name ?? "League"),
            homeTeam: String(row.home_team_name ?? "Home"),
            awayTeam: String(row.away_team_name ?? "Away"),
            homeScore: typeof row.home_score === "number" ? row.home_score : null,
            awayScore: typeof row.away_score === "number" ? row.away_score : null,
            venue: row.venue_name ? String(row.venue_name) : null,
          });
        }
      }
    }

    // 3. Fetch live odds quotes from Supabase
    const { data: oddsRows } = await supabase
      .from("bookmaker_odds_current")
      .select(`
        fixture_id,
        decimal_odds,
        selection_key,
        fixtures (
          home_team:teams!fixtures_home_team_id_fkey (name),
          away_team:teams!fixtures_away_team_id_fkey (name)
        ),
        sports_market_definitions (name),
        bookmakers (name)
      `)
      .limit(60);

    const formattedOdds = ((oddsRows as any[]) ?? []).map((row: any) => ({
      fixtureTitle: `${row.fixtures?.home_team?.name ?? "Home"} vs ${row.fixtures?.away_team?.name ?? "Away"}`,
      market: row.sports_market_definitions?.name ?? "1X2",
      selection: String(row.selection_key ?? "").replaceAll("_", " "),
      price: Number(row.decimal_odds),
      bookmaker: row.bookmakers?.name ?? "Verified Bookmaker",
    }));

    // 4. Fetch and enrich with live quotes from The Odds API
    const theOddsApiKey = process.env.THE_ODDS_API_KEY ?? "f0a93dfb07e556cc647b7e121759de7d";
    if (theOddsApiKey) {
      try {
        const theOddsClient = new TheOddsApiClient(theOddsApiKey);
        const sportsToFetch = [
          "soccer_epl",
          "soccer_spain_la_liga",
          "soccer_italy_serie_a",
          "soccer_germany_bundesliga",
          "soccer_france_ligue_one",
          "soccer_usa_mls",
          "upcoming",
        ];

        const results = await Promise.allSettled(
          sportsToFetch.map((sport) =>
            theOddsClient.getUpcomingOdds({
              sport,
              regions: "eu,uk",
              markets: "h2h,totals",
            })
          )
        );

        for (const res of results) {
          if (res.status === "fulfilled") {
            for (const quote of res.value.slice(0, 40)) {
              formattedOdds.push({
                fixtureTitle: quote.fixtureTitle,
                market: quote.market,
                selection: quote.selection,
                price: quote.price,
                bookmaker: quote.bookmaker,
              });

              // If the fixture isn't in formattedFixtures, register it as upcoming
              if (!formattedFixtures.some((f) => `${f.homeTeam} vs ${f.awayTeam}` === quote.fixtureTitle)) {
                formattedFixtures.push({
                  id: `odds_${quote.fixtureTitle.replace(/\s+/g, "_")}`,
                  kickoffAt: quote.kickoffAt,
                  status: "scheduled",
                  competition: quote.competition,
                  homeTeam: quote.homeTeam,
                  awayTeam: quote.awayTeam,
                  homeScore: null,
                  awayScore: null,
                  venue: null,
                });
              }
            }
          }
        }
      } catch (oddsErr) {
        console.warn("The Odds API live fetch failed:", oddsErr);
      }
    }

    const liveContext: LiveSportsContext = {
      todayDateIso: todaysData.todayDateIso,
      userTimezone,
      fixtures: formattedFixtures,
      oddsQuotes: formattedOdds,
    };

    const analyst = new GeminiSportsChat(process.env.GEMINI_API_KEY ?? "");
    const responseText = await analyst.chat(messages, liveContext);

    return NextResponse.json({
      ok: true,
      message: {
        role: "assistant",
        content: responseText,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI Chat failed to respond";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
