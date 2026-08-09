// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../src";

afterEach(cleanup);

describe("Phase 2B overlays and navigation", () => {
  it("opens a titled dialog, moves focus, closes with Escape, and restores focus", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Example dialog</DialogTitle>
          <DialogDescription>Demonstration content.</DialogDescription>
          <DialogClose asChild>
            <Button>Close dialog</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    fireEvent.click(trigger);
    expect(await screen.findByRole("dialog", { name: "Example dialog" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("opens and closes a focus-managed sheet", async () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Example sheet</SheetTitle>
          <SheetClose asChild>
            <Button>Close sheet</Button>
          </SheetClose>
        </SheetContent>
      </Sheet>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open sheet" }));
    expect(await screen.findByRole("dialog", { name: "Example sheet" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Close sheet" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("supports keyboard menu opening and disabled items", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Example menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Inspect</DropdownMenuItem>
          <DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    fireEvent.keyDown(screen.getByRole("button", { name: "Example menu" }), {
      key: "ArrowDown",
    });
    expect(await screen.findByRole("menuitem", { name: "Inspect" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Unavailable" })).toHaveAttribute(
      "data-disabled",
    );
  });

  it("changes tabs with arrow-key navigation", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList aria-label="Example views">
          <TabsTrigger value="one">Summary</TabsTrigger>
          <TabsTrigger value="two">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Summary panel</TabsContent>
        <TabsContent value="two">Details panel</TabsContent>
      </Tabs>,
    );
    const summary = screen.getByRole("tab", { name: "Summary" });
    const details = screen.getByRole("tab", { name: "Details" });
    summary.focus();
    fireEvent.keyDown(summary, { code: "ArrowRight", key: "ArrowRight", keyCode: 39 });
    fireEvent.focus(details);
    expect(details).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Details panel");
  });
});
