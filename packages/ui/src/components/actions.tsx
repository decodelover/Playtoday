import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

import { cn } from "../lib";
import { Button, type ButtonProps } from "../primitives/button";

export type IconButtonProps = Omit<ButtonProps, "size"> &
  Readonly<{ "aria-label": string; size?: "small" | "medium" | "large" }>;

export function IconButton({ size = "medium", ...props }: IconButtonProps) {
  return <Button data-icon-size={size} size="icon" {...props} />;
}

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> &
  Readonly<{ orientation?: "horizontal" | "vertical" }>;

export function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      aria-label={props["aria-label"] ?? "Grouped actions"}
      className={cn("pt-button-group", className)}
      data-orientation={orientation}
      role="group"
      {...props}
    />
  );
}

export type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Pick<ButtonProps, "variant" | "size" | "loading" | "loadingLabel">;

export function LoadingButton(props: LoadingButtonProps) {
  return <Button {...props} />;
}
