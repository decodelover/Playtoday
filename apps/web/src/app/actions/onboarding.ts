"use server";

import {
  OnboardingStepSchema,
  UserPreferencesDraftSchema,
  UserPreferencesSchema,
  type UserPreferencesInput,
} from "@playtoday/validation";
import {
  completeUserOnboarding,
  OnboardingPersistenceError,
  saveOnboardingProgress,
} from "../../lib/onboarding-service";
import { getAuthenticatedUser } from "../../lib/supabase/server";

export interface SaveStepActionResult {
  success: boolean;
  error?: string;
}

export async function saveOnboardingStepAction(
  step: string,
  preferences: UserPreferencesInput,
): Promise<SaveStepActionResult> {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        error: "Your session has ended. Sign in again to continue.",
      };
    }

    const parsedStep = OnboardingStepSchema.safeParse(step);
    const parsedPreferences = UserPreferencesDraftSchema.safeParse(preferences);

    if (!parsedStep.success || !parsedPreferences.success) {
      const preferenceIssue = parsedPreferences.success
        ? undefined
        : parsedPreferences.error.issues[0]?.message;
      return {
        success: false,
        error: preferenceIssue ?? "Check your choices and try again.",
      };
    }

    await saveOnboardingProgress(parsedStep.data, parsedPreferences.data);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof OnboardingPersistenceError) {
      process.stderr.write(
        `${JSON.stringify({ event: "onboarding_progress_save_failed", operation: err.operation, databaseCode: err.databaseCode })}\n`,
      );
    }
    return {
      success: false,
      error: "We couldn't save your progress. Check your connection and try again.",
    };
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
        error: "Your session has ended. Sign in again to finish setup.",
      };
    }

    const parseResult = UserPreferencesSchema.safeParse(preferences);

    if (!parseResult.success) {
      const firstIssue =
        parseResult.error.issues[0]?.message ?? "Check your choices and try again.";
      return { success: false, error: firstIssue };
    }

    await completeUserOnboarding(parseResult.data);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof OnboardingPersistenceError) {
      process.stderr.write(
        `${JSON.stringify({ event: "onboarding_completion_failed", operation: err.operation, databaseCode: err.databaseCode })}\n`,
      );
    }
    return {
      success: false,
      error: "We couldn't finish setting up your account. Try again in a moment.",
    };
  }
}
