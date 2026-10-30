import { createMiddleware, createStart } from "@tanstack/react-start";
import { indexNowKeyBody } from "@/lib/indexnow";
import { aiTxt, llmsFullTxt, llmsTxt, robotsTxt } from "@/lib/md/discovery";
import { markdownForRequest } from "@/lib/md/http";
import { renderMarkdownPage } from "@/lib/md/registry";
import { absUrl } from "@/lib/seo";
import { serveSitemap } from "@/lib/sitemap";

function plain(body: string | null, cache: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": cache,
    },
  });
}

const files: Record<string, () => string> = {
  "/llms.txt": llmsTxt,
  "/llms-full.txt": llmsFullTxt,
  "/ai.txt": aiTxt,
  "/robots.txt": robotsTxt,
};

const aiReadable = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const file = files[url.pathname];
  if (file && ["GET", "HEAD"].includes(method)) {
    const cache = url.pathname === "/llms-full.txt"
      ? "public, s-maxage=86400, stale-while-revalidate=604800"
      : "public, s-maxage=86400, stale-while-revalidate=604800";
    return plain(method === "HEAD" ? null : file(), cache);
  }
  if (["GET", "HEAD"].includes(method)) {
    const key = indexNowKeyBody(url.pathname);
    if (key) return plain(method === "HEAD" ? null : key, "public, max-age=3600");
    const sitemap = serveSitemap(url.pathname);
    if (sitemap) {
      return new Response(method === "HEAD" || sitemap.status !== 200 ? null : sitemap.body, {
        status: sitemap.status,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": sitemap.status === 200 ? "public, s-maxage=3600, stale-while-revalidate=86400" : "no-store",
        },
      });
    }
  }
  const markdown = markdownForRequest(url, method, request.headers.get("accept"));
  if (markdown) return markdown;
  if (["GET", "HEAD"].includes(method) && renderMarkdownPage(url.pathname)) {
    try {
      const { getResponseHeader, setResponseHeader } = await import("@tanstack/react-start/server");
      const described = [
        `<${absUrl("/llms.txt")}>; rel="describedby"`,
        `<${absUrl("/llms-full.txt")}>; rel="describedby"`,
        `<${absUrl("/ai.txt")}>; rel="describedby"`,
      ].join(", ");
      const current = getResponseHeader("link");
      setResponseHeader("link", current ? `${current}, ${described}` : described);
      const vary = getResponseHeader("vary");
      if (!vary?.toLowerCase().includes("accept")) setResponseHeader("vary", vary ? `${vary}, Accept` : "Accept");
    } catch {
      // The HTML alternate link still advertises the markdown version.
    }
  }
  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [aiReadable],
}));
