import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const themes = readFileSync(
  new URL("../src/styles/themes.css", import.meta.url),
  "utf8",
);
const primitives = readFileSync(
  new URL("../src/styles/primitives.css", import.meta.url),
  "utf8",
);
const motion = readFileSync(
  new URL("../src/styles/motion.css", import.meta.url),
  "utf8",
);

function luminance(hex: string) {
  const channels = [1, 3, 5].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  );
  const [red = 0, green = 0, blue = 0] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground: string, background: string) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return ((values[0] ?? 0) + 0.05) / ((values[1] ?? 0) + 0.05);
}

function darkToken(name: string) {
  const darkBlock = themes.match(/:root,[\s\S]*?\n\}/)?.[0] ?? "";
  const value = darkBlock.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
  if (!value) {
    throw new Error(`Missing dark theme token: ${name}`);
  }
  return value;
}

describe("foundation style accessibility", () => {
  it("keeps core text and status pairings above WCAG AA text contrast", () => {
    const pairs = [
      ["--pt-text-primary", "--pt-background-app"],
      ["--pt-text-secondary", "--pt-background-app"],
      ["--pt-text-muted", "--pt-background-app"],
      ["--pt-semantic-success", "--pt-semantic-success-muted"],
      ["--pt-semantic-warning", "--pt-semantic-warning-muted"],
      ["--pt-semantic-danger", "--pt-semantic-danger-muted"],
      ["--pt-status-live", "--pt-status-live-muted"],
      ["--pt-status-currently-winning", "--pt-status-currently-winning-muted"],
      ["--pt-status-won", "--pt-status-won-muted"],
      ["--pt-status-lost", "--pt-status-lost-muted"],
    ] as const;

    for (const [foreground, background] of pairs) {
      expect(
        contrast(darkToken(foreground), darkToken(background)),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps chart marks above non-text contrast against the app background", () => {
    for (let index = 1; index <= 6; index += 1) {
      expect(
        contrast(
          darkToken(`--pt-chart-series-${index}`),
          darkToken("--pt-background-app"),
        ),
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("defines visible focus, reduced motion, and token-only primitive colours", () => {
    expect(primitives).toContain(":focus-visible");
    expect(primitives).toContain("--pt-focus-width");
    expect(motion).toContain("@media (prefers-reduced-motion: reduce)");
    expect(motion).toContain("transition-duration: 1ms !important");
    expect(primitives).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });
});
