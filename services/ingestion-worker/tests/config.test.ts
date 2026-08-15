import { describe, expect, it } from "vitest";
import { loadSportsWorkerEnvironment } from "../src/config";

const validEnvironment = {
  SPORTS_PROVIDER: "api-football",
  SPORTS_PROVIDER_API_KEY: "test-sports-provider-key-not-a-credential",
  SPORTS_PROVIDER_BASE_URL: "https://v3.football.api-sports.io",
  NEXT_PUBLIC_SUPABASE_URL: "https://project-ref.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key-not-a-credential",
  SPORTS_SYNC_MAX_REQUESTS: "4",
  SPORTS_SYNC_MAX_FIXTURES: "60",
  ODDS_SYNC_MAX_REQUESTS: "4",
  ODDS_SYNC_MAX_PAGES: "2",
  ODDS_SYNC_MAX_EVENTS: "20",
};

describe("sports worker environment", () => {
  it("accepts the server-only ingestion contract", () => {
    expect(loadSportsWorkerEnvironment(validEnvironment)).toMatchObject({
      SPORTS_PROVIDER: "api-football",
      SPORTS_SYNC_MAX_REQUESTS: 4,
      ODDS_SYNC_MAX_PAGES: 2,
    });
  });

  it("rejects a missing provider key without including values", () => {
    expect(() =>
      loadSportsWorkerEnvironment({
        ...validEnvironment,
        SPORTS_PROVIDER_API_KEY: undefined,
      }),
    ).toThrow("SPORTS_PROVIDER_API_KEY");
  });

  it("rejects public provider credentials", () => {
    expect(
      Object.keys(validEnvironment).some(
        (name) => name.startsWith("NEXT_PUBLIC_") && name.includes("PROVIDER"),
      ),
    ).toBe(false);
  });
});
