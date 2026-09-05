import { ChevronDown } from "lucide-react";
import { AppleIcon } from "@/components/apple-icon";
import { SITE } from "@/data/site";

export function BlogCta() {
  return (
    <footer className="mt-16 border-t border-white/5 pt-8">
      <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 text-center md:p-12 md:text-left">
        <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
          <div className="flex-1">
            <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
              Finding these files too slow?
            </h3>
            <p className="mb-8 text-lg leading-relaxed text-muted">
              {SITE.name} visualizes your entire drive, making it obvious where these
              hidden caches are hiding.
            </p>
            <a
              href={SITE.afterDownload}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-medium text-black shadow-lg transition-all hover:scale-[1.02] hover:bg-white/90 md:w-auto"
            >
              <AppleIcon className="h-4 w-4" />
              Download Free
              <ChevronDown className="h-4 w-4" />
            </a>
          </div>
          <div className="relative aspect-video w-full flex-1 overflow-hidden rounded-xl border border-white/10 shadow-2xl transition-transform duration-500 md:aspect-auto md:h-[240px] md:rotate-2 group-hover:rotate-0">
            <img
              src="/app-screenshot.webp"
              alt={`${SITE.name} Interface`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
