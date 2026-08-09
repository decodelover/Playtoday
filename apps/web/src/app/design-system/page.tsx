import type { Metadata } from "next";
import Link from "next/link";

import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "Public design system",
  description:
    "The current PlayToday public visual language, content rules, and interaction standards.",
  robots: { index: false, follow: false },
};

const rules = [
  [
    "01",
    "Evidence before decoration",
    "Visual hierarchy should make source, freshness, uncertainty, and status easier to read.",
  ],
  [
    "02",
    "Colour with a clear role",
    "Pink marks action, mint confirms orientation, and neither is used as a fake performance cue.",
  ],
  [
    "03",
    "No invented records",
    "Fixtures, prices, probabilities, results, and testimonials appear only when a production source provides them.",
  ],
  [
    "04",
    "Motion with a job",
    "Controls respond within 220ms. Section reveals use a single 420ms entrance and disappear when reduced motion is requested.",
  ],
  [
    "05",
    "Continuous rails stay honest",
    "A looping technology rail names only tools verified in the repository. It never implies customers or partnerships.",
  ],
  [
    "06",
    "Images cannot manufacture evidence",
    "Concept imagery may create atmosphere, but it cannot contain readable scores, odds, records, provider marks, or performance claims.",
  ],
] as const;

export default function DesignSystemPreview() {
  return (
    <main className={styles.preview}>
      <header className={styles.hero}>
        <div className={styles.topline}>
          <Link href="/">PLAYTODAY</Link>
          <span>Public system / v1</span>
        </div>
        <p className={styles.marker}>DESIGN DIRECTION</p>
        <h1>Matchday editorial, stripped to the evidence.</h1>
        <p>
          The public interface uses deep navy, crisp white, soft lavender, compact data
          labels, and restrained pink and mint accents. No glass, casino neon, product
          mockups, or synthetic results.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="colour-title">
        <div className={styles.sectionTitle}>
          <span>01</span>
          <h2 id="colour-title">Colour</h2>
        </div>
        <div className={styles.swatches}>
          <article data-colour="ink">
            <strong>Deep navy</strong>
            <code>#01002C</code>
          </article>
          <article data-colour="paper">
            <strong>Soft lavender</strong>
            <code>#E3E2FF</code>
          </article>
          <article data-colour="signal">
            <strong>Action pink</strong>
            <code>#FF0F50</code>
          </article>
          <article data-colour="muted">
            <strong>Fresh mint</strong>
            <code>#4ED8A0</code>
          </article>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="type-title">
        <div className={styles.sectionTitle}>
          <span>02</span>
          <h2 id="type-title">Type</h2>
        </div>
        <div className={styles.typeSpec}>
          <p className={styles.display}>Football analysis that shows its work.</p>
          <div>
            <p>
              Geist Sans carries headlines and reading text. Large headings use tight
              tracking and an editorial line height. Body copy stays below 65 characters
              when the layout allows.
            </p>
            <code>Geist Mono / 01 / PRE-MATCH / REVIEW PENDING</code>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="rule-title">
        <div className={styles.sectionTitle}>
          <span>03</span>
          <h2 id="rule-title">Rules</h2>
        </div>
        <ol className={styles.ruleList}>
          {rules.map(([number, title, body]) => (
            <li key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="state-title">
        <div className={styles.sectionTitle}>
          <span>04</span>
          <h2 id="state-title">States</h2>
        </div>
        <div className={styles.statePanel}>
          <div>
            <span>Live performance records</span>
            <strong>Not published</strong>
          </div>
          <p>
            An unavailable dataset gets a composed, direct explanation. It does not get
            a made-up chart, a blurred mockup, or a spinner that never resolves.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/">Return to the public site</Link>
        <span>Keyboard focus, 44px targets, responsive layout, reduced motion.</span>
      </footer>
    </main>
  );
}
