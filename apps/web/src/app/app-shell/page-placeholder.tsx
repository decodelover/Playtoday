import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
  Stack,
} from "@playtoday/ui";

import type { ShellRoute } from "./routes";

export function PagePlaceholder({ route }: Readonly<{ route: ShellRoute }>) {
  return (
    <Stack gap="large">
      <PageHeader
        description={route.description}
        metadata={<Badge variant="accent">Not available</Badge>}
        title={route.label}
      />
      <Card>
        <CardHeader>
          <CardTitle>No live data</CardTitle>
          <CardDescription>This area is not available.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="shell-placeholder-notice">
            PlayToday has no live sports data, selections, fixtures, odds, or working
            tools to show here.
          </p>
        </CardContent>
      </Card>
    </Stack>
  );
}
