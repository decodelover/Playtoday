"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./auth.module.css";

export function AuthTabSwitcher() {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  const isSignUp = pathname === "/sign-up";

  // Only render segmented tab switcher on sign-in and sign-up pages
  if (!isSignIn && !isSignUp) {
    return null;
  }

  return (
    <div
      aria-label="Account navigation"
      className={styles.tabSwitcher}
      role="navigation"
    >
      <Link
        aria-current={isSignIn ? "page" : undefined}
        className={styles.tabLink}
        data-active={isSignIn ? "true" : undefined}
        href="/sign-in"
      >
        Sign In
      </Link>
      <Link
        aria-current={isSignUp ? "page" : undefined}
        className={styles.tabLink}
        data-active={isSignUp ? "true" : undefined}
        href="/sign-up"
      >
        Create Account
      </Link>
    </div>
  );
}
