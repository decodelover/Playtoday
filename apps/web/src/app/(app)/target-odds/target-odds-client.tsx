"use client";

import { useState } from "react";
import type { TargetOddsOutput } from "@playtoday/ai-tools";
import styles from "./target-odds.module.css";

const PRESET_MULTIPLIERS = [2.0, 3.5, 5.0, 10.0, 20.0];

export function TargetOddsClient() {
  const [multiplier, setMultiplier] = useState<number>(3.5);
  const [customInput, setCustomInput] = useState<string>("");
  const [riskTolerance, setRiskTolerance] = useState<"conservative" | "balanced" | "aggressive">("balanced");
  const [result, setResult] = useState<TargetOddsOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    const targetVal = customInput ? parseFloat(customInput) : multiplier;

    try {
      const res = await fetch("/api/ai/target-odds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetMultiplier: targetVal, riskTolerance }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Target odds compilation failed");
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.targetContainer}>
      {/* Target Odds Parameters Card */}
      <div className={styles.configCard}>
        <div className={styles.configRow}>
          <div>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--pt-stone-500)", textTransform: "uppercase" }}>
              Target Odds Multiplier
            </span>
            <div className={styles.multiplierPills}>
              {PRESET_MULTIPLIERS.map((m) => (
                <button
                  className={styles.pillBtn}
                  data-active={!customInput && multiplier === m}
                  key={m}
                  onClick={() => {
                    setMultiplier(m);
                    setCustomInput("");
                  }}
                  type="button"
                >
                  {m.toFixed(2)}x
                </button>
              ))}
              <input
                placeholder="Custom..."
                style={{
                  width: "6rem",
                  minHeight: "2.25rem",
                  padding: "0 0.75rem",
                  border: "1px solid var(--pt-border-default)",
                  borderRadius: "99px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  outline: "none",
                }}
                type="number"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              />
            </div>
          </div>

          <div>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--pt-stone-500)", textTransform: "uppercase" }}>
              Risk Profile
            </span>
            <div className={styles.riskGroup}>
              {(["conservative", "balanced", "aggressive"] as const).map((r) => (
                <button
                  className={styles.riskBtn}
                  data-active={riskTolerance === r}
                  key={r}
                  onClick={() => setRiskTolerance(r)}
                  type="button"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.generateBtn}
            disabled={isLoading}
            onClick={handleGenerate}
            type="button"
          >
            {isLoading ? "⚡ Computing Accumulator..." : "⚡ Generate Optimized Slip"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: "1rem", background: "#fee2e2", color: "#b91c1c", borderRadius: "0.75rem" }}>
          <strong>Compilation Error:</strong> {error}
        </div>
      )}

      {/* Generated Results */}
      {result ? (
        <div className={styles.resultsGrid}>
          {/* Selections Column */}
          <div className={styles.ticketSummaryCard}>
            <div className={styles.multiplierBadge}>
              <span className={styles.multiplierBig}>{result.achievedMultiplier.toFixed(2)}x</span>
              <span className={styles.multiplierTarget}>
                Target: {result.targetMultiplier}x • Risk: {result.riskTolerance.toUpperCase()}
              </span>
            </div>

            <p style={{ margin: "0 0 1rem", color: "var(--pt-stone-600)", fontSize: "0.88rem" }}>
              {result.overallStrategy}
            </p>

            <div className={styles.selectionsList}>
              {result.selections.map((s, idx) => (
                <div className={styles.selectionCard} key={idx}>
                  <div className={styles.selectionLeft}>
                    <span className={styles.selectionComp}>{s.competition}</span>
                    <span className={styles.selectionMatch}>{s.fixtureTitle}</span>
                    <span className={styles.selectionPick}>
                      {s.marketName}: <strong>{s.selectionName}</strong>
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--pt-stone-500)", marginTop: "0.15rem" }}>
                      💡 {s.reasoning}
                    </span>
                  </div>
                  <div className={styles.selectionPriceBox}>
                    <span className={styles.selectionPrice}>{s.odds.toFixed(2)}</span>
                    <span className={styles.selectionBookmaker}>{s.bookmaker}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className={styles.ticketSummaryCard}>
              <h3 style={{ margin: "0 0 0.85rem", fontSize: "1rem", fontWeight: 800, color: "var(--pt-stone-900)" }}>
                Slip Analytics
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--pt-stone-500)" }}>Total Matches</span>
                  <span style={{ fontWeight: 700, color: "var(--pt-stone-900)" }}>{result.selections.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--pt-stone-500)" }}>Combined Multiplier</span>
                  <span style={{ fontWeight: 700, color: "var(--pt-emerald-600)" }}>{result.achievedMultiplier.toFixed(2)}x</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--pt-stone-500)" }}>Model Joint Probability</span>
                  <span style={{ fontWeight: 700, color: "var(--pt-stone-900)" }}>{result.combinedModelProbability}%</span>
                </div>
              </div>
            </div>

            <div className={styles.ticketSummaryCard} style={{ background: "var(--pt-bg-surface-muted)" }}>
              <h4 style={{ margin: "0 0 0.4rem", fontSize: "0.85rem", fontWeight: 750, color: "var(--pt-stone-800)" }}>
                Responsible Play Notice
              </h4>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--pt-stone-500)", lineHeight: 1.5 }}>
                {result.responsiblePlayNotice}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.configCard} style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎯</div>
          <h3 style={{ margin: "0 0 0.5rem", color: "var(--pt-stone-900)" }}>
            Select Target Odds & Generate
          </h3>
          <p style={{ margin: "0 0 1.5rem", color: "var(--pt-stone-500)", maxWidth: "30rem", marginLeft: "auto", marginRight: "auto" }}>
            Choose your desired multiplier above and let PlayToday&apos;s optimizer construct a low-correlation accumulator from live verified market prices.
          </p>
        </div>
      )}
    </div>
  );
}
