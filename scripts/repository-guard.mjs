import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { execFileSync } from "node:child_process";

const root = new URL("../", import.meta.url);
const rootPath = decodeURIComponent(root.pathname).replace(/^\/(?:([A-Za-z]:))/, "$1");
const required = [
  ".env.example",
  ".github/workflows/ci.yml",
  ".github/dependabot.yml",
  ".github/pull_request_template.md",
  "CONTRIBUTING.md",
  "LICENSE",
  "SECURITY.md",
  "docs/DEPLOYMENT.md",
  "docs/GITHUB_AND_CI.md",
  "docs/GITHUB_BRANCH_PROTECTION.md",
  "docs/GITHUB_OWNERSHIP.md",
  "docs/RELEASE_CHECKLIST.md",
  "docs/walkthroughs/STEP_1D_ENVIRONMENT_AND_SECRETS.md",
  "docs/walkthroughs/STEP_1E_GITHUB_AND_CI.md",
  "apps/web",
  "apps/web/vercel.json",
  "packages/config",
  "services/prediction-api",
  "services/ingestion-worker",
  "services/settlement-worker",
  "pnpm-lock.yaml",
];
const forbiddenLockfiles = ["package-lock.json", "yarn.lock", "bun.lock", "bun.lockb"];
const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".pnpm-store",
  ".pytest_cache",
  ".ruff_cache",
  ".turbo",
  ".venv",
  "coverage",
  "dist",
  "node_modules",
]);
const generatedSegments = new Set([
  ".next",
  ".pytest_cache",
  ".ruff_cache",
  ".turbo",
  "__pycache__",
  "coverage",
  "dist",
  "node_modules",
]);
const retiredNames = ["edge" + "pilot", "edge" + "pilot-ai", "@edge" + "pilot/"];
const textExtensions = new Set([
  "",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const failures = [];
const toPath = (path) => join(rootPath, path);
for (const path of required) {
  if (!existsSync(toPath(path))) failures.push(`Missing required path: ${path}`);
}

function walk(directory, visitor) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    const projectPath = relative(rootPath, absolute).split(sep).join("/");
    if (entry.isDirectory() && entry.name === ".git") {
      if (directory !== rootPath) visitor(entry, absolute, projectPath);
      continue;
    }
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    visitor(entry, absolute, projectPath);
    if (entry.isDirectory()) walk(absolute, visitor);
  }
}

walk(rootPath, (entry, absolute, projectPath) => {
  if (entry.isDirectory() && entry.name === ".git") {
    failures.push(`Nested Git repository found: ${projectPath}`);
  }
  if (entry.isFile() && forbiddenLockfiles.includes(entry.name)) {
    failures.push(`Foreign JavaScript lockfile found: ${projectPath}`);
  }
  const extension = entry.isFile() ? entry.name.slice(entry.name.lastIndexOf(".")) : "";
  if (
    entry.isFile() &&
    textExtensions.has(extension) &&
    !entry.name.endsWith(".lock")
  ) {
    const content = readFileSync(absolute, "utf8").toLowerCase();
    if (retiredNames.some((name) => content.includes(name))) {
      failures.push(`Retired project naming found: ${projectPath}`);
    }
  }
});

let tracked = [];
try {
  tracked = execFileSync("git", ["ls-files", "-z"], { cwd: rootPath })
    .toString("utf8")
    .split("\0")
    .filter(Boolean);
} catch {
  failures.push("Unable to inspect tracked files with Git.");
}
if (tracked.includes(".env.local")) failures.push(".env.local must not be tracked.");
for (const path of tracked) {
  if (path.split("/").some((segment) => generatedSegments.has(segment))) {
    failures.push(`Generated output must not be tracked: ${path}`);
  }
  if (path.endsWith("/.git") || path.includes("/.git/")) {
    failures.push(`Nested Git metadata must not be tracked: ${path}`);
  }
}

if (failures.length > 0) {
  console.error(
    "Repository guard failed:\n" + failures.map((item) => `- ${item}`).join("\n"),
  );
  process.exit(1);
}
console.log(
  "Repository guard passed (targeted invariants; not a complete secret scan).",
);
