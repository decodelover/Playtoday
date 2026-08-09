// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  Button,
  Card,
  DataValue,
  EmptyState,
  ErrorState,
  Input,
  SectionHeading,
  Skeleton,
  StatusChip,
} from "../src";

afterEach(cleanup);

describe("foundation primitives", () => {
  it("renders typed button variants with a stable visible focus class", () => {
    render(<Button variant="secondary">Review analysis</Button>);
    const button = screen.getByRole("button", { name: "Review analysis" });
    expect(button).toHaveAttribute("data-variant", "secondary");
    expect(button).toHaveClass("pt-button");
  });

  it("pairs status text with a non-colour marker", () => {
    const { container } = render(<StatusChip status="lost" />);
    expect(screen.getByText("Lost")).toBeVisible();
    expect(container.querySelector("[aria-hidden='true']")).toHaveTextContent("×");
  });

  it("uses tabular data styling", () => {
    const { container } = render(<DataValue label="Sample odds">1.85</DataValue>);
    expect(container.querySelector(".pt-data-value__number")).toHaveTextContent("1.85");
    expect(container.querySelector(".pt-data-value")).toHaveAttribute(
      "data-size",
      "medium",
    );
  });

  it("requires a visible input label and exposes errors accessibly", () => {
    render(
      <Input error="Use a demonstration value." id="market" label="Example market" />,
    );
    expect(screen.getByLabelText("Example market")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText("Use a demonstration value.")).toBeVisible();
  });

  it("supports input hints and rejects an unlabelled input relationship", () => {
    render(<Input hint="Decimal format" label="Sample odds" name="odds" />);
    expect(screen.getByLabelText("Sample odds")).toHaveAccessibleDescription(
      "Decimal format",
    );
    expect(() => render(<Input label="Invalid input" />)).toThrow(
      "Input requires an id or name",
    );
  });

  it("renders card and section-heading composition options", () => {
    render(
      <Card className="custom-card" variant="interactive">
        <SectionHeading
          action={<Button size="small">Inspect</Button>}
          description="Foundation detail"
          title="Demonstration"
        />
      </Card>,
    );
    expect(screen.getByText("Demonstration").closest(".pt-card")).toHaveAttribute(
      "data-variant",
      "interactive",
    );
    expect(screen.getByRole("button", { name: "Inspect" })).toHaveAttribute(
      "data-size",
      "small",
    );
  });

  it("renders loading, empty, and error states accessibly", () => {
    const { container } = render(
      <>
        <Skeleton label="Loading sample" lines={2} />
        <EmptyState description="No examples are available." title="Nothing here" />
        <ErrorState description="Try the demonstration again." title="Unable to load" />
      </>,
    );
    expect(screen.getByRole("status", { name: "Loading sample" })).toBeVisible();
    expect(container.querySelectorAll(".pt-skeleton__line")).toHaveLength(2);
    expect(screen.getByText("Nothing here")).toBeVisible();
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load");
  });

  it("supports data values without optional labels", () => {
    render(<DataValue size="large">82/100</DataValue>);
    expect(screen.getByText("82/100").closest(".pt-data-value")).toHaveAttribute(
      "data-size",
      "large",
    );
  });
});
