import { runOddsSync, type OddsSyncOptions } from "./odds-runner";

function parseArguments(argumentsList: string[]): OddsSyncOptions {
  const options: OddsSyncOptions = {};
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument !== "--date") {
      throw new Error(`Unknown odds sync argument: ${argument}`);
    }
    const date = argumentsList[index + 1];
    if (!date || !/^\d{4}-\d{2}-\d{2}$/u.test(date)) {
      throw new Error("--date requires YYYY-MM-DD");
    }
    options.date = date;
    index += 1;
  }
  return options;
}

try {
  const result = await runOddsSync(parseArguments(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) {
    process.exitCode = 1;
  }
} catch (error) {
  const message = error instanceof Error ? error.message : "Odds sync failed";
  process.stderr.write(`${JSON.stringify({ ok: false, error: message })}\n`);
  process.exitCode = 1;
}
