import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { DownloadButton } from "@/components/download-button";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () =>
    pageHead({
      title: "Pricing - MacLattice Pro | One-Time Purchase $12.99 | MacLattice",
      description:
        "Get MacLattice Pro for a one-time payment of $12.99. Unlock advanced storage analysis features. No subscription required. 15-day money-back guarantee.",
      path: "/pricing",
      ogTitle: "MacLattice Pro Pricing | One-Time Purchase $12.99",
    }),
});

const FREE = [
  "Visualize disk usage (Treemap)",
  "Power search",
  "Find large files",
  "Live stats (CPU, memory, battery)",
];

const PRO = [
  "Everything in Free +",
  "Delete files within the app",
  "App uninstaller with residue cleanup",
  "Super Power search",
  "Reveal & open file paths",
  "One-click 'Show in Finder'",
  "Directly open archives & folders",
  "Premium themes customisation",
  "Priority email support",
];

function PricingPage() {
  return (
    <SiteShell>
      <section id="pricing" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Reclaim your creative flow.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-400">
              Start reclaiming space today. Upgrade to power through clutter.
            </p>
          </div>

        <div className="relative mx-auto grid items-stretch gap-6 md:grid-cols-2">
          <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-neutral-900/50 p-8">
            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold text-white">The Essentials</h2>
              <p className="text-sm text-neutral-400">
                Perfect for visualizing what's taking up space.
              </p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="ml-2 text-neutral-500">/ forever</span>
              </div>
            </div>
            <ul className="mb-8 flex-1 space-y-4">
              {FREE.map((item) => (
                <li key={item} className="flex items-start text-sm text-neutral-300">
                  <Check className="mt-0.5 mr-3 size-5 shrink-0 text-neutral-500" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <DownloadButton
                className="w-full min-w-0 py-4 text-sm font-semibold"
                label="Download Free Version"
              />
              <p className="mt-4 text-center text-[10px] text-neutral-500">
                Secured by Dodo Payments • 15-day refund
              </p>
            </div>
          </article>

          <article className="relative flex h-full flex-col rounded-3xl border border-primary/40 bg-gradient-to-b from-primary/10 to-neutral-900/50 p-8">
            <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              Lifetime License
            </span>
            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold text-white">The Power Suite</h2>
              <p className="text-sm text-neutral-400">
                Actionable tools for deep cleaning and control.
              </p>
              <div className="mt-6">
                <p className="text-sm text-neutral-500">
                  <span className="line-through">$14.99</span>{" "}
                  <span className="font-medium text-accent">Festival Sale</span>
                </p>
                <div className="mt-1 flex items-baseline">
                  <span className="text-4xl font-bold text-white">$12.99</span>
                  <span className="ml-2 text-neutral-500">one-time</span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">excl. govt. taxes</p>
              </div>
            </div>
            <ul className="mb-8 flex-1 space-y-4">
              {PRO.map((item) => (
                <li key={item} className="flex items-start text-sm text-neutral-300">
                  <Check className="mt-0.5 mr-3 size-5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <a
                href={SITE.checkout}
                className="flex w-full items-center justify-center rounded-xl bg-primary py-4 text-sm font-semibold text-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all hover:bg-primary/90 hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)]"
              >
                Unlock Lifetime Pro
              </a>
              <p className="mt-4 text-center text-[10px] text-neutral-500">
                Secured by Dodo Payments • 15-day refund
              </p>
              <p className="mt-1 text-center text-[10px] text-emerald-400/70">
                💚 1% of revenue goes to mindfulness & mental health organisations
              </p>
            </div>
          </article>
        </div>
        </div>
      </section>
    </SiteShell>
  );
}
