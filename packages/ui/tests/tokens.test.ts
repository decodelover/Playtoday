import { describe, expect, it } from "vitest";

import {
  chartColourTokens,
  colourTokens,
  motionTokens,
  radiusTokens,
  selectionStatuses,
  spacingTokens,
  statusPresentation,
  typographyTokens,
} from "../src";

describe("design tokens", () => {
  it("exports semantic references instead of component-ready raw colours", () => {
    expect(colourTokens.brandPrimary).toBe("var(--pt-brand-primary)");
    expect(
      Object.values(colourTokens).every((value) => value.startsWith("var(--pt-")),
    ).toBe(true);
    expect(chartColourTokens).toHaveLength(6);
    expect(Object.keys(spacingTokens)).toContain("card");
    expect(Object.keys(radiusTokens)).toContain("modal");
    expect(Object.keys(motionTokens)).toContain("durationStandard");
    expect(Object.keys(typographyTokens)).toContain("dataLarge");
  });

  it("provides written and symbolic meaning for every supported status", () => {
    expect(selectionStatuses).toHaveLength(17);
    for (const status of selectionStatuses) {
      expect(statusPresentation[status].label.length).toBeGreaterThan(0);
      expect(statusPresentation[status].marker.length).toBeGreaterThan(0);
    }
    expect(statusPresentation.live).not.toEqual(statusPresentation.won);
    expect(statusPresentation["currently-winning"]).not.toEqual(statusPresentation.won);
  });
});
