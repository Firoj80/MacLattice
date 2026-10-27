import { absUrl } from "@/lib/seo";

export function pageDoc(input: {
  title: string;
  summary: string;
  path: string;
  updated?: string;
  body: string;
  related?: { title: string; path: string }[];
}) {
  const lines = [`# ${input.title}`, "", `> ${input.summary}`, "", `Canonical: ${absUrl(input.path)}`];
  if (input.updated) lines.push(`Last updated: ${input.updated}`);
  lines.push("", input.body.trim());
  if (input.related?.length) {
    lines.push("", "## Related");
    for (const item of input.related) lines.push(`- [${item.title}](${absUrl(item.path)})`);
  }
  return `${lines.join("\n")}\n`;
}

export function bullets(items: readonly string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function linkList(items: readonly { title: string; path: string; summary?: string }[]) {
  return items
    .map((item) => `- [${item.title}](${absUrl(item.path)})${item.summary ? ` - ${item.summary}` : ""}`)
    .join("\n");
}

/** Point markdown links and images at the canonical HTML or asset URL. */
export function absoluteLinks(markdown: string) {
  return markdown.replace(/(!?\[[^\]]*\]\()(\/[^)\s]*)(\))/g, (_match, open, href, close) => {
    return `${open}${absUrl(href)}${close}`;
  });
}
