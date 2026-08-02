import { rm } from "node:fs/promises";
import { resolve, relative } from "node:path";

const workingDirectory = process.cwd();
const targets = process.argv.slice(2);

if (targets.length === 0) {
  throw new Error("Provide at least one generated path to clean.");
}

for (const target of targets) {
  const resolvedTarget = resolve(workingDirectory, target);
  const relativeTarget = relative(workingDirectory, resolvedTarget);

  if (
    relativeTarget === "" ||
    relativeTarget.startsWith("..") ||
    relativeTarget.includes(":")
  ) {
    throw new Error(`Refusing to clean unsafe path: ${target}`);
  }

  await rm(resolvedTarget, { force: true, recursive: true });
}
