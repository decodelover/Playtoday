import Link from "next/link";
import type { ReactNode } from "react";

import type { PublicRoute } from "./routes";
import styles from "./shell.module.css";

export function MarketingContainer({
  children,
  width = "standard",
}: Readonly<{ children: ReactNode; width?: "narrow" | "standard" | "wide" }>) {
  return (
    <div className={styles.container} data-width={width}>
      {children}
    </div>
  );
}

export function MarketingSection({
  children,
  tone = "default",
  width = "standard",
  labelledBy,
}: Readonly<{
  children: ReactNode;
  tone?: "default" | "ink" | "paper" | "signal";
  width?: "narrow" | "standard" | "wide";
  labelledBy?: string;
}>) {
  return (
    <section aria-labelledby={labelledBy} className={styles.section} data-tone={tone}>
      <div className={styles.container} data-reveal="up" data-width={width}>
        {children}
      </div>
    </section>
  );
}

export function PageHero({
  marker,
  eyebrow,
  title,
  description,
  actions,
  aside,
  visual = "stadium",
}: Readonly<{
  marker: string;
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  visual?: "analysis" | "archive" | "evidence" | "pipeline" | "stadium";
}>) {
  return (
    <section className={styles.pageHero} data-marker={marker} data-visual={visual}>
      <MarketingContainer width="wide">
        <div className={styles.pageHeroGrid}>
          <div className={styles.pageHeroCopy}>
            <p className={styles.sectionMarker}>
              <span>{marker}</span>
              {eyebrow}
            </p>
            <h1>{title}</h1>
            <p className={styles.pageHeroDescription}>{description}</p>
            {actions ? <div className={styles.heroActions}>{actions}</div> : null}
          </div>
          {aside ? <aside className={styles.pageHeroAside}>{aside}</aside> : null}
        </div>
      </MarketingContainer>
    </section>
  );
}

export function SectionLead({
  marker,
  eyebrow,
  title,
  description,
}: Readonly<{
  marker: string;
  eyebrow: string;
  title: string;
  description?: string;
}>) {
  return (
    <header className={styles.sectionLead}>
      <p className={styles.sectionMarker}>
        <span>{marker}</span>
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  );
}

export function StatusNotice({
  label,
  value,
  children,
}: Readonly<{ label: string; value: string; children: ReactNode }>) {
  return (
    <aside className={styles.statusNotice}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className={styles.statusCopy}>{children}</div>
    </aside>
  );
}

export function NumberedList({
  items,
}: Readonly<{ items: readonly { title: string; body: string }[] }>) {
  return (
    <ol className={styles.numberedList}>
      {items.map((item, index) => (
        <li key={item.title}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FactList({
  items,
}: Readonly<{ items: readonly { label: string; value: string }[] }>) {
  return (
    <dl className={styles.factList}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ContentGrid({
  children,
  columns = "two",
}: Readonly<{ children: ReactNode; columns?: "two" | "four" }>) {
  return (
    <div className={styles.contentGrid} data-columns={columns}>
      {children}
    </div>
  );
}

export function ContentPanel({
  title,
  children,
  label,
}: Readonly<{ title: string; children: ReactNode; label?: string }>) {
  return (
    <article className={styles.contentPanel}>
      {label ? <p className={styles.panelLabel}>{label}</p> : null}
      <h3>{title}</h3>
      <div>{children}</div>
    </article>
  );
}

export function EmptyState({
  title,
  children,
}: Readonly<{ title: string; children?: ReactNode }>) {
  return (
    <section aria-live="polite" className={styles.emptyState}>
      <span aria-hidden="true" className={styles.emptyStateMark} />
      <div>
        <h2>{title}</h2>
        {children ? <div>{children}</div> : null}
      </div>
    </section>
  );
}

export function Prose({ children }: Readonly<{ children: ReactNode }>) {
  return <div className={styles.prose}>{children}</div>;
}

export function ActionLink({
  href,
  children,
  primary = false,
}: Readonly<{ href: string; children: ReactNode; primary?: boolean }>) {
  return (
    <Link className={primary ? styles.primaryAction : styles.textAction} href={href}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export function ActionButton({
  children,
  onClick,
}: Readonly<{ children: ReactNode; onClick: () => void }>) {
  return (
    <button className={styles.primaryAction} onClick={onClick} type="button">
      <span>{children}</span>
      <span aria-hidden="true">↻</span>
    </button>
  );
}

export function LegalPageLayout({
  route,
  children,
}: Readonly<{ route: PublicRoute; children: ReactNode }>) {
  return (
    <>
      <PageHero
        aside={
          <FactList
            items={[
              { label: "Status", value: "Review pending" },
              { label: "Authority", value: "Not yet published" },
            ]}
          />
        }
        description={route.description}
        eyebrow="Legal"
        marker="LGL"
        title={route.title}
        visual="evidence"
      />
      <MarketingSection tone="paper" width="narrow">
        <div className={styles.legal}>{children}</div>
      </MarketingSection>
    </>
  );
}
