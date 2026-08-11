"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SUPPORTED_SPORTS,
  SUPPORTED_BOOKMAKERS,
  SUPPORTED_MARKETS,
  ANALYSIS_STRATEGIES,
  RISK_PREFERENCES,
  type UserPreferencesInput,
} from "@playtoday/validation";
import {
  completeOnboardingAction,
  saveOnboardingStepAction,
} from "../actions/onboarding";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";
import styles from "./onboarding.module.css";

const STEPS = [
  { id: "welcome", title: "Welcome to PlayToday" },
  { id: "sports", title: "Sports Selection" },
  { id: "bookmakers", title: "Preferred Bookmaker" },
  { id: "markets", title: "Target Markets" },
  { id: "target_odds", title: "Odds & Strategy" },
  { id: "notifications", title: "Notifications" },
  { id: "responsible_play", title: "Responsible Play" },
  { id: "review", title: "Review & Confirm" },
] as const;

export function OnboardingWizard({
  initialStep = "welcome",
  initialPreferences,
}: Readonly<{
  initialStep?: string;
  initialPreferences?: UserPreferencesInput | null;
}>) {
  const router = useRouter();

  const [currentStepIndex, setCurrentStepIndex] = useState(() => {
    const found = STEPS.findIndex((s) => s.id === initialStep);
    return found >= 0 ? found : 0;
  });

  const [preferences, setPreferences] = useState<UserPreferencesInput>(() => {
    const userTz =
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "UTC";
    return {
      preferred_sports: initialPreferences?.preferred_sports ?? ["football"],
      preferred_bookmakers: initialPreferences?.preferred_bookmakers ?? ["sportybet"],
      preferred_markets: initialPreferences?.preferred_markets ?? [
        "1x2",
        "double_chance",
        "over_under",
      ],
      target_odds: initialPreferences?.target_odds ?? 3.0,
      default_strategy: initialPreferences?.default_strategy ?? "balanced",
      risk_preference: initialPreferences?.risk_preference ?? "moderate",
      notification_channels: initialPreferences?.notification_channels ?? {
        email: true,
        in_app: true,
      },
      responsible_play_ack: initialPreferences?.responsible_play_ack ?? false,
      timezone: initialPreferences?.timezone ?? userTz ?? "UTC",
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeStep = STEPS[currentStepIndex] ?? STEPS[0];
  const progressPercent = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  const handleNext = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    const nextIndex = currentStepIndex + 1;

    if (nextIndex < STEPS.length) {
      const nextStepId = STEPS[nextIndex]?.id ?? "welcome";
      const saveResult = await saveOnboardingStepAction(nextStepId, preferences);

      if (!saveResult.success) {
        setErrorMessage(saveResult.error ?? "Failed to save step progress.");
        setIsSubmitting(false);
        return;
      }

      setCurrentStepIndex(nextIndex);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Final Submit
      const completeResult = await completeOnboardingAction(preferences);

      if (!completeResult.success) {
        setErrorMessage(completeResult.error ?? "Failed to complete setup.");
        setIsSubmitting(false);
        return;
      }

      router.push("/overview");
      router.refresh();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setErrorMessage(null);
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className={styles.onboardingShell}>
      <header className={styles.onboardingHeader}>
        <div className={styles.brandLogo}>
          <div className={styles.brandMark}>
            <i>/</i>
            <i>/</i>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>PLAYTODAY</span>
            <span className={styles.brandSub}>Sports Intelligence</span>
          </div>
        </div>

        <button
          className={styles.signOutBtn}
          onClick={() => void handleSignOut()}
          type="button"
        >
          Sign Out
        </button>
      </header>

      <main className={styles.onboardingMain}>
        <div className={styles.onboardingContainer}>
          {/* Progress Header */}
          <div className={styles.progressSection}>
            <div className={styles.progressMeta}>
              <span>
                Step {currentStepIndex + 1} of {STEPS.length}
              </span>
              <span className={styles.stepTitleBadge}>{activeStep.title}</span>
            </div>
            <div
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progressPercent}
              className={styles.trackBar}
              role="progressbar"
            >
              <div
                className={styles.fillBar}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Active Step Card Content */}
          <div className={styles.stepCard}>
            {errorMessage ? (
              <div className={styles.errorMessage}>{errorMessage}</div>
            ) : null}

            {activeStep.id === "welcome" && (
              <>
                <div className={styles.stepHeader}>
                  <h1>Welcome to PlayToday</h1>
                  <p className={styles.stepDescription}>
                    Set up your workspace around how you analyse sports. We will tailor
                    prediction layouts, coupon codes, and risk thresholds to your
                    preferences.
                  </p>
                </div>
                <div className={styles.optionsGridSingle}>
                  <div className={styles.optionCard} data-selected="true">
                    <div className={styles.optionTitle}>Fast 2-Minute Setup</div>
                    <p className={styles.optionDescription}>
                      Configure your preferred bookmaker, target odds range, and
                      analysis strategy. You can change these anytime in Settings.
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeStep.id === "sports" && (
              <>
                <div className={styles.stepHeader}>
                  <h2>Select Sports</h2>
                  <p className={styles.stepDescription}>
                    Choose the sports you follow. Football is our active primary
                    analytics engine.
                  </p>
                </div>
                <div className={styles.optionsGrid}>
                  {SUPPORTED_SPORTS.map((sport) => {
                    const isSelected = sport.id === "football";
                    return (
                      <button
                        className={styles.optionCard}
                        data-selected={isSelected}
                        disabled={!sport.available}
                        key={sport.id}
                        onClick={() => {
                          if (sport.available) {
                            setPreferences((prev: UserPreferencesInput) => ({
                              ...prev,
                              preferred_sports: ["football"],
                            }));
                          }
                        }}
                        type="button"
                      >
                        <div className={styles.optionHeader}>
                          <span className={styles.optionTitle}>{sport.label}</span>
                          <span
                            className={
                              sport.available
                                ? styles.optionBadgeActive
                                : styles.optionBadge
                            }
                          >
                            {sport.badge}
                          </span>
                        </div>
                        <p className={styles.optionDescription}>
                          {sport.available
                            ? "Real-time match data & daily value predictions."
                            : "Coverage launching soon."}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {activeStep.id === "bookmakers" && (
              <>
                <div className={styles.stepHeader}>
                  <h2>Preferred Bookmakers</h2>
                  <p className={styles.stepDescription}>
                    Choose the platform you normally use so PlayToday can format market
                    codes and coupons for quick compatibility. PlayToday never requests
                    or stores betting credentials.
                  </p>
                </div>
                <div className={styles.optionsGridSingle}>
                  {SUPPORTED_BOOKMAKERS.map((bm) => {
                    const isSelected = preferences.preferred_bookmakers.includes(bm.id);
                    return (
                      <button
                        className={styles.optionCard}
                        data-selected={isSelected}
                        key={bm.id}
                        onClick={() => {
                          setPreferences((prev: UserPreferencesInput) => {
                            const exists = prev.preferred_bookmakers.includes(bm.id);
                            const updated = exists
                              ? prev.preferred_bookmakers.filter((id) => id !== bm.id)
                              : [...prev.preferred_bookmakers, bm.id];
                            return {
                              ...prev,
                              preferred_bookmakers:
                                updated.length > 0 ? updated : [bm.id],
                            };
                          });
                        }}
                        type="button"
                      >
                        <div className={styles.optionHeader}>
                          <span className={styles.optionTitle}>{bm.name}</span>
                          {isSelected ? (
                            <span className={styles.optionBadgeActive}>Selected</span>
                          ) : null}
                        </div>
                        <p className={styles.optionDescription}>{bm.description}</p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {activeStep.id === "markets" && (
              <>
                <div className={styles.stepHeader}>
                  <h2>Target Betting Markets</h2>
                  <p className={styles.stepDescription}>
                    Select the market types you want highlighted in your daily
                    prediction feed.
                  </p>
                </div>
                <div className={styles.optionsGrid}>
                  {SUPPORTED_MARKETS.map((market) => {
                    const isSelected = preferences.preferred_markets.includes(
                      market.id,
                    );
                    return (
                      <button
                        className={styles.optionCard}
                        data-selected={isSelected}
                        key={market.id}
                        onClick={() => {
                          setPreferences((prev: UserPreferencesInput) => {
                            const exists = prev.preferred_markets.includes(market.id);
                            const updated = exists
                              ? prev.preferred_markets.filter((id) => id !== market.id)
                              : [...prev.preferred_markets, market.id];
                            return {
                              ...prev,
                              preferred_markets:
                                updated.length > 0 ? updated : [market.id],
                            };
                          });
                        }}
                        type="button"
                      >
                        <div className={styles.optionHeader}>
                          <span className={styles.optionTitle}>{market.label}</span>
                          {isSelected ? (
                            <span className={styles.optionBadgeActive}>✓</span>
                          ) : null}
                        </div>
                        <p className={styles.optionDescription}>{market.description}</p>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {activeStep.id === "target_odds" && (
              <>
                <div className={styles.stepHeader}>
                  <h2>Target Odds & Strategy</h2>
                  <p className={styles.stepDescription}>
                    Define your default odds target and risk profile for daily
                    recommendations.
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel} htmlFor="targetOddsInput">
                    Default Target Odds
                  </label>
                  <input
                    className={styles.textInput}
                    id="targetOddsInput"
                    max={1000}
                    min={1.05}
                    onChange={(e) =>
                      setPreferences((prev: UserPreferencesInput) => ({
                        ...prev,
                        target_odds: Number(e.target.value) || 3.0,
                      }))
                    }
                    step={0.5}
                    type="number"
                    value={preferences.target_odds}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Analysis Strategy</label>
                  <div className={styles.optionsGridSingle}>
                    {ANALYSIS_STRATEGIES.map((strat) => (
                      <button
                        className={styles.optionCard}
                        data-selected={preferences.default_strategy === strat.id}
                        key={strat.id}
                        onClick={() =>
                          setPreferences((prev: UserPreferencesInput) => ({
                            ...prev,
                            default_strategy: strat.id,
                          }))
                        }
                        type="button"
                      >
                        <span className={styles.optionTitle}>{strat.label}</span>
                        <p className={styles.optionDescription}>{strat.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.fieldLabel}>Risk Preference</label>
                  <div className={styles.optionsGridSingle}>
                    {RISK_PREFERENCES.map((risk) => (
                      <button
                        className={styles.optionCard}
                        data-selected={preferences.risk_preference === risk.id}
                        key={risk.id}
                        onClick={() =>
                          setPreferences((prev: UserPreferencesInput) => ({
                            ...prev,
                            risk_preference: risk.id,
                          }))
                        }
                        type="button"
                      >
                        <span className={styles.optionTitle}>{risk.label}</span>
                        <p className={styles.optionDescription}>{risk.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeStep.id === "notifications" && (
              <>
                <div className={styles.stepHeader}>
                  <h2>Notification Channels</h2>
                  <p className={styles.stepDescription}>
                    Choose how you want to receive daily edge alerts and match
                    settlement updates.
                  </p>
                </div>
                <div className={styles.optionsGridSingle}>
                  <label className={styles.checkboxContainer}>
                    <input
                      checked={preferences.notification_channels.email}
                      className={styles.checkboxInput}
                      onChange={(e) =>
                        setPreferences((prev: UserPreferencesInput) => ({
                          ...prev,
                          notification_channels: {
                            ...prev.notification_channels,
                            email: e.target.checked,
                          },
                        }))
                      }
                      type="checkbox"
                    />
                    <div>
                      <span className={styles.fieldLabel}>Email Notifications</span>
                      <p className={styles.optionDescription}>
                        Receive daily high-confidence match alerts and account security
                        notices.
                      </p>
                    </div>
                  </label>

                  <label className={styles.checkboxContainer}>
                    <input
                      checked={preferences.notification_channels.in_app}
                      className={styles.checkboxInput}
                      onChange={(e) =>
                        setPreferences((prev: UserPreferencesInput) => ({
                          ...prev,
                          notification_channels: {
                            ...prev.notification_channels,
                            in_app: e.target.checked,
                          },
                        }))
                      }
                      type="checkbox"
                    />
                    <div>
                      <span className={styles.fieldLabel}>In-App Notifications</span>
                      <p className={styles.optionDescription}>
                        Live notifications inside your dashboard while analysing games.
                      </p>
                    </div>
                  </label>
                </div>
              </>
            )}

            {activeStep.id === "responsible_play" && (
              <>
                <div className={styles.stepHeader}>
                  <h2>Responsible Play Commitment</h2>
                  <p className={styles.stepDescription}>
                    PlayToday provides probabilistic sports intelligence tools.
                    Responsible analytical play is a core requirement for using our
                    application.
                  </p>
                </div>

                <div className={styles.noticeBox}>
                  <span className={styles.noticeIcon}>!</span>
                  <div>
                    <strong>Important Risk Disclaimer:</strong>
                    <p style={{ margin: "0.25rem 0 0 0" }}>
                      Sports outcomes involve inherent uncertainty. Predictions are
                      analytical evaluations, not guaranteed results. Higher odds imply
                      lower probability and higher risk. Never stake money you cannot
                      afford to lose, and never chase losses.
                    </p>
                  </div>
                </div>

                <label className={styles.checkboxContainer}>
                  <input
                    checked={preferences.responsible_play_ack}
                    className={styles.checkboxInput}
                    onChange={(e) =>
                      setPreferences((prev: UserPreferencesInput) => ({
                        ...prev,
                        responsible_play_ack: e.target.checked,
                      }))
                    }
                    type="checkbox"
                  />
                  <span className={styles.checkboxLabel}>
                    I understand that sports analytics carry risk, outcomes are not
                    guaranteed, and I agree to use PlayToday responsibly.
                  </span>
                </label>
              </>
            )}

            {activeStep.id === "review" && (
              <>
                <div className={styles.stepHeader}>
                  <h2>Review Your Preferences</h2>
                  <p className={styles.stepDescription}>
                    Review your setup before entering your PlayToday dashboard.
                  </p>
                </div>
                <div className={styles.optionsGridSingle}>
                  <div className={styles.optionCard}>
                    <div className={styles.optionTitle}>Sports & Bookmakers</div>
                    <p className={styles.optionDescription}>
                      Sports: {preferences.preferred_sports.join(", ")} | Bookmakers:{" "}
                      {preferences.preferred_bookmakers.join(", ")}
                    </p>
                  </div>
                  <div className={styles.optionCard}>
                    <div className={styles.optionTitle}>Markets & Odds</div>
                    <p className={styles.optionDescription}>
                      Markets: {preferences.preferred_markets.join(", ")} | Target Odds:{" "}
                      {preferences.target_odds}x | Strategy:{" "}
                      {preferences.default_strategy}
                    </p>
                  </div>
                  <div className={styles.optionCard}>
                    <div className={styles.optionTitle}>Risk & Notifications</div>
                    <p className={styles.optionDescription}>
                      Risk Profile: {preferences.risk_preference} | Email Alerts:{" "}
                      {preferences.notification_channels.email ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Footer Step Navigation */}
            <footer className={styles.stepFooter}>
              <button
                className={styles.backBtn}
                disabled={currentStepIndex === 0 || isSubmitting}
                onClick={handleBack}
                type="button"
              >
                Back
              </button>

              <button
                className={styles.nextBtn}
                disabled={
                  isSubmitting ||
                  (activeStep.id === "responsible_play" &&
                    !preferences.responsible_play_ack)
                }
                onClick={() => void handleNext()}
                type="button"
              >
                {isSubmitting
                  ? "Saving..."
                  : currentStepIndex === STEPS.length - 1
                    ? "Finish & Go to Overview →"
                    : "Continue →"}
              </button>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
