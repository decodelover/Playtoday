import type { HTMLAttributes } from "react";

import { cn } from "../lib";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> &
  Readonly<{ label?: string; lines?: number; shape?: "text" | "circle" | "rectangle" }>;

export function Skeleton({
  className,
  label = "Loading content",
  lines = 3,
  shape = "text",
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-label={label}
      className={cn("pt-skeleton", className)}
      data-shape={shape}
      role="status"
      {...props}
    >
      {Array.from({ length: lines }, (_, index) => (
        <span aria-hidden="true" className="pt-skeleton__line" key={index} />
      ))}
    </div>
  );
}
