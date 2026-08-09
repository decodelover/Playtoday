export type HelpArticle = Readonly<{
  id: string;
  category: string;
  question: string;
  answer: string;
}>;

export const helpArticles = [
  {
    id: "current-access",
    category: "Getting Started",
    question: "What can I use on PlayToday today?",
    answer:
      "The public information pages are available. Account registration, sign in, live sports data, subscriptions, and production predictions are not available.",
  },
  {
    id: "accounts",
    category: "Getting Started",
    question: "Can I create an account?",
    answer:
      "No. Registration and sign in are not open, and the public site does not contain an active authentication flow.",
  },
  {
    id: "analysis-source",
    category: "Sports Analysis",
    question: "Where does the analysis begin?",
    answer:
      "The planned method begins with approved sports data. Fixture identity, status, history, markets, odds observations, and source references must pass validation before analysis.",
  },
  {
    id: "ai-analyst",
    category: "Sports Analysis",
    question: "What does the AI Analyst do?",
    answer:
      "The AI Analyst can explain verified structured output. It cannot invent sports facts, create an underlying result, or guarantee that a selection will win.",
  },
  {
    id: "target-odds",
    category: "Target Odds",
    question: "Does PlayToday force a requested target?",
    answer:
      "No. Target odds are a constraint. If the evidence does not support the requested total, the system can return a lower total or no qualifying selection.",
  },
  {
    id: "target-risk",
    category: "Target Odds",
    question: "Do higher target odds carry more risk?",
    answer:
      "Yes. Higher odds imply a lower chance of success, and combining more selections creates more ways for a ticket to lose.",
  },
  {
    id: "daily-edge-status",
    category: "Daily Edge",
    question: "Is Daily Edge available?",
    answer:
      "No. Daily Edge is part of the planned product, but the repository has no operational prediction, publication, or settlement service for it.",
  },
  {
    id: "pass-day",
    category: "Daily Edge",
    question: "What is a pass day?",
    answer:
      "A pass day is a day when no candidate clears the publication rules. It must remain part of the performance record rather than being omitted.",
  },
  {
    id: "settlement-method",
    category: "Settlement",
    question: "How is a published selection settled?",
    answer:
      "The planned settlement process uses verified results and the rule version attached to the published selection. Ambiguous results enter review.",
  },
  {
    id: "settlement-corrections",
    category: "Settlement",
    question: "What happens when a result is corrected?",
    answer:
      "A correction must remain linked to the original published record. It cannot silently replace or erase the earlier decision trail.",
  },
  {
    id: "pricing-status",
    category: "Plans and Pricing",
    question: "How much do the plans cost?",
    answer:
      "Pricing has not been finalized for Free, Plus, Pro, or Elite. There is no checkout, payment provider, or active subscription.",
  },
  {
    id: "responsible-play",
    category: "Responsible Play",
    question: "Who can use PlayToday?",
    answer:
      "PlayToday is for people aged 18 and over who meet the legal age requirement where they live. Analysis is information, not a guaranteed outcome.",
  },
  {
    id: "martingale",
    category: "Responsible Play",
    question: "Does PlayToday recommend martingale staking?",
    answer:
      "No. Increasing the next stake after a loss can make a losing run much more expensive. Do not chase losses or abandon a fixed limit.",
  },
] as const satisfies readonly HelpArticle[];

export const helpCategories = [
  "Getting Started",
  "Sports Analysis",
  "Target Odds",
  "Daily Edge",
  "Settlement",
  "Plans and Pricing",
  "Responsible Play",
] as const;
