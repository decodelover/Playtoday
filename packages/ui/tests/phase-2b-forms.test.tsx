// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  Checkbox,
  Field,
  FieldInput,
  Label,
  RadioGroup,
  RadioItem,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Switch,
  Textarea,
} from "../src";

afterEach(cleanup);

HTMLElement.prototype.scrollIntoView = () => undefined;

describe("Phase 2B forms", () => {
  it("associates labels, descriptions, errors, invalid state, and disabled state", () => {
    render(
      <Field description="Use a fictional value." error="Example error">
        <Label required>Sample field</Label>
        <FieldInput disabled />
      </Field>,
    );
    const input = screen.getByLabelText(/sample field/i);
    expect(input).toBeDisabled();
    expect(input).toHaveAccessibleDescription("Use a fictional value. Example error");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Example error");
  });

  it("supports textarea helpers and reusable search clearing", () => {
    render(
      <>
        <Field description="Demonstration only">
          <Label>Notes</Label>
          <Textarea characterCount="12 characters" />
        </Field>
        <Field>
          <Label>Search</Label>
          <SearchInput defaultValue="Example" />
        </Field>
      </>,
    );
    expect(screen.getByText("12 characters")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("supports checkbox, radio, and switch labels and keyboard interaction", () => {
    render(
      <>
        <Checkbox label="Include examples" />
        <RadioGroup aria-label="Density">
          <RadioItem label="Compact" value="compact" />
          <RadioItem disabled label="Unavailable" value="off" />
        </RadioGroup>
        <Switch label="Demonstration setting" />
      </>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Include examples" });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    const radio = screen.getByRole("radio", { name: "Compact" });
    fireEvent.click(radio);
    expect(radio).toBeChecked();
    const toggle = screen.getByRole("switch", { name: "Demonstration setting" });
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
    expect(screen.getByRole("radio", { name: "Unavailable" })).toBeDisabled();
  });

  it("opens Select with the keyboard and selects an enabled option", async () => {
    render(
      <Field>
        <Label>Example market</Label>
        <Select>
          <SelectTrigger aria-label="Example market" />
          <SelectContent>
            <SelectItem value="sample">Sample Market</SelectItem>
            <SelectItem disabled value="disabled">
              Unavailable
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>,
    );
    const trigger = screen.getByRole("combobox", { name: "Example market" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const option = await screen.findByRole("option", { name: "Sample Market" });
    fireEvent.click(option);
    expect(trigger).toHaveTextContent("Sample Market");
  });
});
