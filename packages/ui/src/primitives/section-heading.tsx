import { createElement, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "../lib";

export type SectionHeadingProps = HTMLAttributes<HTMLDivElement> &
  Readonly<{
    title: string;
    description?: string;
    action?: ReactNode;
    eyebrow?: string;
    headingLevel?: 2 | 3 | 4 | 5 | 6;
  }>;

export function SectionHeading({
  action,
  className,
  description,
  eyebrow,
  headingLevel = 2,
  title,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn("pt-section-heading", className)} {...props}>
      <div>
        {eyebrow ? (
          <span className="pt-section-heading__eyebrow">{eyebrow}</span>
        ) : null}
        {createElement(`h${headingLevel}`, null, title)}
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="pt-section-heading__action">{action}</div> : null}
    </div>
  );
}
