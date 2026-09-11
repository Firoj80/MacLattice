import { createFileRoute } from "@tanstack/react-router";
import { handleDodoEvent, verifyDodoSignature } from "@/lib/dodo";

export const Route = createFileRoute("/api/dodo/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY?.trim();
        if (secret && !verifyDodoSignature(raw, request)) {
          return new Response("invalid signature", { status: 401 });
        }
        let payload: unknown;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("invalid json", { status: 400 });
        }
        await handleDodoEvent(payload as Parameters<typeof handleDodoEvent>[0]);
        return new Response("ok", { status: 200 });
      },
    },
  },
});
