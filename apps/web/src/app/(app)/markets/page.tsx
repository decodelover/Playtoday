import Link from "next/link";
import { getOddsCatalog } from "../../../lib/odds-service";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../odds.module.css";

export default async function MarketsPage() {
  const route = getShellRoute("markets");
  const catalog = await getOddsCatalog();
  const supported = catalog.bookmakers.filter((item) => item.preMatchOdds).length;

  return (
    <WorkspacePageWrapper
      badgeText={`${catalog.markets.length} CANONICAL MARKETS`}
      route={route}
      subtitle="See which football markets are mapped, how many current prices are stored, and which bookmaker capabilities are verified by the active source."
    >
      <div className={styles.pageStack}>
        <section className={styles.metricGrid} aria-label="Market summary">
          <div>
            <span>Mapped markets</span>
            <strong>{catalog.markets.length}</strong>
          </div>
          <div>
            <span>Bookmakers with pre-match data</span>
            <strong>{supported}</strong>
          </div>
          <div>
            <span>Target bookmakers supported</span>
            <strong>0 of 3</strong>
          </div>
        </section>

        <section className={styles.registryPanel}>
          <header className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>MARKET REGISTRY</span>
              <h2>Current mapped coverage</h2>
            </div>
            <Link href="/daily-odds">Open current odds</Link>
          </header>
          <div className={styles.marketGrid}>
            {catalog.markets.map((market) => (
              <article className={styles.marketCard} key={market.id}>
                <span>{market.key.replaceAll("_", " ")}</span>
                <h3>{market.name}</h3>
                <strong>{market.currentPriceCount.toLocaleString("en-NG")}</strong>
                <p>active current prices</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.registryPanel}>
          <header className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>BOOKMAKER CAPABILITIES</span>
              <h2>Verified source availability</h2>
            </div>
          </header>
          <div
            className={styles.capabilityTable}
            role="table"
            aria-label="Bookmaker capabilities"
          >
            <div className={styles.capabilityHead} role="row">
              <span>Bookmaker</span>
              <span>Pre-match</span>
              <span>Live</span>
              <span>Booking code</span>
            </div>
            {catalog.bookmakers.map((bookmaker) => (
              <div className={styles.capabilityRow} key={bookmaker.key} role="row">
                <div>
                  <strong>{bookmaker.name}</strong>
                  <small>{bookmaker.availability.replaceAll("_", " ")}</small>
                </div>
                <span data-available={bookmaker.preMatchOdds}>
                  {bookmaker.preMatchOdds ? "Verified" : "Not supported"}
                </span>
                <span data-available={bookmaker.liveOdds}>
                  {bookmaker.liveOdds ? "Verified" : "Not enabled"}
                </span>
                <span data-available={bookmaker.bookingCodeApi}>
                  {bookmaker.bookingCodeApi ? "Verified" : "Not available"}
                </span>
              </div>
            ))}
          </div>
          <p className={styles.disclosure}>
            SportyBet, Bet9ja, and MSport are not present in the active API-Football
            bookmaker catalog. This status describes the current source only. PlayToday
            does not generate booking codes or claim direct bookmaker integration.
          </p>
        </section>
      </div>
    </WorkspacePageWrapper>
  );
}
