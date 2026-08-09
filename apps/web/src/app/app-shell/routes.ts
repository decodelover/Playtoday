export const routeGroups = [
  "Primary",
  "Predictions",
  "Performance",
  "Account",
] as const;
export type RouteGroup = (typeof routeGroups)[number];

export const shellRoutes = [
  {
    key: "overview",
    label: "Overview",
    mobileLabel: "Home",
    path: "/overview",
    icon: "home",
    group: "Primary",
    mobilePrimary: true,
    breadcrumb: "Overview",
    description: "Your future PlayToday workspace overview.",
  },
  {
    key: "ai-analyst",
    label: "AI Analyst",
    mobileLabel: "AI Analyst",
    path: "/ai-analyst",
    icon: "spark",
    group: "Primary",
    mobilePrimary: true,
    breadcrumb: "AI Analyst",
    description: "A future workspace for grounded sports-intelligence assistance.",
  },
  {
    key: "games",
    label: "Today’s Games",
    mobileLabel: "Games",
    path: "/games",
    icon: "calendar",
    group: "Primary",
    mobilePrimary: true,
    breadcrumb: "Today’s Games",
    description: "A future workspace for today’s eligible games.",
  },
  {
    key: "daily-odds",
    label: "Daily Odds",
    mobileLabel: "Daily Odds",
    path: "/daily-odds",
    icon: "daily",
    group: "Predictions",
    mobilePrimary: true,
    breadcrumb: "Daily Odds",
    description:
      "A future workspace for official daily analysis and transparent outcomes.",
  },
  {
    key: "target-odds",
    label: "Target Odds Builder",
    path: "/target-odds",
    icon: "target",
    group: "Predictions",
    mobilePrimary: false,
    breadcrumb: "Target Odds Builder",
    description: "A future workspace for constrained target-building tools.",
  },
  {
    key: "markets",
    label: "Markets",
    path: "/markets",
    icon: "grid",
    group: "Predictions",
    mobilePrimary: false,
    breadcrumb: "Markets",
    description: "A future workspace for supported market exploration.",
  },
  {
    key: "selections",
    label: "My Selections",
    path: "/selections",
    icon: "check",
    group: "Predictions",
    mobilePrimary: false,
    breadcrumb: "My Selections",
    description: "A future workspace for saved selection drafts.",
  },
  {
    key: "analytics",
    label: "Analytics",
    path: "/analytics",
    icon: "chart",
    group: "Performance",
    mobilePrimary: false,
    breadcrumb: "Analytics",
    description: "A future workspace for transparent performance analysis.",
  },
  {
    key: "history",
    label: "Prediction History",
    path: "/history",
    icon: "history",
    group: "Performance",
    mobilePrimary: false,
    breadcrumb: "Prediction History",
    description: "A future workspace for verified historical records.",
  },
  {
    key: "notifications",
    label: "Notifications",
    path: "/notifications",
    icon: "bell",
    group: "Account",
    mobilePrimary: false,
    breadcrumb: "Notifications",
    description:
      "A future workspace for notification preferences and delivery history.",
  },
  {
    key: "subscription",
    label: "Subscription",
    path: "/subscription",
    icon: "card",
    group: "Account",
    mobilePrimary: false,
    breadcrumb: "Subscription",
    description: "A future workspace for subscription information.",
  },
  {
    key: "responsible-play",
    label: "Responsible Play",
    path: "/settings/responsible-play",
    icon: "shield",
    group: "Account",
    mobilePrimary: false,
    breadcrumb: "Responsible Play",
    description: "A future workspace for responsible-play information and controls.",
  },
  {
    key: "settings",
    label: "Settings",
    path: "/settings",
    icon: "settings",
    group: "Account",
    mobilePrimary: false,
    breadcrumb: "Settings",
    description: "A future workspace for application preferences.",
  },
  {
    key: "support",
    label: "Support",
    mobileLabel: "Account",
    path: "/support",
    icon: "help",
    group: "Account",
    mobilePrimary: true,
    breadcrumb: "Support",
    description: "A future workspace for support and account guidance.",
  },
] as const satisfies readonly {
  key: string;
  label: string;
  mobileLabel?: string;
  path: `/${string}`;
  icon: string;
  group: RouteGroup;
  mobilePrimary: boolean;
  breadcrumb: string;
  description: string;
}[];

export type ShellRoute = (typeof shellRoutes)[number];
export type ShellRouteKey = ShellRoute["key"];

export function isRouteActive(pathname: string, routePath: string) {
  return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

export function findShellRoute(pathname: string) {
  return shellRoutes.find((route) => isRouteActive(pathname, route.path));
}

export function getShellRoute(key: ShellRouteKey) {
  const route = shellRoutes.find((item) => item.key === key);
  if (!route) {
    throw new Error(`Unknown shell route: ${key}`);
  }
  return route;
}
