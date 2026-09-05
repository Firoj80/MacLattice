import { Link } from "@tanstack/react-router";
import { startDownloadThenRedirect } from "@/components/download-button";
import { SITE } from "@/data/site";

const linkClass = "text-sm text-muted transition-colors hover:text-white";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-base font-semibold text-white">
              {SITE.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {SITE.tagline}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-white">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" hash="features" className={linkClass}>
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className={linkClass}>
                  Pricing
                </Link>
              </li>
              <li>
                <a
                  href={SITE.siliconDmg}
                  className={linkClass}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey ||
                      event.button !== 0
                    ) {
                      return;
                    }
                    event.preventDefault();
                    startDownloadThenRedirect(SITE.siliconDmg);
                  }}
                >
                  Download
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-white">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/privacy" className={linkClass}>
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={linkClass}>
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className={linkClass}>
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-white">Support</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/contact" className={linkClass}>
                  Contact
                </Link>
              </li>
              <li>
                <a href={SITE.reddit} className={linkClass} rel="noreferrer">
                  Community
                </a>
              </li>
              <li>
                <Link to="/" hash="faq" className={linkClass}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 border-t border-white/5 pt-8">
          <p className="text-xs text-muted">
            © 2026 {SITE.name}. Owned and operated by {SITE.name} team.
          </p>
        </div>
      </div>
    </footer>
  );
}
