import { SITE, availabilitySentence } from "@/data/site";
import { absUrl } from "@/lib/seo";
import { listMarkdownPages } from "@/lib/md/registry";

const SEARCH_BOTS = ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"];
const TRAINING_BOTS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider"];
const PRIVATE = ["/api/", "/buy", "/thanks", "/post-views"];

function mdLink(path: string) {
  return absUrl(path === "/" ? "/index.md" : `${path}.md`);
}

export function llmsTxt() {
  const pages = listMarkdownPages();
  const lines = (group: "core" | "guides" | "legal") =>
    pages
      .filter((page) => page.group === group)
      .map((page) => `- [${page.title}](${mdLink(page.path)}): ${page.summary}`)
      .join("\n");
  return `# ${SITE.brand}

> ${SITE.tagline} ${availabilitySentence()} One-time lifetime licence. Scanning stays on the device.

ScanMyDisk is sold by ${SITE.name}. The catalogue price is ${SITE.lifetimePrice} for the first ${SITE.earlyBirdLimit} licenses, then ${SITE.regularPrice}. Contact: ${SITE.email}.

## Core pages
${lines("core")}

## Docs / Guides
${lines("guides")}

## Optional
${lines("legal")}

## Machine-readable
- [Full content](${absUrl("/llms-full.txt")}): every public page concatenated
- [Markdown catalog](${absUrl("/api/md/_catalog")})
- [Sitemap](${absUrl("/sitemap.xml")})
- [AI usage policy](${absUrl("/ai.txt")})

# keep in sync with /robots.txt and /ai.txt
`;
}

export function llmsFullTxt() {
  const pages = listMarkdownPages();
  const chunks = pages.map((page) => `---\n<!-- source: ${absUrl(page.path)} -->\n${page.markdown.trim()}`);
  const body = `# ${SITE.brand} - full content\n> ${SITE.tagline}\nGenerated: 2026-10-26\n\n${chunks.join("\n\n")}\n`;
  if (body.length > 500_000) console.warn(`llms-full.txt is ${body.length} characters`);
  return body;
}

export function aiTxt() {
  const include = listMarkdownPages()
    .map((page) => `include: ${page.path === "/" ? "/" : page.path}`)
    .join("\n");
  const exclude = PRIVATE.map((path) => `exclude: ${path}`).join("\n");
  return `# ${SITE.brand}
# keep in sync with /llms.txt and /robots.txt

[identity]
name: ${SITE.brand}
url: ${absUrl("/")}
description: ${SITE.tagline} ${availabilitySentence()}
contact: ${SITE.email}

[permissions]
allow: summarise
allow: quote with attribution
allow: cite
allow: index for search and answers
allow: train

[restrictions]
disallow: fabricated quotes
disallow: fake reviews or ratings
disallow: presenting this content as the model's own
disallow: training on private customer data, license keys, or scan results

[attribution]
cite: ${SITE.brand} plus the canonical HTML URL of the page

[scope]
${include}
${exclude}

[contact]
email: ${SITE.email}

Last updated: 2026-10-26
`;
}

function botGroup(name: string) {
  return [`User-agent: ${name}`, "Allow: /", ...PRIVATE.map((path) => `Disallow: ${path}`), ""].join("\n");
}

export function robotsTxt() {
  return `# keep in sync with /llms.txt and /ai.txt
# Machine-readable map: ${absUrl("/llms.txt")}
# AI usage policy: ${absUrl("/ai.txt")}

User-agent: *
Allow: /
${PRIVATE.map((path) => `Disallow: ${path}`).join("\n")}

${[...SEARCH_BOTS, ...TRAINING_BOTS].map(botGroup).join("\n")}
Sitemap: ${absUrl("/sitemap.xml")}
`;
}
