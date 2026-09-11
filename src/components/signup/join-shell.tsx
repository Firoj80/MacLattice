import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { HeaderBuy } from "@/components/header-buy";
import { FOOTER_LEGAL, FOOTER_PRODUCT, FOOTER_SUPPORT, MAIN_NAV, type NavItem } from "@/data/nav";
import { SITE } from "@/data/site";

export function JoinShell({ children }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <JoinHeader />
      <main>{children}</main>
      <JoinFooter />
    </div>
  );
}

function NavLink({ item, className, onClick }: { item: NavItem; className: string; onClick?: () => void }) {
  return (
    <Link to={item.to} hash={item.hash} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );
}

function JoinHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" className="font-display shrink-0 text-lg font-semibold tracking-tight text-fg">
          {SITE.name}
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-3 overflow-hidden text-[13px] font-medium whitespace-nowrap text-muted md:flex lg:gap-x-4">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.label} item={item} className="hover:text-fg" />
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <HeaderBuy />
          <button
            type="button"
            className="rounded-lg p-2 text-fg md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border bg-bg px-5 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col">
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-muted hover:bg-fg/5 hover:text-fg"
              />
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function JoinFooter() {
  const col = "flex flex-col gap-2.5 text-sm text-muted";
  const link = "hover:text-fg";
  return (
    <footer className="border-t border-border px-5 py-12 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-medium text-fg">{SITE.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{SITE.tagline}</p>
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
    </footer>
  );
}
