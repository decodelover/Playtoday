import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getOnboardingState } from "../../lib/onboarding-service";
import { getAuthenticatedUser } from "../../lib/supabase/server";
import { AppShell } from "../app-shell/app-shell";

export default async function ApplicationLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  // Server-side identity protection for authenticated app routes
  const isTestEnvironment = process.env.NODE_ENV === "test";
  const user = await getAuthenticatedUser();
  let accountIdentity: { displayName: string | null; email: string | null } | undefined;

  if (!user && !isTestEnvironment) {
    redirect("/sign-in");
  }

  if (user && !isTestEnvironment) {
    const onboardingState = await getOnboardingState(user.id);
    if (!onboardingState.completed) {
      redirect("/onboarding");
    }
    accountIdentity = {
      displayName: onboardingState.displayName,
      email: user.email ?? null,
    };
  }

  return <AppShell account={accountIdentity}>{children}</AppShell>;
}
