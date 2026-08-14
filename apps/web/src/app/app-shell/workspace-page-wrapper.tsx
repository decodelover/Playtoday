"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { type ShellRoute } from "./routes";
import styles from "./shell.module.css";
import { ArrowRightIcon, ShieldIcon } from "../../components/dashboard/dashboard-icons";

interface WorkspacePageWrapperProps {
  route: ShellRoute;
  subtitle?: string;
  badgeText?: string;
  children?: ReactNode;
  headerActions?: ReactNode;
}

export function WorkspacePageWrapper({
  route,
  subtitle,
  badgeText = "Not available",
  children,
  headerActions,
}: Readonly<WorkspacePageWrapperProps>) {
  return (
    <div className={styles.workspaceContainer}>
      {/* 1. Sleek Natural Page Header */}
      <section className={styles.pageHeaderBanner}>
        <div className={styles.pageHeaderMain}>
          <div className={styles.pageHeaderBadgeRow}>
            <span className={styles.statusPill}>
              <span className={styles.statusDot} aria-hidden="true" />
              {badgeText}
            </span>
            <span className={styles.groupBadge}>{route.group}</span>
          </div>

          <h1 className={styles.pageHeaderTitle}>{route.label}</h1>
          <p className={styles.pageHeaderDescription}>
            {subtitle ?? route.description}
          </p>
        </div>

        {headerActions ? (
          <div className={styles.pageHeaderActions}>{headerActions}</div>
        ) : null}
      </section>

      {/* 2. Page Content Body */}
      <section className={styles.contentSection}>
        {children ?? <DefaultWorkspacePanel route={route} />}
      </section>
    </div>
  );
}

function DefaultWorkspacePanel({ route }: Readonly<{ route: ShellRoute }>) {
  return (
    <div className={styles.defaultWorkspaceCard}>
      <div className={styles.defaultCardHeader}>
        <div className={styles.defaultIconBox}>
          <ShieldIcon size={22} />
        </div>
        <div>
          <h2 className={styles.defaultCardTitle}>{route.label} Workspace</h2>
          <p className={styles.defaultCardSubtitle}>
            Authenticated module connected to PlayToday canonical sports intelligence.
          </p>
        </div>
      </div>

      <div className={styles.defaultCardBody}>
        <p className={styles.defaultCardText}>
          PlayToday has no live sports data, selections, fixtures, odds, or working
          tools to show here when providers are unconfigured. Truthful states are
          displayed instead of fake data.
        </p>
      </div>

      <div className={styles.defaultCardFooter}>
        <Link className={styles.actionBtnSecondary} href="/games">
          Explore Games
        </Link>
        <Link className={styles.actionBtnPrimary} href="/ai-analyst">
          <span>Ask AI Analyst</span>
          <ArrowRightIcon size={15} />
        </Link>
      </div>
    </div>
  );
}
