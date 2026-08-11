"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@playtoday/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ReactNode, type RefObject } from "react";

import styles from "./shell.module.css";
import { findShellRoute, isRouteActive, routeGroups, shellRoutes } from "./routes";

const iconGlyphs: Record<string, string> = {
  home: "⌂",
  spark: "✦",
  calendar: "□",
  daily: "◇",
  target: "◎",
  grid: "▦",
  check: "✓",
  chart: "↗",
  history: "↶",
  bell: "○",
  card: "▭",
  shield: "◈",
  settings: "⚙",
  help: "?",
};

function RouteIcon({ name }: Readonly<{ name: string }>) {
  return (
    <span aria-hidden="true" className={styles.routeIcon}>
      {iconGlyphs[name] ?? "•"}
    </span>
  );
}

function NavigationList({
  collapsed = false,
  onNavigate,
}: Readonly<{ collapsed?: boolean; onNavigate?: () => void }>) {
  const pathname = usePathname();
  return (
    <TooltipProvider delayDuration={200}>
      {routeGroups.map((group) => (
        <section className={styles.navGroup} key={group}>
          <h2 className={styles.navGroupLabel}>
            {collapsed ? <span className={styles.visuallyHidden}>{group}</span> : group}
          </h2>
          <ul className={styles.navList}>
            {shellRoutes
              .filter((route) => route.group === group)
              .map((route) => {
                const active = isRouteActive(pathname, route.path);
                const navigationHandler = onNavigate ? { onClick: onNavigate } : {};
                const link = (
                  <Link
                    aria-current={active ? "page" : undefined}
                    aria-label={collapsed ? route.label : undefined}
                    className={styles.navLink}
                    data-active={active || undefined}
                    href={route.path}
                    {...navigationHandler}
                  >
                    <RouteIcon name={route.icon} />
                    <span className={collapsed ? styles.visuallyHidden : undefined}>
                      {route.label}
                    </span>
                  </Link>
                );
                return (
                  <li key={route.key}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{route.label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </TooltipProvider>
  );
}

export function RouteBreadcrumbs() {
  const route = findShellRoute(usePathname());
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol>
        <li>
          <Link href="/overview">PlayToday</Link>
        </li>
        <li aria-current="page">{route?.breadcrumb ?? "Application"}</li>
      </ol>
    </nav>
  );
}

function MobileNavDrawer({
  open,
  onOpenChange,
  returnFocusRef,
  trigger,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  trigger?: ReactNode;
}>) {
  return (
    <Sheet
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          queueMicrotask(() => returnFocusRef.current?.focus());
        }
      }}
      open={open}
    >
      {trigger}
      <SheetContent
        aria-describedby="mobile-nav-description"
        className={styles.drawer}
        side="left"
      >
        <div className={styles.drawerHeader}>
          <div className={styles.brandLogo}>
            <div className={styles.brandMark} aria-hidden="true">
              <i>/</i>
              <i>/</i>
            </div>
            <div className={styles.brandText}>
              <SheetTitle className={styles.brandName}>PLAYTODAY</SheetTitle>
              <SheetDescription id="mobile-nav-description" className={styles.brandSub}>
                Sports intelligence
              </SheetDescription>
            </div>
          </div>
          <SheetClose asChild>
            <IconButton aria-label="Close navigation" variant="ghost">
              ×
            </IconButton>
          </SheetClose>
        </div>
        <nav aria-label="Mobile full navigation" className={styles.drawerNav}>
          <NavigationList onNavigate={() => onOpenChange(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function AppHeader({
  account,
  navigationTriggerRef,
  onOpenNavigation,
}: Readonly<{
  account?: { displayName: string | null; email: string | null } | undefined;
  navigationTriggerRef: RefObject<HTMLButtonElement | null>;
  onOpenNavigation: () => void;
}>) {
  const identitySource = account?.displayName?.trim() ?? account?.email?.split("@")[0];
  const accountInitials = identitySource
    ? identitySource
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "";

  return (
    <header className={styles.header}>
      <button
        aria-label="Open navigation"
        className={styles.menuTrigger}
        onClick={onOpenNavigation}
        ref={navigationTriggerRef}
        type="button"
      >
        ☰
      </button>
      <div className={styles.headerContext}>
        <RouteBreadcrumbs />
      </div>
      <div className={styles.headerActions}>
        <Dialog>
          <DialogTriggerButton />
          <DialogContent aria-describedby="search-description">
            <DialogHeader>
              <DialogTitle>Search PlayToday</DialogTitle>
              <DialogDescription id="search-description">
                Search is unavailable. Nothing is searched or sent when you open this
                panel.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary">Understood</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Link
          aria-label="Notifications"
          className={styles.headerIconLink}
          href="/settings/notifications"
        >
          ○
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Account menu"
              className={styles.accountTrigger}
              type="button"
            >
              <span aria-hidden="true">{accountInitials || "Account"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {account ? (
              <div className={styles.accountIdentity}>
                <strong>{account.displayName ?? "Display name not set"}</strong>
                <span>{account.email ?? "Email unavailable"}</span>
              </div>
            ) : null}
            <DropdownMenuItem asChild>
              <Link href="/settings">Account settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/security">Security</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/support">Help & Support</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/sign-out">Sign out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function DialogTriggerButton() {
  return (
    <DialogTrigger asChild>
      <Button className={styles.searchButton} variant="ghost">
        <span aria-hidden="true">⌕</span>
        <span className={styles.searchLabel}>Search PlayToday</span>
      </Button>
    </DialogTrigger>
  );
}

function MobileBottomNav({
  onOpenNavigation,
}: Readonly<{ onOpenNavigation: () => void }>) {
  const pathname = usePathname();
  const mobileRoutes = shellRoutes.filter((route) => route.mobilePrimary);
  return (
    <nav aria-label="Mobile primary navigation" className={styles.bottomNav}>
      {mobileRoutes.map((route) => {
        const active = isRouteActive(pathname, route.path);
        if (route.key === "support") {
          return (
            <button
              aria-label="Account and full navigation"
              className={styles.bottomLink}
              data-active={active || undefined}
              key={route.key}
              onClick={onOpenNavigation}
              type="button"
            >
              <RouteIcon name={route.icon} />
              <span>{route.mobileLabel}</span>
            </button>
          );
        }
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={styles.bottomLink}
            data-active={active || undefined}
            href={route.path}
            key={route.key}
          >
            <RouteIcon name={route.icon} />
            <span>{route.mobileLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  account,
  children,
}: Readonly<{
  account?: { displayName: string | null; email: string | null } | undefined;
  children: ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  return (
    <div className={styles.shell} data-collapsed={collapsed || undefined}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>
      <aside aria-label="Application sidebar" className={styles.sidebar}>
        <Link
          aria-label="PlayToday overview"
          className={styles.wordmark}
          href="/overview"
        >
          <span className={styles.brandMark} aria-hidden="true">
            <i>/</i>
            <i>/</i>
          </span>
          <span className={collapsed ? styles.visuallyHidden : styles.brandText}>
            <strong className={styles.brandName}>PLAYTODAY</strong>
            <small className={styles.brandSub}>Sports intelligence</small>
          </span>
        </Link>
        <nav aria-label="Desktop application navigation" className={styles.desktopNav}>
          <NavigationList collapsed={collapsed} />
        </nav>
        <Button
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={styles.collapseButton}
          onClick={() => setCollapsed((value) => !value)}
          variant="ghost"
        >
          <span aria-hidden="true">{collapsed ? "→" : "←"}</span>
          <span className={collapsed ? styles.visuallyHidden : undefined}>
            {collapsed ? "Expand" : "Collapse"}
          </span>
        </Button>
      </aside>
      <div className={styles.workspace}>
        <AppHeader
          account={account}
          navigationTriggerRef={mobileTriggerRef}
          onOpenNavigation={() => setMobileOpen(true)}
        />
        <main className={styles.main} id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <MobileBottomNav onOpenNavigation={() => setMobileOpen(true)} />
      <MobileNavDrawer
        onOpenChange={setMobileOpen}
        open={mobileOpen}
        returnFocusRef={mobileTriggerRef}
      />
    </div>
  );
}
