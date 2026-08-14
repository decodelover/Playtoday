import { runSportsSync, type SportsSyncOptions } from "./runner";

function parseArguments(argumentsList: string[]): SportsSyncOptions {
  const options: SportsSyncOptions = {};
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--health-only") {
      options.healthOnly = true;
    } else if (argument === "--live") {
      options.live = true;
    } else if (argument === "--date") {
      const date = argumentsList[index + 1];
      if (!date || !/^\d{4}-\d{2}-\d{2}$/u.test(date)) {
        throw new Error("--date requires YYYY-MM-DD");
      }
      options.date = date;
      index += 1;
    } else {
      throw new Error(`Unknown sports sync argument: ${argument}`);
    }
  }
  if (options.live && options.date) {
    throw new Error("Choose either --live or --date, not both");
  }
  return options;
}

try {
  const result = await runSportsSync(parseArguments(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.ok) {
    process.exitCode = 1;
  }
} catch (error) {
  const message = error instanceof Error ? error.message : "Sports sync failed";
  process.stderr.write(`${JSON.stringify({ ok: false, error: message })}\n`);
  process.exitCode = 1;
}
