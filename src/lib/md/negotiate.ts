type AcceptPart = { type: string; q: number };

function acceptParts(header: string | null): AcceptPart[] {
  if (!header) return [];
  return header.split(",").map((part) => {
    const [typeRaw, ...params] = part.trim().split(";");
    let q = 1;
    for (const param of params) {
      const [key, value] = param.trim().split("=");
      if (key === "q") {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) q = parsed;
      }
    }
    return { type: typeRaw.trim().toLowerCase(), q };
  });
}

function quality(parts: AcceptPart[], type: string) {
  const found = parts.find((part) => part.type === type);
  return found ? found.q : undefined;
}

/** Markdown only when text/markdown outranks text/html. Missing Accept and star-slash-star stay HTML. */
export function prefersMarkdown(accept: string | null) {
  const parts = acceptParts(accept);
  const markdown = quality(parts, "text/markdown");
  if (markdown === undefined || markdown <= 0) return false;
  const html = quality(parts, "text/html") ?? 0;
  return markdown > html;
}

const SKIP_PREFIXES = ["/api/", "/_next/", "/.well-known/"];
const SKIP_EXACT = new Set(["/llms.txt", "/llms-full.txt", "/ai.txt", "/robots.txt", "/sitemap.xml"]);

export function isSkippedPath(pathname: string) {
  if (SKIP_EXACT.has(pathname)) return true;
  return SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

const MARKDOWN_PAGES = new Set(["/", "/windows", "/macos", "/blog", "/contact", "/license", "/terms", "/privacy", "/refund-policy"]);

/** Path of the markdown twin, or null when this HTML page has no renderer. */
export function markdownPathFor(pathname: string) {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (!MARKDOWN_PAGES.has(path) && !path.startsWith("/blog/")) return null;
  return path === "/" ? "/index.md" : `${path}.md`;
}

export function htmlPathFromMarkdown(pathname: string) {
  if (!pathname.endsWith(".md")) return null;
  const bare = pathname.slice(0, -3);
  if (bare === "/index" || bare === "") return "/";
  return bare || "/";
}
