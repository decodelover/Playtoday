import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const migrationsDirectory = resolve(process.cwd(), "../../supabase/migrations");
const migrationName = readdirSync(migrationsDirectory).find((name) =>
  name.endsWith("_phase_3a_security_hardening.sql"),
);

if (!migrationName) {
  throw new Error("Phase 3A security migration is missing.");
}

const migration = readFileSync(resolve(migrationsDirectory, migrationName), "utf8");

describe("Phase 3A security migration", () => {
  it("derives onboarding ownership from auth.uid and completes in one function", () => {
    expect(migration).toMatch(
      /create or replace function public\.complete_onboarding/u,
    );
    expect(migration).toMatch(/caller_id uuid := auth\.uid\(\)/u);
    expect(migration).toMatch(/insert into public\.user_preferences/u);
    expect(migration).toMatch(/update public\.profiles/u);
    expect(migration).not.toMatch(/p_user_id/u);
  });

  it("prevents direct writes to server-controlled profile fields", () => {
    expect(migration).toMatch(
      /revoke all on table public\.profiles from public, anon, authenticated/u,
    );
    expect(migration).toMatch(
      /grant update \(display_name, avatar_url\) on table public\.profiles to authenticated/u,
    );
    expect(migration).not.toMatch(/grant update \([^)]*onboarding_completed_at/u);
  });

  it("hardens definer functions and private trigger helpers", () => {
    expect(migration).toMatch(/create schema if not exists private/u);
    expect(migration).toMatch(/security definer\s+set search_path = ''/u);
    expect(migration).toMatch(
      /revoke all on function private\.handle_new_auth_user\(\) from public, anon, authenticated/u,
    );
    expect(migration).toMatch(
      /revoke all on function public\.complete_onboarding[\s\S]*from public, anon/u,
    );
  });

  it("adds database constraints for every persisted preference family", () => {
    for (const constraint of [
      "user_preferences_sports_check",
      "user_preferences_bookmakers_check",
      "user_preferences_markets_check",
      "user_preferences_target_odds_check",
      "user_preferences_notifications_check",
      "user_preferences_timezone_shape_check",
    ]) {
      expect(migration).toContain(constraint);
    }
  });
});
