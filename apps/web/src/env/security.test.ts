import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const repositoryRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const webSourceRoot = resolve(repositoryRoot, "apps/web/src");

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      return listSourceFiles(path);
    }
    return /\.[cm]?[jt]sx?$/u.test(entry.name) ? [path] : [];
  });
}

function parseExampleKeys(): string[] {
  return readFileSync(resolve(repositoryRoot, ".env.example"), "utf8")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => line.slice(0, line.indexOf("=")))
    .sort();
}

describe("environment repository safety", () => {
  it("keeps the example contract complete and minimal", () => {
    expect(parseExampleKeys()).toEqual([
      "APP_ENV",
      "LOG_LEVEL",
      "NEXT_PUBLIC_APP_NAME",
      "NEXT_PUBLIC_APP_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]);
  });

  it("keeps .env.local ignored by Git", () => {
    expect(() =>
      execFileSync("git", ["check-ignore", "-q", ".env.local"], {
        cwd: repositoryRoot,
        stdio: "ignore",
      }),
    ).not.toThrow();
  });

  it("prevents Client Components from importing the server environment", () => {
    const violations = listSourceFiles(webSourceRoot).filter((path) => {
      const source = readFileSync(path, "utf8");
      const isClientComponent = /^\s*["']use client["'];/mu.test(source);
      const importsServerEnvironment = /from\s+["'][^"']*env\/server["']/u.test(source);
      return isClientComponent && importsServerEnvironment;
    });

    expect(violations).toEqual([]);
  });

  it("prevents Client Components from referencing the service-role key", () => {
    const violations = listSourceFiles(webSourceRoot).filter((path) => {
      const source = readFileSync(path, "utf8");
      const isClientComponent = /^\s*["']use client["'];/mu.test(source);
      return isClientComponent && source.includes("SUPABASE_SERVICE_ROLE_KEY");
    });

    expect(violations).toEqual([]);
  });
});
