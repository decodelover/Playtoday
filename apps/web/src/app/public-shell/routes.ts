import type { Metadata } from "next";

export const footerGroups = ["Product", "Company", "Resources", "Legal"] as const;
export type PublicFooterGroup = (typeof footerGroups)[number];

export const publicRoutes = [
  {
    key: "home",
    label: "Home",
    path: "/",
    header: false,
    mobile: true,
    footer: null,
    title: "Football analysis that shows its work | PlayToday",
    description:
      "PlayToday provides explainable football analysis, target-odds decision support, and transparent settlement tracking for every game.",
  },
  {
    key: "how-it-works",
    label: "How it works",
    path: "/how-it-works",
    header: true,
    mobile: true,
    footer: "Product",
    title: "How it works | PlayToday",
    description:
      "See how PlayToday validates sports data, estimates outcome probability, checks target odds, and preserves a complete settlement audit trail.",
  },
  {
    key: "performance",
    label: "Performance",
    path: "/performance",
    header: true,
    mobile: true,
    footer: "Product",
    title: "Performance record | PlayToday",
    description:
      "Inspect verified prediction outcomes, settlement history, pass days, and publication rules with 100% data transparency.",
  },
  {
    key: "pricing",
    label: "Pricing",
    path: "/pricing",
    header: true,
    mobile: true,
    footer: "Product",
    title: "Pricing & Plans | PlayToday",
    description:
      "Explore Free, Plus, Pro, and Elite plans tailored for sports analysts, fans, and decision-makers.",
  },
  {
    key: "responsible-play",
    label: "Responsible play",
    path: "/responsible-play",
    header: true,
    mobile: true,
    footer: "Resources",
    title: "Responsible play | PlayToday",
    description:
      "PlayToday is for adults aged 18 and over. Understand risk management, fixed budget limits, and sports analysis boundaries.",
  },
  {
    key: "about",
    label: "About",
    path: "/about",
    header: false,
    mobile: true,
    footer: "Company",
    title: "About PlayToday | Sports Intelligence",
    description:
      "PlayToday brings statistical discipline, visible uncertainty, and full result transparency to football decision support.",
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    header: false,
    mobile: true,
    footer: "Company",
    title: "Contact Us | PlayToday",
    description:
      "Get in touch with the PlayToday team for product inquiries, data quality feedback, or platform support.",
  },
  {
    key: "help",
    label: "Help",
    path: "/help",
    header: false,
    mobile: true,
    footer: "Resources",
    title: "Help Centre | PlayToday",
    description:
      "Search published answers regarding sports intelligence, probability calibration, target odds, and account features.",
  },
  {
    key: "privacy",
    label: "Privacy",
    path: "/privacy",
    header: false,
    mobile: true,
    footer: "Legal",
    title: "Privacy Policy | PlayToday",
    description:
      "Learn how PlayToday collects, uses, and protects personal information, contact submissions, and analytics data.",
  },
  {
    key: "terms",
    label: "Terms",
    path: "/terms",
    header: false,
    mobile: true,
    footer: "Legal",
    title: "Terms of Use | PlayToday",
    description:
      "Read PlayToday service boundaries, user responsibilities, intellectual property, and responsible use policies.",
  },
  {
    key: "sign-in",
    label: "Sign in",
    path: "/sign-in",
    header: false,
    mobile: true,
    footer: null,
    title: "Sign in | PlayToday",
    description:
      "Access your PlayToday account, saved match filters, and custom sports intelligence preferences.",
  },
  {
    key: "sign-up",
    label: "Get started",
    path: "/sign-up",
    header: false,
    mobile: true,
    footer: null,
    title: "Get started | PlayToday",
    description:
      "Create a PlayToday account to access target-odds decision support, AI Analyst insights, and custom match filters.",
  },
] as const satisfies readonly {
  key: string;
  label: string;
  path: `/${string}` | "/";
  header: boolean;
  mobile: boolean;
  footer: PublicFooterGroup | null;
  title: string;
  description: string;
}[];

export type PublicRoute = (typeof publicRoutes)[number];
export type PublicRouteKey = PublicRoute["key"];

export function getPublicRoute(key: PublicRouteKey) {
  const route = publicRoutes.find((item) => item.key === key);
  if (!route) {
    throw new Error(`Unknown public route: ${key}`);
  }
  return route;
}

export function isPublicRouteActive(pathname: string, path: string) {
  return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
}

export function metadataFor(key: PublicRouteKey): Metadata {
  const route = getPublicRoute(key);
  return {
    title: route.title,
    description: route.description,
    alternates: { canonical: route.path },
    openGraph: {
      title: route.title,
      description: route.description,
      type: "website",
      url: route.path,
    },
    twitter: { card: "summary", title: route.title, description: route.description },
  };
}
