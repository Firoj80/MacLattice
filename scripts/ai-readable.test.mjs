import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { prefersMarkdown, markdownPathFor } from "../src/lib/md/negotiate.ts";
import { COVERED_PATHS, SKIPPED_PATHS, listMarkdownPages, renderMarkdownPage } from "../src/lib/md/registry.ts";
import { posts } from "../src/data/blog.ts";
import { robotsTxt } from "../src/lib/md/discovery.ts";

test("accept negotiation keeps browsers on HTML", () => {
  assert.equal(prefersMarkdown(null), false);
  assert.equal(prefersMarkdown("*/*"), false);
  assert.equal(prefersMarkdown("text/html,application/xhtml+xml"), false);
  assert.equal(prefersMarkdown("text/markdown, text/html;q=0.9"), true);
  assert.equal(prefersMarkdown("text/html, text/markdown"), false);
  assert.equal(prefersMarkdown("text/markdown"), true);
  assert.equal(markdownPathFor("/"), "/index.md");
  assert.equal(markdownPathFor("/windows/"), "/windows.md");
  assert.equal(markdownPathFor("/thanks"), null);
  assert.equal(markdownPathFor("/blog/example"), "/blog/example.md");
});

test("every covered public page has a markdown renderer", () => {
  for (const path of COVERED_PATHS) {
    const page = renderMarkdownPage(path);
    assert.ok(page, path);
    assert.match(page.markdown, /^# /);
    assert.match(page.markdown, /Canonical: https:\/\/www\.scanmydisk\.com/);
  }
  for (const post of posts) {
    const page = renderMarkdownPage(`/blog/${post.slug}`);
    assert.equal(page?.title, post.title);
    assert.doesNotMatch(page.markdown, /\]\(\//);
  }
  for (const skipped of SKIPPED_PATHS) assert.equal(renderMarkdownPage(skipped.path), undefined);
  assert.equal(listMarkdownPages().length, COVERED_PATHS.length - 1 + posts.length + 1);
});

test("robots.txt matches the generated policy and allows training crawlers", () => {
  const file = readFileSync(new URL("../public/robots.txt", import.meta.url), "utf8");
  assert.equal(file, robotsTxt());
  for (const bot of ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "PerplexityBot", "GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider"]) {
    assert.match(file, new RegExp(`User-agent: ${bot}`));
  }
  assert.match(file, /Sitemap: https:\/\/www\.scanmydisk\.com\/sitemap\.xml/);
  assert.doesNotMatch(file, /Disallow: \/\n/);
});
