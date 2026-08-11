"use client";

import {
  ANALYSIS_STRATEGIES,
  RISK_PREFERENCES,
  SUPPORTED_BOOKMAKERS,
  SUPPORTED_MARKETS,
  type UserPreferencesInput,
} from "@playtoday/validation";
import { useState } from "react";

import { updatePreferencesAction } from "../../../actions/settings";
import styles from "../settings.module.css";

export function PreferencesForm({
  initial,
}: Readonly<{ initial: UserPreferencesInput }>) {
  const [preferences, setPreferences] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function toggleBookmaker(id: (typeof SUPPORTED_BOOKMAKERS)[number]["id"]) {
    setPreferences((current) => ({
      ...current,
      preferred_bookmakers: current.preferred_bookmakers.includes(id)
        ? current.preferred_bookmakers.filter((value) => value !== id)
        : [...current.preferred_bookmakers, id],
    }));
    setStatus("idle");
  }

  function toggleMarket(id: (typeof SUPPORTED_MARKETS)[number]["id"]) {
    setPreferences((current) => ({
      ...current,
      preferred_markets: current.preferred_markets.includes(id)
        ? current.preferred_markets.filter((value) => value !== id)
        : [...current.preferred_markets, id],
    }));
    setStatus("idle");
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("saving");
        setMessage(null);
        void updatePreferencesAction(preferences).then((result) => {
          setStatus(result.success ? "saved" : "error");
          setMessage(
            result.success
              ? "Your analysis preferences are saved."
              : (result.error ?? null),
          );
        });
      }}
    >
      <section className={styles.formSection}>
        <div className={styles.panelHeader}>
          <h2>Sports</h2>
          <p>Football is the only sport with operational PlayToday coverage.</p>
        </div>
        <label className={styles.choice}>
          <input checked disabled type="checkbox" />
          <span>
            <span>Football</span>
            <small>Active analytics coverage.</small>
          </span>
        </label>
      </section>

      <section className={styles.formSection}>
        <fieldset className={styles.fieldset}>
          <legend>Preferred bookmakers</legend>
          <p className={styles.helper}>
            PlayToday formats selections for these platforms. It never asks for your
            bookmaker login details.
          </p>
          <div className={styles.choiceGrid}>
            {SUPPORTED_BOOKMAKERS.map((bookmaker) => (
              <label className={styles.choice} key={bookmaker.id}>
                <input
                  checked={preferences.preferred_bookmakers.includes(bookmaker.id)}
                  onChange={() => toggleBookmaker(bookmaker.id)}
                  type="checkbox"
                />
                <span>
                  <span>{bookmaker.name}</span>
                  <small>{bookmaker.description}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={styles.formSection}>
        <fieldset className={styles.fieldset}>
          <legend>Preferred markets</legend>
          <p className={styles.helper}>Choose the markets you want prioritised.</p>
          <div className={styles.choiceGrid}>
            {SUPPORTED_MARKETS.map((market) => (
              <label className={styles.choice} key={market.id}>
                <input
                  checked={preferences.preferred_markets.includes(market.id)}
                  onChange={() => toggleMarket(market.id)}
                  type="checkbox"
                />
                <span>
                  <span>{market.label}</span>
                  <small>{market.description}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={styles.formSection}>
        <div className={styles.panelHeader}>
          <h2>Target odds and analysis style</h2>
          <p>Higher target odds usually come with more uncertainty.</p>
        </div>
        <div className={styles.field}>
          <label htmlFor="target-odds">Default target odds</label>
          <input
            id="target-odds"
            inputMode="decimal"
            max={1000}
            min={1.05}
            onChange={(event) => {
              setPreferences((current) => ({
                ...current,
                target_odds: Number(event.target.value),
              }));
              setStatus("idle");
            }}
            required
            step="0.05"
            type="number"
            value={preferences.target_odds}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="strategy">Analysis strategy</label>
          <select
            id="strategy"
            onChange={(event) => {
              setPreferences((current) => ({
                ...current,
                default_strategy: event.target
                  .value as UserPreferencesInput["default_strategy"],
              }));
              setStatus("idle");
            }}
            value={preferences.default_strategy}
          >
            {ANALYSIS_STRATEGIES.map((strategy) => (
              <option key={strategy.id} value={strategy.id}>
                {strategy.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="risk">Risk preference</label>
          <select
            id="risk"
            onChange={(event) => {
              setPreferences((current) => ({
                ...current,
                risk_preference: event.target
                  .value as UserPreferencesInput["risk_preference"],
              }));
              setStatus("idle");
            }}
            value={preferences.risk_preference}
          >
            {RISK_PREFERENCES.map((risk) => (
              <option key={risk.id} value={risk.id}>
                {risk.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className={styles.buttonRow}>
        <button className={styles.button} disabled={status === "saving"} type="submit">
          {status === "saving" ? "Saving..." : "Save preferences"}
        </button>
        {message ? (
          <p
            aria-live="polite"
            className={status === "saved" ? styles.formSuccess : styles.formError}
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
