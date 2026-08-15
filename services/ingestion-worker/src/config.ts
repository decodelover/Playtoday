import { z } from "zod";

const sportsWorkerEnvironmentSchema = z.object({
  SPORTS_PROVIDER: z.literal("api-football"),
  SPORTS_PROVIDER_API_KEY: z.string().trim().min(20),
  SPORTS_PROVIDER_BASE_URL: z.string().url().startsWith("https://"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().startsWith("https://"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(20),
  SPORTS_SYNC_MAX_REQUESTS: z.coerce.number().int().min(2).max(50).default(10),
  SPORTS_SYNC_MAX_FIXTURES: z.coerce.number().int().min(1).max(1000).default(500),
  ODDS_SYNC_MAX_REQUESTS: z.coerce.number().int().min(2).max(50).default(10),
  ODDS_SYNC_MAX_PAGES: z.coerce.number().int().min(1).max(50).default(5),
  ODDS_SYNC_MAX_EVENTS: z.coerce.number().int().min(1).max(200).default(50),
});

export type SportsWorkerEnvironment = z.infer<typeof sportsWorkerEnvironmentSchema>;

export function loadSportsWorkerEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): SportsWorkerEnvironment {
  const result = sportsWorkerEnvironmentSchema.safeParse(source);
  if (!result.success) {
    const names = [
      ...new Set(
        result.error.issues.map((issue) => String(issue.path[0] ?? "environment")),
      ),
    ].sort();
    throw new Error(`Invalid sports worker environment. Check: ${names.join(", ")}.`);
  }
  return result.data;
}
