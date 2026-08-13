import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function MarketsPage() {
  const route = getShellRoute("markets");
  return (
    <WorkspacePageWrapper
      badgeText="SUPPORTED MARKETS READY"
      route={route}
      subtitle="Explore supported sports prediction markets including 1X2 Match Winner, Over/Under Goals, Both Teams to Score, and Double Chance."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>MARKET REGISTRY</span>
            <h2 className={styles.panelTitle}>Supported Prediction Markets</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/games">
              Today’s Games
            </Link>
            <Link className={styles.actionBtnPrimary} href="/target-odds">
              Build Target Ticket
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚽</span>
              <h3>1X2 & Double Chance</h3>
            </div>
            <p>
              Full-time match outcome, Home/Draw/Away selections, and Double Chance risk
              mitigations.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🥅</span>
              <h3>Goals Over / Under</h3>
            </div>
            <p>
              Total match goals (Over 1.5, Over 2.5, Under 3.5) with historical goal
              rate analytics.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🤝</span>
              <h3>Both Teams to Score (BTTS)</h3>
            </div>
            <p>
              BTTS Yes / No markets calculated using team defensive and attacking
              efficiency scores.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
