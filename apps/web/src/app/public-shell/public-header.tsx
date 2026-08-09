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

import { isPublicRouteActive, publicRoutes } from "./routes";
import styles from "./shell.module.css";

function PublicLink({
  label,
  path,
  close = false,
}: Readonly<{ label: string; path: string; close?: boolean }>) {
  const pathname = usePathname();
  const link = (
    <Link
      aria-current={isPublicRouteActive(pathname, path) ? "page" : undefined}
      className={styles.navLink}
      href={path}
    >
      {label}
    </Link>
  );
  return close ? <SheetClose asChild>{link}</SheetClose> : link;
}

function Wordmark() {
  return (
    <Link className={styles.wordmark} href="/" aria-label="PlayToday home">
      <span className={styles.wordmarkMark} aria-hidden="true">
        <i />
        <i />
      </span>
      <span>PLAYTODAY</span>
    </Link>
  );
}

export function PublicHeader() {
  const primary = publicRoutes.filter((route) => route.header);
  const mobile = publicRoutes.filter(
    (route) =>
      route.mobile &&
      route.key !== "home" &&
      route.key !== "sign-in" &&
      route.key !== "sign-up",
  );

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Wordmark />
        <nav aria-label="Primary public navigation" className={styles.desktopNav}>
          {primary.map((route) => (
            <PublicLink key={route.key} label={route.label} path={route.path} />
          ))}
        </nav>
        <div className={styles.headerActions}>
          <Link className={styles.utilityLink} href="/sign-in">
            Sign in
          </Link>
          <Link className={styles.headerCta} href="/sign-up">
            Get started <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <button
              aria-label="Open public navigation"
              className={styles.menuTrigger}
              type="button"
            >
              <span className={styles.hamburgerIcon} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          </SheetTrigger>
          <SheetContent
            aria-describedby="public-menu-description"
            className={styles.drawer}
            side="right"
          >
            <div className={styles.drawerHeader}>
              <div>
                <SheetTitle>PlayToday</SheetTitle>
                <SheetDescription id="public-menu-description">
                  Public pages and product information.
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
                {mobile.map((route, index) => (
                  <li className={styles.mobileNavItem} key={route.key}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <PublicLink close label={route.label} path={route.path} />
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.mobileActions}>
              <SheetClose asChild>
                <Link className={styles.utilityLink} href="/sign-in">
                  Sign in
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link className={styles.headerCta} href="/sign-up">
                  Get started <span aria-hidden="true">→</span>
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
