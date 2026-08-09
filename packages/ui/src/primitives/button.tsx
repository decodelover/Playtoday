import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../lib";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link" | "success";
export type ButtonSize = "small" | "medium" | "large" | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Readonly<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    loadingLabel?: string;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    fullWidth?: boolean;
  }>;

export function Button({
  className,
  children,
  disabled,
  fullWidth = false,
  leadingIcon,
  loading = false,
  loadingLabel = "Loading",
  size = "medium",
  trailingIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading ? true : undefined}
      className={cn("pt-button", className)}
      data-full-width={fullWidth ? true : undefined}
      data-size={size}
      data-variant={variant}
      disabled={Boolean(disabled) || loading}
      type={type}
      {...props}
    >
      {loading ? <span aria-hidden="true" className="pt-spinner" /> : leadingIcon}
      <span className={size === "icon" ? "pt-visually-hidden" : undefined}>
        {loading ? loadingLabel : children}
      </span>
      {loading ? <span className="pt-visually-hidden">{loadingLabel}</span> : null}
      {!loading ? trailingIcon : null}
    </button>
  );
}
