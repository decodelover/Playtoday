import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const settingsAction = readFileSync(
  resolve(process.cwd(), "src/app/actions/settings.ts"),
  "utf8",
);
const exportRoute = readFileSync(
  resolve(process.cwd(), "src/app/(app)/settings/privacy/export/route.ts"),
  "utf8",
);
const securityControls = readFileSync(
  resolve(process.cwd(), "src/app/(app)/settings/security/security-controls.tsx"),
  "utf8",
);

describe("Phase 3B security boundaries", () => {
  it("derives settings ownership from the authenticated server user", () => {
    expect(settingsAction).toContain("supabase.auth.getUser()");
    expect(settingsAction).toContain('.eq("id", context.user.id)');
    expect(settingsAction).toContain('.eq("user_id", context.user.id)');
    expect(settingsAction).not.toMatch(/userId\s*:/u);
  });

  it("keeps normal settings and export paths free of service-role credentials", () => {
    expect(settingsAction).not.toMatch(/service[_-]?role|SUPABASE_SERVICE_ROLE_KEY/iu);
    expect(exportRoute).not.toMatch(/service[_-]?role|SUPABASE_SERVICE_ROLE_KEY/iu);
    expect(securityControls).not.toMatch(
      /service[_-]?role|SUPABASE_SERVICE_ROLE_KEY/iu,
    );
  });

  it("never logs password values", () => {
    expect(securityControls).not.toMatch(/console\.(?:log|info|debug)/u);
    expect(securityControls).not.toMatch(/process\.stdout/u);
  });

  it("does not expose account deletion without a verified deletion path", () => {
    expect(exportRoute).not.toMatch(/deleteUser|auth\.admin/u);
    expect(settingsAction).not.toMatch(/deleteUser|auth\.admin/u);
  });
});
