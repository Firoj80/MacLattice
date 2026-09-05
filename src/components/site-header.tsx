import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { DownloadButton } from "@/components/download-button";
import { SITE } from "@/data/site";

const NAV = [
  { to: "/", hash: "features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/", hash: "faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
          >
            {SITE.name}
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {NAV.map((item) =>
              "hash" in item ? (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="hidden items-center md:flex">
            <DownloadButton variant="nav" />
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/5 md:hidden"
            aria-label={open ? "Close menu" : "Toggle menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/5 bg-black/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col space-y-1">
            {NAV.map((item) =>
              "hash" in item ? (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ),
            )}
            <DownloadButton className="mt-3 w-full" variant="nav" />
          </div>
        </div>
      ) : null}
    </nav>
  );
}
