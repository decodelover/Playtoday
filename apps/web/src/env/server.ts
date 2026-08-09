import "server-only";

import { validateRuntimeEnvironment } from "./schema";

const validatedEnvironment = validateRuntimeEnvironment({
  APP_ENV: process.env.APP_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
});

export const serverEnvironment = Object.freeze({
  APP_ENV: validatedEnvironment.APP_ENV,
  LOG_LEVEL: validatedEnvironment.LOG_LEVEL,
  SUPABASE_SERVICE_ROLE_KEY: validatedEnvironment.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_APP_NAME: validatedEnvironment.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: validatedEnvironment.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: validatedEnvironment.NEXT_PUBLIC_SUPABASE_URL,
});
