import { type SportsProviderHttpClient } from "@playtoday/sports-domain";
import { z } from "zod";
import type { OddsProviderAdapter, ProviderOddsPage, ProviderOddsQuery } from "./types.js";

const envelopeSchema = z.object({
  errors: z.union([z.array(z.unknown()), z.record(z.string(), z.unknown())]),
  paging: z.object({ current: z.number().int().positive(), total: z.number().int() }),
  response: z.array(
    z.object({
      fixture: z.object({ id: z.number().int().positive(), date: z.string().min(10) }),
      update: z.string().min(10),
      bookmakers: z.array(
        z.object({
          id: z.number().int().positive(),
          name: z.string().min(1),
          bets: z.array(
            z.object({
              id: z.number().int().positive(),
              name: z.string().min(1),
              values: z.array(
                z.object({
                  value: z.coerce.string().min(1),
                  odd: z.coerce.string().min(1),
                }),
              ),
            }),
          ),
        }),
      ),
    }),
  ),
});

export class ApiFootballOddsAdapter implements OddsProviderAdapter {
  public readonly providerName = "api-football";

  constructor(private readonly client: SportsProviderHttpClient) {}

  public async getPreMatchOdds(query: ProviderOddsQuery): Promise<ProviderOddsPage> {
    if (!query.date && !query.fixtureId) {
      throw new Error("Pre-match odds require a date or fixture ID");
    }
    const parameters: Record<string, string> = {};
    if (query.date) {
      parameters.date = query.date;
    }
    if (query.fixtureId) {
      parameters.fixture = query.fixtureId;
    }
    if (query.page) {
      parameters.page = String(query.page);
    }

    const result = await this.client.get<unknown>("/odds", parameters);
    const payload = envelopeSchema.parse(result.data);
    const errors = Array.isArray(payload.errors)
      ? payload.errors.length
      : Object.keys(payload.errors).length;
    if (errors > 0) {
      throw new Error("Provider returned an odds error payload");
    }

    const remainingHeader = result.headers.get("x-ratelimit-requests-remaining");
    const remaining = remainingHeader === null ? null : Number(remainingHeader);
    return {
      currentPage: payload.paging.current,
      totalPages: payload.paging.total,
      requestsRemaining: Number.isFinite(remaining) ? remaining : null,
      events: payload.response.map((event) => ({
        providerEventId: String(event.fixture.id),
        kickoffAt: event.fixture.date,
        sourceUpdatedAt: event.update,
        bookmakers: event.bookmakers.map((bookmaker) => ({
          providerBookmakerId: String(bookmaker.id),
          providerBookmakerName: bookmaker.name,
          markets: bookmaker.bets.map((market) => ({
            providerMarketId: String(market.id),
            providerMarketName: market.name,
            values: market.values.map((value) => ({
              selection: value.value,
              decimalOdds: value.odd,
            })),
          })),
        })),
      })),
    };
  }
}
