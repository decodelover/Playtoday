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
    expect(
      screen.getByText(
        /Plan pricing details and online subscription checkout will open/i,
      ),
    ).toBeVisible();
  });

  it("uses the exact honest empty state when no performance records exist", () => {
    const { container } = render(<PerformancePage />);

    expect(
      screen.getByRole("heading", {
        name: "No settled PlayToday performance records are available yet.",
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

  it("renders mature legal privacy and terms policies", () => {
    const privacy = render(<PrivacyPage />);
    expect(
      privacy.getByText(/PlayToday is committed to protecting your privacy/i),
    ).toBeVisible();
    privacy.unmount();

    render(<TermsPage />);
    expect(
      screen.getByText(/Information & decision support, not a bookmaker/i),
    ).toBeVisible();
    expect(screen.getByText(/PlayToday is not a bookmaker/i)).toBeVisible();
  });
});
