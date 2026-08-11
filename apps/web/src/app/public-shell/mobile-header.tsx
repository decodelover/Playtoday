"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@playtoday/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { isPublicRouteActive, publicRoutes } from "./routes";
import styles from "./shell.module.css";

function PublicMobileLink({ label, path }: Readonly<{ label: string; path: string }>) {
  const pathname = usePathname();
  const isActive = isPublicRouteActive(pathname, path);

  return (
    <SheetClose asChild>
      <Link
        aria-current={isActive ? "page" : undefined}
        className={styles.mobileNavLink}
        href={path}
      >
        <span>{label}</span>
        <span className={styles.mobileNavArrow} aria-hidden="true">
          →
        </span>
      </Link>
    </SheetClose>
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
      </span>
    </Link>
  );
}

export function MobileHeader() {
  const mobileRoutes = publicRoutes.filter(
    (route) =>
      route.mobile &&
      route.key !== "home" &&
      route.key !== "sign-in" &&
      route.key !== "sign-up",
  );
  const shouldReduceMotion = useReducedMotion();
  const buttonTapProps = shouldReduceMotion
    ? {}
    : {
        whileTap: { scale: 0.96 },
      };

  return (
    <div className={styles.mobileHeaderContainer}>
      <Wordmark />
      <Sheet>
        <SheetTrigger asChild>
          <motion.button
            aria-label="Open public navigation"
            className={styles.menuTrigger}
            type="button"
            {...buttonTapProps}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.hamburgerIcon} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </motion.button>
        </SheetTrigger>
        <SheetContent
          aria-describedby="public-menu-description"
          className={styles.drawer}
          side="right"
        >
          <div className={styles.drawerHeader}>
            <div className={styles.drawerHeaderTitleGroup}>
              <SheetTitle className={styles.drawerTitle}>
                <span className={styles.drawerTitleMark} aria-hidden="true" />
                PLAYTODAY
              </SheetTitle>
              <SheetDescription id="public-menu-description">
                Explainable sports intelligence & evidence.
              </SheetDescription>
            </div>
            <SheetClose asChild>
              <button
                aria-label="Close public navigation"
                className={styles.closeTrigger}
                type="button"
              >
                <span className={styles.closeIcon} aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
            </SheetClose>
          </div>
          <nav aria-label="Mobile public navigation" className={styles.mobileNav}>
            <ul>
              {mobileRoutes.map((route, index) => (
                <li className={styles.mobileNavItem} key={route.key}>
                  <span className={styles.mobileNavIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <PublicMobileLink label={route.label} path={route.path} />
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.drawerFooterGroup}>
            <div className={styles.mobileActions}>
              <SheetClose asChild>
                <Link className={styles.mobileUtilityBtn} href="/sign-in">
                  Sign in
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link className={styles.mobileCtaBtn} href="/sign-up">
                  Get started <span aria-hidden="true">→</span>
                </Link>
              </SheetClose>
            </div>
            <div className={styles.drawerTagline}>
              <span>PT // FOOTBALL INTELLIGENCE</span>
              <span>SPORTS INTELLIGENCE</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
