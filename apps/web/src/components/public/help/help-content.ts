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
      "You can explore pre-match football probabilities, access target-odds selection tools, create an account, sign in securely, and consult the AI Analyst for transparent match evidence.",
  },
  {
    id: "accounts",
    category: "Getting Started",
    question: "Can I create a PlayToday account?",
    answer:
      "Yes. You can register for a free account or sign in securely via Email, Google, or Apple to access your personalized sports intelligence dashboard.",
  },
  {
    id: "analysis-source",
    category: "Sports Analysis",
    question: "Where does the analysis begin?",
    answer:
      "The analysis method begins with licensed sports data feeds. Fixture identity, status, history, markets, odds observations, and source references pass verification before analysis.",
  },
  {
    id: "ai-analyst",
    category: "Sports Analysis",
    question: "What does the AI Analyst do?",
    answer:
      "The AI Analyst explains verified structured match output. It cannot invent sports facts, create an underlying result, or guarantee that a selection will win.",
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
    question: "How does Daily Edge selection work?",
    answer:
      "Daily Edge identifies top probability selections for today's football fixtures across major global leagues using calibrated statistical models.",
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
      "The settlement process uses verified match results and the rule version attached to the published selection. Ambiguous results enter manual review.",
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
    question: "What features are included in PlayToday plans?",
    answer:
      "Registered users start with free access to standard match probabilities. Plus, Pro, and Elite tiers unlock target-odds tools, AI Analyst breakdowns, and priority data processing.",
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
