import type { HTMLAttributes, ReactNode } from "react";

import { statusPresentation, type SelectionStatus } from "../tokens";
import { cn } from "../lib";

export type StatusChipProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  Readonly<{
    status: SelectionStatus;
    label?: string;
    icon?: ReactNode;
    size?: "small" | "medium";
  }>;

export function StatusChip({
  className,
  icon,
  label,
  size = "medium",
  status,
  ...props
}: StatusChipProps) {
  const presentation = statusPresentation[status];
  return (
    <span
      className={cn("pt-status-chip", className)}
      data-size={size}
      data-status={status}
      {...props}
    >
      <span aria-hidden="true" className="pt-status-chip__marker">
        {icon ?? presentation.marker}
      </span>
      <span>{label ?? presentation.label}</span>
    </span>
  );
}
