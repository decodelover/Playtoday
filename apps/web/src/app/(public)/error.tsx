"use client";

import { ActionButton, PageHero } from "../public-shell/marketing";

export default function Error({
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <PageHero
      actions={<ActionButton onClick={reset}>Try again</ActionButton>}
      description="The page failed before it could be displayed. No internal error details have been exposed."
      eyebrow="Page error"
      marker="500"
      title="This page did not load."
    />
  );
}
