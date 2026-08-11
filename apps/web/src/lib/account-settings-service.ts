import "server-only";

import type { Database } from "@playtoday/database-types";
import {
  UserPreferencesDraftSchema,
  type UserPreferencesInput,
} from "@playtoday/validation";

import { createSupabaseServerClient } from "./supabase/server";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type PreferencesRow = Database["public"]["Tables"]["user_preferences"]["Row"];

export interface AccountSettingsData {
  user: {
    id: string;
    email: string | null;
    emailConfirmedAt: string | null;
    createdAt: string;
  };
  profile: Pick<
    ProfileRow,
    | "avatar_url"
    | "created_at"
    | "display_name"
    | "onboarding_completed_at"
    | "updated_at"
  >;
  preferences: UserPreferencesInput;
  preferencesUpdatedAt: string;
}

export class AccountSettingsError extends Error {
  readonly operation: "load" | "profile" | "preferences" | "notifications";
  readonly databaseCode: string | undefined;

  constructor(operation: AccountSettingsError["operation"], databaseCode?: string) {
    super(`Account settings ${operation} failed.`);
    this.name = "AccountSettingsError";
    this.operation = operation;
    this.databaseCode = databaseCode;
  }
}

function parsePreferences(row: PreferencesRow): UserPreferencesInput {
  const result = UserPreferencesDraftSchema.safeParse({
    preferred_sports: row.preferred_sports,
    preferred_bookmakers: row.preferred_bookmakers,
    preferred_markets: row.preferred_markets,
    target_odds: Number(row.target_odds),
    default_strategy: row.default_strategy,
    risk_preference: row.risk_preference,
    notification_channels: row.notification_channels,
    responsible_play_ack: row.responsible_play_ack,
    timezone: row.timezone,
  });

  if (!result.success) {
    throw new AccountSettingsError("load");
  }

  return result.data;
}

export async function getAuthenticatedAccountSettings(): Promise<AccountSettingsData | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const [profileResult, preferencesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "avatar_url, created_at, display_name, onboarding_completed_at, updated_at",
      )
      .eq("id", user.id)
      .single(),
    supabase.from("user_preferences").select("*").eq("user_id", user.id).single(),
  ]);

  if (profileResult.error || preferencesResult.error) {
    throw new AccountSettingsError(
      "load",
      profileResult.error?.code ?? preferencesResult.error?.code,
    );
  }

  const profile = profileResult.data as AccountSettingsData["profile"];
  const preferencesRow = preferencesResult.data as PreferencesRow;

  return {
    user: {
      id: user.id,
      email: user.email ?? null,
      emailConfirmedAt: user.email_confirmed_at ?? null,
      createdAt: user.created_at,
    },
    profile,
    preferences: parsePreferences(preferencesRow),
    preferencesUpdatedAt: preferencesRow.updated_at,
  };
}
