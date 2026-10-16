import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  ArrowRight,
  ChevronDown,
  HardDrive,
  Layers,
  Copy,
  Camera,
  Activity,
  Sparkles,
  ShieldCheck,
  Cpu,
  Clock,
  ExternalLink,
  Download,
} from "lucide-react";
import { JoinShell } from "@/components/signup/join-shell";
import { JsonLd } from "@/components/json-ld";
import { JOIN_FAQ, JOIN_VIEWS } from "@/data/join";
import { SITE } from "@/data/site";
import { BUY_HREF } from "@/lib/buy";
import { HOME_DESCRIPTION, HOME_TITLE, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: SignupLanding,
  head: () => pageHead({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" }),
});

function SignupLanding() {
  return (
    <JoinShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: JOIN_FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <Hero />
      <Proof />
      <Hogs />
      <ScanSeeClear />
      <How />
      <Pricing />
      <Views />
      <Guides />
      <Faq />
      <Close />
    </JoinShell>
  );
}

function Hero() {
  return (
    <section className="glow-ambient relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-12 pb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] lg:gap-10 lg:pt-16 lg:pb-28">
      <div>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-sky-400 backdrop-blur-md">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-sky-400"></span>
          </span>
          <span>Windows 10 &amp; 11 · 100% Local · {SITE.lifetimePrice} Lifetime</span>
        </div>
        <h1 className="text-gradient mb-6 text-[2.75rem] leading-[1.04] font-bold tracking-[-0.035em] text-balance sm:text-6xl lg:text-[3.25rem] xl:text-[4rem]">
          See what's using space on Windows
        </h1>
        <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/70">
          See every folder on your drive drawn to scale, spot what is eating your storage, and reclaim gigabytes
          with confidence. Lifetime is {SITE.lifetimePrice}. No recurring subscription, ever.
        </p>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <a
            href={BUY_HREF}
            className="btn-primary group !px-6 !py-3.5 !text-base shadow-[0_0_30px_rgba(255,255,255,0.18)]"
          >
            <span>Get {SITE.name} Pro · {SITE.lifetimePrice}</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
          <Link
            to="/license"
            className="btn-secondary !px-4 !py-3 !text-sm"
          >
            <Download className="size-4 text-sky-400" />
            <span>Download / License</span>
          </Link>
        </div>
        <p className="mt-3 text-xs text-white/45">One-time payment · 15-day refund guarantee · Instant key</p>
        <ul className="mt-8 space-y-2.5 text-sm text-white/80">
          {[
            "Native Windows x64 application, ready to run",
            "Instant licence key right after checkout",
            "100% private: your files never leave your PC",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="flex size-5 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
                <Check className="size-3.5" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative group overflow-hidden rounded-2xl border border-white/15 bg-slate-950/80 p-2 shadow-2xl transition-all duration-300 hover:border-sky-500/30 hover:shadow-[0_0_50px_rgba(56,189,248,0.15)]">
        <div className="mb-2 flex items-center justify-between border-b border-white/10 px-2 pb-2 text-xs text-white/50">
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-red-500/70"></div>
            <div className="size-2.5 rounded-full bg-yellow-500/70"></div>
            <div className="size-2.5 rounded-full bg-green-500/70"></div>
            <span className="ml-2 font-mono text-[11px] text-white/50">Scan My Disk — System32 scan</span>
          </div>
          <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-400">
            Windows Native
          </span>
        </div>
        <img
          src="/windows-real-scan.webp"
          alt="Actual Scan My Disk Windows app displaying a real System32 disk usage scan"
          width={1680}
          height={882}
          fetchPriority="high"
          decoding="async"
          className="h-auto w-full rounded-lg"
        />
      </div>
    </section>
  );
}

function Proof() {
  const items = [
    { k: "Lifetime Licence", v: `${SITE.lifetimePrice} once`, icon: Sparkles },
    { k: "Clean & Verified", v: "Safe Windows installer", icon: ShieldCheck },
    { k: "100% Local Processing", v: "No uploads, no cloud", icon: Cpu },
    { k: "Fast Native Engine", v: "Windows 10 & 11 (64-bit)", icon: Clock },
  ];
  return (
    <div className="border-y border-white/10 bg-white/[0.015] px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {items.map(({ k, v, icon: Icon }, i) => (
          <div
            key={k}
            className={`flex items-start gap-3.5 px-3 py-6 md:px-6 md:py-7 ${
              i ? "border-white/5 md:border-l" : ""
            } ${i >= 2 ? "border-t border-white/5 md:border-t-0" : ""}`}
          >
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <Icon className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{k}</p>
              <p className="mt-0.5 text-xs text-muted">{v}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hogs() {
  const items = [
    ["System Data", "caches, logs, snapshots, temp files", "Hidden system folders that won't explain themselves."],
    ["Build caches", "Visual Studio, Gradle, old installers", "Every build leaves gigabytes behind. Safe to clear once reviewed."],
    ["Docker disk image", "Docker Desktop VHDX", "One virtual disk file that can quietly grow to tens of gigabytes."],
    ["node_modules", "one in every repo you've cloned", "Hundreds of copies across old projects. Find them in one scan."],
    ["Duplicate files", "photos, videos, downloads", "Same file, multiple copies. Keep the keeper and delete the rest."],
    ["Uninstall leftovers", "AppData and ProgramData", "Uninstalling an app often leaves residual caches and telemetry."],
  ];
  return (
    <section id="features" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-semibold tracking-wider text-sky-400 uppercase">Where the space goes</p>
        <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
          Six things that silently fill your PC drive.
        </h2>
        <p className="mb-10 max-w-2xl text-lg text-white/60">
          Windows hides the biggest space hogs in folders you rarely open. {SITE.name} finds them in one comprehensive scan.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, path, body]) => (
            <article
              key={title}
              className="glass-card flex flex-col gap-2 rounded-2xl p-6 transition-all duration-200 md:p-7"
            >
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="font-mono text-xs text-sky-400/80">{path}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURE_TABS = [
  {
    id: "treemap",
    label: "Storage map",
    icon: HardDrive,
    title: "See exactly where your disk space goes",
    body: "Scan your full PC, your user profile, or any custom folder. Explore an interactive treemap sized strictly by disk usage, inspect individual files, and review selected items in Cleanup Queue before removing them.",
    image: "/windows-views/treemap.webp",
    alt: "Scan My Disk for Windows showing a real System32 scan in Treemap view",
    caption: "Actual Windows app · real System32 scan",
  },
  {
    id: "uninstaller",
    label: "Applications",
    icon: Layers,
    title: "Manage installed Windows applications",
    body: "Browse installed apps with high-res icons and measured sizes. For supported apps, launch the Windows or vendor uninstaller and choose whether to keep app data or review selected leftovers for removal.",
    image: "/windows-features/applications.webp",
    alt: "Scan My Disk Windows Applications screen with installed app icons and uninstall controls",
    caption: "Actual Windows app · installed applications",
  },
  {
    id: "duplicates",
    label: "Duplicates",
    icon: Copy,
    title: "Find matching copies. Choose what to keep.",
    body: "Find identical files across your scan using three-pass content hashing. Choose a copy to keep, then review the redundant copies in Cleanup Queue before taking action.",
    image: "/windows-features/duplicates.webp",
    alt: "Actual Scan My Disk duplicate review interface with an example matching file group",
    caption: "Actual Windows app · example duplicate group",
  },
  {
    id: "snapshots",
    label: "Snapshots",
    icon: Camera,
    title: "See how your folders change over time",
    body: "Save a lightweight scan snapshot and compare earlier and later scans of the same location. Immediately spot which folders grew or shrank over time.",
    image: "/windows-features/snapshots.webp",
    alt: "Actual Scan My Disk snapshot comparison interface with example saved scans",
    caption: "Actual Windows app · example snapshot comparison",
  },
  {
    id: "monitor",
    label: "Live monitor",
    icon: Activity,
    title: "See what is using your PC right now",
    body: "Watch real-time CPU usage, memory pressure, network rates, and free volume space. Search the process list and sort by resource footprint to detect performance bottlenecks.",
    image: "/windows-features/monitor.webp",
    alt: "Scan My Disk Windows Monitor showing live CPU, memory, network, and system drive metrics",
    caption: "Actual Windows app · live system monitor",
  },
] as const;

function ScanSeeClear() {
  const [active, setActive] = useState<(typeof FEATURE_TABS)[number]["id"]>("treemap");
  const panel = FEATURE_TABS.find((tab) => tab.id === active) ?? FEATURE_TABS[0];

  return (
    <section className="border-t border-white/10 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <p className="mb-2 text-xs font-semibold tracking-wider text-sky-400 uppercase">Complete Toolkit</p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
            Scan. See. Clear.
          </h2>
          <p className="text-lg text-white/60">
            Explore your storage visually, review staged cleanup, and keep track of your Windows PC.
          </p>
        </div>
        <div
          role="tablist"
          aria-label={`${SITE.name} features`}
          className="-mx-6 mb-8 flex gap-2 overflow-x-auto px-6 md:mx-0 md:justify-center md:px-0"
        >
          {FEATURE_TABS.map((tab) => {
            const selected = tab.id === active;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={`inline-flex min-h-11 flex-none items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                  selected
                    ? "border-white bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.25)]"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon className={`size-4 ${selected ? "text-black" : "text-sky-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div
          id={`panel-${panel.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${panel.id}`}
          className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)] lg:gap-12"
        >
          <div className="order-2 lg:order-1">
            <h3 className="mb-4 text-2xl font-semibold tracking-tight text-balance text-white md:text-3xl">
              {panel.title}
            </h3>
            <p className="text-base leading-relaxed text-white/70 md:text-lg">{panel.body}</p>
          </div>
          <figure className="glass-card order-1 overflow-hidden rounded-2xl border border-white/15 p-2 shadow-2xl lg:order-2">
            <img
              key={panel.id}
              src={panel.image}
              alt={panel.alt}
              width={1680}
              height={panel.id === "treemap" ? 882 : 1050}
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-xl"
            />
            <figcaption className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 pb-1 text-xs text-muted">
              <span>{panel.caption}</span>
              <a
                href={panel.image}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-sky-400 transition-colors hover:text-sky-300 hover:underline"
              >
                <span>View full screenshot</span>
                <ExternalLink className="size-3" />
              </a>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    ["1", "Scan your PC", "Read every directory, including the protected AppData and system locations where junk and caches pile up."],
    ["2", "See what's taking up space", "Every folder is drawn as an interactive block sized by disk footprint. Zoom in, search, or toggle between 8 distinct visual views."],
    ["3", "Clear with confidence", "Move junk to the Recycle Bin, drop duplicate copies, or run cleanup presets. Nothing is deleted until you review and confirm."],
  ];
  return (
    <section className="border-t border-white/10 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold tracking-wider text-sky-400 uppercase">How it works</p>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          How {SITE.name} cleans a PC
        </h2>
        <p className="mb-10 max-w-2xl text-lg text-white/60">
          No automated background deletion that risks your files. You look first, review in the queue, then decide.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(([n, title, body]) => (
            <article key={n} className="glass-card rounded-2xl p-6 md:p-7">
              <div className="mb-4 flex size-9 items-center justify-center rounded-xl border border-sky-500/25 bg-sky-500/10 font-mono text-sm font-bold text-sky-400">
                {n}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const included = [
    "Delete files safely via native Recycle Bin",
    "App uninstaller that cleans leftover support data",
    "Content-based duplicate detection",
    "Saved scan comparison & growth tracking",
    "Pre-configured quick cleanup profiles",
    "Eight distinct interactive visualisations",
    "High-speed local search across the drive",
    "Live CPU, RAM and system volume metrics",
  ];
  return (
    <section id="pricing" className="border-t border-white/10 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          One price. Every tool. Yours for good.
        </h2>
        <p className="mb-10 max-w-2xl text-lg text-white/60">
          Other disk analyzers charge recurring subscriptions. {SITE.name} is a one-time purchase with no renewal fees.
        </p>
        <div className="glow-card relative grid gap-10 rounded-3xl border border-white/15 bg-gradient-to-b from-sky-500/10 via-white/[0.03] to-transparent p-7 backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:p-10">
          <div>
            <div className="inline-flex rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              Lifetime Licence · Windows
            </div>
            <p className="mt-4 text-5xl font-bold tracking-tight text-white">
              {SITE.lifetimePrice}
              <span className="ml-2 text-lg font-medium text-white/50">one-time</span>
            </p>
            <p className="mt-3 text-sm text-muted">Pay once. Zero recurring subscriptions, no account required.</p>
            <a
              href={BUY_HREF}
              className="btn-primary group mt-8 !px-6 !py-3.5 !text-base shadow-[0_0_24px_rgba(255,255,255,0.2)]"
            >
              <span>Get {SITE.name} Pro · {SITE.lifetimePrice}</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <p className="mt-3 text-xs text-white/45">One-time payment · 15-day refund guarantee</p>
          </div>
          <ul className="grid content-start gap-3.5 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-white/80">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
                  <Check className="size-3" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Views() {
  return (
    <section id="views" className="border-t border-white/10 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-wider text-sky-400 uppercase">Visualizations</p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            One scan. Eight ways to read it.
          </h2>
          <p className="text-base text-muted">
            Eight interactive perspectives generated from the same scan. Navigate folder trees, isolate space hogs, or audit storage by file age.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JOIN_VIEWS.map((view) => (
            <article
              key={view.name}
              className="glass-card group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5"
            >
              <div>
                <a
                  href={view.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[16/10] w-full overflow-hidden rounded-lg bg-black/60 border border-white/5"
                  aria-label={`View full ${view.name} screenshot`}
                >
                  <img
                    src={view.image}
                    alt={`${view.name} in ${SITE.name}`}
                    width={560}
                    height={350}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-end justify-end p-2">
                    <span className="inline-flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-sky-300 backdrop-blur-sm">
                      Full view <ExternalLink className="size-2.5" />
                    </span>
                  </div>
                </a>
                <div className="px-1 pt-3 pb-1">
                  <h3 className="text-sm font-semibold text-white tracking-tight">{view.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">{view.body}</p>
                </div>
              </div>

              <div className="px-1 pt-1">
                <a
                  href={view.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 hover:text-sky-300 transition-colors"
                  aria-label={`Open ${view.name} full view`}
                >
                  <span>Open full screenshot</span>
                  <ExternalLink className="size-2.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guides() {
  const cards = [
    {
      kicker: "Uninstall",
      title: "Uninstall apps properly",
      body: "Remove an app and the residual caches it leaves behind.",
      slug: "clean-appdata-programdata-leftovers-windows",
    },
    {
      kicker: "Free up space",
      title: "Free up space",
      body: "Where a full disk actually goes, and how to get the space back.",
      slug: "beginner-mac-cleanup",
    },
    {
      kicker: "System Data",
      title: "Inspect System Data",
      body: "What the hidden system folders hold, and which ones you can delete.",
      slug: "system-data-mystery",
    },
  ];
  return (
    <section className="border-t border-white/10 px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold tracking-wider text-sky-400 uppercase">Guides &amp; Articles</p>
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">Storage optimization guides</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.slug}
              to="/blog/$slug"
              params={{ slug: card.slug }}
              className="glass-card group block rounded-2xl p-5 transition-all duration-200"
            >
              <p className="text-xs font-semibold tracking-wider text-sky-400 uppercase">{card.kicker}</p>
              <h3 className="mt-2 font-semibold text-white group-hover:text-sky-300">{card.title}</h3>
              <p className="mt-2 text-sm text-muted">{card.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="border-t border-white/10 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-white sm:text-4xl">Questions about {SITE.name}</h2>
        <div className="glass-card overflow-hidden rounded-2xl border border-white/10">
          {JOIN_FAQ.map((item) => (
            <details key={item.q} className="group border-b border-white/10 last:border-0">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-left font-medium text-white transition-colors hover:bg-white/[0.04]">
                <span>{item.q}</span>
                <ChevronDown className="size-4 shrink-0 text-white/50 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Close() {
  return (
    <section className="px-6 pb-24">
      <div className="glow-ambient relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-sky-500/10 via-white/[0.02] to-transparent px-6 py-16 text-center backdrop-blur-xl md:py-20">
        <h2 className="mx-auto mb-4 max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
          Get your gigabytes back for {SITE.lifetimePrice}.
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-white/70">
          One payment, yours for good. No subscription, no account required, and your files never leave your PC.
        </p>
        <a href={BUY_HREF} className="btn-primary group !px-8 !py-4 !text-base shadow-[0_0_30px_rgba(255,255,255,0.25)]">
          <span>Get {SITE.name} Pro · {SITE.lifetimePrice}</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
        <p className="mt-3 text-xs text-white/45">One-time payment · Lifetime licence, no recurring fees</p>
      </div>
    </section>
  );
}

