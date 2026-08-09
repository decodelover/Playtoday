import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../lib";

export type DataValueProps = HTMLAttributes<HTMLSpanElement> &
  Readonly<{
    children: ReactNode;
    label?: string;
    size?: "small" | "medium" | "large";
    format?:
      "odds" | "percentage" | "score" | "currency" | "count" | "duration" | "neutral";
    prefix?: ReactNode;
    suffix?: ReactNode;
    trend?: ReactNode;
    loading?: boolean;
    missingLabel?: string;
  }>;

export function DataValue({
  children,
  className,
  format = "neutral",
  label,
  loading = false,
  missingLabel = "Not available",
  prefix,
  size = "medium",
  suffix,
  trend,
  ...props
}: DataValueProps) {
  return (
    <span
      className={cn("pt-data-value", className)}
      data-size={size}
      data-format={format}
      {...props}
    >
      {label ? <span className="pt-data-value__label">{label}</span> : null}
      <span className="pt-data-value__number">
        {loading ? (
          "…"
        ) : children == null ? (
          missingLabel
        ) : (
          <>
            {prefix}
            {children}
            {suffix}
          </>
        )}
      </span>
      {trend ? <span className="pt-data-value__trend">{trend}</span> : null}
    </span>
  );
}
