import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { posts } from "../src/data/blog.ts";
import { submitToIndexNow, urlsToSubmit } from "../src/lib/indexnow.ts";
import {
  PAGE_LASTMOD,
  buildSitemaps,
  isIsoDate,
  locsFromXml,
  serveSitemap,
} from "../src/lib/sitemap.ts";

const HOST = "https://www.scanmydisk.com";
const EXCLUDED = [
  "/buy",
  "/thanks",
  "/post-views",
  "/pay",
  "/pricing",
  "/signup",
  "/login",
  "/blog/grandperspective-vs-dissectmac",
  "/api/checkout",
  "/llms.txt",
  "/robots.txt",
];

const MONTHS = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

function isoFromUpdated(source) {
  const text = source.match(/updated="([^"]+)"/)?.[1];
  assert.ok(text);
  const [month, day, year] = text.replace(",", "").split(" ");
  return `${year}-${MONTHS[month.toLowerCase()]}-${day.padStart(2, "0")}`;
}

function assertSitemap(xml, now) {
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.doesNotMatch(xml, /changefreq|priority/);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(locs).size, locs.length);
  for (const loc of locs) {
    assert.match(loc, new RegExp(`^${HOST.replaceAll(".", "\\.")}(?:/|$)`));
    assert.equal(loc.includes("?"), false);
    assert.equal(loc.endsWith(".md"), false);
  }
  for (const lastmod of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
    assert.equal(isIsoDate(lastmod[1]), true);
    assert.equal(lastmod[1] <= now, true);
  }
  return locs;
}

test("legal lastmod matches the date printed on the page", () => {
  const files = {
    "/privacy": "src/routes/privacy.tsx",
    "/terms": "src/routes/terms.tsx",
    "/refund-policy": "src/routes/refund-policy.tsx",
  };
  for (const [path, file] of Object.entries(files)) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    assert.equal(isoFromUpdated(source), PAGE_LASTMOD[path]);
  }
});

test("fixture sections are valid and skip drafts, noindex, and future posts", () => {
  const now = "2026-10-29";
  const built = buildSitemaps({
    now,
    researchUpdated: "2026-05-02",
    posts: [
      { slug: "public-guide", date: "2024-01-02" },
      { slug: "public-guide", date: "2024-01-02" },
      { slug: "draft-guide", date: "2024-01-03", draft: true },
      { slug: "hidden-guide", date: "2024-01-04", noindex: true },
      { slug: "scheduled-guide", date: "2999-01-01" },
      { slug: "bad slug", date: "2024-01-05" },
    ],
  });
  assert.match(built.index.xml, /<sitemapindex /);
  const indexLocs = assertSitemap(built.index.xml, now);
  assert.deepEqual(indexLocs, built.sections.map((section) => `${HOST}${section.path}`));
  const urls = built.sections.flatMap((section) => locsFromXml(section.xml));
  const locs = urls.map((url) => url.loc);
  assert.equal(locs.filter((loc) => loc === `${HOST}/blog/public-guide`).length, 1);
  assert.equal(locs.some((loc) => loc.includes("draft-guide")), false);
  assert.equal(locs.some((loc) => loc.includes("hidden-guide")), false);
  assert.equal(locs.some((loc) => loc.includes("scheduled-guide")), false);
  assert.equal(locs.includes(`${HOST}/research/product`), true);
  const product = built.sections.find((section) => section.path === "/sitemap/research.xml").xml;
  assert.match(product, new RegExp(`<loc>${HOST}/research/guides</loc>\\s*<lastmod>2026-05-02</lastmod>`));
  assert.doesNotMatch(product, new RegExp(`<loc>${HOST}/research/product</loc>\\s*<lastmod>`));
  const pages = built.sections.find((section) => section.path === "/sitemap/pages.xml").xml;
  assert.doesNotMatch(pages, new RegExp(`<loc>${HOST}/</loc>\\s*<lastmod>`));
  assert.match(pages, new RegExp(`<loc>${HOST}/privacy</loc>\\s*<lastmod>2026-10-13</lastmod>`));
  for (const section of built.sections) assertSitemap(section.xml, now);
});

test("sections shard after 45,000 urls", () => {
  const posts = Array.from({ length: 5 }, (_, index) => ({ slug: `guide-${index}`, date: "2024-01-02" }));
  const built = buildSitemaps({ posts, now: "2026-01-01", researchUpdated: "2024-01-02", shardLimit: 2 });
  const paths = built.sections.map((section) => section.path);
  assert.deepEqual(
    paths.filter((path) => path.startsWith("/sitemap/posts")),
    ["/sitemap/posts-1.xml", "/sitemap/posts-2.xml", "/sitemap/posts-3.xml"],
  );
  assert.equal(built.sections.find((section) => section.path === "/sitemap/posts-3.xml").urls.length, 1);
});

test("live sitemap lists the public catalog only", () => {
  const now = new Date().toISOString().slice(0, 10);
  const built = buildSitemaps({ now });
  const urls = built.sections.flatMap((section) => section.urls);
  const locs = urls.map((url) => url.loc);
  assert.equal(new Set(locs).size, locs.length);
  assert.equal(locs.filter((loc) => loc.includes("/blog/")).length, posts.length);
  assert.equal(built.sections.find((section) => section.path === "/sitemap/pages.xml").urls.length, 9);
  assert.equal(built.sections.find((section) => section.path === "/sitemap/research.xml").urls.length, 3);
  assert.equal(built.sections.find((section) => section.path === "/sitemap/posts.xml").urls.length, posts.length);
  for (const path of EXCLUDED) assert.equal(locs.includes(path.startsWith("http") ? path : `${HOST}${path}`), false);
  for (const url of urls) {
    assert.match(url.loc, /^https:\/\/www\.scanmydisk\.com\//);
    if (url.lastmod) {
      assert.equal(isIsoDate(url.lastmod), true);
      assert.equal(url.lastmod <= now, true);
    }
  }
  for (const section of [built.index, ...built.sections]) assertSitemap(section.xml, now);
  assert.match(built.index.xml, /<loc>https:\/\/www\.scanmydisk\.com\/sitemap\/posts\.xml<\/loc>\s*<lastmod>2026-10-15<\/lastmod>/);
});

test("a failed rebuild keeps the last sitemap and never returns an empty 200", () => {
  const store = new Map();
  let calls = 0;
  const ok = () => {
    calls += 1;
    return buildSitemaps({
      now: "2026-01-01",
      researchUpdated: "2024-01-02",
      posts: [{ slug: "public-guide", date: "2024-01-02" }],
    });
  };
  const first = serveSitemap("/sitemap/posts.xml", 0, ok, store, 1000);
  const second = serveSitemap("/sitemap/posts.xml", 500, ok, store, 1000);
  assert.equal(calls, 1);
  assert.equal(second.status, 200);
  assert.match(second.body, /public-guide/);
  const failed = serveSitemap("/sitemap/posts.xml", 5000, () => {
    throw new Error("catalog down");
  }, store, 1000);
  assert.equal(failed.status, 200);
  assert.equal(failed.body, first.body);
  const empty = serveSitemap("/sitemap/pages.xml", 0, () => {
    throw new Error("catalog down");
  }, new Map(), 1000);
  assert.equal(empty.status, 503);
  assert.equal(empty.body, "");
});

test("indexnow diffs one updated guide and stays quiet outside production", async () => {
  const current = buildSitemaps().sections.flatMap((section) => section.urls);
  const target = `${HOST}/blog/system-data-mystery`;
  const previous = current.map((url) => (url.loc === target ? { ...url, lastmod: "2025-01-01" } : url));
  const urls = urlsToSubmit(previous, current);
  assert.equal(urls[0], target);
  for (const path of ["/blog", "/research", "/research/guides"]) assert.equal(urls.includes(`${HOST}${path}`), true);
  const fetchImpl = async () => {
    throw new Error("should not be called");
  };
  const local = await submitToIndexNow(urls, { env: "preview", fetchImpl });
  assert.equal(local.skipped, "not-production");
  const posted = [];
  const production = await submitToIndexNow(urls, {
    env: "production",
    key: "a".repeat(32),
    fetchImpl: async (_endpoint, init) => {
      posted.push(JSON.parse(init.body));
      return { ok: false, status: 500 };
    },
  });
  assert.equal(production.skipped, null);
  assert.equal(posted.length, 1);
  assert.equal(posted[0].host, "www.scanmydisk.com");
  assert.equal(posted[0].keyLocation, `${HOST}/${"a".repeat(32)}.txt`);
  assert.deepEqual(posted[0].urlList, urls);
  const dry = await submitToIndexNow([target], { dryRun: true, key: "b".repeat(32) });
  assert.equal(dry.skipped, "dry-run");
  assert.equal(dry.batches[0].urlList[0], target);
});
