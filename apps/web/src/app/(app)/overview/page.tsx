import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function OverviewPage() {
  const route = getShellRoute("overview");
  return (
    <WorkspacePageWrapper
      badgeText="CANONICAL SPORTS ENGINE ONLINE"
      route={route}
      subtitle="Welcome to your PlayToday Sports Intelligence Workspace. Monitor live data pipelines, canonical football schemas, and target bookmaker coverage."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>PRODUCTION PLATFORM</span>
            <h2 className={styles.panelTitle}>Platform Workspace Overview</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/games">
              Explore Games
            </Link>
            <Link className={styles.actionBtnPrimary} href="/ai-analyst">
              Launch AI Analyst
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚽</span>
              <h3>Canonical Football Engine</h3>
            </div>
            <p>
              Production database foundation active. Real API-Football ingestion adapter
              handles competitions, teams, venues, and fixtures with zero mock fallback
              data.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🎯</span>
              <h3>Target Bookmaker Matrix</h3>
            </div>
            <p>
              Target bookmakers (SportyBet, Bet9ja, MSport) explicitly configured with
              bookmaker odds integration boundary rules.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🛡️</span>
              <h3>Security & Compliance</h3>
            </div>
            <p>
              Server-only credential management (`SPORTS_PROVIDER_API_KEY`,
              `SUPABASE_SERVICE_ROLE_KEY`) with strict PostgreSQL Row Level Security
              (RLS).
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
