// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  Alert,
  ConfidenceIndicator,
  DataQualityIndicator,
  RiskIndicator,
  StatusChip,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  statusPresentation,
} from "../src";

afterEach(cleanup);

describe("Phase 2B feedback and data display", () => {
  it("uses announced alert semantics", () => {
    render(
      <Alert
        description="Review the fictional example."
        title="Example warning"
        variant="danger"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Example warning");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Review the fictional example.",
    );
  });

  it("renders every status as visible text with distinct unsettled and settled state data", () => {
    render(
      <>
        {Object.keys(statusPresentation).map((status) => (
          <StatusChip key={status} status={status as keyof typeof statusPresentation} />
        ))}
      </>,
    );
    for (const presentation of Object.values(statusPresentation)) {
      expect(screen.getByText(presentation.label)).toBeVisible();
    }
    expect(screen.getByText("Live").closest("[data-status]")).toHaveAttribute(
      "data-status",
      "live",
    );
    expect(screen.getByText("Won").closest("[data-status]")).toHaveAttribute(
      "data-status",
      "won",
    );
    expect(
      screen.getByText("Currently winning").closest("[data-status]"),
    ).toHaveAttribute("data-status", "currently-winning");
    expect(
      screen.getByText("Lost").parentElement?.querySelector("[aria-hidden='true']"),
    ).not.toBeEmptyDOMElement();
  });

  it("preserves semantic table structure, caption, and numeric support", () => {
    render(
      <Table>
        <TableCaption>Fictional demonstration values</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead numeric>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Example</TableCell>
            <TableCell numeric>1.85</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.getByText("Fictional demonstration values").tagName).toBe("CAPTION");
    expect(screen.getByRole("cell", { name: "1.85" })).toHaveAttribute(
      "data-numeric",
      "true",
    );
  });

  it("keeps risk, confidence, and data quality explicitly separate", () => {
    render(
      <>
        <RiskIndicator level="low" />
        <RiskIndicator level="moderate" />
        <RiskIndicator level="high" />
        <RiskIndicator level="extreme" />
        <ConfidenceIndicator score={82} />
        <DataQualityIndicator delayed freshness="Updated earlier" score={91} />
      </>,
    );
    for (const label of ["Low risk", "Moderate risk", "High risk", "Extreme risk"]) {
      expect(screen.getByText(label)).toBeVisible();
    }
    expect(screen.getByText("Model confidence")).toBeVisible();
    expect(screen.getByText("Data quality")).toBeVisible();
    expect(screen.getByText("Data delayed")).toBeVisible();
    expect(document.body).not.toHaveTextContent(/safe bet|guaranteed|probability/i);
  });
});
