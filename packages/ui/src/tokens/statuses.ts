export const selectionStatuses = [
  "not-started",
  "live",
  "currently-winning",
  "currently-losing",
  "won",
  "lost",
  "void",
  "postponed",
  "suspended",
  "cancelled",
  "partially-settled",
  "ticket-won",
  "ticket-lost",
  "pass-day",
  "locked",
  "verified",
  "data-delayed",
] as const;

export type SelectionStatus = (typeof selectionStatuses)[number];

export const statusPresentation: Record<
  SelectionStatus,
  Readonly<{ label: string; marker: string }>
> = {
  "not-started": { label: "Not started", marker: "○" },
  live: { label: "Live", marker: "●" },
  "currently-winning": { label: "Currently winning", marker: "↗" },
  "currently-losing": { label: "Currently losing", marker: "↘" },
  won: { label: "Won", marker: "✓" },
  lost: { label: "Lost", marker: "×" },
  void: { label: "Void", marker: "—" },
  postponed: { label: "Postponed", marker: "◷" },
  suspended: { label: "Suspended", marker: "Ⅱ" },
  cancelled: { label: "Cancelled", marker: "⊘" },
  "partially-settled": { label: "Partially settled", marker: "◐" },
  "ticket-won": { label: "Ticket won", marker: "✓✓" },
  "ticket-lost": { label: "Ticket lost", marker: "××" },
  "pass-day": { label: "Pass day", marker: "–" },
  locked: { label: "Locked", marker: "◇" },
  verified: { label: "Verified", marker: "◆" },
  "data-delayed": { label: "Data delayed", marker: "◷" },
};
