"use client";

import { useEffect, useRef, type ReactNode } from "react";

import styles from "./shell.module.css";

const REVEAL_SELECTOR = "[data-reveal]";

export function ScrollReveal({ children }: Readonly<{ children: ReactNode }>) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealImmediately = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((item) => {
        item.setAttribute("data-reveal-visible", "true");
      });
    };

    root.setAttribute("data-motion-ready", "true");

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      revealImmediately(root);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          (entry.target as HTMLElement).setAttribute("data-reveal-visible", "true");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    const observe = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((item) => {
        if (item.getAttribute("data-reveal-visible") !== "true") {
          observer.observe(item);
        }
      });
    };

    observe(root);

    const mutationObserver = new MutationObserver(() => observe(root));
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles.motionRoot} ref={rootRef} suppressHydrationWarning>
      {children}
    </div>
  );
}
