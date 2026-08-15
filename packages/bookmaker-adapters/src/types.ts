export interface ProviderOddsQuery {
  date?: string | undefined;
  fixtureId?: string | undefined;
  page?: number | undefined;
}

export interface ProviderOddsValue {
  selection: string;
  decimalOdds: string;
}

export interface ProviderOddsMarket {
  providerMarketId: string;
  providerMarketName: string;
  values: ProviderOddsValue[];
}

export interface ProviderBookmakerOdds {
  providerBookmakerId: string;
  providerBookmakerName: string;
  markets: ProviderOddsMarket[];
}

export interface ProviderOddsEvent {
  providerEventId: string;
  kickoffAt: string;
  sourceUpdatedAt: string;
  bookmakers: ProviderBookmakerOdds[];
}

export interface ProviderOddsPage {
  currentPage: number;
  totalPages: number;
  requestsRemaining: number | null;
  events: ProviderOddsEvent[];
}

export interface NormalizedSelection {
  selectionKey: string;
  line: number | null;
  participant: "home" | "away" | null;
}

export interface OddsProviderAdapter {
  readonly providerName: string;
  getPreMatchOdds(query: ProviderOddsQuery): Promise<ProviderOddsPage>;
}
