"use client";

import { Fragment, useEffect, useRef } from "react";
import { DesktopHeader } from "./desktop-header";
import { MobileHeader } from "./mobile-header";
import styles from "./shell.module.css";

export function PublicHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const sentinel = sentinelRef.current;
    if (!header || !sentinel || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        header.dataset.scrolled = entry?.isIntersecting ? "false" : "true";
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <Fragment>
      <span aria-hidden="true" className={styles.headerSentinel} ref={sentinelRef} />
      <header className={styles.header} ref={headerRef}>
        <div className={styles.headerInner}>
          <DesktopHeader />
          <MobileHeader />
        </div>
      </header>
    </Fragment>
  );
}
