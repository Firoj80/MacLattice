import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { HeaderBuy } from "@/components/header-buy";
import { BrandMark } from "@/components/brand";
import { CodeHypeBadge } from "@/components/codehype-badge";
import { FOOTER_LEGAL, FOOTER_PRODUCT, FOOTER_SUPPORT, MAIN_NAV, type NavItem } from "@/data/nav";
import { SITE } from "@/data/site";
import { markdownPathFor } from "@/lib/md/negotiate";
import { absUrl } from "@/lib/seo";

export function JoinShell({ children }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <JoinHeader />
      <main className="min-h-screen pt-16">{children}</main>
      <JoinFooter />
    </div>
  );
}

function NavLink({ item, className, onClick }: { item: NavItem; className: string; onClick?: () => void }) {
  if (item.href) {
    return (
      <a href={item.href} className={className} onClick={onClick}>
        {item.label}
      </a>
    );
  }
  return (
    <Link to={item.to ?? "/"} hash={item.hash} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );
}

function JoinHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.08] bg-[#030712]/80 backdrop-blur-2xl transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <BrandMark />
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-2 overflow-hidden text-[13px] font-medium whitespace-nowrap text-muted md:flex lg:gap-x-3">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              className="rounded-lg px-2.5 py-1 text-muted transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
            />
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <HeaderBuy />
          <button
            type="button"
            className="rounded-lg p-2 text-fg transition-colors hover:bg-white/[0.08] md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-white/[0.08] bg-[#070b16]/95 backdrop-blur-2xl px-5 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-white/[0.08] hover:text-white"
              />
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function JoinFooter() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const markdown = markdownPathFor(pathname);
  const col = "flex flex-col gap-2.5 text-sm text-muted";
  const link = "hover:text-fg";
  return (
    <footer className="border-t border-border px-5 py-12 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandMark size="sm" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{SITE.tagline}</p>
          <CodeHypeBadge />
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-fg">Product</h4>
          <div className={col}>
            {FOOTER_PRODUCT.map((item) => (
              <NavLink key={item.label} item={item} className={link} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-fg">Legal</h4>
          <div className={col}>
            {FOOTER_LEGAL.map((item) => (
              <NavLink key={item.label} item={item} className={link} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-fg">Support</h4>
          <div className={col}>
            {FOOTER_SUPPORT.map((item) => (
              <NavLink key={item.label} item={item} className={link} />
            ))}
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-sm text-muted">
        © {new Date().getFullYear()} {SITE.name}
      </p>
      {pathname === "/" ? (
        <p className="mx-auto mt-6 max-w-6xl">
          <a href="https://www.scrolllaunch.com/products/scanmydisk?ref=badge" target="_blank" rel="noopener">
            <img src="https://www.scrolllaunch.com/api/badge/scanmydisk" alt="Featured on ScrollLaunch" width="220" height="48" loading="lazy" />
          </a>
        </p>
      ) : null}
      {markdown ? (
        <p className="mx-auto mt-3 max-w-6xl">
          <a href={absUrl(markdown)} className="text-xs text-muted hover:text-fg">
            View as Markdown
          </a>
        </p>
      ) : null}
    </footer>
  );
}
