"use server";

import type { UserPreferencesInput } from "@playtoday/validation";
import { UserPreferencesSchema } from "@playtoday/validation";
import {
  completeUserOnboarding,
  saveOnboardingProgress,
} from "../../lib/onboarding-service";
import { getAuthenticatedUser } from "../../lib/supabase/server";

export interface SaveStepActionResult {
  success: boolean;
  error?: string;
}

export async function saveOnboardingStepAction(
  step: string,
  partialPreferences?: Partial<UserPreferencesInput>,
): Promise<SaveStepActionResult> {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        error: "Your authentication session expired. Please sign in again.",
      };
    }

    await saveOnboardingProgress(user.id, step, partialPreferences);
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred while saving progress.";
    return { success: false, error: message };
  }
}

export async function completeOnboardingAction(
  preferences: UserPreferencesInput,
): Promise<SaveStepActionResult> {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        error: "Authentication session required to complete setup.",
      };
    }

    const parseResult = UserPreferencesSchema.safeParse(preferences);

    if (!parseResult.success) {
      const firstIssue =
        parseResult.error.issues[0]?.message ?? "Invalid preferences configuration.";
      return { success: false, error: firstIssue };
    }

    await completeUserOnboarding(user.id, parseResult.data);
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to finalize your setup. Please try again.";
    return { success: false, error: message };
  }
}
