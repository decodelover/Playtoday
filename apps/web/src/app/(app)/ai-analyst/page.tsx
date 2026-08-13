import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function AiAnalystPage() {
  const route = getShellRoute("ai-analyst");
  return (
    <WorkspacePageWrapper
      badgeText="GROUNDED AI ANALYST ONLINE"
      route={route}
      subtitle="Interact with PlayToday's AI Analyst powered by real sports data, team metrics, and canonical fixture statistics."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>INTELLIGENCE ASSISTANT</span>
            <h2 className={styles.panelTitle}>AI Sports Analyst</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/games">
              Select Match
            </Link>
            <Link className={styles.actionBtnPrimary} href="/target-odds">
              Build Target Odds
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🧠</span>
              <h3>Context-Grounded Insights</h3>
            </div>
            <p>
              The AI Analyst consumes canonical match context directly from PostgreSQL
              to provide grounded, un-hallucinated tactical breakdowns and statistics.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚡</span>
              <h3>Prediction Assistant</h3>
            </div>
            <p>
              Analyzes historical team head-to-head records, goal distribution, and form
              indicators without inventing injuries or lineups.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🛡️</span>
              <h3>No-Slop Integrity</h3>
            </div>
            <p>
              Provides truthful, risk-aware responses with explicit responsible play
              boundaries.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
