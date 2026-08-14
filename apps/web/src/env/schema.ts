import { z } from "zod";

export const appEnvironmentSchema = z.enum([
  "development",
  "test",
  "preview",
  "production",
]);

export const logLevelSchema = z.enum(["debug", "info", "warn", "error"]);

const applicationUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    try {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    } catch {
      return false;
    }
  });

export const serverEnvironmentSchema = z.object({
  APP_ENV: appEnvironmentSchema,
  LOG_LEVEL: logLevelSchema,
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(20),
  SPORTS_PROVIDER: z.literal("api-football"),
  SPORTS_PROVIDER_API_KEY: z.string().trim().min(20),
  SPORTS_PROVIDER_BASE_URL: applicationUrlSchema,
  SPORTS_SYNC_MAX_REQUESTS: z.coerce.number().int().min(2).max(20).default(4),
  SPORTS_SYNC_MAX_FIXTURES: z.coerce.number().int().min(1).max(200).default(60),
  CRON_SECRET: z.string().trim().min(16),
});

export const contactSupabaseEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: applicationUrlSchema,
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(20),
});

export const clientEnvironmentSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1),
  NEXT_PUBLIC_APP_URL: applicationUrlSchema,
  NEXT_PUBLIC_SUPABASE_URL: applicationUrlSchema,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().trim().min(20).optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().trim().min(20).optional(),
});

export const runtimeEnvironmentSchema = serverEnvironmentSchema.extend(
  clientEnvironmentSchema.shape,
);

export type AppEnvironment = z.infer<typeof appEnvironmentSchema>;
export type ClientEnvironment = z.infer<typeof clientEnvironmentSchema>;
export type ClientEnvironmentInput = z.input<typeof clientEnvironmentSchema>;
export type RuntimeEnvironment = z.infer<typeof runtimeEnvironmentSchema>;
export type RuntimeEnvironmentInput = z.input<typeof runtimeEnvironmentSchema>;
export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;
export type ServerEnvironmentInput = z.input<typeof serverEnvironmentSchema>;
export type ContactSupabaseEnvironment = z.infer<
  typeof contactSupabaseEnvironmentSchema
>;
export type ContactSupabaseEnvironmentInput = z.input<
  typeof contactSupabaseEnvironmentSchema
>;

export class EnvironmentValidationError extends Error {
  readonly variables: readonly string[];

  constructor(
    scope: "client" | "runtime" | "server" | "supabase",
    variables: string[],
  ) {
    const uniqueVariables = [...new Set(variables)].sort();
    super(
      `Invalid ${scope} environment configuration. Check: ${uniqueVariables.join(", ")}.`,
    );
    this.name = "EnvironmentValidationError";
    this.variables = uniqueVariables;
  }
}

function parseEnvironment<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
  scope: "client" | "runtime" | "server" | "supabase",
): z.output<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    const variables = result.error.issues.map((issue) =>
      issue.path.length > 0 ? String(issue.path[0]) : "environment",
    );
    throw new EnvironmentValidationError(scope, variables);
  }

  return result.data;
}

export function validateClientEnvironment(input: unknown): ClientEnvironment {
  return parseEnvironment(clientEnvironmentSchema, input, "client");
}

export function validateRuntimeEnvironment(input: unknown): RuntimeEnvironment {
  return parseEnvironment(runtimeEnvironmentSchema, input, "runtime");
}

export function validateServerEnvironment(input: unknown): ServerEnvironment {
  return parseEnvironment(serverEnvironmentSchema, input, "server");
}

export function validateContactSupabaseEnvironment(
  input: unknown,
): ContactSupabaseEnvironment {
  return parseEnvironment(contactSupabaseEnvironmentSchema, input, "supabase");
}
