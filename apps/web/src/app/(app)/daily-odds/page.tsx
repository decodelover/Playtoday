import { getAuthenticatedAccountSettings } from "../../../lib/account-settings-service";
import { getCurrentOddsBoard, type OddsQuote } from "../../../lib/odds-service";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../odds.module.css";

function selectionLabel(quote: OddsQuote): string {
  const base = quote.selectionKey.replaceAll("_", " ");
  const line = quote.line === null ? "" : ` ${quote.line}`;
  return `${base}${line}`;
}

function bestQuotes(quotes: OddsQuote[]): OddsQuote[] {
  const best = new Map<string, OddsQuote>();
  for (const quote of quotes) {
    const key = `${quote.marketKey}:${quote.selectionKey}:${quote.line ?? ""}:${quote.participant ?? ""}`;
    const current = best.get(key);
    if (!current || quote.decimalOdds > current.decimalOdds) {
      best.set(key, quote);
    }
  }
  return [...best.values()].sort((a, b) =>
    `${a.marketName}:${a.selectionKey}:${a.line ?? ""}`.localeCompare(
      `${b.marketName}:${b.selectionKey}:${b.line ?? ""}`,
    ),
  );
}

export default async function DailyOddsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ date?: string; bookmaker?: string; market?: string }>;
}>) {
  const route = getShellRoute("daily-odds");
  const [params, account] = await Promise.all([
    searchParams,
    getAuthenticatedAccountSettings(),
  ]);
  const timezone = account?.preferences.timezone ?? "UTC";
  const board = await getCurrentOddsBoard({
    userTimezone: timezone,
    ...(/^\d{4}-\d{2}-\d{2}$/u.test(params.date ?? "") ? { dateIso: params.date } : {}),
    ...(params.bookmaker ? { bookmakerKey: params.bookmaker } : {}),
    ...(params.market ? { marketKey: params.market } : {}),
  });
  const timestamp = board.lastUpdatedAt
    ? new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: timezone,
      }).format(new Date(board.lastUpdatedAt))
    : "No current update";

  return (
    <WorkspacePageWrapper
      badgeText={
        board.totalCount > 0 ? `${board.totalCount} CURRENT PRICES` : "ODDS STATUS"
      }
      route={route}
      subtitle="Compare current pre-match football prices from the verified API-Football bookmaker catalog. No prediction score is added here."
    >
      <div className={styles.pageStack}>
        <section className={styles.sourceBar} aria-label="Odds source status">
          <div>
            <span className={styles.eyebrow}>CURRENT SOURCE</span>
            <strong>API-Football pre-match odds</strong>
          </div>
          <div className={styles.sourceMeta}>
            <span className={styles.freshness} data-state={board.freshness}>
              <span aria-hidden="true" />
              {board.freshness}
            </span>
            <span>Updated {timestamp}</span>
            <span>Times shown in {timezone}</span>
          </div>
        </section>

        <form className={styles.filterBar} method="get">
          <label>
            <span>Date</span>
            <input defaultValue={board.dateIso} name="date" type="date" />
          </label>
          <label>
            <span>Bookmaker</span>
            <select defaultValue={params.bookmaker ?? ""} name="bookmaker">
              <option value="">All verified sources</option>
              {board.bookmakers.map((bookmaker) => (
                <option key={bookmaker.key} value={bookmaker.key}>
                  {bookmaker.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Market</span>
            <select defaultValue={params.market ?? ""} name="market">
              <option value="">All mapped markets</option>
              {board.markets.map((market) => (
                <option key={market.key} value={market.key}>
                  {market.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Apply filters</button>
        </form>

        <div className={styles.resultMeta}>
          <span>{board.fixtures.length} fixtures in this view</span>
          <span>
            Showing {board.loadedCount} of {board.totalCount} matching prices
          </span>
        </div>

        {board.fixtures.length === 0 ? (
          <section className={styles.emptyState}>
            <div className={styles.emptyMark} aria-hidden="true">
              PT
            </div>
            <h2>No current prices match these filters</h2>
            <p>
              Try another date, bookmaker, or mapped market. A blank result does not
              mean the bookmaker offers no odds elsewhere; it only reflects the current
              source.
            </p>
          </section>
        ) : (
          <div className={styles.fixtureGrid}>
            {board.fixtures.slice(0, 12).map((fixture) => {
              const quotes = bestQuotes(fixture.quotes).slice(0, 12);
              return (
                <article className={styles.fixtureCard} key={fixture.id}>
                  <header>
                    <div>
                      <span className={styles.competition}>
                        {fixture.competitionName}
                      </span>
                      <h2>
                        {fixture.homeTeamName} <span>vs</span> {fixture.awayTeamName}
                      </h2>
                    </div>
                    <time dateTime={fixture.kickoffAt}>
                      {new Intl.DateTimeFormat("en-NG", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: timezone,
                      }).format(new Date(fixture.kickoffAt))}
                    </time>
                  </header>
                  <div className={styles.quoteList}>
                    {quotes.map((quote) => (
                      <div className={styles.quoteRow} key={quote.id}>
                        <div>
                          <span>{quote.marketName}</span>
                          <strong>{selectionLabel(quote)}</strong>
                        </div>
                        <div className={styles.priceBlock}>
                          <span>{quote.bookmakerName}</span>
                          <strong>{quote.decimalOdds.toFixed(2)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                  <footer>
                    Best displayed price per mapped selection in the loaded source data
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </WorkspacePageWrapper>
  );
}
