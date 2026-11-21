import { createFileRoute } from "@tanstack/react-router";
import { USD_PRICE } from "@/lib/local-pricing";

export const Route = createFileRoute("/api/pricing")({
  server: {
    handlers: {
      GET: () =>
        Response.json(USD_PRICE, {
          headers: { "Cache-Control": "public, max-age=3600" },
        }),
    },
  },
});
