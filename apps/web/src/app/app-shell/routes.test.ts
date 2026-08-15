import { describe, expect, it } from "vitest";

import { findShellRoute, isRouteActive, shellRoutes } from "./routes";

describe("shell route configuration", () => {
  it("has unique keys, paths, and complete labels", () => {
    expect(new Set(shellRoutes.map((route) => route.key)).size).toBe(
      shellRoutes.length,
    );
    expect(new Set(shellRoutes.map((route) => route.path)).size).toBe(
      shellRoutes.length,
    );
    expect(shellRoutes.every((route) => route.label && route.breadcrumb)).toBe(true);
  });

  it("defines exactly the intended five mobile destinations", () => {
    expect(
      shellRoutes.filter((route) => route.mobilePrimary).map((route) => route.key),
    ).toEqual(["overview", "ai-analyst", "games", "daily-edge", "support"]);
  });

  it("matches exact and future nested routes without false positives", () => {
    expect(isRouteActive("/games", "/games")).toBe(true);
    expect(isRouteActive("/games/example", "/games")).toBe(true);
    expect(isRouteActive("/gamesmanship", "/games")).toBe(false);
    expect(findShellRoute("/unknown")).toBeUndefined();
  });

  it("contains no retired identity or prohibited bookmaker routes", () => {
    const content = JSON.stringify(shellRoutes).toLowerCase();
    expect(content).not.toContain(["edge", "pilot"].join(""));
    expect(content).not.toMatch(/sportybet|bet9ja|msport|booking-code/);
  });
});
