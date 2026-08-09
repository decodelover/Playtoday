// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { helpArticles } from "./help-content";
import { HelpSearch } from "./help-search";

afterEach(cleanup);

describe("HelpSearch", () => {
  it("starts with every published Help Centre article", () => {
    render(<HelpSearch />);

    expect(screen.getByText(`${helpArticles.length} answers`)).toBeVisible();
    expect(screen.getByRole("heading", { name: "Getting Started" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Settlement" })).toBeVisible();
  });

  it("searches only the published article content", () => {
    render(<HelpSearch />);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "martingale" },
    });

    expect(screen.getByText("1 answer")).toBeVisible();
    expect(
      screen.getByText("Does PlayToday recommend martingale staking?", {
        selector: "summary",
      }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Settlement" }),
    ).not.toBeInTheDocument();
  });

  it("shows a useful empty result without generating an answer", () => {
    render(<HelpSearch />);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "unpublished topic" },
    });

    expect(screen.getByRole("status")).toHaveTextContent("No matching answer");
    expect(screen.getByText("0 answers")).toBeVisible();
  });
});
