// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { OnboardingWizard } from "./onboarding-wizard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("../actions/onboarding", () => ({
  saveOnboardingStepAction: vi.fn().mockResolvedValue({ success: true }),
  completeOnboardingAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("../../lib/supabase/client", () => ({
  createSupabaseBrowserClient: () => ({
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

describe("OnboardingWizard Component", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders welcome step with brand header and progress indicator", () => {
    render(<OnboardingWizard initialStep="welcome" />);

    expect(screen.getByText("PLAYTODAY")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Welcome to PlayToday" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 8")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue →/i })).toBeInTheDocument();
  });

  it("navigates forward through onboarding steps when clicking continue", async () => {
    render(<OnboardingWizard initialStep="welcome" />);

    const continueBtn = screen.getByRole("button", { name: /continue →/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(screen.getByText("Select Sports")).toBeInTheDocument();
      expect(screen.getByText("Step 2 of 8")).toBeInTheDocument();
    });
  });

  it("requires responsible play acknowledgement before proceeding on step 7", () => {
    render(<OnboardingWizard initialStep="responsible_play" />);

    expect(screen.getByText("Responsible Play Commitment")).toBeInTheDocument();
    const continueBtn = screen.getByRole("button", { name: /continue →/i });

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    expect(continueBtn).toBeDisabled();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(continueBtn).not.toBeDisabled();
  });
});
