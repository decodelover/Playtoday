export const colourTokens = {
  brandPrimary: "var(--pt-brand-primary)",
  brandSecondary: "var(--pt-brand-secondary)",
  brandAccent: "var(--pt-brand-accent)",
  backgroundApp: "var(--pt-background-app)",
  backgroundPanel: "var(--pt-background-panel)",
  textPrimary: "var(--pt-text-primary)",
  textSecondary: "var(--pt-text-secondary)",
  borderDefault: "var(--pt-border-default)",
  focusRing: "var(--pt-border-focus)",
  success: "var(--pt-semantic-success)",
  warning: "var(--pt-semantic-warning)",
  danger: "var(--pt-semantic-danger)",
  information: "var(--pt-semantic-information)",
} as const;

export const chartColourTokens = [
  "var(--pt-chart-series-1)",
  "var(--pt-chart-series-2)",
  "var(--pt-chart-series-3)",
  "var(--pt-chart-series-4)",
  "var(--pt-chart-series-5)",
  "var(--pt-chart-series-6)",
] as const;

export type ColourToken = keyof typeof colourTokens;
