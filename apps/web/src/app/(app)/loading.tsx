import { Skeleton, Stack } from "@playtoday/ui";
export default function ShellLoading() {
  return (
    <Stack aria-label="Loading application workspace" gap="large" role="status">
      <Skeleton className="shell-loading-title" shape="rectangle" />
      <Skeleton lines={4} />
    </Stack>
  );
}
