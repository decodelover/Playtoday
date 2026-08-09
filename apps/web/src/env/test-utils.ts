import type { RuntimeEnvironmentInput } from "./schema";

export const deterministicTestEnvironment = Object.freeze({
  APP_ENV: "test",
  LOG_LEVEL: "error",
  NEXT_PUBLIC_APP_NAME: "PlayToday",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "https://project-ref.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "test-server-service-role-key-not-a-credential",
} satisfies RuntimeEnvironmentInput);

export function createTestEnvironment(
  overrides: Partial<RuntimeEnvironmentInput> = {},
): RuntimeEnvironmentInput {
  return {
    ...deterministicTestEnvironment,
    ...overrides,
  };
}
