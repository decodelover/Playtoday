import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function TargetOddsPage() {
  const route = getShellRoute("target-odds");
  return (
    <WorkspacePageWrapper
      badgeText="TARGET ODDS BUILDER ACTIVE"
      route={route}
      subtitle="Build custom ticket combinations targeting specific cumulative odds thresholds across target bookmakers."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>CUSTOM BUILDER</span>
            <h2 className={styles.panelTitle}>Target Odds Generator</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/markets">
              Explore Markets
            </Link>
            <Link className={styles.actionBtnPrimary} href="/selections">
              Save Draft Ticket
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🎯</span>
              <h3>Target Multiplier Control</h3>
            </div>
            <p>
              Set target multiplier bounds (e.g. 3.00x, 5.00x, 10.00x) and generate
              optimal probability-weighted combinations.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚡</span>
              <h3>Risk Optimization Engine</h3>
            </div>
            <p>
              Filters selections based on safety scores, form indicators, and market
              liquidity limits.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🇳🇬</span>
              <h3>Bookmaker Alignment</h3>
            </div>
            <p>
              Aligned for seamless compilation on SportyBet, Bet9ja, and MSport
              platforms.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
