import { createFileRoute } from "@tanstack/react-router";
import { handleDodoEvent, verifyDodoSignature } from "@/lib/dodo";
export const Route = createFileRoute("/api/dodo/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!process.env.DODO_PAYMENTS_WEBHOOK_KEY)
          return new Response("Webhook not configured", { status: 503 });
        const raw = await request.text();
        if (raw.length > 262144) return new Response("Too large", { status: 413 });
        if (!verifyDodoSignature(raw, request))
          return new Response("Invalid signature", { status: 401 });
        let payload: Parameters<typeof handleDodoEvent>[0];
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        if (!payload || typeof payload !== "object" || typeof payload.type !== "string")
          return new Response("Invalid event", { status: 400 });
        try {
          await handleDodoEvent(payload, request.headers.get("webhook-id")!);
          return new Response("ok");
        } catch {
          return new Response("Event processing failed; retry required", { status: 503 });
        }
      },
    },
  },
});
