import "server-only";

import type { UserPreferencesInput } from "@playtoday/validation";
import { UserPreferencesSchema } from "@playtoday/validation";
import { createSupabaseServerClient } from "./supabase/server";

export interface UserOnboardingState {
  completed: boolean;
  completedAt: string | null;
  currentStep: string;
  preferences: UserPreferencesInput | null;
}

export async function getOnboardingState(userId: string): Promise<UserOnboardingState> {
  const supabase = await createSupabaseServerClient();

  // Fetch profile onboarding completion timestamp and current step
  const { data: profile } = await (supabase.from("profiles") as any)
    .select("onboarding_completed_at, onboarding_step")
    .eq("id", userId)
    .maybeSingle();

  // Fetch user preferences record
  const { data: prefs } = await (supabase.from("user_preferences") as any)
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const completedAt =
    (profile as { onboarding_completed_at?: string | null })?.onboarding_completed_at ??
    null;
  const completed = completedAt !== null;
  const currentStep =
    (profile as { onboarding_step?: string | null })?.onboarding_step ?? "welcome";

  let parsedPreferences: UserPreferencesInput | null = null;

  if (prefs) {
    const rawChannels =
      typeof (prefs as any).notification_channels === "object" &&
      (prefs as any).notification_channels !== null
        ? ((prefs as any).notification_channels as {
            email?: boolean;
            in_app?: boolean;
          })
        : { email: true, in_app: true };

    const validationResult = UserPreferencesSchema.safeParse({
      preferred_sports: (prefs as any).preferred_sports ?? ["football"],
      preferred_bookmakers: (prefs as any).preferred_bookmakers ?? ["sportybet"],
      preferred_markets: (prefs as any).preferred_markets ?? [
        "1x2",
        "double_chance",
        "over_under",
      ],
      target_odds: Number((prefs as any).target_odds ?? 3.0),
      default_strategy: (prefs as any).default_strategy ?? "balanced",
      risk_preference: (prefs as any).risk_preference ?? "moderate",
      notification_channels: {
        email: Boolean(rawChannels.email ?? true),
        in_app: Boolean(rawChannels.in_app ?? true),
      },
      responsible_play_ack: Boolean((prefs as any).responsible_play_ack ?? true),
      timezone: (prefs as any).timezone ?? "UTC",
    });

    if (validationResult.success) {
      parsedPreferences = validationResult.data;
    }
  }

  return {
    completed,
    completedAt,
    currentStep,
    preferences: parsedPreferences,
  };
}

export async function saveOnboardingProgress(
  userId: string,
  step: string,
  preferences?: Partial<UserPreferencesInput>,
) {
  const supabase = await createSupabaseServerClient();

  // Update onboarding step on profile
  await (supabase.from("profiles") as any)
    .update({
      onboarding_step: step,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (preferences) {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (preferences.preferred_sports)
      updatePayload.preferred_sports = preferences.preferred_sports;
    if (preferences.preferred_bookmakers)
      updatePayload.preferred_bookmakers = preferences.preferred_bookmakers;
    if (preferences.preferred_markets)
      updatePayload.preferred_markets = preferences.preferred_markets;
    if (preferences.target_odds !== undefined)
      updatePayload.target_odds = preferences.target_odds;
    if (preferences.default_strategy)
      updatePayload.default_strategy = preferences.default_strategy;
    if (preferences.risk_preference)
      updatePayload.risk_preference = preferences.risk_preference;
    if (preferences.notification_channels)
      updatePayload.notification_channels = preferences.notification_channels;
    if (preferences.responsible_play_ack !== undefined)
      updatePayload.responsible_play_ack = preferences.responsible_play_ack;
    if (preferences.timezone) updatePayload.timezone = preferences.timezone;

    await (supabase.from("user_preferences") as any).upsert(
      {
        user_id: userId,
        ...updatePayload,
      },
      { onConflict: "user_id" },
    );
  }

  return { success: true };
}

export async function completeUserOnboarding(
  userId: string,
  preferences: UserPreferencesInput,
) {
  const validated = UserPreferencesSchema.parse(preferences);
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();

  // Upsert user preferences strictly scoped to authenticated user_id
  const { error: prefsError } = await (supabase.from("user_preferences") as any).upsert(
    {
      user_id: userId,
      preferred_sports: validated.preferred_sports,
      preferred_bookmakers: validated.preferred_bookmakers,
      preferred_markets: validated.preferred_markets,
      target_odds: validated.target_odds,
      default_strategy: validated.default_strategy,
      risk_preference: validated.risk_preference,
      notification_channels: validated.notification_channels,
      responsible_play_ack: validated.responsible_play_ack,
      timezone: validated.timezone,
      updated_at: now,
    },
    { onConflict: "user_id" },
  );

  if (prefsError) {
    throw new Error(`Failed to persist user preferences: ${prefsError.message}`);
  }

  // Update profile onboarding completion timestamp atomically
  const { error: profileError } = await (supabase.from("profiles") as any)
    .update({
      onboarding_completed_at: now,
      onboarding_step: "completed",
      updated_at: now,
    })
    .eq("id", userId);

  if (profileError) {
    throw new Error(`Failed to update onboarding completion: ${profileError.message}`);
  }

  return { success: true };
}
