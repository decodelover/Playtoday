import { describe, expect, it } from "vitest";

import {
  EnvironmentValidationError,
  validateClientEnvironment,
  validateContactSupabaseEnvironment,
  validateRuntimeEnvironment,
  validateServerEnvironment,
} from "./schema";
import { createTestEnvironment } from "./test-utils";

describe.each(["development", "test", "preview", "production"] as const)(
  "%s environment",
  (appEnvironment) => {
    it("accepts the complete foundation contract", () => {
      expect(
        validateRuntimeEnvironment(createTestEnvironment({ APP_ENV: appEnvironment }))
          .APP_ENV,
      ).toBe(appEnvironment);
    });
  },
);

describe("environment validation failures", () => {
  it("rejects a missing required variable", () => {
    expect(() =>
      validateRuntimeEnvironment({
        ...createTestEnvironment(),
        NEXT_PUBLIC_APP_NAME: undefined,
      }),
    ).toThrow("NEXT_PUBLIC_APP_NAME");
  });

  it("keeps production strict when a required value is missing", () => {
    expect(() =>
      validateRuntimeEnvironment({
        ...createTestEnvironment({ APP_ENV: "production" }),
        NEXT_PUBLIC_APP_URL: undefined,
      }),
    ).toThrow("NEXT_PUBLIC_APP_URL");
  });

  it("rejects an unknown APP_ENV", () => {
    expect(() =>
      validateRuntimeEnvironment({
        ...createTestEnvironment(),
        APP_ENV: "staging",
      }),
    ).toThrow("APP_ENV");
  });

  it("rejects an unknown LOG_LEVEL", () => {
    expect(() =>
      validateRuntimeEnvironment({
        ...createTestEnvironment(),
        LOG_LEVEL: "verbose",
      }),
    ).toThrow("LOG_LEVEL");
  });

  it("rejects a malformed application URL", () => {
    expect(() =>
      validateRuntimeEnvironment({
        ...createTestEnvironment(),
        NEXT_PUBLIC_APP_URL: "not-a-url",
      }),
    ).toThrow("NEXT_PUBLIC_APP_URL");
  });

  it("rejects a non-HTTP application URL", () => {
    expect(() =>
      validateRuntimeEnvironment({
        ...createTestEnvironment(),
        NEXT_PUBLIC_APP_URL: "ftp://localhost:3000",
      }),
    ).toThrow("NEXT_PUBLIC_APP_URL");
  });

  it("does not reveal a supplied value in validation errors", () => {
    const suppliedValue = "secret-like-value-that-must-not-appear";

    try {
      validateRuntimeEnvironment({
        ...createTestEnvironment(),
        APP_ENV: suppliedValue,
      });
      throw new Error("Expected environment validation to fail.");
    } catch (error) {
      expect(error).toBeInstanceOf(EnvironmentValidationError);
      expect((error as Error).message).toContain("APP_ENV");
      expect((error as Error).message).not.toContain(suppliedValue);
    }
  });
});

describe("client environment boundary", () => {
  it("returns only explicitly approved public variables", () => {
    expect(validateClientEnvironment(createTestEnvironment())).toEqual({
      NEXT_PUBLIC_APP_NAME: "PlayToday",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: "https://project-ref.supabase.co",
    });
  });

  it("validates the server-only subset independently", () => {
    expect(validateServerEnvironment(createTestEnvironment())).toEqual({
      APP_ENV: "test",
      LOG_LEVEL: "error",
      SUPABASE_SERVICE_ROLE_KEY: "test-server-service-role-key-not-a-credential",
      SPORTS_PROVIDER: "api-football",
      SPORTS_PROVIDER_API_KEY: "test-sports-provider-key-not-a-credential",
      SPORTS_PROVIDER_BASE_URL: "https://v3.football.api-sports.io",
      SPORTS_SYNC_MAX_REQUESTS: 4,
      SPORTS_SYNC_MAX_FIXTURES: 60,
      ODDS_SYNC_MAX_REQUESTS: 4,
      ODDS_SYNC_MAX_PAGES: 2,
      ODDS_SYNC_MAX_EVENTS: 20,
      CRON_SECRET: "test-cron-secret-not-a-credential",
    });
  });

  it("validates the contact Supabase boundary independently", () => {
    expect(
      validateContactSupabaseEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: "https://project-ref.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "test-server-service-role-key-not-a-credential",
      }),
    ).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "https://project-ref.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "test-server-service-role-key-not-a-credential",
    });
  });

  it("requires a non-empty service-role key for contact persistence", () => {
    expect(() =>
      validateContactSupabaseEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: "https://project-ref.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "short",
      }),
    ).toThrow("SUPABASE_SERVICE_ROLE_KEY");
  });

  it("rejects a malformed public Supabase URL", () => {
    expect(() =>
      validateClientEnvironment({
        ...createTestEnvironment(),
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
      }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_URL");
  });
});
