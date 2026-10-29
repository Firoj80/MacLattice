import { posts } from "@/data/blog";
import { JOIN_FAQ, JOIN_VIEWS } from "@/data/join";
import { SITE, availabilitySentence, macOSAvailable } from "@/data/site";
import { HOME_DESCRIPTION } from "@/lib/seo";
import { absoluteLinks, bullets, linkList, pageDoc } from "@/lib/md/format";
import { blogSeoDescription } from "@/data/blog-seo";
import { defaultGuides, guideListLede, guideListTitle, guideStudy, productStudy, researchStudies, sortGuides, studyMarkdown } from "@/lib/research/study";

export type MarkdownPage = {
  path: string;
  title: string;
  summary: string;
  group: "core" | "guides" | "legal" | "research";
  updated?: string;
  markdown: string;
};

const windowsFeatures = [
  "Disk usage analyzer for Windows 11 and Windows 10",
  "Storage visualizer with " + JOIN_VIEWS.length + " views, including a treemap",
  "Find large files and folders on a Windows PC",
  "Duplicate detection that compares file contents",
  "Saved scan comparison so you can see what grew",
  "Cleanup stays on the device. Files are not uploaded",
];

const hogs = [
  ["System Data", "caches, logs, snapshots, temp files", "Hidden system folders that won't explain themselves."],
  ["Build caches", "Visual Studio, Gradle, old installers", "Every build leaves gigabytes behind. Safe to clear once reviewed."],
  ["Docker disk image", "Docker Desktop VHDX", "One virtual disk file that can quietly grow to tens of gigabytes."],
  ["node_modules", "one in every repo you've cloned", "Hundreds of copies across old projects. Find them in one scan."],
  ["Duplicate files", "photos, videos, downloads", "Same file, multiple copies. Keep the keeper and delete the rest."],
  ["Uninstall leftovers", "AppData and ProgramData", "Uninstalling an app often leaves residual caches and telemetry."],
];

const toolkit = [
  ["Storage map", "Scan a full PC, a user profile, or any folder. Explore a treemap sized by disk usage, inspect files, and review selected items in Cleanup Queue before removing them."],
  ["Applications", "Browse installed apps with measured sizes. For supported apps, launch the Windows or vendor uninstaller and choose whether to keep app data or review leftovers."],
  ["Duplicates", "Find identical files with three-pass content hashing. Choose a copy to keep, then review the redundant copies in Cleanup Queue."],
  ["Snapshots", "Save a scan snapshot and compare earlier and later scans of the same location."],
  ["Live monitor", "Watch CPU usage, memory pressure, network rates, and free volume space."],
];

function home(): MarkdownPage {
  const path = "/";
  const body = [
    availabilitySentence(),
    "",
    `Catalogue price: ${SITE.lifetimePrice} early bird for the first ${SITE.earlyBirdLimit} licenses, then ${SITE.regularPrice}. One payment. No subscription and no account. Checkout may show a local currency.`,
    "",
    "Scanning stays on the device.",
    "",
    "## Where the space goes",
    "",
    hogs.map(([title, kind, bodyText]) => `### ${title}\n\n${kind}. ${bodyText}`).join("\n\n"),
    "",
    "## Scan. See. Clear.",
    "",
    toolkit.map(([title, bodyText]) => `### ${title}\n\n${bodyText}`).join("\n\n"),
    "",
    `## ${JOIN_VIEWS.length} views`,
    "",
    JOIN_VIEWS.map((view) => `- **${view.name}.** ${view.body}`).join("\n"),
    "",
    "## Questions",
    "",
    JOIN_FAQ.map((item) => `### ${item.q}\n\n${item.a}`).join("\n\n"),
    "",
    "## Guides",
    "",
    linkList([
      { title: "Uninstall apps properly", path: "/blog/clean-appdata-programdata-leftovers-windows", summary: "Remove an app and the residual caches it leaves behind." },
      { title: "Free up space", path: "/blog/find-delete-duplicate-files-windows-content-hashing", summary: "Where a full disk actually goes, and how to get the space back." },
      { title: "Inspect System Data", path: "/blog/shrink-docker-wsl2-ext4-vhdx-windows", summary: "What the hidden system folders hold, and which ones you can delete." },
      { title: "All guides", path: "/blog", summary: "Windows and Mac storage guides." },
    ]),
  ].join("\n");
  return {
    path,
    title: "ScanMyDisk",
    summary: HOME_DESCRIPTION,
    group: "core",
    markdown: pageDoc({
      title: "ScanMyDisk",
      summary: HOME_DESCRIPTION,
      path,
      body,
      related: [
        { title: "Windows", path: "/windows" },
        { title: "macOS", path: "/macos" },
        { title: "Guides", path: "/blog" },
      ],
    }),
  };
}

function windows(): MarkdownPage {
  const path = "/windows";
  const summary = "ScanMyDisk is a Windows disk space analyzer and storage visualizer for Windows 10 and Windows 11. Find large files, duplicates and caches. macOS version coming soon.";
  const body = [
    "ScanMyDisk is a visual disk space analyzer and storage visualizer for Windows 10 and Windows 11. See what is using the disk, find large files, duplicates and caches, and review cleanup before anything is removed.",
    "",
    availabilitySentence(),
    "",
    `Catalogue price: ${SITE.lifetimePrice} early bird for the first ${SITE.earlyBirdLimit} licenses, then ${SITE.regularPrice}.`,
    "",
    "## What the Windows app does",
    "",
    bullets(windowsFeatures),
    "",
    `## ${JOIN_VIEWS.length} views`,
    "",
    JOIN_VIEWS.map((view) => `- **${view.name}.** ${view.body}`).join("\n"),
  ].join("\n");
  return {
    path,
    title: "Windows disk space analyzer",
    summary,
    group: "core",
    markdown: pageDoc({
      title: "Windows disk space analyzer",
      summary,
      path,
      body,
      related: [
        { title: "Home", path: "/" },
        { title: "macOS", path: "/macos" },
      ],
    }),
  };
}

function macos(): MarkdownPage {
  const path = "/macos";
  const ready = macOSAvailable();
  const title = ready ? "ScanMyDisk for macOS" : "ScanMyDisk for macOS — Coming Soon";
  const summary = ready
    ? "ScanMyDisk is a visual disk space analyzer for macOS and Windows. See what is using disk space, including large files, duplicates and caches."
    : "ScanMyDisk for macOS is coming soon. The visual disk space analyzer is available now for Windows 10 and Windows 11.";
  const body = [
    ready
      ? "The macOS version is available."
      : "The macOS version is in development and is not available yet.",
    "",
    availabilitySentence(),
    "",
    ready ? "## What it includes" : "## What the Mac version is planned to include",
    "",
    bullets([
      "A visual map of disk usage",
      "Large file and folder inspection",
      "Duplicate detection",
      "Local analysis, so files stay on the Mac",
    ]),
    "",
    ready
      ? `Catalogue price: ${SITE.lifetimePrice} early bird for the first ${SITE.earlyBirdLimit} licenses, then ${SITE.regularPrice}.`
      : "These are planned features. They are not a download, and the Mac app is not released. Email support@scanmydisk.com to be told when it is ready.",
  ].join("\n");
  return {
    path,
    title,
    summary,
    group: "core",
    markdown: pageDoc({
      title,
      summary,
      path,
      body,
      related: [
        { title: "Windows", path: "/windows" },
        { title: "Home", path: "/" },
      ],
    }),
  };
}

function blogIndex(): MarkdownPage {
  const path = "/blog";
  const guides = defaultGuides();
  const title = guideListTitle(guides);
  const summary = guideListLede(guides);
  const items = sortGuides(guides).map((post) => ({
    title: post.title,
    path: `/blog/${post.slug}`,
    summary: posts.find((item) => item.slug === post.slug)?.excerpt,
  }));
  return {
    path,
    title,
    summary,
    group: "guides",
    updated: guideStudy(guides).updated,
    markdown: pageDoc({
      title,
      summary,
      path,
      updated: guideStudy(guides).updated,
      body: linkList(items),
      related: [
        { title: "Guide statistics", path: "/research/guides" },
        { title: "Home", path: "/" },
      ],
    }),
  };
}

function blogPost(slug: string): MarkdownPage | undefined {
  const post = posts.find((item) => item.slug === slug);
  if (!post) return;
  const path = `/blog/${post.slug}`;
  const summary = blogSeoDescription(post.slug, post.excerpt);
  const body = [
    `By ${post.author}. Published ${post.date}.`,
    "",
    absoluteLinks(post.body),
  ].join("\n");
  return {
    path,
    title: post.title,
    summary,
    group: "guides",
    updated: post.date,
    markdown: pageDoc({
      title: post.title,
      summary,
      path,
      updated: post.date,
      body,
      related: [
        { title: "All guides", path: "/blog" },
        { title: "Home", path: "/" },
      ],
    }),
  };
}

function contact(): MarkdownPage {
  const path = "/contact";
  const summary = `Get in touch with the ${SITE.name} team for technical support, licence help, or refund requests.`;
  const body = [
    `Email [${SITE.email}](mailto:${SITE.email}) for installation help, bug reports, and general feedback. A typical reply is under 24 hours.`,
    "",
    `Refunds: email ${SITE.email} within 15 days with the order ID. See the refund policy.`,
  ].join("\n");
  return {
    path,
    title: "Contact",
    summary,
    group: "core",
    markdown: pageDoc({
      title: "Contact",
      summary,
      path,
      body,
      related: [{ title: "Refund policy", path: "/refund-policy" }],
    }),
  };
}

function license(): MarkdownPage {
  const path = "/license";
  const summary = "Download the latest Windows installer or recover your lifetime license key.";
  const body = [
    `Download the Windows 10 and 11 setup from ${SITE.origin}/api/download. The page lists version 0.1.5, a native x64 build, with offline scanning.`,
    "",
    "If Windows SmartScreen appears, choose More info, then Run anyway.",
    "",
    "Recover the lifetime key in the customer portal with the purchase email: open the portal, enter the checkout email, use the link sent to that inbox, then paste the key on first launch.",
    "",
    "A licence is active on one PC at a time. Deactivate it to move machines.",
  ].join("\n");
  return {
    path,
    title: "Your licence and downloads",
    summary,
    group: "core",
    markdown: pageDoc({
      title: "Your licence and downloads",
      summary,
      path,
      body,
      related: [{ title: "Contact", path: "/contact" }],
    }),
  };
}

function terms(): MarkdownPage {
  const path = "/terms";
  const summary = "Scan My Disk terms of service. One-time purchase, lifetime access, 15-day money-back guarantee.";
  const body = [
    `## 1. Acceptance of Terms\n\nBy downloading, installing, or using ${SITE.name}, you agree to these Terms of Service. If you do not agree, do not use the software.`,
    `## 2. License Grant\n\n${SITE.name} grants a revocable, non-exclusive, non-transferable license to use the software for personal or commercial purposes in accordance with the purchased license.`,
    `## 3. Pro License\n\n- Fees: one-time payment of ${SITE.lifetimePrice}.\n- Lifetime access to current features and future updates.\n- Refunds: 15-day money-back guarantee.`,
    `## 4. Disclaimer of Warranties\n\nThe software is provided "as is" without warranty of any kind. You use it at your own risk. ${SITE.name} is not responsible for data loss from the deletion features.`,
    "## 5. Governing Law\n\nThese terms are governed by the laws of India, without regard to conflict of law provisions.",
  ].join("\n\n");
  return {
    path,
    title: "Terms of Service",
    summary,
    group: "legal",
    updated: "2026-01-01",
    markdown: pageDoc({ title: "Terms of Service", summary, path, updated: "2026-01-01", body }),
  };
}

function privacy(): MarkdownPage {
  const path = "/privacy";
  const summary = "Scan My Disk privacy policy. Your files never leave your Windows PC — all scanning happens 100% locally.";
  const body = [
    `${SITE.name} explains here how information is handled in the desktop application and on the website.`,
    `## 2. Data we don't collect\n\nScanned results stay on the machine. File names, folder structures, and scan results are not uploaded. The app analyzes metadata such as size and type locally and does not read document contents.`,
    `## 3. Data we collect\n\n- Payment information is processed by Dodo Payments. Card details are not stored by ${SITE.name}.\n- License keys are used to validate the lifetime license.\n- Email is used to send license keys and product updates.`,
    "## 4. Website analytics\n\nDataFast records page paths, referring websites, browser and device information, and visitor and session identifiers. Analytics requests expose network information such as IP address to that service. License keys, purchase email, scanned files, and checkout order query parameters are not sent as analytics events. The DataFast visitor identifier is passed to Dodo Payments in checkout metadata so a completed payment can be attributed to a referring website.",
    "## 5. Third-party services\n\n- Dodo Payments: payment processing and license management.\n- DataFast: website traffic and navigation analytics.",
    `## 6. Contact\n\nQuestions about this policy: [${SITE.email}](mailto:${SITE.email}).`,
  ].join("\n\n");
  return {
    path,
    title: "Privacy Policy",
    summary,
    group: "legal",
    updated: "2026-10-13",
    markdown: pageDoc({ title: "Privacy Policy", summary, path, updated: "2026-10-13", body }),
  };
}

function refunds(): MarkdownPage {
  const path = "/refund-policy";
  const summary = "Scan My Disk refund policy. 15-day money-back guarantee, no questions asked.";
  const body = [
    `If you are not happy with ${SITE.name}, you can have a full refund within 15 days of the initial purchase.`,
    `## How to request a refund\n\nEmail [${SITE.email}](mailto:${SITE.email}) with the order ID or the purchase email, and a brief reason.`,
    "## Processing time\n\nRefunds are typically processed within 3-5 business days, back to the original payment method.",
  ].join("\n\n");
  return {
    path,
    title: "Refund Policy",
    summary,
    group: "legal",
    updated: "2026-01-01",
    markdown: pageDoc({ title: "Refund Policy", summary, path, updated: "2026-01-01", body }),
  };
}

function researchPage(study: ReturnType<typeof guideStudy>, related: { title: string; path: string }[]): MarkdownPage {
  return {
    path: study.path,
    title: study.title,
    summary: study.description,
    group: "research",
    updated: study.updated,
    markdown: pageDoc({
      title: study.title,
      summary: study.description,
      path: study.path,
      updated: study.updated,
      body: studyMarkdown(study),
      related,
    }),
  };
}

function researchIndex(): MarkdownPage {
  const studies = researchStudies();
  const path = "/research";
  const summary = "Counts from ScanMyDisk's public guide catalog and product feature list. Not disk-scan telemetry.";
  return {
    path,
    title: "ScanMyDisk Research",
    summary,
    group: "research",
    updated: studies.find((study) => study.updated)?.updated,
    markdown: pageDoc({
      title: "ScanMyDisk Research",
      summary,
      path,
      updated: studies.find((study) => study.updated)?.updated,
      body: linkList(studies.map((study) => ({ title: study.title, path: study.path, summary: study.summary }))),
      related: studies.map((study) => ({ title: study.title, path: study.path })),
    }),
  };
}

function researchGuides(): MarkdownPage {
  return researchPage(guideStudy(), [
    { title: "All guides", path: "/blog" },
    { title: "Product facts", path: "/research/product" },
  ]);
}

function researchProduct(): MarkdownPage {
  return researchPage(productStudy(), [
    { title: "Guide statistics", path: "/research/guides" },
    { title: "Home", path: "/" },
  ]);
}

const STATIC: Record<string, () => MarkdownPage> = {
  "/": home,
  "/windows": windows,
  "/macos": macos,
  "/blog": blogIndex,
  "/research": researchIndex,
  "/research/guides": researchGuides,
  "/research/product": researchProduct,
  "/contact": contact,
  "/license": license,
  "/terms": terms,
  "/privacy": privacy,
  "/refund-policy": refunds,
};

export function renderMarkdownPage(pathname: string): MarkdownPage | undefined {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const staticPage = STATIC[path];
  if (staticPage) return staticPage();
  if (path.startsWith("/blog/")) return blogPost(path.slice("/blog/".length));
  return undefined;
}

export function listMarkdownPages(): MarkdownPage[] {
  const pages = Object.keys(STATIC).map((path) => STATIC[path]());
  const guides = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => blogPost(post.slug))
    .filter((page): page is MarkdownPage => Boolean(page));
  return [...pages.filter((page) => page.group === "core"), ...pages.filter((page) => page.group === "research"), ...pages.filter((page) => page.group === "guides"), ...guides, ...pages.filter((page) => page.group === "legal")];
}

/** Public HTML routes that must have a renderer, plus routes we deliberately skip. */
export const COVERED_PATHS = ["/", "/windows", "/macos", "/blog", "/research", "/research/guides", "/research/product", "/contact", "/license", "/terms", "/privacy", "/refund-policy"] as const;

export const SKIPPED_PATHS: { path: string; reason: string }[] = [
  { path: "/pricing", reason: "301 to /#pricing. Pricing is on the homepage markdown." },
  { path: "/pay", reason: "301 to /#pricing." },
  { path: "/login", reason: "301 to /buy." },
  { path: "/signup", reason: "301 to /buy." },
  { path: "/buy", reason: "Checkout redirect. Disallowed in robots.txt." },
  { path: "/thanks", reason: "noindex purchase receipt." },
  { path: "/post-views", reason: "noindex private view counts." },
];
