import { spawnSync } from "node:child_process";

const executable = "pnpm";
const commands = [
  ["repository:guard"],
  ["env:example:check"],
  ["env:check:test"],
  ["format:check"],
  ["lint"],
  ["typecheck"],
  ["test"],
  ["test:coverage"],
  ["build"],
];

for (const args of commands) {
  console.log(`\n> pnpm ${args.join(" ")}`);
  const result = spawnSync(executable, args, {
    shell: process.platform === "win32",
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("\nLocal CI-equivalent checks passed.");
