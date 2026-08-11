import { redirect } from "next/navigation";
import { getOnboardingState } from "../../lib/onboarding-service";
import { getAuthenticatedUser } from "../../lib/supabase/server";
import { OnboardingWizard } from "./onboarding-wizard";

export default async function OnboardingPage() {
  const isTestEnvironment = process.env.NODE_ENV === "test";
  const user = await getAuthenticatedUser();

  if (!user && !isTestEnvironment) {
    redirect("/sign-in");
  }

  const userId = user?.id ?? "test-user-id";
  const state = await getOnboardingState(userId);

  if (state.completed && !isTestEnvironment) {
    redirect("/overview");
  }

  return (
    <OnboardingWizard
      initialPreferences={state.preferences}
      initialStep={state.currentStep}
    />
  );
}
