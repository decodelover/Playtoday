import "server-only";

import { validateRuntimeEnvironment } from "./schema";

const validatedEnvironment = validateRuntimeEnvironment({
  APP_ENV: process.env.APP_ENV || "production",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua2NsbXlydmJxZGt0Y3FqY3ZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjIzMDAwMSwiZXhwIjoyMTAxODA2MDAxfQ.wqSQ5sjB91s6GQ-dqDDmCfigf_b8i1gnLSnxyoUzlSU",
  SPORTS_PROVIDER: (process.env.SPORTS_PROVIDER as any) || "api-football",
  SPORTS_PROVIDER_API_KEY: process.env.SPORTS_PROVIDER_API_KEY || "99002fc1865a1b41114524d9207b91c1",
  SPORTS_PROVIDER_BASE_URL: process.env.SPORTS_PROVIDER_BASE_URL || "https://v3.football.api-sports.io",
  SPORTS_SYNC_MAX_REQUESTS: process.env.SPORTS_SYNC_MAX_REQUESTS || 10,
  SPORTS_SYNC_MAX_FIXTURES: process.env.SPORTS_SYNC_MAX_FIXTURES || 500,
  ODDS_SYNC_MAX_REQUESTS: process.env.ODDS_SYNC_MAX_REQUESTS || 10,
  ODDS_SYNC_MAX_PAGES: process.env.ODDS_SYNC_MAX_PAGES || 5,
  ODDS_SYNC_MAX_EVENTS: process.env.ODDS_SYNC_MAX_EVENTS || 50,
  AI_PROVIDER: process.env.AI_PROVIDER || "gemini",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || Buffer.from("QVEuQWI4Uk42SmpIZU90R240WlRQOXQxYVl3UXZwTkpxQlFjZkJidkZRNlFrNTBCTHkzcXc=", "base64").toString("utf-8"),
  CRON_SECRET: process.env.CRON_SECRET || "local-cron-secret-not-for-production",
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "PlayToday",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://playtoday.vercel.app",
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://enkclmyrvbqdktcqjcvf.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua2NsbXlydmJxZGt0Y3FqY3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMzAwMDEsImV4cCI6MjEwMTgwNjAwMX0.bRvqDecmL7DZB4zQKVm5ZstDUpmAruOSJlRDxjDbprQ",
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
  ODDS_SYNC_MAX_REQUESTS: validatedEnvironment.ODDS_SYNC_MAX_REQUESTS,
  ODDS_SYNC_MAX_PAGES: validatedEnvironment.ODDS_SYNC_MAX_PAGES,
  ODDS_SYNC_MAX_EVENTS: validatedEnvironment.ODDS_SYNC_MAX_EVENTS,
  AI_PROVIDER: validatedEnvironment.AI_PROVIDER,
  GEMINI_API_KEY: validatedEnvironment.GEMINI_API_KEY,
  CRON_SECRET: validatedEnvironment.CRON_SECRET,
  NEXT_PUBLIC_APP_NAME: validatedEnvironment.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: validatedEnvironment.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: validatedEnvironment.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: validatedEnvironment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
