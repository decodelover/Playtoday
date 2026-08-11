"use server";

import type { Database } from "@playtoday/database-types";
import {
  DisplayNameSchema,
  NotificationChannelsSchema,
  SettingsPreferencesSchema,
  TimezoneSchema,
  type NotificationChannelsInput,
  type UserPreferencesInput,
} from "@playtoday/validation";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "../../lib/supabase/server";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type PreferencesUpdate = Database["public"]["Tables"]["user_preferences"]["Update"];

interface MutationResult {
  error: { code?: string } | null;
}

interface MutationFilter {
  eq(column: string, value: string): PromiseLike<MutationResult>;
}

interface SettingsMutationTable<Update> {
  update(values: Update): MutationFilter;
}

export interface SettingsActionResult {
  success: boolean;
  error?: string;
}

async function getAuthenticatedContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return error || !user ? null : { supabase, user };
}

function logSettingsFailure(operation: string, databaseCode?: string) {
  process.stderr.write(
    `${JSON.stringify({ event: "account_settings_write_failed", operation, databaseCode })}\n`,
  );
}

export async function updateDisplayNameAction(
  displayName: string,
): Promise<SettingsActionResult> {
  const parsed = DisplayNameSchema.safeParse(displayName);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Check your display name.",
    };
  }

  const context = await getAuthenticatedContext();
  if (!context) {
    return { success: false, error: "Your session has ended. Sign in again." };
  }

  const profiles = context.supabase.from(
    "profiles",
  ) as unknown as SettingsMutationTable<ProfileUpdate>;
  const { error } = await profiles
    .update({ display_name: parsed.data })
    .eq("id", context.user.id);

  if (error) {
    logSettingsFailure("profile", error.code);
    return { success: false, error: "We couldn't save your name. Try again." };
  }

  revalidatePath("/settings", "layout");
  return { success: true };
}

export async function updateTimezoneAction(
  timezone: string,
): Promise<SettingsActionResult> {
  const parsed = TimezoneSchema.safeParse(timezone);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Check your timezone.",
    };
  }

  const context = await getAuthenticatedContext();
  if (!context) {
    return { success: false, error: "Your session has ended. Sign in again." };
  }

  const preferences = context.supabase.from(
    "user_preferences",
  ) as unknown as SettingsMutationTable<PreferencesUpdate>;
  const { error } = await preferences
    .update({ timezone: parsed.data })
    .eq("user_id", context.user.id);

  if (error) {
    logSettingsFailure("timezone", error.code);
    return { success: false, error: "We couldn't save your timezone. Try again." };
  }

  revalidatePath("/settings/profile");
  return { success: true };
}

export async function updatePreferencesAction(
  input: UserPreferencesInput,
): Promise<SettingsActionResult> {
  const parsed = SettingsPreferencesSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Check your preferences.",
    };
  }

  const context = await getAuthenticatedContext();
  if (!context) {
    return { success: false, error: "Your session has ended. Sign in again." };
  }

  const preferences = context.supabase.from(
    "user_preferences",
  ) as unknown as SettingsMutationTable<PreferencesUpdate>;
  const { error } = await preferences
    .update({
      preferred_sports: parsed.data.preferred_sports,
      preferred_bookmakers: parsed.data.preferred_bookmakers,
      preferred_markets: parsed.data.preferred_markets,
      target_odds: parsed.data.target_odds,
      default_strategy: parsed.data.default_strategy,
      risk_preference: parsed.data.risk_preference,
    })
    .eq("user_id", context.user.id);

  if (error) {
    logSettingsFailure("preferences", error.code);
    return { success: false, error: "We couldn't save your preferences. Try again." };
  }

  revalidatePath("/settings/preferences");
  return { success: true };
}

export async function updateNotificationChannelsAction(
  input: NotificationChannelsInput,
): Promise<SettingsActionResult> {
  const parsed = NotificationChannelsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Check your notification choices." };
  }

  const context = await getAuthenticatedContext();
  if (!context) {
    return { success: false, error: "Your session has ended. Sign in again." };
  }

  const preferences = context.supabase.from(
    "user_preferences",
  ) as unknown as SettingsMutationTable<PreferencesUpdate>;
  const { error } = await preferences
    .update({ notification_channels: parsed.data })
    .eq("user_id", context.user.id);

  if (error) {
    logSettingsFailure("notifications", error.code);
    return {
      success: false,
      error: "We couldn't save your notification choices. Try again.",
    };
  }

  revalidatePath("/settings/notifications");
  return { success: true };
}
