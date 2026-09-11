import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { BuyLicenseCard } from "@/components/signup/buy-license-card";
import { JoinShell } from "@/components/signup/join-shell";
import { JsonLd } from "@/components/json-ld";
import { JOIN_FAQ, JOIN_SIGNATURE, JOIN_TOOLKIT, JOIN_VIEWS } from "@/data/join";
import { SITE } from "@/data/site";
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
      <Views />
      <PriceStrip />
      <Toolkit />
      <Signature />
      <Pricing />
      <Faq />
    </JoinShell>
  );
}

function Hero() {
  return (
    <section id="create" className="mx-auto grid max-w-6xl items-stretch gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
      <div className="flex flex-col">
        <div className="inline-flex items-baseline gap-3 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5">
          <span className="font-display text-3xl font-medium tracking-tight text-primary sm:text-4xl">
            {SITE.lifetimePrice}
          </span>
          <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            lifetime · pay once
          </span>
        </div>
        <h1 className="font-display mt-6 max-w-xl text-4xl leading-[1.06] font-medium tracking-tight text-fg sm:text-5xl lg:text-[3.35rem]">
          See every byte. Reclaim it without the hunt.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
          One scan. Eight views. Duplicates, leftovers, scan compare, and cleanup
          presets — on your Mac. Not $89 a year. {SITE.lifetimePrice} forever.
        </p>
        <ul className="mt-6 space-y-2.5 text-[15px] text-fg">
          {[
            "No subscription, no account",
            "One Mac at a time — move it whenever you like",
            "15-day refund, key on screen after checkout",
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8 min-h-0 flex-1 overflow-hidden rounded-[28px] border border-border">
          <img
            src="/join-disk.jpg"
            alt="Editorial map of a Mac disk as nested rooms"
            className="h-full min-h-[220px] w-full object-cover"
          />
        </div>
      </div>
      <div className="flex">
        <BuyLicenseCard />
      </div>
    </section>
  );
}

function Proof() {
  const items = [
    "Eight visualisations",
    "100% local",
    "Apple Silicon + Intel",
    `${SITE.lifetimePrice} lifetime`,
    "One Mac at a time",
    "No subscription",
  ];
  return (
    <div className="border-y border-border bg-primary text-primary-fg">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 text-xs font-semibold tracking-[0.14em] uppercase sm:px-8">
        {items.map((item) => (
          <span key={item} className={item.includes("$") ? "text-[13px] tracking-wide" : undefined}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Views() {
  return (
    <section id="views" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">One scan. Eight reads.</p>
      <h2 className="font-display mt-3 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-fg sm:text-4xl">
        Folders, rings, flames, bubbles, maps — pick the view that makes the weight obvious.
      </h2>
      <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {JOIN_VIEWS.map((view) => (
          <article key={view.name} className="bg-card p-6">
            <h3 className="font-display text-xl font-medium text-fg">{view.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{view.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PriceStrip() {
  return (
    <section className="px-5 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-[28px] bg-primary px-8 py-8 text-primary-fg sm:flex-row sm:px-12">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">Lifetime licence</p>
          <p className="font-display mt-1 text-5xl font-medium tracking-tight sm:text-6xl">
            {SITE.lifetimePrice}
            <span className="ml-2 text-2xl font-normal opacity-80">once</span>
          </p>
          <p className="mt-2 text-sm opacity-85">CleanMyMac-class tools. One payment. No renewal mail.</p>
        </div>
        <a
          href="#create"
          className="inline-flex h-12 shrink-0 items-center rounded-xl bg-primary-fg px-7 text-sm font-semibold text-primary"
        >
          Buy licence — {SITE.lifetimePrice}
        </a>
      </div>
    </section>
  );
}

function Toolkit() {
  return (
    <section id="toolkit" className="bg-card/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">The toolkit</p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-fg sm:text-4xl">
          Everything you need after the map is drawn.
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {JOIN_TOOLKIT.map((item) => (
            <article key={item.name}>
              <h3 className="text-[15px] font-semibold text-fg">{item.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Signature() {
  return (
    <section id="signature" className="mx-auto max-w-6xl space-y-24 px-5 py-20 sm:px-8">
      <div>
        <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">Only on this plan</p>
        <h2 className="font-display mt-3 max-w-2xl text-3xl leading-tight font-medium tracking-tight text-fg sm:text-4xl">
          Three tools built for the moment the drive is already full.
        </h2>
      </div>
      {JOIN_SIGNATURE.map((feature, i) => (
        <article key={feature.id} className="grid items-center gap-10 lg:grid-cols-2">
          <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">{feature.kicker}</p>
            <h3 className="font-display mt-3 text-3xl leading-tight font-medium tracking-tight text-fg">
              {feature.title}
            </h3>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">{feature.body}</p>
            <ul className="mt-6 space-y-3">
              {feature.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed text-fg">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={i % 2 === 1 ? "lg:order-1" : undefined}>
            <img
              src={feature.image}
              alt={feature.imageAlt}
              className="aspect-[16/10] w-full rounded-[28px] border border-border object-cover"
            />
          </div>
        </article>
      ))}
    </section>
  );
}

function Pricing() {
  const included = [
    "All eight visualisations",
    "Duplicate detection by content",
    "Saved scan comparison",
    "Cleanup presets (Safe, Developer, Cache, Large Junk)",
    "Complete app uninstaller and leftovers",
    "Snapshots, live monitor, staged cleanup",
    "Every 1.x update",
    "One Mac — deactivate to move",
  ];
  return (
    <section id="pricing" className="bg-primary text-primary-fg">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase opacity-80">Pay once</p>
            <p className="mt-4 text-sm font-medium tracking-wide opacity-70">
              <span className="line-through">$89 / year</span>
              <span className="ml-3 opacity-100">typical cleaner subscription</span>
            </p>
            <h2 className="font-display mt-2 text-[6.5rem] leading-[0.85] font-medium tracking-tight sm:text-[8rem]">
              {SITE.lifetimePrice}
            </h2>
            <p className="mt-2 text-2xl font-medium">for life. Not a subscription.</p>
            <p className="mt-5 max-w-md text-base leading-relaxed opacity-85">
              Dodo collects your name and email. You get a licence key on the next
              screen. We email the Mac app when it ships.
            </p>
            <a
              href="#create"
              className="mt-8 inline-flex h-14 items-center rounded-xl bg-primary-fg px-8 text-base font-semibold text-primary"
            >
              Buy licence — {SITE.lifetimePrice}
            </a>
            <p className="mt-3 text-sm opacity-75">15-day money-back guarantee · no account</p>
          </div>
          <ul className="space-y-3 rounded-[28px] bg-primary-fg p-8 text-fg shadow-[0_24px_60px_rgb(0_0_0/0.18)]">
            <li className="mb-4 font-display text-2xl font-medium text-primary">Everything included</li>
            {included.map((item) => (
              <li key={item} className="flex gap-3 text-[15px]">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <h2 className="font-display text-3xl font-medium tracking-tight text-fg">Questions, answered.</h2>
      <div className="mt-10 divide-y divide-border border-y border-border">
        {JOIN_FAQ.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="cursor-pointer list-none text-[16px] font-semibold text-fg marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {item.q}
                <span className="text-muted transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 pr-8 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
