import Link from "next/link";
import { getShellRoute } from "../../app-shell/routes";
import { WorkspacePageWrapper } from "../../app-shell/workspace-page-wrapper";
import styles from "../../app-shell/shell.module.css";

export default function SupportPage() {
  const route = getShellRoute("support");
  return (
    <WorkspacePageWrapper
      badgeText="HELP & SUPPORT ONLINE"
      route={route}
      subtitle="Access PlayToday documentation, responsible play guidance, account security controls, and support resources."
    >
      <div className={styles.workspacePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleGroup}>
            <span className={styles.panelBadge}>HELP CENTER</span>
            <h2 className={styles.panelTitle}>PlayToday Assistance</h2>
          </div>
          <div className={styles.panelActions}>
            <Link className={styles.actionBtnSecondary} href="/settings/security">
              Security Controls
            </Link>
            <Link className={styles.actionBtnPrimary} href="/settings/responsible-play">
              Responsible Play
            </Link>
          </div>
        </div>

        <div className={styles.panelGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📖</span>
              <h3>System Documentation</h3>
            </div>
            <p>
              Learn about our canonical sports data model, model probability
              calculations, and bookmaker odds integration policies.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🛡️</span>
              <h3>Account Security & Privacy</h3>
            </div>
            <p>
              Manage multi-factor authentication, active session revocation, password
              changes, and personal data export requests.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>💚</span>
              <h3>Responsible Play Limits</h3>
            </div>
            <p>
              Set deposit limits, cooling-off breaks, or self-exclusion options at any
              time.
            </p>
          </div>
        </div>
      </div>
    </WorkspacePageWrapper>
  );
}
