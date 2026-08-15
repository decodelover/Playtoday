import type { RuntimeEnvironmentInput } from "./schema";

export const deterministicTestEnvironment = Object.freeze({
  APP_ENV: "test",
  LOG_LEVEL: "error",
  NEXT_PUBLIC_APP_NAME: "PlayToday",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "https://project-ref.supabase.co",
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
} satisfies RuntimeEnvironmentInput);

export function createTestEnvironment(
  overrides: Partial<RuntimeEnvironmentInput> = {},
): RuntimeEnvironmentInput {
  return {
    ...deterministicTestEnvironment,
    ...overrides,
  };
}
