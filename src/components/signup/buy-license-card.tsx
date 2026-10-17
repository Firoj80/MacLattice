import { Check } from "lucide-react";
import { SITE } from "@/data/site";
import { BUY_HREF } from "@/lib/buy";

const FEATURES = [
  "Eight disk visualisations",
  "Duplicate files, photos & videos",
  "Saved scan comparison",
  "Cleanup presets (Safe, Developer, Cache)",
  "App uninstaller + leftovers",
  "Snapshots & live monitor",
];

export function BuyLicenseCard() {
  return (
    <div
      id="buy"
      className="flex h-full min-h-full flex-col overflow-hidden rounded-[28px] border-2 border-primary bg-card shadow-[0_24px_60px_rgb(33_86_74/0.18)]"
    >
      <div className="bg-primary px-6 py-6 text-primary-fg md:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">Lifetime licence</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="font-display text-5xl leading-none font-medium tracking-tight sm:text-6xl">
            {SITE.lifetimePrice}
          </span>
          <span className="mb-1 text-sm font-medium opacity-80">once · forever</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h2 className="font-display text-2xl leading-tight font-medium tracking-tight text-fg">
          Everything in one licence
        </h2>
        <ul className="mt-5 flex-1 space-y-2.5">
          {FEATURES.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15px] text-fg">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3.5">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Windows app</p>
          <p className="mt-1 text-[15px] leading-snug font-medium text-fg">
            Install Scan My Disk for Windows and paste the licence key from checkout to unlock it.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm leading-relaxed text-muted">
            Currently available for Windows 10 and 11. macOS version coming soon.
          </p>
          <a
            href={BUY_HREF}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-fg transition-transform duration-150 hover:brightness-110 active:scale-[0.98]"
          >
            Buy Lifetime Licence in {SITE.lifetimePrice}
          </a>
        </div>
        <p className="mt-3 text-center text-xs text-muted">15-day refund · one device at a time</p>
      </div>
    </div>
  );
}
