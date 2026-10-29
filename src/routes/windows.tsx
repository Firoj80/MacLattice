import { useLocalPricing } from "@/components/local-pricing";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { JoinShell } from "@/components/signup/join-shell";
import { JsonLd } from "@/components/json-ld";
import { JOIN_VIEWS } from "@/data/join";
import { PLATFORM_FAQ, SITE, availabilitySentence, macOSAvailable } from "@/data/site";
import { BUY_HREF } from "@/lib/buy";
import { faqJsonLd, pageHead, softwareJsonLd } from "@/lib/seo";
import { AtAGlance } from "@/components/at-a-glance";
import { windowsGlanceRows } from "@/lib/research/study";

const TITLE = "Windows Disk Space Analyzer | ScanMyDisk";
const DESCRIPTION = `ScanMyDisk is a Windows disk space analyzer and storage visualizer for Windows 10 and Windows 11 with ${JOIN_VIEWS.length} views. Find large files, duplicates and caches. macOS version coming soon.`;

export const Route = createFileRoute("/windows")({
  component: WindowsPage,
  head: () =>
    pageHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/windows",
    }),
});

const SHOTS = [
  {
    src: "/windows-real-scan.webp",
    alt: "ScanMyDisk Windows disk analyzer treemap",
    caption: "Treemap of a real Windows scan",
  },
  {
    src: "/windows-features/applications.webp",
    alt: "ScanMyDisk storage visualizer on Windows 11",
    caption: "Installed applications on Windows 11",
  },
  {
    src: "/windows-features/monitor.webp",
    alt: "ScanMyDisk Windows disk usage monitor",
    caption: "Live disk and system monitor",
  },
  {
    src: "/windows-features/duplicates.webp",
    alt: "ScanMyDisk Windows duplicate file review",
    caption: "Duplicate groups on Windows",
  },
] as const;

function WindowsPage() {
  const price = useLocalPricing();
  return (
    <JoinShell>
      <JsonLd data={softwareJsonLd()} />
      <JsonLd data={faqJsonLd(PLATFORM_FAQ)} />
      <section className="glow-ambient mx-auto max-w-6xl px-6 pt-16 pb-12">
        <p className="mb-3 text-xs font-semibold tracking-wider text-sky-400 uppercase">Available now</p>
        <h1 className="text-gradient max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Windows disk space analyzer
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-white/70">
          ScanMyDisk is a visual disk space analyzer and storage visualizer for Windows 10 and Windows 11.
          See what is using the disk, find large files, duplicates and caches, and review cleanup before anything is removed.
        </p>
        <div className="mt-6 max-w-2xl">
          <AtAGlance rows={windowsGlanceRows()} />
          <p className="mt-3 text-sm text-white/60">
            <a href="/research/product" className="underline-offset-2 hover:underline">Product facts</a>
          </p>
        </div>
        <p className="mt-4 text-sm text-white/80">{availabilitySentence()}</p>
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <a href={BUY_HREF} className="btn-primary group !px-6 !py-3.5 !text-base">
            <span>Get {SITE.name} for Windows · {price.lifetimePrice}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
          <Link to="/macos" className="text-sm font-medium text-white/70 hover:text-white">
            macOS — {macOSAvailable() ? "Available Now" : "Coming Soon"}
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 sm:grid-cols-2">
        {SHOTS.map((shot) => (
          <figure key={shot.src} className="glass-card overflow-hidden rounded-2xl border border-white/10 p-2">
            <img src={shot.src} alt={shot.alt} width={1200} height={750} loading="lazy" decoding="async" className="h-auto w-full rounded-xl" />
            <figcaption className="px-3 py-2 text-xs text-muted">{shot.caption}</figcaption>
          </figure>
        ))}
      </section>

      <section className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-3xl font-bold text-white">What the Windows app does</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Disk usage analyzer for Windows 11 and Windows 10",
              "Storage visualizer with " + JOIN_VIEWS.length + " views, including a treemap",
              "Find large files and folders on a Windows PC",
              "Duplicate detection that compares file contents",
              "Saved scan comparison so you can see what grew",
              "Cleanup stays on the device. Files are not uploaded",
            ].map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-white/80">
                <Check className="mt-0.5 size-4 shrink-0 text-sky-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {JOIN_VIEWS.map((view) => (
              <figure key={view.name} className="overflow-hidden rounded-xl border border-white/10">
                <img
                  src={view.image}
                  alt={`ScanMyDisk Windows disk usage ${view.name} view`}
                  width={560}
                  height={350}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover object-top"
                />
                <figcaption className="px-3 py-2 text-sm font-medium text-white">{view.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </JoinShell>
  );
}
