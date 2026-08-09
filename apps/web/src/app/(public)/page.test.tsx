// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Home, { metadata } from "./page";

afterEach(cleanup);

describe("public homepage", () => {
  it("renders one heading and the full editorial narrative", () => {
    render(<Home />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const name of [
      "The number is never the whole story",
      "Built around decisions, not tips",
      "A decision trail from source to settlement",
      "A loss belongs in the record",
      "Useful information can still lead to a losing choice",
      "What is available now",
    ]) {
      expect(
        screen.getByRole("heading", { name: new RegExp(name, "i") }),
      ).toBeVisible();
    }
  });

  it("contains no fabricated sports, pricing, or performance data", () => {
    render(<Home />);
    const copy = document.body.textContent?.toLowerCase() ?? "";
    expect(copy).toContain("no live performance dataset");
    expect(copy).toContain("none published");
    expect(copy).not.toMatch(
      /north city|sample odds|illustrative probability|demonstration data|fictional/,
    );
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("presents verified technologies and clearly labelled conceptual imagery", () => {
    render(<Home />);
    expect(
      screen.getByRole("region", { name: /built on a production-grade web stack/i }),
    ).toBeVisible();
    expect(document.body.textContent).toContain(
      "This is not a partner or endorsement list.",
    );
    expect(screen.getAllByRole("img")).toHaveLength(3);
    for (const image of screen.getAllByRole("img")) {
      expect(image).toHaveAccessibleName();
    }
    const pause = screen.getByRole("button", { name: "Pause rail" });
    fireEvent.click(pause);
    expect(screen.getByRole("button", { name: "Resume rail" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("states the product boundary and responsible-play limits", () => {
    render(<Home />);
    const copy = document.body.textContent?.toLowerCase() ?? "";
    expect(copy).toContain("football, pre-match, analysis only");
    expect(copy).toContain("never increase a stake to recover a loss");
    expect(copy).toContain("does not accept stakes");
    expect(
      screen.getByRole("link", { name: /responsible-play principles/i }),
    ).toHaveAttribute("href", "/responsible-play");
  });

  it("provides factual metadata", () => {
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(JSON.stringify(metadata).toLowerCase()).not.toMatch(
      /guaranteed|accuracy|official partner/,
    );
  });
});
