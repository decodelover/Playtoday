import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: false,
      include: [
        "src/app/page.tsx",
        "src/app/design-system/page.tsx",
        "src/app/app-shell/*.ts",
        "src/app/app-shell/*.tsx",
        "src/app/api/health/route.ts",
        "src/env/schema.ts",
        "src/env/test-utils.ts",
      ],
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    environment: "node",
  },
});
