// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import AboutPage from "./about/page";
import HowItWorksPage from "./how-it-works/page";
import PerformancePage from "./performance/page";
import PricingPage from "./pricing/page";
import PrivacyPage from "./privacy/page";
import ResponsiblePlayPage from "./responsible-play/page";
import TermsPage from "./terms/page";

afterEach(cleanup);

describe("Phase 2F supporting-page content", () => {
  it("explains the data, analyst, target, and settlement boundaries", () => {
    render(<HowItWorksPage />);

    expect(screen.getAllByText(/AI Analyst/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/target odds/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/settlement/i).length).toBeGreaterThan(0);
  });

  it("publishes plan names without inventing pricing or checkout", () => {
    render(<PricingPage />);

    for (const plan of ["Free", "Plus", "Pro", "Elite"]) {
      expect(screen.getByRole("heading", { name: plan })).toBeVisible();
    }
    expect(screen.getByText("Pricing has not been finalized.")).toBeVisible();
    expect(screen.getAllByText(/Pricing has not been finalized/i).length).toBe(5);
    expect(screen.getByText(/does not have a checkout/i)).toBeVisible();
  });

  it("uses the exact honest empty state when no performance model exists", () => {
    const { container } = render(<PerformancePage />);

    expect(
      screen.getByRole("heading", {
        name: "No verified PlayToday performance records have been published yet.",
      }),
    ).toBeVisible();
    expect(container.querySelector("canvas, svg")).not.toBeInTheDocument();
  });

  it("states the required responsible-play limits", () => {
    render(<ResponsiblePlayPage />);

    expect(screen.getByText("18+")).toBeVisible();
    expect(screen.getAllByText(/higher risk/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/martingale/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/chase a loss/i).length).toBeGreaterThan(0);
  });

  it("describes the mission without a team, investor, or location claim", () => {
    const { container } = render(<AboutPage />);

    expect(screen.getByText("Statistical analysis")).toBeVisible();
    expect(screen.getByText("Transparent records")).toBeVisible();
    expect(container.textContent).not.toMatch(/investor|headquarters|our team/i);
  });

  it("marks unresolved privacy and terms details for legal review", () => {
    const privacy = render(<PrivacyPage />);
    expect(privacy.getAllByText(/Pending Legal Review/i).length).toBeGreaterThan(0);
    privacy.unmount();

    render(<TermsPage />);
    expect(screen.getAllByText(/Pending Legal Review/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/It is not a bookmaker/i)).toBeVisible();
  });
});
