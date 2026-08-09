import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { cn } from "../lib";

export function Breadcrumb({
  className,
  label = "Breadcrumb",
  ...props
}: HTMLAttributes<HTMLElement> & Readonly<{ label?: string }>) {
  return (
    <nav aria-label={label} className={cn("pt-breadcrumb", className)} {...props} />
  );
}
export function BreadcrumbList({
  className,
  ...props
}: HTMLAttributes<HTMLOListElement>) {
  return <ol className={cn("pt-breadcrumb__list", className)} {...props} />;
}
export function BreadcrumbItem({
  className,
  current = false,
  separator = "/",
  children,
  ...props
}: HTMLAttributes<HTMLLIElement> &
  Readonly<{ current?: boolean; separator?: ReactNode }>) {
  return (
    <li
      aria-current={current ? "page" : undefined}
      className={cn("pt-breadcrumb__item", className)}
      {...props}
    >
      {children}
      {!current ? <span aria-hidden="true">{separator}</span> : null}
    </li>
  );
}

export function Pagination({
  className,
  label = "Pagination",
  ...props
}: HTMLAttributes<HTMLElement> & Readonly<{ label?: string }>) {
  return (
    <nav aria-label={label} className={cn("pt-pagination", className)} {...props} />
  );
}
export function PaginationList({
  className,
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("pt-pagination__list", className)} {...props} />;
}
export function PaginationLink({
  className,
  current = false,
  disabled = false,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> &
  Readonly<{ current?: boolean; disabled?: boolean }>) {
  return (
    <a
      aria-current={current ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={cn("pt-pagination__link", className)}
      data-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : props.tabIndex}
      {...props}
    />
  );
}
export function PaginationEllipsis({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden="true"
      className={cn("pt-pagination__ellipsis", className)}
      {...props}
    >
      …
    </span>
  );
}
