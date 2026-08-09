import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../lib";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  Readonly<{ variant?: "neutral" | "accent" | "outline"; size?: "small" | "medium" }>;
export function Badge({
  className,
  variant = "neutral",
  size = "medium",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn("pt-badge", className)}
      data-size={size}
      data-variant={variant}
      {...props}
    />
  );
}

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  Readonly<{
    variant?: "information" | "success" | "warning" | "danger" | "neutral";
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
  }>;
export function Alert({
  action,
  className,
  description,
  icon,
  title,
  variant = "neutral",
  ...props
}: AlertProps) {
  const role = variant === "danger" ? "alert" : "status";
  return (
    <div
      className={cn("pt-alert", className)}
      data-variant={variant}
      role={role}
      {...props}
    >
      {icon ? (
        <span aria-hidden="true" className="pt-alert__icon">
          {icon}
        </span>
      ) : null}
      <div>
        <strong>{title}</strong>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="pt-alert__action">{action}</div> : null}
    </div>
  );
}

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  Readonly<{
    value?: number;
    max?: number;
    label: string;
    description?: string;
    indeterminate?: boolean;
  }>;
export function Progress({
  className,
  description,
  indeterminate = false,
  label,
  max = 100,
  value = 0,
  ...props
}: ProgressProps) {
  const safeValue = Math.min(Math.max(value, 0), max);
  return (
    <div className={cn("pt-progress", className)} {...props}>
      <div className="pt-progress__label">
        <span>{label}</span>
        {!indeterminate ? (
          <span>
            {safeValue}/{max}
          </span>
        ) : null}
      </div>
      <div
        aria-label={label}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={indeterminate ? undefined : safeValue}
        className="pt-progress__track"
        role="progressbar"
      >
        <span
          data-indeterminate={indeterminate || undefined}
          style={indeterminate ? undefined : { width: `${(safeValue / max) * 100}%` }}
        />
      </div>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> &
  Readonly<{ label?: string; size?: "small" | "medium" | "large" }>;
export function Spinner({
  className,
  label = "Loading",
  size = "medium",
  ...props
}: SpinnerProps) {
  return (
    <span
      aria-label={label}
      className={cn("pt-spinner-wrap", className)}
      data-size={size}
      role="status"
      {...props}
    >
      <span aria-hidden="true" className="pt-spinner" />
    </span>
  );
}
