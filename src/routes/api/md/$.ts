import { createFileRoute } from "@tanstack/react-router";
import { markdownForRequest } from "@/lib/md/http";

function handle({ request }: { request: Request }) {
  const url = new URL(request.url);
  return (
    markdownForRequest(url, request.method, request.headers.get("accept")) ??
    new Response("# Not found\n\n> That page does not exist.\n", {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex, follow" },
    })
  );
}

export const Route = createFileRoute("/api/md/$")({
  server: { handlers: { GET: handle, HEAD: handle, OPTIONS: handle } },
});
