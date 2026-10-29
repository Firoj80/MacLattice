import { useLocalPricing } from "@/components/local-pricing";
import { createFileRoute, Link } from "@tanstack/react-router";
import { JoinShell } from "@/components/signup/join-shell";
import { JsonLd } from "@/components/json-ld";
import { PLATFORM_FAQ, SITE, availabilitySentence, macOSAvailable } from "@/data/site";
import { BUY_HREF } from "@/lib/buy";
import { absUrl, faqJsonLd, pageHead } from "@/lib/seo";
import { AtAGlance } from "@/components/at-a-glance";
import { macGlanceRows } from "@/lib/research/study";

const TITLE = macOSAvailable()
  ? "ScanMyDisk for macOS"
  : "ScanMyDisk for macOS — Coming Soon";
const DESCRIPTION = macOSAvailable()
  ? "ScanMyDisk is a visual disk space analyzer for macOS and Windows. See what is using disk space, including large files, duplicates and caches."
  : "ScanMyDisk for macOS is coming soon. The visual disk space analyzer is available now for Windows 10 and Windows 11.";

export const Route = createFileRoute("/macos")({
  component: MacosPage,
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/macos",
    }),
});

function MacosPage() {
  const price = useLocalPricing();
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE,
    description: DESCRIPTION,
    url: absUrl("/macos"),
    isPartOf: { "@type": "WebSite", name: SITE.brand, url: absUrl("/") },
  };

  return (
    <JoinShell>
      <JsonLd data={pageLd} />
      <JsonLd data={faqJsonLd(PLATFORM_FAQ)} />
      <section className="glow-ambient mx-auto max-w-3xl px-6 py-20">
        <p className="mb-3 text-xs font-semibold tracking-wider text-sky-400 uppercase">
          {macOSAvailable() ? "Available now" : "Coming soon"}
        </p>
        <h1 className="text-gradient text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {macOSAvailable()
            ? "ScanMyDisk for macOS"
            : "ScanMyDisk for macOS is coming soon."}
        </h1>
        <p className="mt-5 text-lg text-white/70">
          ScanMyDisk is a visual disk space analyzer. It helps you see what is using disk space, including large
          files, duplicates and caches.{" "}
          {macOSAvailable()
            ? "The macOS version is available."
            : "The macOS version is in development and is not available yet."}
        </p>
        <p className="mt-4 text-sm text-white/80">{availabilitySentence()}</p>
        <div className="mt-6">
          <AtAGlance rows={macGlanceRows()} />
          <p className="mt-3 text-sm text-white/60">
            <a href="/research/product" className="underline-offset-2 hover:underline">Product facts</a>
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-semibold text-white">
          {macOSAvailable() ? "What it includes" : "What the Mac version is planned to include"}
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/75">
          <li>A visual map of disk usage</li>
          <li>Large file and folder inspection</li>
          <li>Duplicate detection</li>
          <li>Local analysis, so files stay on the Mac</li>
        </ul>
        {macOSAvailable() ? null : (
          <p className="mt-4 text-sm text-white/50">
            These are planned features. They are not a download, and the Mac app is not released.
          </p>
        )}

        {macOSAvailable() ? (
          <a href={BUY_HREF} className="btn-primary mt-8 inline-flex !px-6 !py-3">
            Get {SITE.name} · {price.lifetimePrice}
          </a>
        ) : (
          <>
            <h2 className="mt-12 text-2xl font-semibold text-white">Get a note when it launches</h2>
            <p className="mt-3 text-sm text-white/70">
              There is no Mac download yet. Email {SITE.email} and we will reply when the macOS version is ready.
            </p>
            <a
              href={`mailto:${SITE.email}?subject=ScanMyDisk%20macOS`}
              className="btn-primary mt-6 inline-flex !px-6 !py-3"
            >
              Email about the macOS version
            </a>
          </>
        )}

        <p className="mt-10 text-sm text-white/70">
          Need the app today?{" "}
          <Link to="/windows" className="font-semibold text-sky-300 hover:text-sky-200">
            Windows — Available Now
          </Link>
        </p>
      </section>
    </JoinShell>
  );
}
