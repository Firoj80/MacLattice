import { createFileRoute } from "@tanstack/react-router";
import { rateLimit } from "@/lib/license-rate-limit";
import { createDodoCheckout } from "@/lib/dodo";
import { logCheckoutFailure } from "@/lib/checkout-diagnostics";
export const Route = createFileRoute("/buy")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          if (
            !(await rateLimit(
              "checkout",
              request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local",
              20,
            ))
          )
            return new Response("Please wait before trying again.", { status: 429 });
          const s = await createDodoCheckout(request.headers.get("cookie"));
          return new Response(null, {
            status: 302,
            headers: { Location: s.url, "Set-Cookie": s.cookie, "Cache-Control": "no-store" },
          });
        } catch (error) {
          logCheckoutFailure(error);
          return new Response("Checkout is temporarily unavailable. Please try again later.", {
            status: 503,
          });
        }
      },
    },
  },
});
