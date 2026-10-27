import { absUrl } from "@/lib/seo";
import { htmlPathFromMarkdown, isSkippedPath, prefersMarkdown } from "@/lib/md/negotiate";
import { listMarkdownPages, renderMarkdownPage } from "@/lib/md/registry";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
};

export function markdownResponse(pathname: string, method: string, negotiated: boolean) {
  const page = renderMarkdownPage(pathname);
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    "X-Robots-Tag": "noindex, follow",
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    ...CORS,
  });
  if (negotiated) headers.set("Vary", "Accept");
  if (!page) {
    const body = `# Not found\n\n> That page does not exist.\n\nCanonical: ${absUrl(pathname || "/")}\n`;
    headers.set("X-Markdown-Tokens", String(Math.ceil(body.length / 4)));
    return new Response(method === "HEAD" ? null : body, { status: 404, headers });
  }
  headers.set("Content-Location", absUrl(page.path));
  headers.set("Link", `<${absUrl(page.path)}>; rel="canonical"`);
  headers.set("X-Markdown-Tokens", String(Math.ceil(page.markdown.length / 4)));
  if (page.updated) headers.set("Last-Modified", new Date(`${page.updated}T00:00:00.000Z`).toUTCString());
  return new Response(method === "HEAD" ? null : page.markdown, { status: 200, headers });
}

export function catalogResponse(method: string) {
  const body = JSON.stringify({
    routes: listMarkdownPages().map((page) => ({
      html: absUrl(page.path),
      markdown: absUrl(page.path === "/" ? "/index.md" : `${page.path}.md`),
      title: page.title,
      summary: page.summary,
      updated: page.updated ?? null,
    })),
  });
  return new Response(method === "HEAD" ? null : body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex, follow",
      ...CORS,
    },
  });
}

export function optionsResponse() {
  return new Response(null, { status: 204, headers: CORS });
}

/** Resolve a public request to a markdown response, or null when the app should render HTML. */
export function markdownForRequest(url: URL, method: string, accept: string | null) {
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) return null;
  const pathname = url.pathname;
  if (pathname === "/api/md/_catalog" || pathname === "/api/md/_catalog/") {
    return method === "OPTIONS" ? optionsResponse() : catalogResponse(method);
  }
  if (pathname.startsWith("/api/md/")) {
    if (method === "OPTIONS") return optionsResponse();
    const rest = decodeURIComponent(pathname.slice("/api/md".length));
    const htmlPath = rest.endsWith(".md") ? htmlPathFromMarkdown(rest) : rest || "/";
    return markdownResponse(htmlPath || "/", method, false);
  }
  if (isSkippedPath(pathname)) return null;
  const fromSuffix = htmlPathFromMarkdown(pathname);
  if (fromSuffix) {
    if (method === "OPTIONS") return optionsResponse();
    return markdownResponse(fromSuffix, method, false);
  }
  if (prefersMarkdown(accept) && renderMarkdownPage(pathname)) {
    if (method === "OPTIONS") return optionsResponse();
    return markdownResponse(pathname, method, true);
  }
  return null;
}
