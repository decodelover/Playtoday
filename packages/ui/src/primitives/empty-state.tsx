import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../lib";

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> &
  Readonly<{
    title: string;
    description: string;
    icon?: ReactNode;
    primaryAction?: ReactNode;
    secondaryAction?: ReactNode;
  }>;

export function EmptyState({
  className,
  description,
  icon,
  primaryAction,
  secondaryAction,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn("pt-state-message", className)} data-state="empty" {...props}>
      <span aria-hidden="true" className="pt-state-message__marker">
        {icon ?? "○"}
      </span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        {primaryAction || secondaryAction ? (
          <div className="pt-state-message__actions">
            {primaryAction}
            {secondaryAction}
          </div>
        ) : null}
      </div>
    </div>
  );
}
