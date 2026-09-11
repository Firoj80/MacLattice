import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { HeaderBuy } from "@/components/header-buy";
import { MAIN_NAV } from "@/data/nav";
import { SITE } from "@/data/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className="font-display shrink-0 text-lg font-semibold tracking-tight text-fg transition-opacity hover:opacity-80"
          >
            {SITE.name}
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-x-3 overflow-hidden lg:gap-x-4 md:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                className="text-[13px] font-medium whitespace-nowrap text-muted transition-colors hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center md:flex">
            <HeaderBuy />
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-fg transition-colors hover:bg-fg/5 md:hidden"
            aria-label={open ? "Close menu" : "Toggle menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-bg px-6 py-4 md:hidden">
          <div className="flex flex-col space-y-1">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={item.hash}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted hover:bg-fg/5 hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
            <HeaderBuy className="mt-3 w-full justify-center" />
          </div>
        </div>
      ) : null}
    </nav>
  );
}
