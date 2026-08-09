import type { ReactNode } from "react";
import { PublicFooter } from "./public-footer";
import { PublicHeader } from "./public-header";
import { ScrollReveal } from "./scroll-reveal";
import styles from "./shell.module.css";

export function PublicShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#public-main">
        Skip to main content
      </a>
      <PublicHeader />
      <main id="public-main" tabIndex={-1}>
        <ScrollReveal>{children}</ScrollReveal>
      </main>
      <PublicFooter />
    </div>
  );
}
