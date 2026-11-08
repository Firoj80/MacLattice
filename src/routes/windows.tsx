import { useLocalPricing } from "@/components/local-pricing";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, X } from "lucide-react";
import { JoinShell } from "@/components/signup/join-shell";
import { JsonLd } from "@/components/json-ld";
import { JOIN_VIEWS } from "@/data/join";
import { PLATFORM_FAQ, SITE, availabilitySentence, macOSAvailable } from "@/data/site";
import { BUY_HREF } from "@/lib/buy";
import { faqJsonLd, pageHead, softwareJsonLd } from "@/lib/seo";

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
        <p className="mt-4 text-sm text-white/80">{availabilitySentence()}</p>
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <a
            href={BUY_HREF}
            data-ml-goal="checkout_click"
            data-ml-goal-plan="pro"
            className="btn-primary group !px-6 !py-3.5 !text-base"
          >
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

      <section className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="mb-2 text-xs font-semibold tracking-wider text-sky-400 uppercase">Comparison</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">How ScanMyDisk compares to alternatives</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
              Classic tools like WinDirStat and WizTree show raw file sizes. ScanMyDisk combines 8 interactive map modes, duplicate content hashing, and developer cache cleanup under a one-time $5 license.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 glass-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/5 text-xs font-semibold text-white/90">
                <tr>
                  <th className="px-5 py-4">Capability</th>
                  <th className="px-5 py-4 text-sky-400">ScanMyDisk</th>
                  <th className="px-5 py-4 text-white/70">WinDirStat</th>
                  <th className="px-5 py-4 text-white/70">WizTree</th>
                  <th className="px-5 py-4 text-white/70">TreeSize Free</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                <tr>
                  <td className="px-5 py-3.5 font-medium text-white">Visual Map Modes</td>
                  <td className="px-5 py-3.5 font-semibold text-sky-400">8 Views (Treemap, Sunburst, Flame, Bubbles, Mind Map, Folders, Top Sizes, Age Map)</td>
                  <td className="px-5 py-3.5 text-white/60">1 (Treemap)</td>
                  <td className="px-5 py-3.5 text-white/60">2 (Tree + Treemap)</td>
                  <td className="px-5 py-3.5 text-white/60">1 (Folder Tree)</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-white">Duplicate Detection</td>
                  <td className="px-5 py-3.5 font-semibold text-sky-400">
                    <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-sky-400" /> 3-Pass Content Hash</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> None</td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> None</td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> Paid tier only</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-white">Developer Presets (node_modules, Gradle, Docker VHDX)</td>
                  <td className="px-5 py-3.5 font-semibold text-sky-400">
                    <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-sky-400" /> Built-in</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-white">App Leftover Cleaner (AppData / ProgramData)</td>
                  <td className="px-5 py-3.5 font-semibold text-sky-400">
                    <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-sky-400" /> Yes</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-white">Scan Snapshots (Diff what grew)</td>
                  <td className="px-5 py-3.5 font-semibold text-sky-400">
                    <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-sky-400" /> Yes</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> Paid tier only</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-white">Live System Resource Monitor</td>
                  <td className="px-5 py-3.5 font-semibold text-sky-400">
                    <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-sky-400" /> CPU, RAM, Disk</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                  <td className="px-5 py-3.5 text-white/60"><X className="size-4 text-white/40 inline" /> No</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-medium text-white">Pricing Model</td>
                  <td className="px-5 py-3.5 font-bold text-sky-400">{price.lifetimePrice} Lifetime (one-time)</td>
                  <td className="px-5 py-3.5 text-white/70">Free (open-source)</td>
                  <td className="px-5 py-3.5 text-white/70">Free for personal use</td>
                  <td className="px-5 py-3.5 text-white/70">Free / $29.95+ Pro</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
            <h3 className="text-xl font-bold text-white">Ready to reclaim your Windows SSD?</h3>
            <p className="max-w-md text-sm text-white/70">15-day refund guarantee. Runs 100% offline. Files stay on your machine.</p>
            <a
              href={BUY_HREF}
              data-ml-goal="checkout_click"
              data-ml-goal-plan="pro"
              className="btn-primary group !px-7 !py-3.5 !text-base"
            >
              <span>Get {SITE.name} for Windows · {price.lifetimePrice}</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </JoinShell>
  );
}
