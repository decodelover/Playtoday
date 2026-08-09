"use client";

import { useState } from "react";

import styles from "./home.module.css";

const foundation = [
  { name: "Next.js", mark: "N" },
  { name: "React", mark: "R" },
  { name: "TypeScript", mark: "TS" },
  { name: "Tailwind CSS", mark: "TW" },
  { name: "pnpm", mark: "PN" },
  { name: "Vitest", mark: "V" },
] as const;

export function FoundationCarousel() {
  const [paused, setPaused] = useState(false);

  return (
    <div className={styles.marqueeFrame} data-paused={paused ? true : undefined}>
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {[0, 1].map((copy) => (
            <ul
              aria-hidden={copy === 1 ? true : undefined}
              className={styles.foundationList}
              key={copy}
            >
              {foundation.map((item) => (
                <li key={`${copy}-${item.name}`}>
                  <span aria-hidden="true" className={styles.foundationMark}>
                    {item.mark}
                  </span>
                  <strong>{item.name}</strong>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        aria-pressed={paused}
        className={styles.marqueeControl}
        onClick={() => setPaused((current) => !current)}
        type="button"
      >
        {paused ? "Resume rail" : "Pause rail"}
      </button>
    </div>
  );
}
