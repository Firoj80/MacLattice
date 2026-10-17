import { macOSAvailable } from "@/data/site";

export type NavItem = {
  to?: "/" | "/blog" | "/contact" | "/privacy" | "/terms" | "/refund-policy" | "/license";
  href?: string;
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
  { href: "/buy", label: "Buy licence" },
  { to: "/blog", label: "Blog" },
  { href: "/windows", label: "Windows — Available Now" },
  { href: "/macos", label: macOSAvailable() ? "macOS — Available Now" : "macOS — Coming Soon" },
  { href: "/blog/clean-appdata-programdata-leftovers-windows", label: "Uninstall leftovers" },
  { href: "/blog/find-delete-duplicate-files-windows-content-hashing", label: "Free up space" },
  { href: "/blog/shrink-docker-wsl2-ext4-vhdx-windows", label: "System Data" },
  { to: "/license", label: "Downloads & licence recovery" },
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
