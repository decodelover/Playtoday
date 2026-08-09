"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentProps,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import {
  Checkbox as CheckboxPrimitive,
  RadioGroup as RadioPrimitive,
  Select as SelectPrimitive,
  Switch as SwitchPrimitive,
} from "radix-ui";

import { cn } from "../lib";

interface FieldContextValue {
  controlId: string;
  descriptionId: string | undefined;
  errorId: string | undefined;
  invalid: boolean;
}
const FieldContext = createContext<FieldContextValue | null>(null);

export function Label({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> &
  Readonly<{ required?: boolean; optional?: boolean; disabled?: boolean }>) {
  const field = useContext(FieldContext);
  const { required, optional, disabled, ...labelProps } = props;
  return (
    <label
      className={cn("pt-label", className)}
      data-disabled={disabled ? true : undefined}
      htmlFor={labelProps.htmlFor ?? field?.controlId}
      {...labelProps}
    >
      {children}
      {required ? <span aria-hidden="true"> *</span> : null}
      {optional ? <span className="pt-label__optional"> Optional</span> : null}
    </label>
  );
}

export function Field({
  children,
  className,
  error,
  description,
  id,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  Readonly<{ error?: string; description?: string }>) {
  const generatedId = useId();
  const controlId = id ?? `pt-field-${generatedId}`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  return (
    <FieldContext.Provider
      value={{ controlId, descriptionId, errorId, invalid: Boolean(error) }}
    >
      <div className={cn("pt-field", className)} {...props}>
        {children}
        {description ? (
          <p className="pt-field__message" id={descriptionId}>
            {description}
          </p>
        ) : null}
        {error ? (
          <p className="pt-field__message" data-error="true" id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

function describedBy(field: FieldContextValue | null, own?: string) {
  const value = [own, field?.descriptionId, field?.errorId].filter(Boolean).join(" ");
  return value.length > 0 ? value : undefined;
}

export function FieldInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const field = useContext(FieldContext);
  return (
    <input
      aria-describedby={describedBy(field, props["aria-describedby"])}
      aria-invalid={field?.invalid ? true : (props["aria-invalid"] ?? undefined)}
      className={cn("pt-input", className)}
      id={props.id ?? field?.controlId}
      {...props}
    />
  );
}

export function Textarea({
  className,
  characterCount,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> &
  Readonly<{ characterCount?: ReactNode }>) {
  const field = useContext(FieldContext);
  return (
    <div className="pt-textarea-wrap">
      <textarea
        aria-describedby={describedBy(field, props["aria-describedby"])}
        aria-invalid={field?.invalid ? true : (props["aria-invalid"] ?? undefined)}
        className={cn("pt-input pt-textarea", className)}
        id={props.id ?? field?.controlId}
        {...props}
      />
      {characterCount ? (
        <span className="pt-character-count">{characterCount}</span>
      ) : null}
    </div>
  );
}

export function SearchInput({
  onClear,
  clearLabel = "Clear search",
  defaultValue,
  value: controlledValue,
  ...props
}: InputHTMLAttributes<HTMLInputElement> &
  Readonly<{ onClear?: () => void; clearLabel?: string }>) {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    String(defaultValue ?? ""),
  );
  const value =
    controlledValue === undefined ? uncontrolledValue : String(controlledValue);
  return (
    <div className="pt-input-shell">
      <FieldInput
        {...props}
        type="search"
        value={value}
        onChange={(event) => {
          if (controlledValue === undefined) {
            setUncontrolledValue(event.target.value);
          }
          props.onChange?.(event);
        }}
      />
      {value ? (
        <button
          aria-label={clearLabel}
          className="pt-input-action"
          onClick={() => {
            if (controlledValue === undefined) {
              setUncontrolledValue("");
            }
            onClear?.();
          }}
          type="button"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;
export function SelectTrigger({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  const field = useContext(FieldContext);
  return (
    <SelectPrimitive.Trigger
      aria-describedby={describedBy(field, props["aria-describedby"])}
      aria-invalid={field?.invalid ? true : undefined}
      className={cn("pt-select-trigger", className)}
      id={props.id ?? field?.controlId}
      {...props}
    >
      <SelectPrimitive.Value />
      <SelectPrimitive.Icon aria-hidden="true">⌄</SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}
export function SelectContent({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn("pt-select-content", className)}
        position="popper"
        {...props}
      >
        <SelectPrimitive.ScrollUpButton aria-label="Scroll up">
          ↑
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton aria-label="Scroll down">
          ↓
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}
export function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label className={cn("pt-select-label", className)} {...props} />
  );
}
export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item className={cn("pt-select-item", className)} {...props}>
      <SelectPrimitive.ItemIndicator aria-hidden="true">
        ✓
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
export const SelectSeparator = SelectPrimitive.Separator;

export function Checkbox({
  className,
  label,
  description,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root> &
  Readonly<{ label: string; description?: string }>) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  return (
    <div className="pt-choice">
      <CheckboxPrimitive.Root
        className={cn("pt-checkbox", className)}
        id={id}
        {...props}
      >
        <CheckboxPrimitive.Indicator>✓</CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <div>
        <label htmlFor={id}>{label}</label>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

export const RadioGroup = RadioPrimitive.Root;
export function RadioItem({
  className,
  label,
  description,
  ...props
}: ComponentProps<typeof RadioPrimitive.Item> &
  Readonly<{ label: string; description?: string }>) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  return (
    <div className="pt-choice">
      <RadioPrimitive.Item className={cn("pt-radio", className)} id={id} {...props}>
        <RadioPrimitive.Indicator className="pt-radio__indicator" />
      </RadioPrimitive.Item>
      <div>
        <label htmlFor={id}>{label}</label>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

export function Switch({
  className,
  label,
  description,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root> &
  Readonly<{ label: string; description?: string }>) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  return (
    <div className="pt-choice">
      <SwitchPrimitive.Root className={cn("pt-switch", className)} id={id} {...props}>
        <SwitchPrimitive.Thumb className="pt-switch__thumb" />
      </SwitchPrimitive.Root>
      <div>
        <label htmlFor={id}>{label}</label>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}
