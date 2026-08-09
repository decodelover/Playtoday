// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DesignSystemPreview from "./page";

describe("DesignSystemPreview", () => {
  it("documents the current public visual system without invented product records", () => {
    render(<DesignSystemPreview />);
    expect(
      screen.getByRole("heading", { level: 1, name: /matchday editorial/i }),
    ).toBeVisible();
    expect(screen.getByText("#FF0F50")).toBeVisible();
    expect(screen.getByText("Not published")).toBeVisible();
    expect(document.body.textContent?.toLowerCase()).not.toMatch(
      /sample odds|home team|demonstration data|fictional/,
    );
  });
});
