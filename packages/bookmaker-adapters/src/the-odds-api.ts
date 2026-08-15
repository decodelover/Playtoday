export interface TheOddsApiOutcome {
  name: string;
  price: number;
  point?: number | undefined;
}

export interface TheOddsApiMarket {
  key: string;
  last_update?: string | undefined;
  outcomes: TheOddsApiOutcome[];
}

export interface TheOddsApiBookmaker {
  key: string;
  title: string;
  last_update?: string | undefined;
  markets: TheOddsApiMarket[];
}

export interface TheOddsApiEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: TheOddsApiBookmaker[];
}

export interface NormalizedOddsQuote {
  fixtureTitle: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  kickoffAt: string;
  market: string;
  selection: string;
  price: number;
  bookmaker: string;
  point?: number | undefined;
}

export class TheOddsApiClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, baseUrl = "https://api.the-odds-api.com/v4") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  public async getUpcomingOdds(options?: {
    sport?: string;
    regions?: string;
    markets?: string;
  }): Promise<NormalizedOddsQuote[]> {
    const sport = options?.sport ?? "upcoming";
    const regions = options?.regions ?? "eu,uk";
    const markets = options?.markets ?? "h2h,totals";

    const url = `${this.baseUrl}/sports/${sport}/odds/?apiKey=${this.apiKey}&regions=${regions}&markets=${markets}&dateFormat=iso`;

    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(`The Odds API request failed (${res.status}): ${errorText}`);
    }

    const events = (await res.json()) as TheOddsApiEvent[];
    if (!Array.isArray(events)) {
      return [];
    }

    const quotes: NormalizedOddsQuote[] = [];

    for (const event of events) {
      const fixtureTitle = `${event.home_team} vs ${event.away_team}`;
      // Take top 2 primary bookmakers per match to give wide match diversity
      const selectedBookmakers = (event.bookmakers ?? []).slice(0, 2);

      for (const bookmaker of selectedBookmakers) {
        let homePrice: number | null = null;
        let awayPrice: number | null = null;
        let drawPrice: number | null = null;

        for (const market of bookmaker.markets ?? []) {
          const marketName = market.key === "h2h" ? "1X2 / Match Winner" : market.key === "totals" ? "Over/Under Totals" : market.key;
          for (const outcome of market.outcomes ?? []) {
            let selectionLabel = outcome.name;
            if (outcome.name === event.home_team) {
              selectionLabel = `Home Win (${event.home_team})`;
              homePrice = outcome.price;
            } else if (outcome.name === event.away_team) {
              selectionLabel = `Away Win (${event.away_team})`;
              awayPrice = outcome.price;
            } else if (outcome.name.toLowerCase() === "draw") {
              selectionLabel = "Draw";
              drawPrice = outcome.price;
            } else if (market.key === "totals" && outcome.point !== undefined) {
              selectionLabel = `${outcome.name} ${outcome.point} Goals`;
            }

            quotes.push({
              fixtureTitle,
              homeTeam: event.home_team,
              awayTeam: event.away_team,
              competition: event.sport_title,
              kickoffAt: event.commence_time,
              market: marketName,
              selection: selectionLabel,
              price: outcome.price,
              bookmaker: bookmaker.title,
              point: outcome.point,
            });
          }
        }

        // Derive Double Chance quotes mathematically
        if (homePrice && drawPrice) {
          const prob1X = 1 / homePrice + 1 / drawPrice;
          const dc1X = Math.max(1.04, Math.round((1 / prob1X) * 0.95 * 100) / 100);
          quotes.push({
            fixtureTitle,
            homeTeam: event.home_team,
            awayTeam: event.away_team,
            competition: event.sport_title,
            kickoffAt: event.commence_time,
            market: "Double Chance",
            selection: `1X (${event.home_team} or Draw)`,
            price: dc1X,
            bookmaker: bookmaker.title,
          });
        }

        if (awayPrice && drawPrice) {
          const probX2 = 1 / awayPrice + 1 / drawPrice;
          const dcX2 = Math.max(1.04, Math.round((1 / probX2) * 0.95 * 100) / 100);
          quotes.push({
            fixtureTitle,
            homeTeam: event.home_team,
            awayTeam: event.away_team,
            competition: event.sport_title,
            kickoffAt: event.commence_time,
            market: "Double Chance",
            selection: `X2 (Draw or ${event.away_team})`,
            price: dcX2,
            bookmaker: bookmaker.title,
          });
        }
      }
    }

    return quotes;
  }
}
