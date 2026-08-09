import type { InputHTMLAttributes } from "react";

import { cn } from "../lib";

export type InputProps = InputHTMLAttributes<HTMLInputElement> &
  Readonly<{
    label: string;
    hint?: string;
    error?: string;
  }>;

export function Input({ className, error, hint, id, label, ...props }: InputProps) {
  const inputId = id ?? props.name;
  if (!inputId) {
    throw new Error("Input requires an id or name for its accessible label.");
  }
  const descriptionId = hint || error ? `${inputId}-description` : undefined;

  return (
    <div className={cn("pt-field", className)}>
      <label className="pt-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-describedby={descriptionId}
        aria-invalid={Boolean(error)}
        className="pt-input"
        id={inputId}
        {...props}
      />
      {hint || error ? (
        <span
          className="pt-field__message"
          data-error={Boolean(error)}
          id={descriptionId}
        >
          {error ?? hint}
        </span>
      ) : null}
    </div>
  );
}
