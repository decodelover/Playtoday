import type { HTMLAttributes } from "react";

import { cn } from "../lib";

export type CardProps = HTMLAttributes<HTMLDivElement> &
  Readonly<{
    variant?:
      | "default"
      | "elevated"
      | "interactive"
      | "selected"
      | "subtle"
      | "danger"
      | "success";
  }>;

export function Card({ className, variant = "default", ...props }: CardProps) {
  return <div className={cn("pt-card", className)} data-variant={variant} {...props} />;
}
