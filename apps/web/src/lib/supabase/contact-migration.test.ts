import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDirectory = resolve(process.cwd(), "../../supabase/migrations");
const migrationName = readdirSync(migrationsDirectory).find((name) =>
  name.endsWith("_phase_2f_contact_submissions.sql"),
);

if (!migrationName) {
  throw new Error("Phase 2F contact migration is missing.");
}

const migration = readFileSync(resolve(migrationsDirectory, migrationName), "utf8");

describe("contact submissions migration", () => {
  it("creates only the approved contact fields", () => {
    expect(migration).toMatch(/create table public\.contact_submissions/u);
    for (const column of [
      "id",
      "enquiry_type",
      "name",
      "email",
      "subject",
      "message",
      "status",
      "created_at",
    ]) {
      expect(migration).toMatch(new RegExp(`\\b${column}\\b`, "u"));
    }
  });

  it("enables and forces RLS with no public policy", () => {
    expect(migration).toMatch(
      /alter table public\.contact_submissions enable row level security/u,
    );
    expect(migration).toMatch(
      /alter table public\.contact_submissions force row level security/u,
    );
    expect(migration).toMatch(
      /revoke all on table public\.contact_submissions from public, anon, authenticated/u,
    );
    expect(migration).not.toMatch(/create policy/iu);
  });

  it("allows the server role to insert without granting reads", () => {
    expect(migration).toMatch(
      /grant insert on table public\.contact_submissions to service_role/u,
    );
    expect(migration).not.toMatch(/grant select/iu);
  });
});
