import type {
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import { cn } from "../lib";
import { Card, DataValue, Skeleton } from "../primitives";
import { CardContent, CardHeader } from "./layout";

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="pt-table-wrap" tabIndex={0}>
      <table className={cn("pt-table", className)} {...props} />
    </div>
  );
}
export function TableHeader(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}
export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}
export function TableFooter(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot {...props} />;
}
export function TableRow({
  className,
  selected = false,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & Readonly<{ selected?: boolean }>) {
  return (
    <tr
      aria-selected={selected || undefined}
      className={cn("pt-table__row", className)}
      {...props}
    />
  );
}
export function TableHead({
  className,
  numeric = false,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & Readonly<{ numeric?: boolean }>) {
  return (
    <th
      className={cn("pt-table__head", className)}
      data-numeric={numeric || undefined}
      {...props}
    />
  );
}
export function TableCell({
  className,
  numeric = false,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & Readonly<{ numeric?: boolean }>) {
  return (
    <td
      className={cn("pt-table__cell", className)}
      data-numeric={numeric || undefined}
      {...props}
    />
  );
}
export function TableCaption({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn("pt-table__caption", className)} {...props} />;
}

export function DefinitionList({
  className,
  ...props
}: HTMLAttributes<HTMLDListElement>) {
  return <dl className={cn("pt-definition-list", className)} {...props} />;
}
export function DefinitionItem({
  className,
  term,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & Readonly<{ term: ReactNode }>) {
  return (
    <div className={cn("pt-definition-list__item", className)} {...props}>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}
export function DataList({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("pt-data-list", className)} {...props} />;
}
export function DataListItem({
  className,
  label,
  value,
  meta,
  ...props
}: HTMLAttributes<HTMLLIElement> &
  Readonly<{ label: ReactNode; value: ReactNode; meta?: ReactNode }>) {
  return (
    <li className={cn("pt-data-list__item", className)} {...props}>
      <span>{label}</span>
      <strong>{value}</strong>
      {meta ? <small>{meta}</small> : null}
    </li>
  );
}

export function StatCard({
  description,
  empty = false,
  icon,
  label,
  loading = false,
  status,
  trend,
  value,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  Readonly<{
    label: string;
    value?: ReactNode;
    description?: string;
    trend?: ReactNode;
    icon?: ReactNode;
    status?: ReactNode;
    loading?: boolean;
    empty?: boolean;
  }>) {
  return (
    <Card {...props}>
      <CardHeader>
        <div className="pt-stat-card__label">
          {icon}
          <span>{label}</span>
          {status}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton lines={2} />
        ) : (
          <DataValue label={label} size="large">
            {empty ? null : value}
          </DataValue>
        )}
        {trend}
        {description ? (
          <p className="pt-stat-card__description">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function Avatar({
  alt,
  className,
  fallback,
  size = "medium",
  src,
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "alt"> &
  Readonly<{ alt: string; fallback: string; size?: "small" | "medium" | "large" }>) {
  return (
    <span
      aria-label={alt}
      className={cn("pt-avatar", className)}
      data-size={size}
      role="img"
    >
      {src ? (
        <img alt="" src={src} {...props} />
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </span>
  );
}
export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cn("pt-kbd", className)} {...props} />;
}

export type RiskLevel = "low" | "moderate" | "high" | "extreme";
const riskLabels: Record<RiskLevel, string> = {
  low: "Low risk",
  moderate: "Moderate risk",
  high: "High risk",
  extreme: "Extreme risk",
};
export function RiskIndicator({
  className,
  description,
  level,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  Readonly<{ level: RiskLevel; description?: string }>) {
  return (
    <div
      aria-label={riskLabels[level]}
      className={cn("pt-indicator", className)}
      data-risk={level}
      {...props}
    >
      <span aria-hidden="true" className="pt-indicator__marker">
        ◆
      </span>
      <span>
        <strong>{riskLabels[level]}</strong>
        {description ? <small>{description}</small> : null}
      </span>
    </div>
  );
}
export function ConfidenceIndicator({
  className,
  explanation,
  label = "Model confidence",
  score,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  Readonly<{ score: number; label?: string; explanation?: string }>) {
  return (
    <div
      className={cn("pt-indicator", className)}
      data-indicator="confidence"
      {...props}
    >
      <DataValue label={label} size="medium" suffix="/100">
        {score}
      </DataValue>
      {explanation ? <small>{explanation}</small> : null}
    </div>
  );
}
export function DataQualityIndicator({
  className,
  delayed = false,
  freshness,
  label = "Data quality",
  score,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  Readonly<{
    score: number;
    label?: string;
    freshness?: ReactNode;
    delayed?: boolean;
  }>) {
  return (
    <div
      className={cn("pt-indicator", className)}
      data-delayed={delayed || undefined}
      data-indicator="data-quality"
      {...props}
    >
      <DataValue label={label} size="medium" suffix="/100">
        {score}
      </DataValue>
      {freshness ? <small>{freshness}</small> : null}
      {delayed ? <span>Data delayed</span> : null}
    </div>
  );
}
export function TrendIndicator({
  className,
  direction,
  label,
  ...props
}: HTMLAttributes<HTMLSpanElement> &
  Readonly<{ direction: "up" | "down" | "neutral"; label?: string }>) {
  const marker = direction === "up" ? "↗" : direction === "down" ? "↘" : "→";
  return (
    <span
      aria-label={label ?? `${direction} trend`}
      className={cn("pt-trend", className)}
      data-direction={direction}
      {...props}
    >
      <span aria-hidden="true">{marker}</span>
      {label ? <span>{label}</span> : null}
    </span>
  );
}
