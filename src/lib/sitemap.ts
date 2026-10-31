import { posts as catalogPosts } from "@/data/blog";
import { guideStudy } from "@/lib/research/study";
import { absUrl } from "@/lib/seo";

export const SITEMAP_SHARD_LIMIT = 45_000;
export const SITEMAP_TTL_MS = 3_600_000;

/** Visible "updated" dates on the legal pages. Omit a date when the page has none. */
export const PAGE_LASTMOD: Record<string, string> = {
  "/privacy": "2026-10-13",
  "/terms": "2026-01-01",
  "/refund-policy": "2026-01-01",
};

const PAGE_PATHS = ["/", "/windows", "/macos", "/blog", "/contact", "/license", "/privacy", "/terms", "/refund-policy"];

const RESEARCH_PATHS = [
  { path: "/research", dated: true },
  { path: "/research/guides", dated: true },
] as const;

export type SitemapPost = {
  slug: string;
  date: string;
  draft?: boolean;
  noindex?: boolean;
};

export type SitemapUrl = {
  loc: string;
  lastmod?: string;
};

export type SitemapFile = {
  path: string;
  xml: string;
  urls: SitemapUrl[];
};

export type SitemapBuild = {
  index: SitemapFile;
  sections: SitemapFile[];
};

export type SitemapOptions = {
  posts?: readonly SitemapPost[];
  researchUpdated?: string;
  now?: string;
  shardLimit?: number;
};

const memory = new Map<string, { body: string; at: number }>();

function xmlEscape(value: string) {
  return value.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
}

export function xmlUnescape(value: string) {
  return value.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
}

export function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

export function usableLastmod(value: string | undefined, now: string) {
  if (!value || !isIsoDate(value) || value > now) return undefined;
  return value;
}

function publishedPosts(posts: readonly SitemapPost[], now: string) {
  const seen = new Set<string>();
  const published: SitemapPost[] = [];
  for (const post of posts) {
    if (post.draft || post.noindex) continue;
    if (!/^[a-z0-9-]+$/.test(post.slug)) continue;
    if (!usableLastmod(post.date, now)) continue;
    if (seen.has(post.slug)) continue;
    seen.add(post.slug);
    published.push(post);
  }
  return published;
}

function withLoc(path: string, lastmod: string | undefined, now: string): SitemapUrl {
  const url: SitemapUrl = { loc: absUrl(path) };
  const dated = usableLastmod(lastmod, now);
  if (dated) url.lastmod = dated;
  return url;
}

export function pageUrls(now: string): SitemapUrl[] {
  return PAGE_PATHS.map((path) => withLoc(path, PAGE_LASTMOD[path], now));
}

export function researchUrls(updated: string | undefined, now: string): SitemapUrl[] {
  return RESEARCH_PATHS.map((page) => withLoc(page.path, page.dated ? updated : undefined, now));
}

export function postUrls(posts: readonly SitemapPost[], now: string): SitemapUrl[] {
  return publishedPosts(posts, now).map((post) => withLoc(`/blog/${post.slug}`, post.date, now));
}

function maxLastmod(urls: SitemapUrl[]) {
  return urls.reduce<string | undefined>((latest, url) => {
    if (!url.lastmod) return latest;
    if (!latest || url.lastmod > latest) return url.lastmod;
    return latest;
  }, undefined);
}

function chunks<T>(items: T[], size: number) {
  if (items.length === 0) return [items];
  const parts: T[][] = [];
  for (let index = 0; index < items.length; index += size) parts.push(items.slice(index, index + size));
  return parts;
}

function sectionFiles(name: string, urls: SitemapUrl[], limit: number): { path: string; urls: SitemapUrl[] }[] {
  const parts = chunks(urls, limit);
  if (parts.length === 1) return [{ path: `/sitemap/${name}.xml`, urls: parts[0] }];
  return parts.map((urlsInShard, index) => ({ path: `/sitemap/${name}-${index + 1}.xml`, urls: urlsInShard }));
}

function urlset(urls: SitemapUrl[]) {
  const body = urls
    .map((url) => {
      const lastmod = url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : "";
      return `  <url>\n    <loc>${xmlEscape(url.loc)}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function indexXml(files: { path: string; urls: SitemapUrl[] }[]) {
  const body = files
    .map((file) => {
      const lastmod = maxLastmod(file.urls);
      const dated = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
      return `  <sitemap>\n    <loc>${xmlEscape(absUrl(file.path))}</loc>${dated}\n  </sitemap>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

export function buildSitemaps(options: SitemapOptions = {}): SitemapBuild {
  const now = options.now ?? new Date().toISOString().slice(0, 10);
  const posts = options.posts ?? catalogPosts.map((post) => ({ slug: post.slug, date: post.date }));
  const researchUpdated = options.posts === undefined && options.researchUpdated === undefined ? guideStudy().updated : options.researchUpdated;
  const limit = options.shardLimit ?? SITEMAP_SHARD_LIMIT;
  const groups = [
    ...sectionFiles("pages", pageUrls(now), limit),
    ...sectionFiles("research", researchUrls(researchUpdated, now), limit),
    ...sectionFiles("posts", postUrls(posts, now), limit),
  ];
  const sections = groups.map((group) => ({ ...group, xml: urlset(group.urls) }));
  return {
    index: { path: "/sitemap.xml", urls: sections.flatMap((section) => section.urls), xml: indexXml(sections) },
    sections,
  };
}

export function isSitemapRequest(pathname: string) {
  return pathname === "/sitemap.xml" || /^\/sitemap\/[a-z0-9-]+\.xml$/.test(pathname);
}

export function locsFromXml(xml: string): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = match[1].match(/<loc>([^<]*)<\/loc>/)?.[1];
    const lastmod = match[1].match(/<lastmod>([^<]*)<\/lastmod>/)?.[1];
    if (!loc) continue;
    const url: SitemapUrl = { loc: xmlUnescape(loc) };
    if (lastmod) url.lastmod = lastmod;
    urls.push(url);
  }
  return urls;
}

type CacheStore = Map<string, { body: string; at: number }>;

export function serveSitemap(
  pathname: string,
  nowMs = Date.now(),
  build: () => SitemapBuild = () => buildSitemaps(),
  store: CacheStore = memory,
  ttlMs = SITEMAP_TTL_MS,
): { status: number; body: string } | null {
  if (!isSitemapRequest(pathname)) return null;
  const cached = store.get(pathname);
  if (cached && nowMs - cached.at < ttlMs) return { status: 200, body: cached.body };
  try {
    const built = build();
    const entries = [built.index, ...built.sections];
    for (const entry of entries) store.set(entry.path, { body: entry.xml, at: nowMs });
    const match = entries.find((entry) => entry.path === pathname);
    if (!match) return { status: 404, body: "" };
    return { status: 200, body: match.xml };
  } catch (error) {
    console.error("sitemap render failed", error);
    if (cached) return { status: 200, body: cached.body };
    return { status: 503, body: "" };
  }
}
