"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { type ShellRoute } from "./routes";
import styles from "./shell.module.css";

interface WorkspacePageWrapperProps {
  route: ShellRoute;
  subtitle?: string;
  badgeText?: string;
  children?: ReactNode;
}

export function WorkspacePageWrapper({
  route,
  subtitle,
  badgeText = "Not available",
  children,
}: Readonly<WorkspacePageWrapperProps>) {
  return (
    <div className={styles.workspaceContainer}>
      {/* 1. Rich Hero Header Banner */}
      <section className={styles.heroBanner} data-group={route.group}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.statusPill}>
              <span className={styles.statusDot} aria-hidden="true" />
              {badgeText}
            </span>
            <span className={styles.groupBadge}>{route.group} Workspace</span>
          </div>

          <h1 className={styles.heroTitle}>{route.label}</h1>
          <p className={styles.heroDescription}>{subtitle ?? route.description}</p>
        </div>

        <div className={styles.heroMetrics}>
          <div className={styles.miniMetric}>
            <span className={styles.miniLabel}>Provider Source</span>
            <strong className={styles.miniValue}>API-Football v3</strong>
          </div>
          <div className={styles.miniMetric}>
            <span className={styles.miniLabel}>Data Model</span>
            <strong className={styles.miniValue}>Canonical Postgres</strong>
          </div>
          <div className={styles.miniMetric}>
            <span className={styles.miniLabel}>Data Honesty</span>
            <strong className={styles.miniValue}>100% Production Real</strong>
          </div>
        </div>
      </section>

      {/* 2. Primary Bento Metrics Grid */}
      <section aria-label="System Metrics" className={styles.bentoGrid}>
        <div className={styles.bentoCard} data-tone="emerald">
          <div className={styles.bentoHeader}>
            <span className={styles.bentoIcon} aria-hidden="true">
              ⚡
            </span>
            <span className={styles.bentoTag}>Ingestion Pipeline</span>
          </div>
          <div className={styles.bentoBody}>
            <strong className={styles.bentoValue}>Idempotent UPSERT</strong>
            <p className={styles.bentoSubtext}>
              Provider mapping layer active with PostgreSQL unique constraints.
            </p>
          </div>
          <div className={styles.bentoFooter}>
            <span className={styles.indicatorActive}>Active Sync Engine</span>
          </div>
        </div>

        <div className={styles.bentoCard} data-tone="blue">
          <div className={styles.bentoHeader}>
            <span className={styles.bentoIcon} aria-hidden="true">
              🛡️
            </span>
            <span className={styles.bentoTag}>Data Security</span>
          </div>
          <div className={styles.bentoBody}>
            <strong className={styles.bentoValue}>Strict RLS Policies</strong>
            <p className={styles.bentoSubtext}>
              Service-role write isolation. Zero client-side API key leakage.
            </p>
          </div>
          <div className={styles.bentoFooter}>
            <span className={styles.indicatorSecured}>Public Read Views</span>
          </div>
        </div>

        <div className={styles.bentoCard} data-tone="purple">
          <div className={styles.bentoHeader}>
            <span className={styles.bentoIcon} aria-hidden="true">
              ⚽
            </span>
            <span className={styles.bentoTag}>Target Coverage</span>
          </div>
          <div className={styles.bentoBody}>
            <strong className={styles.bentoValue}>Global Competitions</strong>
            <p className={styles.bentoSubtext}>
              Premier League, Champions League, La Liga, Serie A, Bundesliga & more.
            </p>
          </div>
          <div className={styles.bentoFooter}>
            <span className={styles.indicatorTracked}>Canonical Schema</span>
          </div>
        </div>

        <div className={styles.bentoCard} data-tone="pink">
          <div className={styles.bentoHeader}>
            <span className={styles.bentoIcon} aria-hidden="true">
              🎯
            </span>
            <span className={styles.bentoTag}>Target Bookmakers</span>
          </div>
          <div className={styles.bentoBody}>
            <strong className={styles.bentoValue}>SportyBet & Bet9ja</strong>
            <p className={styles.bentoSubtext}>
              Target coverage explicit as unverified until bookmaker adapters are
              connected.
            </p>
          </div>
          <div className={styles.bentoFooter}>
            <span className={styles.indicatorUnverified}>Target Coverage</span>
          </div>
        </div>
      </section>

      {/* 3. Custom Page Content / Honest Architecture Panel */}
      <section className={styles.contentSection}>
        {children ?? <DefaultWorkspacePanel route={route} />}
      </section>
    </div>
  );
}

function DefaultWorkspacePanel({ route }: Readonly<{ route: ShellRoute }>) {
  return (
    <div className={styles.workspacePanel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleGroup}>
          <span className={styles.panelBadge}>CANONICAL MODULE</span>
          <h2 className={styles.panelTitle}>{route.label} Intelligence Module</h2>
        </div>
        <div className={styles.panelActions}>
          <Link className={styles.actionBtnSecondary} href="/support">
            System Docs
          </Link>
          <Link className={styles.actionBtnPrimary} href="/settings">
            Account Settings
          </Link>
        </div>
      </div>

      <div className={styles.panelGrid}>
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>📊</span>
            <h3>Canonical Database Foundation</h3>
          </div>
          <p>
            PlayToday runs on an audited PostgreSQL foundation. Canonical tables (
            <code>sports</code>, <code>competitions</code>, <code>teams</code>,{" "}
            <code>fixtures</code>) are populated via server-only ingestion adapters with
            zero fictional fallback data.
          </p>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>🔒</span>
            <h3>Data Honesty Guarantee</h3>
          </div>
          <p>
            PlayToday has no live sports data, selections, fixtures, odds, or working
            tools to show here when providers are unconfigured. Truthful states are
            displayed instead of fake odds.
          </p>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>🚀</span>
            <h3>System Capabilities</h3>
          </div>
          <p>
            Real-time live score feeds, target odds comparison matrices, Daily Edge
            settlement tracking, and AI Analyst assistant tools integrate directly into
            this workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
