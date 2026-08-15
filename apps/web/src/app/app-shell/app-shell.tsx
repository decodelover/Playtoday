"use client";

import {
  Button,
  Dialog,
  DialogClose,
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
import {
  BellIcon,
  CalendarIcon,
  CardIcon,
  ChartIcon,
  CheckCircleIcon,
  DailyIcon,
  GridIcon,
  HelpIcon,
  HistoryIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  SparklesIcon,
  TargetIcon,
} from "../../components/dashboard/dashboard-icons";
import { UserAvatar } from "../../components/user-avatar";

interface AppAccountIdentity {
  displayName: string | null;
  email: string | null;
  avatarUrl?: string | null;
}

const ROUTE_ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  spark: SparklesIcon,
  calendar: CalendarIcon,
  daily: DailyIcon,
  target: TargetIcon,
  grid: GridIcon,
  check: CheckCircleIcon,
  chart: ChartIcon,
  history: HistoryIcon,
  bell: BellIcon,
  card: CardIcon,
  shield: ShieldIcon,
  settings: SettingsIcon,
  help: HelpIcon,
};

function RouteIcon({ name }: Readonly<{ name: string }>) {
  const Icon = ROUTE_ICON_MAP[name] ?? HomeIcon;

  return (
    <span aria-hidden="true" className={styles.routeIcon}>
      <Icon size={17} />
    </span>
  );
}

/* ----------------------------------------------------------------
   Navigation List — shared between sidebar + drawer
   ---------------------------------------------------------------- */
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

/* ----------------------------------------------------------------
   Breadcrumbs
   ---------------------------------------------------------------- */
export function RouteBreadcrumbs() {
  const pathname = usePathname();
  const route = findShellRoute(pathname);
  const label = route?.breadcrumb ?? "Application";

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol className={styles.breadcrumbList}>
        <li className={styles.breadcrumbRoot}>
          <Link href="/overview">PlayToday</Link>
        </li>
        <li className={styles.breadcrumbSep} aria-hidden="true">
          /
        </li>
        <li aria-current="page" className={styles.breadcrumbCurrent}>
          {label}
        </li>
      </ol>
    </nav>
  );
}

/* ----------------------------------------------------------------
   Mobile Drawer — natural luxury theme, matches dashboard palette
   ---------------------------------------------------------------- */
function MobileNavDrawer({
  account,
  open,
  onOpenChange,
  returnFocusRef,
}: Readonly<{
  account?: AppAccountIdentity | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
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
      <SheetContent
        aria-describedby="mobile-nav-description"
        className={styles.drawer}
        side="left"
      >
        {/* Drawer Header — brand + close */}
        <div className={styles.drawerHeader}>
          <div className={styles.drawerBrand}>
            <span className={styles.brandMark} aria-hidden="true">
              <i />
              <i />
            </span>
            <div className={styles.brandText}>
              <SheetTitle className={styles.brandName}>PLAYTODAY</SheetTitle>
              <SheetDescription id="mobile-nav-description" className={styles.brandSub}>
                Sports intelligence
              </SheetDescription>
            </div>
          </div>
          <SheetClose asChild>
            <button
              aria-label="Close navigation"
              className={styles.drawerClose}
              type="button"
            >
              <span className={styles.closeIcon} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </SheetClose>
        </div>

        {/* Navigation — scrollable */}
        <nav aria-label="Mobile full navigation" className={styles.drawerNav}>
          <NavigationList onNavigate={() => onOpenChange(false)} />
        </nav>

        {/* Account profile card at bottom of drawer */}
        {account ? (
          <div className={styles.drawerBottomAccount}>
            <Link
              className={styles.drawerAccountCard}
              href="/settings/profile"
              onClick={() => onOpenChange(false)}
            >
              <UserAvatar
                name={account.displayName}
                size={38}
                src={account.avatarUrl}
              />
              <div className={styles.drawerAccountInfo}>
                <strong className={styles.drawerAccountName}>
                  {account.displayName ?? "Signed in user"}
                </strong>
                <small className={styles.drawerAccountEmail}>{account.email}</small>
              </div>
              <SettingsIcon size={16} />
            </Link>
          </div>
        ) : null}

        {/* Drawer footer */}
        <div className={styles.drawerFooter}>
          <span>PT // CANONICAL SPORTS INTELLIGENCE</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ----------------------------------------------------------------
   Header — ☰ | Breadcrumbs | Search | Notifications | Profile
   ---------------------------------------------------------------- */
function AppHeader({
  account,
  navigationTriggerRef,
  onOpenNavigation,
}: Readonly<{
  account?: AppAccountIdentity | undefined;
  navigationTriggerRef: RefObject<HTMLButtonElement | null>;
  onOpenNavigation: () => void;
}>) {
  return (
    <header className={styles.header}>
      {/* Hamburger (mobile only) */}
      <button
        aria-label="Open navigation"
        className={styles.menuTrigger}
        onClick={onOpenNavigation}
        ref={navigationTriggerRef}
        type="button"
      >
        <span className={styles.hamburgerIcon} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>

      {/* Breadcrumbs on left */}
      <div className={styles.headerContext}>
        <RouteBreadcrumbs />
      </div>

      {/* Actions at far right: Search | Notifications | Avatar */}
      <div className={styles.headerActions}>
        <Dialog>
          <DialogTrigger asChild>
            <button
              aria-label="Search PlayToday"
              className={styles.searchTriggerBtn}
              type="button"
            >
              <SearchIcon size={16} />
              <span className={styles.searchPromptText}>Search...</span>
              <kbd className={styles.searchKbd}>⌘K</kbd>
            </button>
          </DialogTrigger>
          <DialogContent
            aria-describedby="search-description"
            className={styles.searchDialog}
          >
            <DialogHeader>
              <div className={styles.searchDialogIcon} aria-hidden="true">
                <SearchIcon size={18} />
              </div>
              <DialogTitle>Search PlayToday</DialogTitle>
              <DialogDescription id="search-description">
                Search is not available yet. Use the navigation to open games, markets,
                analysis, or account settings.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Close search</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Link
          aria-label="Notifications"
          className={styles.headerIconBtn}
          href="/settings/notifications"
        >
          <BellIcon size={17} />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Account menu"
              className={styles.accountTrigger}
              type="button"
            >
              <UserAvatar
                name={account?.displayName}
                size={30}
                src={account?.avatarUrl}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={styles.accountMenuContent}>
            {account ? (
              <div className={styles.accountMenuHeader}>
                <UserAvatar
                  name={account.displayName}
                  size={36}
                  src={account.avatarUrl}
                />
                <div className={styles.accountMenuInfo}>
                  <div className={styles.accountMenuName}>
                    {account.displayName ?? "Signed In User"}
                  </div>
                  <div className={styles.accountMenuEmail}>{account.email}</div>
                </div>
              </div>
            ) : null}
            <DropdownMenuItem asChild>
              <Link className={styles.accountMenuItem} href="/settings">
                Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className={styles.accountMenuItem} href="/settings/profile">
                Profile &amp; Avatar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className={styles.accountMenuItem} href="/settings/security">
                Security
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className={styles.accountMenuItem} href="/support">
                Help &amp; Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                className={`${styles.accountMenuItem} ${styles.signOutItem}`}
                href="/auth/sign-out"
              >
                Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------
   App Shell — root layout
   ---------------------------------------------------------------- */
export function AppShell({
  account,
  children,
}: Readonly<{
  account?: AppAccountIdentity | undefined;
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

      {/* Desktop Sidebar */}
      <aside aria-label="Application sidebar" className={styles.sidebar}>
        <Link
          aria-label="PlayToday overview"
          className={styles.wordmark}
          href="/overview"
        >
          <span className={styles.brandMark} aria-hidden="true">
            <i />
            <i />
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

      {/* Main content area */}
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

      {/* Mobile drawer */}
      <MobileNavDrawer
        account={account}
        onOpenChange={setMobileOpen}
        open={mobileOpen}
        returnFocusRef={mobileTriggerRef}
      />
    </div>
  );
}
