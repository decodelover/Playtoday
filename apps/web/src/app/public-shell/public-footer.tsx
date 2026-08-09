import Link from "next/link";

import { publicRoutes } from "./routes";
import styles from "./shell.module.css";

export function PublicFooter() {
  const footerRoutes = publicRoutes.filter((route) => route.footer !== null);
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner} data-reveal="up">
        <div className={styles.footerStatement}>
          <p className={styles.sectionMarker}>
            <span>PT</span>Football intelligence
          </p>
          <h2>Keep the reasoning beside the result.</h2>
        </div>
        <div className={styles.footerDetails}>
          <p>
            PlayToday is planned as analysis and decision support. It does not take
            stakes, place bets, or guarantee outcomes.
          </p>
          <nav aria-label="Footer navigation" className={styles.footerNav}>
            {footerRoutes.map((route) => (
              <Link href={route.path} key={route.key}>
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className={styles.footerBase}>
        <span>© {new Date().getFullYear()} PlayToday</span>
        <span>Adults only. Outcomes remain uncertain.</span>
      </div>
    </footer>
  );
}
