import { z } from "zod";

/**
 * Supported Sport Identifiers
 */
export const SUPPORTED_SPORTS = [
  { id: "football", label: "Football", available: true, badge: "Live Analytics" },
  { id: "basketball", label: "Basketball", available: false, badge: "Upcoming" },
  { id: "tennis", label: "Tennis", available: false, badge: "Upcoming" },
] as const;

export type SportId = (typeof SUPPORTED_SPORTS)[number]["id"];

/**
 * Canonical Bookmaker Identifiers
 */
export const SUPPORTED_BOOKMAKERS = [
  {
    id: "sportybet",
    name: "SportyBet",
    description: "Prioritise fast code formatting and SportyBet market structure.",
  },
  {
    id: "bet9ja",
    name: "Bet9ja",
    description: "Align market terminology and selection layouts for Bet9ja.",
  },
  {
    id: "msport",
    name: "MSport",
    description: "Format analysis for MSport coupon compatibility.",
  },
] as const;

export type BookmakerId = (typeof SUPPORTED_BOOKMAKERS)[number]["id"];

/**
 * Supported Market Identifiers
 */
export const SUPPORTED_MARKETS = [
  {
    id: "1x2",
    label: "Match Result (1X2)",
    description: "Home win, draw, or away win.",
  },
  {
    id: "double_chance",
    label: "Double Chance",
    description: "Cover 2 out of 3 match outcomes.",
  },
  {
    id: "dnb",
    label: "Draw No Bet",
    description: "Stake refunded if the match ends in a draw.",
  },
  {
    id: "over_under",
    label: "Over/Under Goals",
    description: "Total match goals threshold.",
  },
  {
    id: "btts",
    label: "Both Teams to Score",
    description: "Goal scored by both sides.",
  },
  {
    id: "team_goals",
    label: "Team Goals",
    description: "Individual team scoring totals.",
  },
  {
    id: "handicap",
    label: "Asian Handicap",
    description: "Goal advantage or deficit spread.",
  },
] as const;

export type MarketId = (typeof SUPPORTED_MARKETS)[number]["id"];

/**
 * Analysis Strategies
 */
export const ANALYSIS_STRATEGIES = [
  {
    id: "conservative",
    label: "Conservative",
    description:
      "Fewer selections with tighter probability thresholds and lower variance.",
  },
  {
    id: "balanced",
    label: "Balanced",
    description:
      "Balanced middle ground between target odds size and probability threshold.",
  },
  {
    id: "aggressive",
    label: "Aggressive",
    description:
      "Higher target potential with wider variance and greater outcome uncertainty.",
  },
] as const;

export type StrategyId = (typeof ANALYSIS_STRATEGIES)[number]["id"];

/**
 * Risk Preferences
 */
export const RISK_PREFERENCES = [
  {
    id: "conservative",
    label: "Lower Risk Tolerance",
    description: "Prioritise higher-probability recommendations with modest odds.",
  },
  {
    id: "moderate",
    label: "Moderate Risk Tolerance",
    description: "Standard balance across probability and outcome potential.",
  },
  {
    id: "higher_risk",
    label: "Higher Risk Tolerance",
    description: "Accept higher outcome uncertainty in pursuit of larger target odds.",
  },
] as const;

export type RiskId = (typeof RISK_PREFERENCES)[number]["id"];

/**
 * Zod Validation Schema for User Onboarding Preferences
 */
export const UserPreferencesSchema = z.object({
  preferred_sports: z
    .array(z.enum(["football", "basketball", "tennis"]))
    .min(1, "At least one sport must be selected.")
    .refine((sports: string[]) => sports.includes("football"), {
      message: "Football is currently the primary supported sport.",
    }),
  preferred_bookmakers: z
    .array(z.enum(["sportybet", "bet9ja", "msport"]))
    .min(1, "Select at least one preferred bookmaker."),
  preferred_markets: z
    .array(
      z.enum([
        "1x2",
        "double_chance",
        "dnb",
        "over_under",
        "btts",
        "team_goals",
        "handicap",
      ]),
    )
    .min(1, "Select at least one preferred betting market."),
  target_odds: z
    .number({ message: "Target odds must be a number." })
    .min(1.05, "Target odds must be at least 1.05.")
    .max(1000.0, "Target odds cannot exceed 1000.00."),
  default_strategy: z.enum(["conservative", "balanced", "aggressive"]),
  risk_preference: z.enum(["conservative", "moderate", "higher_risk"]),
  notification_channels: z.object({
    email: z.boolean(),
    in_app: z.boolean(),
  }),
  responsible_play_ack: z.boolean(),
  timezone: z.string().min(1, "Timezone is required."),
});

export type UserPreferencesInput = z.infer<typeof UserPreferencesSchema>;

export const OnboardingStepSchema = z.enum([
  "welcome",
  "sports",
  "bookmakers",
  "markets",
  "target_odds",
  "notifications",
  "responsible_play",
  "review",
]);

export type OnboardingStepId = z.infer<typeof OnboardingStepSchema>;
