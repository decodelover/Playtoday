"use client";

import { useState } from "react";

import styles from "./home.module.css";

const sportsCoverage = [
  { name: "Football.com", icon: "⚽", category: "Football Portal" },
  { name: "FlashScore", icon: "⚡", category: "Live Scores" },
  { name: "AiScore", icon: "◈", category: "Match Analytics" },
  { name: "FotMob", icon: "✦", category: "Match Telemetry" },
  { name: "SofaScore", icon: "📊", category: "Live Ratings" },
  { name: "Opta Sports", icon: "◎", category: "Opta Data Feeds" },
  { name: "Sky Sports", icon: "📺", category: "Broadcasting" },
  { name: "Sport TV", icon: "📡", category: "Live Sports Media" },
  { name: "LiveScore", icon: "⏱", category: "Real-Time Tracking" },
  { name: "Transfermarkt", icon: "📈", category: "Valuations & Form" },
] as const;

export function FoundationCarousel() {
  const [paused, setPaused] = useState(false);

  return (
    <div className={styles.marqueeFrame} data-paused={paused ? true : undefined}>
      <div className={styles.marquee} tabIndex={0}>
        <div className={styles.marqueeTrack}>
          {[0, 1].map((copy) => (
            <ul
              aria-hidden={copy === 1 ? true : undefined}
              className={styles.foundationList}
              key={copy}
            >
              {sportsCoverage.map((item) => (
                <li key={`${copy}-${item.name}`}>
                  <span aria-hidden="true" className={styles.foundationMark}>
                    {item.icon}
                  </span>
                  <div className={styles.sportsInfo}>
                    <strong>{item.name}</strong>
                    <small>{item.category}</small>
                  </div>
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
