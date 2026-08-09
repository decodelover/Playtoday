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
    title: "Football analysis that shows its work",
    description:
      "PlayToday is being built for explainable football analysis, target-odds decision support, and an honest record of every published result.",
    status: "pre-launch",
  },
  {
    key: "how-it-works",
    label: "How it works",
    path: "/how-it-works",
    header: true,
    mobile: true,
    footer: "Product",
    title: "How it works",
    description:
      "See how PlayToday validates sports data, estimates probability, checks target odds, and preserves each settlement decision.",
    status: "pre-launch",
  },
  {
    key: "performance",
    label: "Performance",
    path: "/performance",
    header: true,
    mobile: true,
    footer: "Product",
    title: "Performance record",
    description:
      "Verified results will appear only from an approved database read model. No PlayToday performance records have been published yet.",
    status: "pre-launch",
  },
  {
    key: "pricing",
    label: "Pricing",
    path: "/pricing",
    header: true,
    mobile: true,
    footer: "Product",
    title: "Pricing",
    description:
      "Free, Plus, Pro, and Elite are planned tiers. Pricing has not been finalized, and there is no checkout or billing flow.",
    status: "pre-launch",
  },
  {
    key: "responsible-play",
    label: "Responsible play",
    path: "/responsible-play",
    header: true,
    mobile: true,
    footer: "Resources",
    title: "Responsible play",
    description:
      "PlayToday is for adults aged 18 and over. Higher odds mean higher risk, and no analysis can guarantee an outcome.",
    status: "pre-launch",
  },
  {
    key: "about",
    label: "About",
    path: "/about",
    header: false,
    mobile: true,
    footer: "Company",
    title: "About PlayToday",
    description:
      "PlayToday is being built around transparent sports analysis, visible uncertainty, and a complete record of published results.",
    status: "pre-launch",
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
    header: false,
    mobile: true,
    footer: "Company",
    title: "Contact",
    description:
      "Send a validated contact enquiry. A success message appears only after the submission is stored in Supabase.",
    status: "pre-launch",
  },
  {
    key: "help",
    label: "Help",
    path: "/help",
    header: false,
    mobile: true,
    footer: "Resources",
    title: "Help",
    description:
      "Search published answers about product access, sports analysis, target odds, Daily Edge, settlement, pricing, and responsible play.",
    status: "pre-launch",
  },
  {
    key: "privacy",
    label: "Privacy",
    path: "/privacy",
    header: false,
    mobile: true,
    footer: "Legal",
    title: "Privacy",
    description:
      "Read how the public contact form processes submitted information and which legal details remain pending review.",
    status: "legal-review-pending",
  },
  {
    key: "terms",
    label: "Terms",
    path: "/terms",
    header: false,
    mobile: true,
    footer: "Legal",
    title: "Terms of use",
    description:
      "Read the current service boundaries, user responsibilities, risk terms, and items still pending legal review.",
    status: "legal-review-pending",
  },
  {
    key: "sign-in",
    label: "Sign in",
    path: "/sign-in",
    header: false,
    mobile: true,
    footer: null,
    title: "Sign in",
    description:
      "PlayToday accounts are not open yet, so there is no credential form on this page.",
    status: "pre-launch",
  },
  {
    key: "sign-up",
    label: "Get started",
    path: "/sign-up",
    header: false,
    mobile: true,
    footer: null,
    title: "Get started",
    description:
      "Registration is not open yet. Read the method and product principles before account access becomes available.",
    status: "pre-launch",
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
  status: "pre-launch" | "legal-review-pending";
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
