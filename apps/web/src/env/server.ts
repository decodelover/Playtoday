import "server-only";

import { validateRuntimeEnvironment } from "./schema";

const validatedEnvironment = validateRuntimeEnvironment({
  APP_ENV: process.env.APP_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SPORTS_PROVIDER: process.env.SPORTS_PROVIDER,
  SPORTS_PROVIDER_API_KEY: process.env.SPORTS_PROVIDER_API_KEY,
  SPORTS_PROVIDER_BASE_URL: process.env.SPORTS_PROVIDER_BASE_URL,
  SPORTS_SYNC_MAX_REQUESTS: process.env.SPORTS_SYNC_MAX_REQUESTS,
  SPORTS_SYNC_MAX_FIXTURES: process.env.SPORTS_SYNC_MAX_FIXTURES,
  CRON_SECRET: process.env.CRON_SECRET,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
});

export const serverEnvironment = Object.freeze({
  APP_ENV: validatedEnvironment.APP_ENV,
  LOG_LEVEL: validatedEnvironment.LOG_LEVEL,
  SUPABASE_SERVICE_ROLE_KEY: validatedEnvironment.SUPABASE_SERVICE_ROLE_KEY,
  SPORTS_PROVIDER: validatedEnvironment.SPORTS_PROVIDER,
  SPORTS_PROVIDER_API_KEY: validatedEnvironment.SPORTS_PROVIDER_API_KEY,
  SPORTS_PROVIDER_BASE_URL: validatedEnvironment.SPORTS_PROVIDER_BASE_URL,
  SPORTS_SYNC_MAX_REQUESTS: validatedEnvironment.SPORTS_SYNC_MAX_REQUESTS,
  SPORTS_SYNC_MAX_FIXTURES: validatedEnvironment.SPORTS_SYNC_MAX_FIXTURES,
  CRON_SECRET: validatedEnvironment.CRON_SECRET,
  NEXT_PUBLIC_APP_NAME: validatedEnvironment.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: validatedEnvironment.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: validatedEnvironment.NEXT_PUBLIC_SUPABASE_URL,
});
