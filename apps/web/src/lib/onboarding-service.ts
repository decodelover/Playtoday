import "server-only";

import type { Database } from "@playtoday/database-types";
import {
  OnboardingStepSchema,
  UserPreferencesDraftSchema,
  UserPreferencesSchema,
  type UserPreferencesInput,
} from "@playtoday/validation";
import { createSupabaseServerClient } from "./supabase/server";

type ProfileOnboardingRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "display_name" | "onboarding_completed_at" | "onboarding_step" | "avatar_url"
>;
type UserPreferencesRow = Database["public"]["Tables"]["user_preferences"]["Row"];
type DatabaseFunctions = Database["public"]["Functions"];

interface OnboardingRpcResult {
  error: { code?: string } | null;
}

interface OnboardingRpc {
  (
    functionName: "save_onboarding_progress",
    args: DatabaseFunctions["save_onboarding_progress"]["Args"],
  ): PromiseLike<OnboardingRpcResult>;
  (
    functionName: "complete_onboarding",
    args: DatabaseFunctions["complete_onboarding"]["Args"],
  ): PromiseLike<OnboardingRpcResult>;
}

export interface UserOnboardingState {
  completed: boolean;
  completedAt: string | null;
  currentStep: string;
  displayName: string | null;
  avatarUrl?: string | null;
  preferences: UserPreferencesInput | null;
}

export class OnboardingPersistenceError extends Error {
  readonly operation: "complete" | "load" | "save";
  readonly databaseCode: string | undefined;

  constructor(operation: "complete" | "load" | "save", databaseCode?: string) {
    super(`Onboarding ${operation} failed.`);
    this.name = "OnboardingPersistenceError";
    this.operation = operation;
    this.databaseCode = databaseCode;
  }
}

export async function getOnboardingState(userId: string): Promise<UserOnboardingState> {
  const supabase = await createSupabaseServerClient();

  // Fetch profile onboarding completion timestamp and current step
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("display_name, onboarding_completed_at, onboarding_step, avatar_url")
    .eq("id", userId)
    .maybeSingle();
  const profile = profileData as ProfileOnboardingRow | null;

  if (profileError || !profile) {
    throw new OnboardingPersistenceError("load", profileError?.code);
  }

  // Fetch user preferences record
  const { data: preferencesData, error: preferencesError } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  const prefs = preferencesData as UserPreferencesRow | null;

  if (preferencesError) {
    throw new OnboardingPersistenceError("load", preferencesError.code);
  }

  const completedAt = profile.onboarding_completed_at ?? null;
  const completed = completedAt !== null;
  const parsedStep = OnboardingStepSchema.safeParse(profile.onboarding_step);
  const currentStep = completed
    ? "completed"
    : parsedStep.success
      ? parsedStep.data
      : "welcome";

  let parsedPreferences: UserPreferencesInput | null = null;

  if (prefs) {
    const rawChannels =
      typeof prefs.notification_channels === "object" &&
      prefs.notification_channels !== null
        ? (prefs.notification_channels as {
            email?: boolean;
            in_app?: boolean;
          })
        : { email: false, in_app: true };

    const validationResult = UserPreferencesDraftSchema.safeParse({
      preferred_sports: prefs.preferred_sports ?? ["football"],
      preferred_bookmakers: prefs.preferred_bookmakers ?? ["sportybet"],
      preferred_markets: prefs.preferred_markets ?? [
        "1x2",
        "double_chance",
        "over_under",
      ],
      target_odds: Number(prefs.target_odds ?? 3.0),
      default_strategy: prefs.default_strategy ?? "balanced",
      risk_preference: prefs.risk_preference ?? "moderate",
      notification_channels: {
        email: Boolean(rawChannels.email ?? false),
        in_app: Boolean(rawChannels.in_app ?? true),
      },
      responsible_play_ack: prefs.responsible_play_ack ?? false,
      timezone: prefs.timezone ?? "UTC",
    });

    if (validationResult.success) {
      parsedPreferences = validationResult.data;
    }
  }

  return {
    completed,
    completedAt,
    currentStep,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url ?? null,
    preferences: parsedPreferences,
  };
}

export async function saveOnboardingProgress(
  step: string,
  preferences: UserPreferencesInput,
) {
  const validatedStep = OnboardingStepSchema.parse(step);
  const validated = UserPreferencesDraftSchema.parse(preferences);
  const supabase = await createSupabaseServerClient();
  const rpc = supabase.rpc.bind(supabase) as unknown as OnboardingRpc;

  const { error } = await rpc("save_onboarding_progress", {
    p_step: validatedStep,
    p_preferred_sports: validated.preferred_sports,
    p_preferred_bookmakers: validated.preferred_bookmakers,
    p_preferred_markets: validated.preferred_markets,
    p_target_odds: validated.target_odds,
    p_default_strategy: validated.default_strategy,
    p_risk_preference: validated.risk_preference,
    p_notification_channels: validated.notification_channels,
    p_responsible_play_ack: validated.responsible_play_ack,
    p_timezone: validated.timezone,
  });

  if (error) {
    throw new OnboardingPersistenceError("save", error.code);
  }

  return { success: true };
}

export async function completeUserOnboarding(preferences: UserPreferencesInput) {
  const validated = UserPreferencesSchema.parse(preferences);
  const supabase = await createSupabaseServerClient();
  const rpc = supabase.rpc.bind(supabase) as unknown as OnboardingRpc;

  const { error } = await rpc("complete_onboarding", {
    p_preferred_sports: validated.preferred_sports,
    p_preferred_bookmakers: validated.preferred_bookmakers,
    p_preferred_markets: validated.preferred_markets,
    p_target_odds: validated.target_odds,
    p_default_strategy: validated.default_strategy,
    p_risk_preference: validated.risk_preference,
    p_notification_channels: validated.notification_channels,
    p_responsible_play_ack: validated.responsible_play_ack,
    p_timezone: validated.timezone,
  });

  if (error) {
    throw new OnboardingPersistenceError("complete", error.code);
  }

  return { success: true };
}
