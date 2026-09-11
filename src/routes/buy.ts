import { createFileRoute } from "@tanstack/react-router";
import { createDodoCheckout, dodoProductLink } from "@/lib/dodo";

export const Route = createFileRoute("/buy")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const chip = url.searchParams.get("chip") === "intel" ? "intel" : "silicon";
        const origin = `${url.protocol}//${url.host}`.replace(/\/$/, "");
        const returnUrl = `${origin}/thanks`;

        try {
          const link = dodoProductLink();
          if (link) {
            const checkout = new URL(link);
            checkout.searchParams.set("quantity", "1");
            checkout.searchParams.set("redirect_url", returnUrl);
            return Response.redirect(checkout.toString(), 302);
          }

          const session = await createDodoCheckout({ returnUrl, chip });
          if (session) return Response.redirect(session.url, 302);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Checkout failed";
          return new Response(message, {
            status: 502,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }

        const pay = new URL("/pay", origin);
        pay.searchParams.set("chip", chip);
        return Response.redirect(pay.toString(), 302);
      },
    },
  },
});
