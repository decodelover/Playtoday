"use client";
import { Button, ErrorState } from "@playtoday/ui";
export default function ShellError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <ErrorState
      retryAction={<Button onClick={reset}>Try again</Button>}
      description="The workspace could not be displayed. No sensitive details have been shown."
      title="Workspace unavailable"
    />
  );
}
