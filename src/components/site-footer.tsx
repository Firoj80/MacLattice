import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand";
import { FOOTER_LEGAL, FOOTER_PRODUCT, FOOTER_SUPPORT, type NavItem } from "@/data/nav";
import { SITE } from "@/data/site";

const linkClass = "text-sm text-muted transition-colors hover:text-fg";

function Item({ item }: { item: NavItem }) {
  return (
    <li>
      {item.href ? (
        <a href={item.href} className={linkClass}>
          {item.label}
        </a>
      ) : (
        <Link to={item.to ?? "/"} hash={item.hash} className={linkClass}>
          {item.label}
        </Link>
      )}
    </li>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <BrandMark size="sm" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {SITE.tagline}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-fg">Product</h4>
            <ul className="space-y-2.5">
              {FOOTER_PRODUCT.map((item) => (
                <Item key={item.label} item={item} />
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-fg">Legal</h4>
            <ul className="space-y-2.5">
              {FOOTER_LEGAL.map((item) => (
                <Item key={item.label} item={item} />
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-fg">Support</h4>
            <ul className="space-y-2.5">
              {FOOTER_SUPPORT.map((item) => (
                <Item key={item.label} item={item} />
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 border-t border-border pt-8">
          <p className="text-xs text-muted">
            © 2026 {SITE.name}. Owned and operated by {SITE.name} team.
          </p>
        </div>
      </div>
    </footer>
  );
}
