import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  createTestEnvironment,
  deterministicTestEnvironment,
} from "../apps/web/src/env/test-utils.ts";
import { validateRuntimeEnvironment } from "../apps/web/src/env/schema.ts";

const repositoryRoot = resolve(import.meta.dirname, "..");
const examplePath = resolve(repositoryRoot, ".env.example");
const expectedKeys = [
  "APP_ENV",
  "LOG_LEVEL",
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];
const serverOnlyKeys = ["APP_ENV", "LOG_LEVEL", "SUPABASE_SERVICE_ROLE_KEY"];
const clientSafeKeys = [
  "NEXT_PUBLIC_APP_NAME",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
];
const forbiddenFutureKeys = [
  "AI_GATEWAY_API_KEY",
  "BET9JA_CREDENTIALS",
  "DATABASE_URL",
  "FLUTTERWAVE_SECRET_KEY",
  "GEMINI_API_KEY",
  "MSPORT_CREDENTIALS",
  "ODDS_API_KEY",
  "OPENAI_API_KEY",
  "PAYSTACK_SECRET_KEY",
  "SPORTS_API_KEY",
  "SPORTYBET_CREDENTIALS",
  "SUPABASE_SECRET_KEY",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
];

function parseEnvironmentValue(sourceValue) {
  if (
    sourceValue.length >= 2 &&
    ((sourceValue.startsWith('"') && sourceValue.endsWith('"')) ||
      (sourceValue.startsWith("'") && sourceValue.endsWith("'")))
  ) {
    return sourceValue.slice(1, -1);
  }

  return sourceValue;
}

function parseEnvironmentFile(contents) {
  const entries = new Map();

  for (const sourceLine of contents.split(/\r?\n/u)) {
    const line = sourceLine.trim();
    if (line.length === 0 || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator <= 0) {
      throw new Error("Invalid environment template line; expected KEY=value.");
    }

    const key = line.slice(0, separator).trim();
    const value = parseEnvironmentValue(line.slice(separator + 1).trim());
    if (entries.has(key)) {
      throw new Error(`Duplicate environment template key: ${key}.`);
    }
    entries.set(key, value);
  }

  return entries;
}

function validateExample() {
  const entries = parseEnvironmentFile(readFileSync(examplePath, "utf8"));
  const actualKeys = [...entries.keys()].sort();
  const requiredKeys = [...expectedKeys].sort();

  if (actualKeys.join("\n") !== requiredKeys.join("\n")) {
    throw new Error(".env.example must contain exactly the foundation keys.");
  }

  if (serverOnlyKeys.some((key) => key.startsWith("NEXT_PUBLIC_"))) {
    throw new Error("A server-only environment key uses the public prefix.");
  }
  if (clientSafeKeys.some((key) => !key.startsWith("NEXT_PUBLIC_"))) {
    throw new Error("A client-safe environment key is missing the public prefix.");
  }

  for (const key of forbiddenFutureKeys) {
    if (entries.has(key)) {
      throw new Error(`Forbidden future environment key found: ${key}.`);
    }
  }

  for (const [key, value] of entries) {
    if (/^(?:AKIA|sk-|ghp_|xox[baprs]-)/u.test(value) || value.length > 80) {
      throw new Error(`Example value for ${key} resembles a credential.`);
    }
  }

  validateRuntimeEnvironment(Object.fromEntries(entries));
  execFileSync("git", ["check-ignore", "-q", ".env.local"], {
    cwd: repositoryRoot,
    stdio: "ignore",
  });
}

function validateCurrent() {
  const localPath = resolve(repositoryRoot, ".env.local");
  const localEntries = existsSync(localPath)
    ? parseEnvironmentFile(readFileSync(localPath, "utf8"))
    : new Map();

  validateRuntimeEnvironment({
    APP_ENV: process.env.APP_ENV ?? localEntries.get("APP_ENV"),
    LOG_LEVEL: process.env.LOG_LEVEL ?? localEntries.get("LOG_LEVEL"),
    NEXT_PUBLIC_APP_NAME:
      process.env.NEXT_PUBLIC_APP_NAME ?? localEntries.get("NEXT_PUBLIC_APP_NAME"),
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ?? localEntries.get("NEXT_PUBLIC_APP_URL"),
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      localEntries.get("NEXT_PUBLIC_SUPABASE_URL"),
    SUPABASE_SERVICE_ROLE_KEY:
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      localEntries.get("SUPABASE_SERVICE_ROLE_KEY"),
  });
}

const mode = process.argv[2];

try {
  if (mode === "current") {
    validateCurrent();
  } else if (mode === "test") {
    validateRuntimeEnvironment(createTestEnvironment(deterministicTestEnvironment));
  } else if (mode === "example") {
    validateExample();
  } else {
    throw new Error("Expected environment-check mode: current, test, or example.");
  }

  process.stdout.write(`Environment ${mode} validation passed.\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : "Environment check failed.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
