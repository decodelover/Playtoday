import {
  createElement,
  type ComponentProps,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import {
  Separator as SeparatorPrimitive,
  VisuallyHidden as VisuallyHiddenPrimitive,
} from "radix-ui";

import { cn } from "../lib";

export type CardSectionProps = HTMLAttributes<HTMLDivElement>;
export function CardHeader({ className, ...props }: CardSectionProps) {
  return <div className={cn("pt-card__header", className)} {...props} />;
}
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("pt-card__title", className)} {...props} />;
}
export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("pt-card__description", className)} {...props} />;
}
export function CardContent({ className, ...props }: CardSectionProps) {
  return <div className={cn("pt-card__content", className)} {...props} />;
}
export function CardFooter({ className, ...props }: CardSectionProps) {
  return <div className={cn("pt-card__footer", className)} {...props} />;
}

export function PageHeader({
  action,
  breadcrumb,
  className,
  description,
  metadata,
  title,
  ...props
}: HTMLAttributes<HTMLElement> &
  Readonly<{
    title: string;
    description?: string;
    breadcrumb?: ReactNode;
    action?: ReactNode;
    metadata?: ReactNode;
  }>) {
  return (
    <header className={cn("pt-page-header", className)} {...props}>
      <div>
        {breadcrumb}
        {metadata ? <div className="pt-page-header__metadata">{metadata}</div> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="pt-page-header__action">{action}</div> : null}
    </header>
  );
}
export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn("pt-separator", className)}
      orientation={orientation}
      {...props}
    />
  );
}
export function Stack({
  className,
  direction = "vertical",
  gap = "medium",
  ...props
}: HTMLAttributes<HTMLDivElement> &
  Readonly<{
    direction?: "vertical" | "horizontal";
    gap?: "small" | "medium" | "large";
  }>) {
  return (
    <div
      className={cn("pt-stack", className)}
      data-direction={direction}
      data-gap={gap}
      {...props}
    />
  );
}
export function Container({
  className,
  size = "wide",
  ...props
}: HTMLAttributes<HTMLDivElement> & Readonly<{ size?: "narrow" | "wide" | "full" }>) {
  return <div className={cn("pt-container", className)} data-size={size} {...props} />;
}
export function Surface({
  as = "div",
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLElement> &
  Readonly<{ as?: ElementType; tone?: "default" | "subtle" | "elevated" }>) {
  return createElement(as, {
    className: cn("pt-surface", className),
    "data-tone": tone,
    ...props,
  });
}
export const VisuallyHidden = VisuallyHiddenPrimitive.Root;
