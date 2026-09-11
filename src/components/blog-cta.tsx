import { SITE } from "@/data/site";
import { BUY_HREF } from "@/lib/buy";

export function BlogCta() {
  return (
    <footer className="mt-16 border-t border-border pt-8">
      <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center md:p-12 md:text-left">
        <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
          <div className="flex-1">
            <h3 className="font-display mb-4 text-2xl font-medium tracking-tight text-fg md:text-3xl">
              Finding these files too slow?
            </h3>
            <p className="mb-8 text-lg leading-relaxed text-muted">
              {SITE.name} visualizes your entire drive, making it obvious where these
              hidden caches are hiding.
            </p>
            <a
              href={BUY_HREF}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-medium text-primary-fg shadow-lg transition-all hover:brightness-110 md:w-auto"
            >
              Buy licence · {SITE.lifetimePrice}
            </a>
          </div>
          <div className="relative aspect-video w-full flex-1 overflow-hidden rounded-xl border border-border shadow-xl md:aspect-auto md:h-[240px]">
            <img
              src="/app-screenshot.webp"
              alt={`${SITE.name} Interface`}
              width={1200}
              height={673}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
