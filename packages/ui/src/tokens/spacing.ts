export const spacingTokens = {
  micro: "var(--pt-space-1)",
  inline: "var(--pt-space-2)",
  control: "var(--pt-space-3)",
  component: "var(--pt-space-4)",
  card: "var(--pt-space-6)",
  section: "var(--pt-space-10)",
  page: "var(--pt-space-16)",
} as const;

export const layoutTokens = {
  mobileGutter: "var(--pt-layout-gutter-mobile)",
  dashboardGutter: "var(--pt-layout-gutter-dashboard)",
  contentMax: "var(--pt-layout-content-max)",
  sidebar: "var(--pt-layout-sidebar)",
  sidebarCollapsed: "var(--pt-layout-sidebar-collapsed)",
  headerHeight: "var(--pt-layout-header)",
  mobileNavigationHeight: "var(--pt-layout-mobile-nav)",
} as const;
