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
        metadata={<Badge variant="accent">Foundation placeholder</Badge>}
        title={route.label}
      />
      <Card>
        <CardHeader>
          <CardTitle>Workspace foundation</CardTitle>
          <CardDescription>
            This route is ready for a future product phase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="shell-placeholder-notice">
            This page is part of the application-shell foundation and contains no live
            sports data, selections, fixtures, odds, or operational functionality.
          </p>
        </CardContent>
      </Card>
    </Stack>
  );
}
