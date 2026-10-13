import { createFileRoute } from "@tanstack/react-router";
import { providerConfig } from "@/lib/dodo-client";

export const Route = createFileRoute("/api/license/config")({
  server: { handlers: { GET: () => {
    try {
      const { product, mode } = providerConfig();
      return Response.json({ product_id: product, mode }, { headers: { "Cache-Control": "no-store" } });
    } catch {
      return Response.json({ error: "License service is not configured." }, { status: 503 });
    }
  } } },
});
