import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const webRoot = resolve(repositoryRoot, "apps/web");
const localEnvironmentPath = resolve(repositoryRoot, ".env.local");
const nextBinary = resolve(webRoot, "node_modules/next/dist/bin/next");
const command = process.argv[2];

if (!new Set(["build", "dev", "start"]).has(command)) {
  throw new Error("Expected a Next.js command: build, dev, or start.");
}

function parseLocalEnvironment(contents) {
  const values = {};

  for (const sourceLine of contents.split(/\r?\n/u)) {
    const line = sourceLine.trim();
    if (line.length === 0 || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator <= 0) {
      throw new Error("Invalid root .env.local line; expected KEY=value.");
    }

    const key = line.slice(0, separator).trim();
    const sourceValue = line.slice(separator + 1).trim();
    const value =
      sourceValue.length >= 2 &&
      ((sourceValue.startsWith('"') && sourceValue.endsWith('"')) ||
        (sourceValue.startsWith("'") && sourceValue.endsWith("'")))
        ? sourceValue.slice(1, -1)
        : sourceValue;

    values[key] = value;
  }

  return values;
}

const localEnvironment = existsSync(localEnvironmentPath)
  ? parseLocalEnvironment(readFileSync(localEnvironmentPath, "utf8"))
  : {};

const child = spawn(process.execPath, [nextBinary, command], {
  cwd: webRoot,
  env: { ...localEnvironment, ...process.env },
  stdio: "inherit",
});

child.on("error", (error) => {
  process.stderr.write(`Unable to start Next.js: ${error.message}\n`);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.stderr.write(`Next.js stopped with signal ${signal}.\n`);
    process.exitCode = 1;
    return;
  }

  process.exitCode = code ?? 1;
});
