import { SITE } from "@/data/site";
import { buildSitemaps, locsFromXml, type SitemapUrl } from "@/lib/sitemap";

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const INDEXNOW_BATCH = 10_000;

const LISTING_PATHS = ["/blog", "/research", "/research/guides"];

export function indexNowKeyBody(pathname: string, key = process.env.INDEXNOW_KEY ?? "") {
  if (!/^[a-f0-9]{32}$/.test(key)) return null;
  if (pathname !== `/${key}.txt`) return null;
  return key;
}

export function indexNowBody(urls: string[], key: string) {
  const host = new URL(SITE.origin).host;
  return {
    host,
    key,
    keyLocation: `${SITE.origin}/${key}.txt`,
    urlList: urls,
  };
}

export function urlsToSubmit(previous: readonly SitemapUrl[], next: readonly SitemapUrl[]) {
  const before = new Map(previous.map((url) => [url.loc, url.lastmod ?? ""]));
  const after = new Map(next.map((url) => [url.loc, url.lastmod ?? ""]));
  const changed: string[] = [];
  for (const [loc, lastmod] of after) {
    if (before.get(loc) !== lastmod) changed.push(loc);
  }
  for (const loc of before.keys()) {
    if (!after.has(loc)) changed.push(loc);
  }
  const postTouched = changed.some((loc) => /\/blog\/[^/]+$/.test(loc));
  if (postTouched) {
    for (const path of LISTING_PATHS) {
      const loc = `${SITE.origin}${path}`;
      if (!changed.includes(loc)) changed.push(loc);
    }
  }
  return changed;
}

function chunk<T>(items: T[], size: number) {
  const parts: T[][] = [];
  for (let index = 0; index < items.length; index += size) parts.push(items.slice(index, index + size));
  return parts;
}

export async function submitToIndexNow(
  urls: string[],
  options: {
    dryRun?: boolean;
    fetchImpl?: typeof fetch;
    key?: string;
    env?: string;
    batchSize?: number;
  } = {},
) {
  const env = options.env ?? process.env.VERCEL_ENV;
  const dryRun = options.dryRun === true;
  if (!dryRun && env !== "production") return { skipped: "not-production", batches: [] };
  const key = options.key ?? process.env.INDEXNOW_KEY ?? "";
  if (!/^[a-f0-9]{32}$/.test(key)) {
    console.error("IndexNow skipped: INDEXNOW_KEY is missing or not 32 hex characters");
    return { skipped: "bad-key", batches: [] };
  }
  const batches = chunk([...new Set(urls)], options.batchSize ?? INDEXNOW_BATCH).map((urlList) => indexNowBody(urlList, key));
  if (dryRun) {
    for (const body of batches) console.log(`IndexNow dry-run ${JSON.stringify(body)}`);
    return { skipped: "dry-run", batches };
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  for (const body of batches) {
    try {
      const response = await fetchImpl(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
      });
      if (!response.ok) console.error(`IndexNow failed: ${response.status}`);
    } catch (error) {
      console.error("IndexNow failed", error);
    }
  }
  return { skipped: null, batches };
}

async function fetchText(url: string) {
  try {
    const response = await fetch(url, { headers: { accept: "application/xml" } });
    return { status: response.status, text: await response.text() };
  } catch (error) {
    console.error("IndexNow could not fetch", url, error);
    return null;
  }
}

export async function fetchPublishedUrls(origin = SITE.origin): Promise<SitemapUrl[] | null> {
  const index = await fetchText(`${origin}/sitemap.xml`);
  if (!index) return null;
  if (index.status === 404) return [];
  if (index.status !== 200) return null;
  if (index.text.includes("<sitemapindex")) {
    const locs = [...index.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const urls: SitemapUrl[] = [];
    for (const loc of locs) {
      const section = await fetchText(loc);
      if (!section || section.status !== 200) return null;
      urls.push(...locsFromXml(section.text));
    }
    return urls;
  }
  return locsFromXml(index.text);
}

/** Guides change in source. A production deploy is the publish, update, and delete path. */
export async function pingProductionIndexNow() {
  if (process.env.VERCEL_ENV !== "production") {
    console.log("IndexNow skipped: not production");
    return;
  }
  try {
    const current = buildSitemaps().sections.flatMap((section) => section.urls);
    const previous = await fetchPublishedUrls();
    if (!previous) {
      console.error("IndexNow skipped: could not read the live sitemap");
      return;
    }
    const urls = urlsToSubmit(previous, current);
    if (urls.length === 0) {
      console.log("IndexNow: no content changes");
      return;
    }
    await submitToIndexNow(urls);
  } catch (error) {
    console.error("IndexNow failed", error);
  }
}
