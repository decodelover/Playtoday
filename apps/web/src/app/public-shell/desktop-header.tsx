"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { isPublicRouteActive, publicRoutes } from "./routes";
import styles from "./shell.module.css";

function PublicNavLink({ label, path }: Readonly<{ label: string; path: string }>) {
  const pathname = usePathname();
  const isActive = isPublicRouteActive(pathname, path);
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={styles.navLink}
      href={path}
    >
      <span>{label}</span>
      {isActive ? <span className={styles.activeIndicator} aria-hidden="true" /> : null}
    </Link>
  );
}

function Wordmark() {
  return (
    <Link className={styles.wordmark} href="/" aria-label="PlayToday home">
      <span className={styles.wordmarkMark} aria-hidden="true">
        <i />
        <i />
      </span>
      <span className={styles.wordmarkText}>
        <strong>PLAYTODAY</strong>
        <small>Sports intelligence</small>
      </span>
    </Link>
  );
}

export function DesktopHeader() {
  const primaryRoutes = publicRoutes.filter((route) => route.header);
  const shouldReduceMotion = useReducedMotion();
  const hoverProps = shouldReduceMotion
    ? {}
    : {
        whileHover: { y: -2 },
        whileTap: { scale: 0.98 },
      };

  return (
    <div className={styles.desktopHeaderContainer}>
      <Wordmark />
      <nav aria-label="Primary public navigation" className={styles.desktopNav}>
        {primaryRoutes.map((route) => (
          <PublicNavLink key={route.key} label={route.label} path={route.path} />
        ))}
      </nav>
      <div className={styles.headerActions}>
        <span className={styles.statusBadge}>
          <i className={styles.statusDot} aria-hidden="true" />
          <span>FOOTBALL COVERAGE</span>
        </span>
        <Link className={styles.utilityLink} href="/sign-in">
          Sign in
        </Link>
        <motion.div
          {...hoverProps}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link className={styles.headerCta} href="/sign-up">
            Get started <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
