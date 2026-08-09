// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  DataList,
  DataListItem,
  DefinitionItem,
  DefinitionList,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Kbd,
  LoadingButton,
  PageHeader,
  Pagination,
  PaginationEllipsis,
  PaginationLink,
  PaginationList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlList,
  SegmentedControlPanel,
  Separator,
  Spinner,
  Stack,
  StatCard,
  Surface,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TrendIndicator,
  VisuallyHidden,
} from "../src";

afterEach(cleanup);

describe("Phase 2B public component inventory", () => {
  it("renders feedback, layout, navigation, and data-display composition", () => {
    render(
      <Container>
        <PageHeader
          action={<Button>Action</Button>}
          breadcrumb={<span>Root</span>}
          description="Example description"
          metadata="Metadata"
          title="Example page"
        />
        <Stack gap="small">
          <Badge variant="outline">Beta</Badge>
          <Progress description="Half complete" label="Example progress" value={50} />
          <Progress indeterminate label="Background refresh" />
          <Spinner label="Loading inventory" size="large" />
          <Separator />
          <Surface tone="subtle">
            <VisuallyHidden>Hidden context</VisuallyHidden>Surface
          </Surface>
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>Card description</CardDescription>
            </CardHeader>
            <CardContent>Content</CardContent>
            <CardFooter>Footer</CardFooter>
          </Card>
          <DefinitionList>
            <DefinitionItem term="Label">Value</DefinitionItem>
          </DefinitionList>
          <DataList>
            <DataListItem label="Example" meta="Metadata" value="1.85" />
          </DataList>
          <StatCard description="Demonstration" label="Example stat" value="82" />
          <Avatar alt="Example avatar" fallback="EX" />
          <Kbd>Esc</Kbd>
          <TrendIndicator direction="neutral" label="Stable trend" />
          <LoadingButton>Ready</LoadingButton>
        </Stack>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Library</BreadcrumbItem>
            <BreadcrumbItem current>Components</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Pagination>
          <PaginationList>
            <li>
              <PaginationLink href="#previous">Previous</PaginationLink>
            </li>
            <li>
              <PaginationLink current href="#one">
                1
              </PaginationLink>
            </li>
            <li>
              <PaginationEllipsis />
            </li>
            <li>
              <PaginationLink disabled href="#next">
                Next
              </PaginationLink>
            </li>
          </PaginationList>
        </Pagination>
        <SegmentedControl defaultValue="a">
          <SegmentedControlList>
            <SegmentedControlItem value="a">A</SegmentedControlItem>
            <SegmentedControlItem value="b">B</SegmentedControlItem>
          </SegmentedControlList>
          <SegmentedControlPanel value="a">Panel A</SegmentedControlPanel>
        </SegmentedControl>
      </Container>,
    );
    expect(screen.getByRole("heading", { name: "Example page" })).toBeVisible();
    expect(
      screen.getByRole("progressbar", { name: "Example progress" }),
    ).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByRole("status", { name: "Loading inventory" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeVisible();
    expect(screen.getByText("Stable trend")).toBeVisible();
  });

  it("renders optional overlay building blocks when controlled open", () => {
    render(
      <>
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Consequence</AlertDialogTitle>
            <AlertDialogDescription>
              Explicit fictional consequence.
            </AlertDialogDescription>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
        <Popover open>
          <PopoverTrigger>Popover anchor</PopoverTrigger>
          <PopoverContent>Contextual example</PopoverContent>
        </Popover>
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Tooltip anchor</TooltipTrigger>
            <TooltipContent>Supplementary guidance</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu open>
          <DropdownMenuTrigger>Menu anchor</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>Checked example</DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup value="one">
              <DropdownMenuRadioItem value="one">Radio example</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </>,
    );
    expect(screen.getByRole("alertdialog", { hidden: true })).toHaveTextContent(
      "Consequence",
    );
    expect(screen.getByText("Contextual example")).toBeInTheDocument();
    expect(screen.getByRole("tooltip", { hidden: true })).toHaveTextContent(
      "Supplementary guidance",
    );
    expect(screen.getByRole("menuitemcheckbox", { hidden: true })).toHaveAttribute(
      "data-state",
      "checked",
    );
    expect(screen.getByRole("menuitemradio", { hidden: true })).toHaveAttribute(
      "data-state",
      "checked",
    );
  });
});
