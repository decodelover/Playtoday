import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../lib";

export type ErrorStateProps = HTMLAttributes<HTMLDivElement> &
  Readonly<{
    title: string;
    description: string;
    retryAction?: ReactNode;
    supportAction?: ReactNode;
  }>;

export function ErrorState({
  className,
  description,
  retryAction,
  supportAction,
  title,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn("pt-state-message", className)}
      data-state="error"
      role="alert"
      {...props}
    >
      <span aria-hidden="true" className="pt-state-message__marker">
        !
      </span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        {retryAction || supportAction ? (
          <div className="pt-state-message__actions">
            {retryAction}
            {supportAction}
          </div>
        ) : null}
      </div>
    </div>
  );
}
