// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button, ButtonGroup, IconButton, cn } from "../src";

afterEach(cleanup);

describe("Phase 2B utilities and actions", () => {
  it("merges conditional and conflicting Tailwind classes", () => {
    const conditional = false;
    expect(cn("px-2", conditional && "hidden", "px-4", { block: true })).toBe(
      "px-4 block",
    );
  });

  it("renders semantic variants, sizes, and grouped actions", () => {
    render(
      <ButtonGroup aria-label="Example actions">
        <Button size="large" variant="outline">
          Review
        </Button>
        <Button variant="success">Confirm</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group", { name: "Example actions" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Review" })).toHaveAttribute(
      "data-size",
      "large",
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveAttribute(
      "data-variant",
      "success",
    );
  });

  it("makes loading buttons busy and prevents interaction", () => {
    const onClick = vi.fn();
    render(
      <Button loading loadingLabel="Saving example" onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: /saving example/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("requires an accessible name through the IconButton type", () => {
    render(<IconButton aria-label="Open options">+</IconButton>);
    expect(screen.getByRole("button", { name: "Open options" })).toBeVisible();
  });
});
