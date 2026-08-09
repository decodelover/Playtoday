import { describe, expect, it } from "vitest";
import { footerGroups, metadataFor, publicRoutes } from "./routes";

describe("public route registry", () => {
  it("has unique keys and paths", () => {
    expect(new Set(publicRoutes.map(({ key }) => key)).size).toBe(publicRoutes.length);
    expect(new Set(publicRoutes.map(({ path }) => path)).size).toBe(
      publicRoutes.length,
    );
  });
  it("defines the intended primary navigation", () => {
    expect(
      publicRoutes.filter(({ header }) => header).map(({ label }) => label),
    ).toEqual(["How it works", "Performance", "Pricing", "Responsible play"]);
  });
  it("provides complete unique metadata", () => {
    expect(new Set(publicRoutes.map(({ title }) => title)).size).toBe(
      publicRoutes.length,
    );
    for (const route of publicRoutes) {
      const metadata = metadataFor(route.key);
      expect(metadata.title).toBeTruthy();
      expect(metadata.description).toBeTruthy();
    }
  });
  it("populates every footer group", () => {
    for (const group of footerGroups) {
      expect(publicRoutes.some(({ footer }) => footer === group)).toBe(true);
    }
  });
  it("contains no retired, bookmaker, affiliate or guaranteed language", () => {
    const serialized = JSON.stringify(publicRoutes).toLowerCase();
    const forbidden = [
      ["edge", "pilot"].join(""),
      ["book", "maker"].join(""),
      "affiliate",
      "guaranteed",
      "deposit",
    ];
    for (const term of forbidden) {
      expect(serialized).not.toContain(term);
    }
  });
});
