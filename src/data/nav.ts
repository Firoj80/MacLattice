export type NavItem = {
  to: "/" | "/blog" | "/contact" | "/privacy" | "/terms" | "/refund-policy" | "/license";
  hash?: string;
  label: string;
};

/** Every remaining public page — used by header and footer. */
export const MAIN_NAV: NavItem[] = [
  { to: "/", hash: "views", label: "Features" },
  { to: "/", hash: "pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/", hash: "faq", label: "FAQ" },
];

export const FOOTER_PRODUCT: NavItem[] = [
  { to: "/", hash: "views", label: "Features" },
  { to: "/", hash: "pricing", label: "Pricing" },
  { to: "/", hash: "create", label: "Buy licence" },
  { to: "/blog", label: "Blog" },
  { to: "/license", label: "Already Have Licence?" },
];

export const FOOTER_LEGAL: NavItem[] = [
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
  { to: "/refund-policy", label: "Refund Policy" },
];

export const FOOTER_SUPPORT: NavItem[] = [
  { to: "/contact", label: "Contact" },
  { to: "/", hash: "faq", label: "FAQ" },
];
