"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

import styles from "./shell.module.css";

const REVEAL_SELECTOR = "[data-reveal]";

export function ScrollReveal({ children }: Readonly<{ children: ReactNode }>) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    root.dataset.motionReady = "true";

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealImmediately = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((item) => {
        item.dataset.revealVisible = "true";
      });
    };

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
          (entry.target as HTMLElement).dataset.revealVisible = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );

    const observe = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((item) => {
        if (item.dataset.revealVisible !== "true") {
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
    <div className={styles.motionRoot} ref={rootRef}>
      {children}
    </div>
  );
}
