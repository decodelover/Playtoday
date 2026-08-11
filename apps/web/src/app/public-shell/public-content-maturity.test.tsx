import { describe, expect, it } from "vitest";
import { publicRoutes } from "./routes";

const PROHIBITED_PUBLIC_TERMS = [
  "pre-launch",
  "being built",
  "under development",
  "development phase",
  "engineering foundation",
  "production foundation",
  "technologies currently present in this repository",
  "foundation placeholder",
  "product foundation",
  "demonstration interface",
  "demo data",
  "sample data",
  "placeholder data",
  "illustrative data",
  "coming in a later phase",
  "once implemented",
  "when this feature is built",
  "future development phase",
  "phase 2",
  "mvp architecture",
  "repository technology",
];

describe("Public Content Maturity & Data Honesty Audit", () => {
  it("ensures public route metadata titles and descriptions do not contain prohibited developer terms", () => {
    publicRoutes.forEach((route) => {
      const lowerTitle = route.title.toLowerCase();
      const lowerDesc = route.description.toLowerCase();

      PROHIBITED_PUBLIC_TERMS.forEach((term) => {
        expect(
          lowerTitle,
          `Route '${route.key}' title contains prohibited term '${term}'`,
        ).not.toContain(term);

        expect(
          lowerDesc,
          `Route '${route.key}' description contains prohibited term '${term}'`,
        ).not.toContain(term);
      });
    });
  });
});
