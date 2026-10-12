import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
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

const btn =
  "inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:scale-[1.02] hover:bg-white/90";

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
    <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 lg:py-24 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:gap-14">
      <div>
        <p className="mb-4 text-sm font-medium text-white/50">
          Windows disk space analyzer · {SITE.lifetimePrice} once
        </p>
        <h1 className="mb-6 text-[2.6rem] leading-[1.04] font-bold tracking-[-0.03em] text-balance text-white sm:text-6xl lg:text-[3.25rem] xl:text-[4rem]">
          The disk space analyzer that clears your PC
        </h1>
        <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/60">
          See every folder on your drive drawn to scale, find what is taking up space, and clear it
          in a few clicks. The map is included. Lifetime is {SITE.lifetimePrice}. No subscription, ever.
        </p>
        <a href={BUY_HREF} className={btn}>
          Get {SITE.name} Pro · {SITE.lifetimePrice}
        </a>
        <p className="mt-3 text-sm text-white/40">One-time payment · Lifetime licence, no subscription</p>
        <ul className="mt-8 space-y-2 text-sm text-white/70">
          {["Windows app, ready now", "Licence key on this site after checkout", "Files never leave your PC"].map(
            (item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-white/70" />
                {item}
              </li>
            ),
          )}
        </ul>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
        <img
          src="/join-disk.webp"
          alt="Scan My Disk treemap"
          width={1400}
          height={788}
          fetchPriority="high"
          decoding="async"
          className="aspect-[16/10] w-full object-cover object-top"
        />
      </div>
    </section>
  );
}

function Proof() {
  const items = [
    ["Lifetime", `${SITE.lifetimePrice} once`],
    ["Notarized", "Checked before you install"],
    ["100% local", "No uploads, no account"],
    ["Windows", "Windows 10 and 11"],
  ];
  return (
    <div className="border-y border-white/5 bg-white/[0.015] px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {items.map(([k, v], i) => (
          <div
            key={k}
            className={`px-2 py-6 text-center md:px-6 md:py-7 md:text-left ${i ? "border-white/5 md:border-l" : ""} ${i >= 2 ? "border-t border-white/5 md:border-t-0" : ""}`}
          >
            <p className="text-sm font-semibold text-white">{k}</p>
            <p className="mt-1 text-sm text-white/50">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hogs() {
  const items = [
    ["System Data", "caches, logs, snapshots, app containers", "The grey bar in Settings that won't explain itself."],
    ["Build caches", "Visual Studio, Gradle, and old installers", "Every build leaves files behind. Safe to clear once you review them."],
    ["Docker disk image", "Docker Desktop VHDX", "One file that can quietly grow to tens of gigabytes."],
    ["node_modules", "one in every project you've cloned", "Hundreds of copies across old projects. Find them in one scan."],
    ["Duplicates", "photos, videos, documents", "Same file, multiple copies. Keep one and delete the rest."],
    ["Leftovers", "AppData and ProgramData", "Uninstalling an app often leaves its support files."],
  ];
  return (
    <section id="features" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-medium text-white/40">Where the space goes</p>
        <h2 className="mb-4 max-w-3xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
          Six things that fill a PC. None of them is your photos.
        </h2>
        <p className="mb-10 max-w-2xl text-lg text-white/55">
          Windows hides the biggest space hogs in folders you never open. {SITE.name} finds them in one scan.
        </p>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, path, body]) => (
            <article key={title} className="flex flex-col gap-2 bg-black p-6 hover:bg-white/[0.02] md:p-7">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="font-mono text-xs text-white/40">{path}</p>
              <p className="text-sm leading-relaxed text-white/60">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURE_TABS = [
  {
    id: "uninstaller",
    label: "App uninstaller",
    title: "Remove apps and everything they left behind",
    body: "Deleting an app leaves its containers, caches and preference files behind. Scan My Disk finds them and removes the lot.",
    image: "/feature-uninstaller.webp",
    alt: "Scan My Disk app uninstaller",
  },
  {
    id: "leftovers",
    label: "Leftover cleanup",
    title: "Clear what deleted apps left behind",
    body: "Dragging an app to the Bin does not touch Application Support, containers, or preferences. Scan My Disk lists the orphans so you can review them and move them to the Trash.",
    image: "/join-presets.webp",
    alt: "Scan My Disk leftover cleanup",
  },
  {
    id: "treemap",
    label: "Storage map",
    title: "Every folder, drawn to scale",
    body: "The disk space analyzer draws the drive as a map. Every folder is a block sized by the space it uses, so the biggest problems are the biggest shapes. Click a block to go deeper.",
    image: "/join-disk.webp",
    alt: "Scan My Disk storage map",
  },
  {
    id: "search",
    label: "Search",
    title: "Find a file faster than Finder",
    body: "Search the whole scan by name in seconds, including the Library folders Finder hides. Filter to large files, disk images, archives, and developer junk.",
    image: "/feature-search.webp",
    alt: "Scan My Disk search",
  },
  {
    id: "monitor",
    label: "Live monitor",
    title: "See what is using the PC right now",
    body: "Watch CPU load, memory pressure, and network activity while a heavy build is running, so you can tell what is actually slowing the machine down.",
    image: "/monitoring.webp",
    alt: "Scan My Disk live monitor",
  },
] as const;

function ScanSeeClear() {
  const [active, setActive] = useState<(typeof FEATURE_TABS)[number]["id"]>("uninstaller");
  const panel = FEATURE_TABS.find((tab) => tab.id === active) ?? FEATURE_TABS[0];

  return (
    <section className="border-t border-white/5 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
            Scan. See. Clear.
          </h2>
          <p className="text-lg text-white/60">
            Every clean-up tool in {SITE.name}, for one payment of {SITE.lifetimePrice}.
          </p>
        </div>
        <div
          role="tablist"
          aria-label={`${SITE.name} features`}
          className="-mx-6 mb-8 flex gap-2 overflow-x-auto px-6 md:mx-0 md:justify-center md:px-0"
        >
          {FEATURE_TABS.map((tab) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                onClick={() => setActive(tab.id)}
                className={`inline-flex flex-none items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                  selected
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div
          id={`panel-${panel.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${panel.id}`}
          className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12"
        >
          <div className="order-2 lg:order-1">
            <h3 className="mb-4 text-2xl font-semibold tracking-tight text-balance text-white md:text-3xl">
              {panel.title}
            </h3>
            <p className="text-base leading-relaxed text-white/60 md:text-lg">{panel.body}</p>
          </div>
          <div className="order-1 overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl lg:order-2">
            <img
              src={panel.image}
              alt={panel.alt}
              width={1400}
              height={788}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    ["1", "Scan your PC", "Read every folder, including the hidden ones where caches, leftovers and developer files pile up."],
    ["2", "See what's taking up space", "Every folder is a block sized by the space it uses. Click in, search by name, or switch to sunburst, flame, bubbles, or a mind map."],
    ["3", "Clear it", "Move junk to the Trash, uninstall leftovers, drop duplicate copies, or run a cleanup preset. Nothing is gone until you say so."],
  ];
  return (
    <section className="border-t border-white/5 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm text-white/40">How it works</p>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          How {SITE.name} cleans a PC
        </h2>
        <p className="mb-10 max-w-2xl text-lg text-white/55">
          There's no button that deletes things you haven't seen. You look first, then you decide.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(([n, title, body]) => (
            <article key={n} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
              <p className="mb-3 text-sm font-semibold text-white/40">{n}</p>
              <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const included = [
    "Delete files right inside the app",
    "App uninstaller that removes leftovers",
    "Duplicate detection",
    "Saved scan comparison",
    "Cleanup presets",
    "Eight visualisations",
    "Fast search across your PC",
    "Live CPU, memory and battery stats",
  ];
  return (
    <section id="pricing" className="border-t border-white/5 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          One price. Every tool. Yours for good.
        </h2>
        <p className="mb-10 max-w-2xl text-lg text-white/55">
          CleanMyMac charges a yearly subscription. {SITE.name} is one payment for the map and the cleanup.
        </p>
        <div className="grid gap-10 rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:p-10">
          <div>
            <p className="text-sm font-medium text-white/50">{SITE.name} · lifetime licence</p>
            <p className="mt-2 text-5xl font-bold tracking-tight text-white">
              {SITE.lifetimePrice}
              <span className="ml-2 text-lg font-medium text-white/50">one time</span>
            </p>
            <p className="mt-3 text-sm text-white/50">Pay once. Nothing to renew, no account to keep.</p>
            <a href={BUY_HREF} className={`${btn} mt-8`}>
              Get {SITE.name} Pro · {SITE.lifetimePrice}
            </a>
            <p className="mt-3 text-sm text-white/40">One-time payment · 15-day refund</p>
          </div>
          <ul className="grid content-start gap-3.5 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-white/80">
                <Check className="mt-0.5 size-4 shrink-0 text-white/70" />
                {item}
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
    <section id="views" className="border-t border-white/5 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          One scan. Eight ways to read it.
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JOIN_VIEWS.map((view) => (
            <article key={view.name} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <img
                src={view.image}
                alt={`${view.name} in ${SITE.name}`}
                width={700}
                height={394}
                loading="lazy"
                className="aspect-video w-full object-cover object-top"
              />
              <div className="p-5">
                <h3 className="font-semibold text-white">{view.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{view.body}</p>
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
    ["Uninstall", "Uninstall apps properly", "Remove an app and the caches it leaves behind.", "/blog"],
    ["Free up space", "Free up space", "Caches, downloads, backups and developer junk.", "/blog"],
    ["System Data", "System Data", "What the grey bar holds, and how to shrink it.", "/blog"],
  ];
  return (
    <section className="border-t border-white/5 px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm text-white/40">Guides</p>
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">Fix it yourself first</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(([kicker, title, body, href]) => (
            <Link
              key={title}
              to={href}
              className="block rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <p className="text-xs font-semibold tracking-wider text-white/40 uppercase">{kicker}</p>
              <h3 className="mt-2 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/55">{body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="border-t border-white/5 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-bold text-white sm:text-4xl">Questions about {SITE.name}</h2>
        <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
          {JOIN_FAQ.map((item) => (
            <details key={item.q} className="group border-b border-white/5 last:border-0">
              <summary className="cursor-pointer list-none p-5 font-medium text-white hover:bg-white/[0.02]">
                {item.q}
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-white/60">{item.a}</p>
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
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 px-6 py-16 text-center md:py-20">
        <h2 className="mx-auto mb-4 max-w-2xl text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
          Get your gigabytes back for {SITE.lifetimePrice}.
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-white/60">
          One payment, yours for good. No subscription, no account, and your files never leave your PC.
        </p>
        <a href={BUY_HREF} className={btn}>
          Get {SITE.name} Pro · {SITE.lifetimePrice}
        </a>
        <p className="mt-3 text-sm text-white/40">One-time payment · Lifetime licence, no subscription</p>
      </div>
    </section>
  );
}
