import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./auth.module.css";

function PlayTodayLogo() {
  return (
    <Link aria-label="PlayToday home" className={styles.brandLink} href="/">
      <span aria-hidden="true" className={styles.wordmarkMark}>
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

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className={styles.authShell}>
      <div className={styles.authContainer}>
        {/* Left Column — Floating Hero Card (Desktop) */}
        <section aria-label="PlayToday overview" className={styles.authHeroCard}>
          <div className={styles.brandHeader}>
            <PlayTodayLogo />
            <span className={styles.brandPill}>
              <span aria-hidden="true" className={styles.statusDot} />
              LIVE TELEMETRY
            </span>
          </div>

          <div className={styles.heroContent}>
            <h2 className={styles.heroHeading}>
              Explainable sports intelligence for today&apos;s games.
            </h2>
            <p className={styles.heroSubtext}>
              PlayToday is built for sports enthusiasts who demand evidence, probability
              analysis, and full result history behind every football selection.
            </p>
          </div>

          <Link className={styles.backHomeBtn} href="/">
            ← Back to Home
          </Link>
        </section>

        {/* Right Column — Form Panel with Mobile Brand Header */}
        <main className={styles.authCard}>
          <div className={styles.mobileBrandHeader}>
            <PlayTodayLogo />
            <Link
              className={styles.backHomeBtn}
              href="/"
              style={{
                minHeight: "2.4rem",
                paddingInline: "0.9rem",
                fontSize: "0.8rem",
              }}
            >
              ← Home
            </Link>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
